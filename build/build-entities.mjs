// References, releases, artists and instruments: first-class entities kept
// under `src/data/{references,releases,artists,instruments}/*.data.js`.
//
// A reference is anything outside the tune data that points at tunes (and
// artists): an audio or video recording (typically a track of a release), a
// web page, a book… Not to be confused with a tune's own `references`.
//
// Pipeline (driven by build-tune-lists.mjs):
//   1. loadEntities       — read, validate, resolve; returns the entity model
//   2. projectReferences  — attach tune-shaped reference objects to the tunes
//                           that a reference links to (`tune.referencesFromEntities`)
//   3. entitiesFor        — per generated list, the subset of entities related
//                           to that list's tunes, to embed in the list JSON
import fs from "fs/promises";
import path from "path";
import { parseDataFile } from "./parse-data-file.mjs";

// ─── Identity ─────────────────────────────────────────────────────────────────

// At least one of these must be non-null on each entity.
const ARTIST_ID_FIELDS = ["id", "qId", "theSessionComposerId"];
const RELEASE_ID_FIELDS = ["id", "mbId", "discogsId", "theSessionRecordingId"];
// A reference names its release (an album, a book…) with any one of these fields.
const RELEASE_REF_FIELDS = [
  "releaseId",
  "mbId",
  "discogsId",
  "theSessionRecordingId"
];
// Known values for `reference.type` (optional; an unknown value is only a warning).
const REFERENCE_TYPES = ["audio", "video", "web", "book"];

const has = (v) => v != null;
const releaseRefField = (ref) => RELEASE_REF_FIELDS.find((f) => has(ref[f]));
const trackKey = (ref) =>
  releaseRefField(ref) && has(ref.trackNumber)
    ? `${ref[releaseRefField(ref)]}#${ref.trackNumber}`
    : null;

/** Every identifier an entity can be known by, as strings — for validity and duplicate checks. */
const idKeys = (fields) => (e) =>
  fields.filter((f) => has(e[f])).map((f) => `${f}=${e[f]}`);
const referenceKeys = (ref) => {
  const keys = [
    has(ref.id) && `id=${ref.id}`,
    trackKey(ref) && `track=${trackKey(ref)}`
  ].filter(Boolean);
  // The first URL identifies a reference only when nothing else does: tracks
  // of one release may well share the release's URL.
  return keys.length || !ref.urls?.[0] ? keys : [`url=${ref.urls[0]}`];
};
/** The id a reference is known by in the published data. */
const referenceId = (ref) => ref.id ?? trackKey(ref) ?? ref.urls?.[0];

/** Builds a finder that resolves a reference object against a list, by any of `fields`. */
const lookup = (list, fields) => {
  const maps = fields.map((f) => [
    f,
    new Map(list.filter((e) => has(e[f])).map((e) => [e[f], e]))
  ]);
  return (ref) => {
    for (const [f, map] of maps)
      if (has(ref[f]) && map.has(ref[f])) return map.get(ref[f]);
  };
};

const asReleaseRef = ({
  releaseId,
  mbId,
  discogsId,
  theSessionRecordingId
}) => ({
  id: releaseId,
  mbId,
  discogsId,
  theSessionRecordingId
});

// ─── Loading ──────────────────────────────────────────────────────────────────

/** Reads every `.data.js` file directly under `dir`; each yields one entry or an array of them. */
async function readEntries(dir) {
  const fileNames = (await fs.readdir(dir).catch(() => []))
    .filter((f) => f.endsWith(".data.js"))
    .sort();
  const entries = [];
  for (const fileName of fileNames) {
    let data;
    try {
      data = parseDataFile(await fs.readFile(path.join(dir, fileName), "utf8"));
    } catch (error) {
      throw new Error(`${path.basename(dir)}/${fileName}: ${error.message}`);
    }
    entries.push(
      ...[data ?? []]
        .flat()
        .filter((entry) => !entry.excludeFromBuild)
        .map((entry) => ({ entry, fileName }))
    );
  }
  return entries;
}

/** Checks each entry has an identifier and that none is used twice; pushes problems onto `errors`. */
function checkIdentity(kind, pairs, keysOf, errors) {
  const seen = new Map();
  for (const { entry, fileName } of pairs) {
    const keys = keysOf(entry);
    if (!keys.length)
      errors.push(
        `${fileName}: ${kind} "${entry.title ?? entry.name}" has no identifier`
      );
    for (const key of keys) {
      if (seen.has(key))
        errors.push(
          `${fileName}: duplicate ${kind} ${key} (also in ${seen.get(key)})`
        );
      else seen.set(key, fileName);
    }
  }
}

