# Build process

This documents the full build pipeline: how tune data (and the references, releases, artists and instruments related to it) becomes the tune-list JSON files and manifest the app loads, and how webpack turns the app itself into a deployable bundle. Aimed at anyone maintaining or extending the build, not at end users.

## Source layout

```plaintext
src/
  index.js
  index.html
  generated/
    tune-lists-manifest.json   # written by the build; statically imported by index.js
  data/                        # everything maintained by hand
    tunes/
      0001 some tune.data.js   # numbered .data.js — contributes to the default list
      another tune.data.js     # unnumbered .data.js — same
      a-jig.abc                # bare .abc — its tune(s) also merged into the default list
      collections/
        norbeck-book3.abc      # a standalone, self-contained list of tunes
        another-collection.abc
      set-lists/
        default.data.js        # setLists with groups: "default" (or none)
        alora.data.js          # setLists with groups: "alora"
        steam-up.data.js       # setLists with groups: "su"
    references/                # one file per reference, or many per file
      itma recordings.data.js
    releases/
      tommy peoples.data.js
    artists/
      artists.data.js
    instruments/
      instruments.data.js      # one keyed object: { pipes: { qId, en, fr }, … }
```

Paths in the rest of this document that start with `tunes/` are relative to `src/data/`.

Three kinds of tune source file, three different treatments:

| Location | Format | Result |
|---|---|---|
| `tunes/*.data.js` | JS object (or array of objects), `export default` | One or more tunes, merged into the **default list** (and any group lists via `tune.groups`) |
| `tunes/*.abc` (bare, not in a subfolder) | Raw ABC, one or more tunes | Every tune it contains is parsed and merged into the **default list**, same as `.data.js` tunes — but without any of the `.data.js`-only flags (`groups`, `excludeFromDefault`, `excludeFromBuild`, `isPrivate`, an explicit `fileDate` override), since there's no wrapper object to carry them |
| `tunes/collections/*.abc` | Raw ABC, one or more tunes, optional `%% list-*` header directives | Becomes its own **standalone list** (`abc-<stem>`), never merged into anything else |
| `tunes/set-lists/*.data.js` | JS object with a `setLists` array, `export default` | Set lists, tagged with a `groups` field to say which generated list(s) they belong to |

`fs.readdir` on `src/data/tunes/` is non-recursive, so `.data.js`/`.abc` files at the top level are picked up by the tune-loading loop, while `collections/` and `set-lists/` (being directories) are automatically skipped by it. The reverse is also true: files inside those two subfolders are only ever read by the code paths that specifically target them.

## Tune list generation — `build/build-tune-lists.mjs`

Exports `buildTuneLists({ isDevelopment, outputDir, manifestPath })`, invoked either from the webpack plugin (production builds) or directly via `npm run build:tunes` (local development).

### 1. Load tunes