/**
 * Load, validate and resolve all entities under `dataDir`.
 *
 * Fatal (thrown, all reported together): an entity without an identifier, a
 * duplicate identifier, a duplicate instrument key, `credits.indexes` outside
 * `reference.tunes`. Everything else that fails to resolve is a warning.
 *
 * Entities flagged `excludeFromBuild` are dropped on reading; those flagged
 * `isPrivate` are dropped after validation unless `isDevelopment` is true.
 * References always get an `id` (derived from release + track, else the first
 * URL, if not given). An absent `language` means English.
 *
 * @returns {Promise<{references: object[], releases: object[], artists: object[],
 *   instruments: object, resolveArtist: Function, resolveRelease: Function}>}
 */
export async function loadEntities(dataDir, { isDevelopment = false } = {}) {
  const [artistPairs, releasePairs, referencePairs, instrumentPairs] =
    await Promise.all(
      ["artists", "releases", "references", "instruments"].map((name) =>
        readEntries(path.join(dataDir, name))
      )
    );
  const errors = [];

  checkIdentity("artist", artistPairs, idKeys(ARTIST_ID_FIELDS), errors);
  checkIdentity("release", releasePairs, idKeys(RELEASE_ID_FIELDS), errors);
  checkIdentity("reference", referencePairs, referenceKeys, errors);

  // Instruments: keyed objects, merged across files.
  const instruments = {};
  for (const { entry, fileName } of instrumentPairs)
    for (const [key, definition] of Object.entries(entry)) {
      if (key in instruments)
        errors.push(`${fileName}: duplicate instrument "${key}"`);
      instruments[key] = definition;
    }

  referencePairs.forEach(({ entry: ref, fileName }) => {
    const count = ref.tunes?.length ?? 0;
    (ref.credits ?? []).forEach((credit) =>
      (credit.indexes ?? []).forEach((i) => {
        if (!Number.isInteger(i) || i < 0 || i >= count)
          errors.push(
            `${fileName}: reference "${ref.id ?? ref.title}" has credit index ${i} outside its ${count} tune(s)`
          );
      })
    );
  });

  if (errors.length)
    throw new Error(`Invalid entity data:\n  ${errors.join("\n  ")}`);

  const artists = artistPairs.map((p) => p.entry);
  const releases = releasePairs.map((p) => p.entry);
  const finders = (artistList, releaseList) => {
    const findRelease = lookup(releaseList, RELEASE_ID_FIELDS);
    return {
      resolveArtist: lookup(artistList, ["id", "qId"]),
      resolveRelease: (ref) => findRelease(asReleaseRef(ref))
    };
  };

  // Warnings — checked against everything, so private entities don't cause noise.
  const all = finders(artists, releases);
  referencePairs.forEach(({ entry: ref, fileName }) => {
    const warn = (msg) =>
      console.warn(
        `Warning: ${fileName}: reference "${ref.id ?? ref.title}" ${msg}`
      );
    if (has(ref.type) && !REFERENCE_TYPES.includes(ref.type))
      warn(`has unknown type "${ref.type}"`);
    if (has(ref.releaseId) && !all.resolveRelease(ref))
      warn(`refers to unknown release "${ref.releaseId}"`);
    (ref.credits ?? []).forEach((credit) => {
      if ((has(credit.id) || has(credit.qId)) && !all.resolveArtist(credit))
        warn(`credits unknown artist "${credit.id ?? credit.qId}"`);
      (credit.instruments ?? [])
        .filter((k) => !(k in instruments))
        .forEach((k) => warn(`uses unknown instrument "${k}"`));
    });
  });

  const visible = ({ entry }) => isDevelopment || !entry.isPrivate;
  const visibleArtists = artistPairs.filter(visible).map((p) => p.entry);
  const visibleReleases = releasePairs.filter(visible).map((p) => p.entry);
  const references = referencePairs
    .filter(visible)
    .map(({ entry }) => ({ ...entry, id: referenceId(entry) }));

  return {
    references,
    releases: visibleReleases,
    artists: visibleArtists,
    instruments,
    ...finders(visibleArtists, visibleReleases)
  };
}

// ─── Projection onto tunes ────────────────────────────────────────────────────

/** "Name (role, instrument, …), …" for whoever is credited on tune `index` of a reference. */
function creditLine(ref, index, { instruments, resolveArtist }) {
  return (ref.credits ?? [])
    .filter((c) => !c.indexes || c.indexes.includes(index))
    .map((c) => {
      const name = resolveArtist(c)?.name ?? c.name;
      if (!name) return null; // unknown performer: slot kept in the data, nothing to show
      const details = [
        c.role,
        ...(c.instruments ?? []).map((k) => instruments[k]?.en ?? k)
      ].filter(Boolean);
      return details.length ? `${name} (${details.join(", ")})` : name;
    })
    .filter(Boolean)
    .join(", ");
}

/** A reference seen from one of its tunes, shaped like a manual `references` entry. */
function toReference(ref, index, release, model) {
  const entry = ref.tunes[index];
  const [url, ...moreUrls] = ref.urls?.length
    ? ref.urls
    : (release?.urls ?? []);
  const timing = entry.startTime
    ? `Tune from ${entry.startTime}${entry.endTime ? ` to ${entry.endTime}` : ""}`
    : null;
  const notes = [
    [has(ref.trackNumber) && `Track ${ref.trackNumber}`, ref.title]
      .filter(Boolean)
      .join(": "),
    timing,
    entry.notes,
    ref.notes,
    ...moreUrls // bare URLs are linkified by formatReference
  ]
    .filter(Boolean)
    .join("\n");

  return {
    referenceId: ref.id,
    type: ref.type,
    language: ref.language,
    artists: creditLine(ref, index, model) || undefined,
    url,
    album:
      release && `${release.title}${release.year ? ` (${release.year})` : ""}`,
    notes
  };
}

/**
 * For each reference, append a tune-shaped reference to `referencesFromEntities`
 * on every tune it links to (matched by `theSessionId`, then `ttId`). Tunes
 * entries with only a title are kept in the data but can't be linked, and a
 * reference that links to no loaded tune isn't published in any list. Mutates `tunes`.
 *
 * `referencesFromEntities` is last in the combined reference order (see
 * getCombinedReferences in processTuneData.js), so existing cross-reference
 * indices are unaffected.
 */
export function projectReferences(model, tunes) {
  const bySessionId = new Map();
  const byTtId = new Map();
  tunes.forEach((t) => {
    if (t.theSessionId) bySessionId.set(t.theSessionId, t);
    if (t.ttId) byTtId.set(t.ttId, t);
  });

  for (const ref of model.references) {
    const release = model.resolveRelease(ref);
    const unmatched = [];
    (ref.tunes ?? []).forEach((entry, index) => {
      const tune =
        bySessionId.get(entry.theSessionId) ?? byTtId.get(entry.ttId);
      if (tune)
        (tune.referencesFromEntities ??= []).push(
          toReference(ref, index, release, model)
        );
      else if (has(entry.theSessionId) || has(entry.ttId))
        unmatched.push(entry.theSessionId ?? `ttId ${entry.ttId}`);
    });
    if (unmatched.length)
      console.warn(
        `Warning: reference "${ref.id}" has tunes not in the database: ${unmatched.join(", ")}`
      );
  }
}

// ─── Per-list subsets ─────────────────────────────────────────────────────────

/**
 * The entities related to a list's tunes, as extra sections for the list JSON:
 * the references that link to those tunes, plus the releases, artists and
 * instruments those references use. Empty sections are omitted, so lists
 * without any references are unchanged. Call after projectReferences, with the
 * tunes that will actually be published.
 */
export function entitiesFor(tunes, model) {
  const ids = new Set(
    tunes
      .flatMap((t) => t.referencesFromEntities ?? [])
      .map((r) => r.referenceId)
  );
  const references = model.references.filter((r) => ids.has(r.id));
  const credits = references.flatMap((r) => r.credits ?? []);
  const releases = new Set(references.map(model.resolveRelease));
  const artists = new Set(credits.map(model.resolveArtist));
  const instrumentKeys = new Set(credits.flatMap((c) => c.instruments ?? []));

  const sections = {
    references,
    releases: model.releases.filter((r) => releases.has(r)),
    artists: model.artists.filter((a) => artists.has(a)),
    instruments: Object.fromEntries(
      Object.entries(model.instruments).filter(([k]) => instrumentKeys.has(k))
    )
  };
  return Object.fromEntries(
    Object.entries(sections).filter(([, v]) => Object.keys(v).length)
  );
}