For each `.data.js` and bare `.abc` file directly under `src/data/tunes/`:
- `.data.js` → evaluated via `parseDataFile` (`build/parse-data-file.mjs`; a `new Function` sandbox, not `import`, so the script doesn't need a bundler); tunes flagged `excludeFromBuild` are dropped here.
- `.abc` → split into individual tunes with `getTunes()` from `@goplayerjuggler/abc-tools`; each becomes a bare `{ abc }` object.

Both paths converge: for every tune, ABC metadata (key, rhythm, origin, composer, …) is extracted via `getMetadata()` into `metadataFromAbc`, and a `fileDate` is attached — from the tune's own `fileDate` property if a `.data.js` tune sets one explicitly, otherwise from the tune-dates cache (see below), keyed by the source file's name.

### 2. Load set lists

Every `.data.js` file under `src/data/tunes/set-lists/` is evaluated the same way (`parseDataFile`) and their `setLists` arrays concatenated into one flat list. A set list's `groups` field (comma-separated) says which generated list(s) it should be attached to — `setListsFor(group)` filters on that.

### 3. Load entities and attach references to tunes

`loadEntities`, `projectReferences` and `entitiesFor` live in `build/build-entities.mjs`; see "References, releases, artists and instruments" below.

### 4. Generate lists

- **Default list** (`default`): all loaded tunes except those flagged `excludeFromDefault`, plus set lists tagged for the `"default"` group.
- **Group lists** (`group-<name>`): tunes are grouped by their `groups` property (comma-separated, lower-cased); one list per distinct group, alphabetically. `getGroupDisplayName()` maps known group ids (`alora`, `su`, `blr`) to friendly names, falling back to `Group: <name>` for anything else.
- **Origin lists** (`origin-<id>`): tunes matching an entry in `ORIGIN_EXTRACTS`, based on `metadataFromAbc.origin`.
- **Composer lists** (`composer-<id>`, development builds only): same idea via `COMPOSER_EXTRACTS`, gated on `isDevelopment` since these are exploratory/incomplete.
- **Collection lists** (`abc-<stem>`): one per file under `tunes/collections/`, parsed via `parseAbcHeader()` for `%% list-name`, `%% list-description`, `%% list-date`, `%% list-defaultSort` directives in the header (the lines before the first `X:` field). A list without a `%% list-defaultSort` directive (or any generated list without an explicit `defaultSort`) falls back to `"rhythmContourName"`.

### 5. Write output

`writeList(baseId, tunes, setLists)`:
1. Filters out `isPrivate` tunes unless `isDevelopment` is true, so private tunes never reach a production build.
2. Strips build-time-only properties (`groups`, `excludeFromDefault`, `metadataFromAbc` from tunes; `groups` from set lists) via `sanitizeTune`/`sanitizeSetList`.
3. Adds the entities related to the remaining tunes (`references`, `releases`, `artists`, `instruments`, each only if non-empty) via `entitiesFor`.
4. Serialises to JSON, MD5-hashes the content, and writes it as `<baseId>.<hash10>.json`.

The content hash in the filename lets the app cache these files aggressively while still picking up changes immediately: a changed list gets a new filename, an unchanged one keeps its old (already-cached) one.

After all lists are written, any `.json` file already present in `outputDir` that wasn't just (re)written is deleted — this prunes hashed files left behind by an earlier build whose content has since changed under the same `baseId`.

### 6. Write the manifest

`manifest.json` — `{ version, generated, lists: [...], externalSources: [] }` — is always written to `outputDir` (typically `dist/tune-lists/`), at a **stable, unhashed** path so it can be fetched at a known URL both by the browser at runtime and by anyone inspecting the CLI output directly. If `manifestPath` is also given, the same content is additionally written there — used to get the manifest into `src/generated/tune-lists-manifest.json`, which `index.js` statically imports (`import manifest from "./generated/tune-lists-manifest.json"`) so it's bundled directly rather than fetched at runtime.

## References, releases, artists and instruments

Four kinds of entity, each a folder of `.data.js` files under `src/data/` (one entity per file or many; each file exports an object or an array, `instruments` a single keyed object).

### Minimal schema

Every field is optional unless stated. At least one *identifier* must be non-null on each artist, release and reference.

| Entity | Identifiers | Other fields |
|---|---|---|
| artist | `id` (local), `qId` (Wikidata QID, integer), `theSessionComposerId` | `name`, `instruments` (keys, first = main instrument), `notes`, `urls` |
| release | `id` (local), `mbId`, `discogsId`, `theSessionRecordingId` | `title`, `year`, `notes`, `urls` |
| reference | `id` (local); or a release identifier (`releaseId`, `mbId`, `discogsId`, `theSessionRecordingId`) + `trackNumber`; or, failing both, `urls[0]` | `type`, `language`, `title`, `duration`, `notes`, `urls`, `tunes`, `credits` |
| instrument | the key | `{ qId, en, fr }` |

A reference's two lists:

- `tunes` — ordered, in the sequence of the reference. Each entry has `theSessionId` or `ttId` (links a tune in the data), or just a `title` (not in the data yet); plus optional `startTime`, `endTime` (audio and video) and `notes`.
- `credits` — each has `id` or `qId` (a known artist) or `name` (inline; `null` keeps the slot of an unknown performer), plus `instruments` (keys), `role` (free text, for non-performers: `author`) and `indexes` (0-based positions in `tunes`; absent = the whole reference).

```js
{ id: "fog-is-lifting-track-3", releaseId: "fog-is-lifting-2025", trackNumber: 3,
  urls: ["https://…"],
  tunes: [{ title: "The Stage" }, { theSessionId: 2716, startTime: "3:26" }],
  credits: [{ id: "sylvain-barou", indexes: [1] }, { name: "Libby McCrohan", instruments: ["bouzouki"] }] }
```

- A **reference** is anything outside the tune data that points at tunes (0..N) and artists (0..N): an audio or video recording — typically one track of a release — a web page, a book. It has an optional `type` (`audio`, `video`, `web`, `book`) and a `language` (absent means English).
- A **release** is a published whole that references can belong to: an album, a book.

These *entity references* are not to be confused with a tune's own references (`tune.references`, `referencesFromAbc`, `referencesFromEntities`; see `getCombinedReferences` in `processTuneData.js`).

Entities are not lists of their own: each generated list JSON gets extra sections holding just the entities related to that list's tunes, so `origin-france.<hash>.json` only carries the references, artists etc. that involve French tunes. A list with no related references is unchanged.

### Loading and validation (`loadEntities`)

- Files flagged `excludeFromBuild` are dropped on reading; `isPrivate` entities are dropped after validation unless `isDevelopment` is true. (A credit for a private artist in a public reference then simply shows no name.)
- A reference is identified by its `id`, or by a release identifier + `trackNumber`, or — only when it has neither — by its first URL. That makes a web page need no `id`; a book without a URL does.
- **Errors** (the build fails, all listed together): an entity with none of its identifiers; the same identifier used twice; a duplicate instrument key; `credits.indexes` outside the reference's `tunes`.
- **Warnings**: an unknown `type`; a `releaseId` matching no release; a credit `id`/`qId` matching no artist; an unknown instrument key; a `tunes` entry with a `theSessionId`/`ttId` that matches no tune. `tunes` entries with only a title are never warned about. A release referenced only by `mbId`, `discogsId` or `theSessionRecordingId` needn't have an entry.
- A reference without an `id` is given one: `<release identifier>#<trackNumber>`, else its first URL.
- Credits resolve to artists by `id`, then `qId`; a credit with only a `name` is inline.
- A credit that resolves to an artist, and has neither `role` nor `instruments`, gets the artist's first instrument (`artist.instruments[0]`). This is done on load, so the published credits carry it too. Give the credit its own `instruments` to override.

### Attaching references to tunes (`projectReferences`)

For each loaded tune that a reference's `tunes` matches (by `theSessionId`, then `ttId`, across all tunes, not per list), one tune-shaped reference object is appended to that tune's `referencesFromEntities`:

| Field | Content |
|---|---|
| `referenceId` | the reference's `id` (used to find its entities in the list JSON) |
| `type` | the reference's `type`, if any |
| `language` | the reference's `language`, if any (absent means English) |
| `artists` | credits that apply to that tune (all of them, or those whose `indexes` include any of its positions), as `Name (role, instrument, …)` using the English instrument labels; unknown performers are skipped |
| `url` | the reference's first URL, falling back to the release's |
| `album` | release title and year |
| `notes` | track number and title, the list of the reference's tunes (when it has several), the tune's time range and the tune entry's `notes` (once per mention), the reference's `notes`, any further URLs |

`url`, `album`, `artists` and `notes` are the shape that `formatReference` in `utils.js` already renders, so the app shows these references on tune rows without further changes; `type` and `language` are extra fields it can use. `index.js` only needs to append `referencesFromEntities` after `references` (see `getCombinedReferences` in `processTuneData.js`).

A reference with several tunes appears on each of them. In the `notes` it lists all its tunes, in order, separated by ` / `, followed by a summary of their `rhythm`s in brackets:

```text
The Stage / [Ag Filleadh Abhaile](theSessionId=1234) / [O'Mahoney's](theSessionId=2716) (reel; 2 hornpipes)
```

- A tune that the reference mentions more than once gets a single merged reference: all its positions in the list are plain text, the credits are those of any of its positions, and the notes carry the time range and notes of each mention.
- The tune whose row it is, and any tune not in the data, are plain text; every other tune is a note link, which `formatNoteLinks` turns into an anchor to that tune's row.
- The summary counts the rhythms of the tunes found in the data, lower-cased, in order of first appearance: `2 jigs; hop jig`, `7 reels`, `slow air; 2 strathspeys; reel`. Tunes without a rhythm are left out.
- A tune's name and rhythm are read from `tune.name` / `tune.rhythm`, falling back to `metadataFromAbc` (`tuneName`, `tuneRhythm` in `build-entities.mjs`).
- These links are ordinary note links, so `calculateCrossRefs` sees them; it adds no pointer between tunes that already link to each other (see `src/cross-references.md`).

A reference that matches no loaded tune is validated but not published in any list: for now a tune is the only way into a list.

### Per-list subsets (`entitiesFor`)

Given the tunes that will be published in a list, the references that they point to via `referenceId` are included, plus the releases, artists and instruments those references use.

## Tune-dates cache — `build/tune-dates.json` and `update-tune-dates.mjs`

Tune `lastUpdate` values need a stable "when was this last changed" date, and `git log` is the source of truth for that — but shelling out to git for every tune on every build would be slow, so it's cached in `build/tune-dates.json`.

- The cache holds `{ tuneDates1, tuneDates2 }`. Numbered files (`0001 some tune.data.js`) are indexed by number into the `tuneDates1` array; everything else (including bare `.abc` files) is a `fileName → date` entry in the `tuneDates2` dict.
- `npm run update-dates` runs `git log -n 1 --follow --format=%ai -- <file>` for every `.data.js`/`.abc` file directly under `src/data/tunes/` and updates the cache if the date has changed. `--follow` means renames don't lose history.
- `npm run update-dates -- only-check <duration>` (e.g. `4h`, `30m`, `7d`) restricts the git lookups to files whose mtime is within that window, so a quick "I just edited a couple of files" pass doesn't have to re-check everything.
- `build-tune-lists.mjs` never writes this file; it only reads it and warns if a file has no cached date, telling you to run `update-dates`.
- References, releases, artists and instruments are not covered by this cache either, and don't affect a list's `lastUpdate`.
- Collections under `tunes/collections/` are not covered by this cache — they use the `%% list-date` header directive instead, since each collection is a single external file rather than something tracked tune-by-tune in this repo's git history.
- `lastUpdate` for a generated list is the most recent date among its constituent tunes' `fileDate`s and its set lists' `dateModified` fields (`listLastUpdate()`/`maxDate()`), falling back to today's date if nothing is available.

## Webpack build — `webpack.config.js`

### Entry, output, module rules

- Entry: `src/index.js`. Output: `dist/bundle.js`, `publicPath: ""`.
- `output.clean.keep` preserves anything under `tune-lists/` when webpack cleans the output directory, since those files are written by `ConcatenateTunesPlugin` before webpack's own emit/clean phase and shouldn't be wiped by it.
- `abcjs` is an external — loaded separately, not bundled — and referenced globally as `ABCJS`.
- `resolve.alias`: when the `localAbcTools` env flag is passed, `@goplayerjuggler/abc-tools` resolves to a sibling `../abcTools/` folder instead of the npm package, for local development against an unpublished version of that repo.
- CSS: `style-loader` + `css-loader` in development, `MiniCssExtractPlugin.loader` + `css-loader` in production (so CSS is extracted to `styles.css` for later inlining rather than injected via `<style>` tags at runtime).
- `.json` files use webpack's built-in `type: "json"` handling.
- `.html` files are loaded as raw text (`type: "asset/source"`), except `src/index.html` itself, which is excluded since it's handled separately by `HtmlWebpackPlugin` as the page template.

### Tune list generation — `ConcatenateTunesPlugin`

A plugin that builds tune-list JSON files as part of a production build, active only when `isDevelopment` is false. On `compiler.hooks.beforeCompile` it calls `buildTuneLists` once, writing list JSON to `<compiler.outputPath>/tune-lists/` and the manifest to both that folder and `src/generated/tune-lists-manifest.json`.

In development builds, the plugin registers no hooks at all: tune list generation is a separate, manual step (see npm scripts below), decoupled from webpack's compile cycle.

### HTML and asset inlining

- `HtmlWebpackPlugin` generates `dist/index.html` from the `src/index.html` template, injecting the bundle into `<body>`, minifying in production (collapsed whitespace, comments stripped).
- In production only: `MiniCssExtractPlugin` extracts CSS to `styles.css`, then `HtmlInlineCssWebpackPlugin` and `HtmlInlineScriptPlugin` inline both the CSS and the JS bundle directly into `index.html` — producing a single self-contained HTML file, which is what actually gets published (e.g. to GitHub Pages).
- `CssMinimizerPlugin` is added to the optimisation minimizers (alongside webpack's default JS minimizer, kept via the `"..."` entry) for production CSS minification.

### Dev server and watching

`devServer` serves `dist/` statically on port 8080 with hot reloading enabled. `devServer.watchFiles` watches `src/**/*` for the dev server's own reload behaviour (distinct from webpack's compiler dependency graph), but explicitly ignores `node_modules/`, `dist/`, `src/generated/`, and `src/data/` — so only application code changes trigger a reload; data files (tunes, references, …) do not. `watchOptions.ignored` mirrors this for webpack's own watcher (also ignoring the legacy `src/tunes.compiled.js` path), for the same reason.

## npm scripts

```powershell
# setup
npm install

# build tune lists — run this first, and again whenever data files change
npm run build:tunes

# run local version (tune lists are not rebuilt automatically while this
# is running — re-run `npm run build:tunes` and refresh the browser after
# editing tunes or other data files)
npm run dev

# build website — this includes building the tune lists
npm run build

# working with abc-tools: install it as a sibling, same parent folder
npm run dev:local
	<# this way abc-tools is loaded from the local copy, not the npm package #>

# update the tune-dates cache from git history
npm run update-dates -- only-check 4h
```

`build:tunes` runs `node ./build/build-tune-lists.mjs` directly, with `isDevelopment: true` (so private tunes are included) and `manifestPath` pointing at `src/generated/tune-lists-manifest.json` — so a single run is enough to prime a working dev environment, without webpack needing to be involved at all.

## Runtime manifest recovery

Because list files are hashed by content, a manifest baked into a bundle can end up pointing at a filename that no longer exists — for instance if a tab is left open across a deploy, or the bundle is served from a cache, and the referenced list has since been rebuilt (and its old hashed file pruned). `TuneListSelectorModal.js` recovers from this reactively when loading a server list or saving one to a local slot:

- `_withFreshManifestOnFailure(listId, listFile, fn)` tries the fetch once; on failure, it re-fetches `./tune-lists/manifest.json` (with `cache: "no-store"`, to bypass HTTP caching for this small, frequently-changing file), looks the list up again by id, and — only if its `file` hash has actually changed — retries once with the corrected filename.
- The refreshed manifest is merged into the existing manifest object in place (`Object.assign`, not reassignment), so any other reference to the same object (e.g. in `index.js`) picks up the update without extra plumbing.
- If the retry also fails, or the manifest lookup shows nothing changed for that list (a genuine error, not a stale hash), the original error is surfaced to the user as normal.

This is deliberately reactive-only — there's no proactive background polling or refresh-on-modal-open — so the common case, where nothing is stale, involves no extra network requests.
