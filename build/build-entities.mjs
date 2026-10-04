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

// How a loaded tune gives its name and rhythm (the ABC metadata is the fallback).
const tuneName = (t) => t.name ?? t.metadataFromAbc?.title;
const tuneRhythm = (t) => t.rhythm ?? t.metadataFromAbc?.rhythm;
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

/** A credit may be a bare artist id, shorthand for `{ id }`. */
const asCredit = (credit) =>
  typeof credit === "string" ? { id: credit } : credit;

/** A credit naming a known artist, with no role or instrument of its own, gets the artist's first instrument. */
const withDefaultInstrument = (credit, resolveArtist) => {
  if (credit.role || credit.instruments?.length) return credit;
  const instrument = resolveArtist(credit)?.instruments?.[0];
  return instrument ? { ...credit, instruments: [instrument] } : credit;
};

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
 * URL, if not given). An absent `language` means English. A credit (of a
 * reference or a release) that names a known artist but gives neither `role`
 * nor `instruments` gets the artist's first instrument.
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
  const warner = (kind, fileName, entity) => (msg) =>
    console.warn(
      `Warning: ${fileName}: ${kind} "${entity.id ?? entity.title}" ${msg}`
    );
  const checkCredits = (credits, warn) =>
    (credits ?? []).map(asCredit).forEach((credit) => {
      if ((has(credit.id) || has(credit.qId)) && !all.resolveArtist(credit))
        warn(`credits unknown artist "${credit.id ?? credit.qId}"`);
      (credit.instruments ?? [])
        .filter((k) => !(k in instruments))
        .forEach((k) => warn(`uses unknown instrument "${k}"`));
    });
  releasePairs.forEach(({ entry: release, fileName }) =>
    checkCredits(release.credits, warner("release", fileName, release))
  );
  referencePairs.forEach(({ entry: ref, fileName }) => {
    const warn = warner("reference", fileName, ref);
    if (has(ref.type) && !REFERENCE_TYPES.includes(ref.type))
      warn(`has unknown type "${ref.type}"`);
    if (has(ref.releaseId) && !all.resolveRelease(ref))
      warn(`refers to unknown release "${ref.releaseId}"`);
    checkCredits(ref.credits, warn);
  });

  const visible = ({ entry }) => isDevelopment || !entry.isPrivate;
  const visibleArtists = artistPairs.filter(visible).map((p) => p.entry);
  const { resolveArtist } = finders(visibleArtists, []);
  const withDefaultInstruments = (entity) =>
    entity.credits
      ? {
          ...entity,
          credits: entity.credits.map((c) =>
            withDefaultInstrument(asCredit(c), resolveArtist)
          )
        }
      : entity;
  const visibleReleases = releasePairs
    .filter(visible)
    .map((p) => withDefaultInstruments(p.entry));
  const resolvers = finders(visibleArtists, visibleReleases);
  const references = referencePairs.filter(visible).map(({ entry }) => ({
    ...withDefaultInstruments(entry),
    id: referenceId(entry)
  }));

  return {
    references,
    releases: visibleReleases,
    artists: visibleArtists,
    instruments,
    ...resolvers
  };
}

// ─── Projection onto tunes ────────────────────────────────────────────────────

/** "Name (role, instrument, …), …" for whoever is credited on any of the tunes at `indices` of a reference (or release, which may be absent). */
function creditLine(ref, indices, { instruments, resolveArtist }) {
  return (ref?.credits ?? [])
    .filter((c) => !c.indexes || c.indexes.some((i) => indices.includes(i)))
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

const tuneIdStr = (t) =>
  t.theSessionId ? `theSessionId=${t.theSessionId}` : `ttId=${t.ttId}`;

/** "jig" -> "jigs", "march" -> "marches"; a word already ending in "s" is left alone. */
const plural = (word) =>
  /(ch|sh|x|z)$/.test(word)
    ? `${word}es`
    : word.endsWith("s")
      ? word
      : `${word}s`;

/** Counts the tunes' rhythms, in order of first appearance: "2 jigs; hop jig". */
function rhythmSummary(tunes) {
  const counts = new Map();
  for (const tune of tunes) {
    const rhythm = tuneRhythm(tune)?.trim().toLowerCase();
    if (rhythm) counts.set(rhythm, (counts.get(rhythm) ?? 0) + 1);
  }
  return [...counts]
    .map(([rhythm, n]) => (n > 1 ? `${n} ${plural(rhythm)}` : rhythm))
    .join("; ");
}

/**
 * The tunes of a reference, in order, as seen from the tune at `indices`: "A / B / C (2 jigs; reel)".
 * Every other tune found in the database is a note link (`[B](theSessionId=2)`, resolved
 * by formatNoteLinks); the tune itself, and any tune not in the database, is plain text.
 * A tune is named as the reference names it (`entry.name`), else as the database does.
 * Null for a reference with fewer than two tunes.
 */
function tuneListLine(matches, indices) {
  if (matches.length < 2) return null;
  const labels = matches.map(({ entry, tune }, i) => {
    const name = (
      entry.name ??
      (tune && tuneName(tune)) ??
      entry.title ??
      `#${entry.theSessionId ?? entry.ttId ?? "?"}`
    ).replace(/[[\]]/g, ""); // brackets would break the link syntax
    return tune && !indices.includes(i)
      ? `[${name}](${tuneIdStr(tune)})`
      : name;
  });
  const summary = rhythmSummary(matches.map((m) => m.tune).filter(Boolean));
  return labels.join(" / ") + (summary ? ` (${summary})` : "");
}

/**
 * A reference seen from one of its tunes, shaped like a manual `references` entry.
 * `indices` are the positions in `ref.tunes` of that tune (several if the reference
 * mentions it more than once: they are merged into one reference); `matches` pairs
 * each entry of `ref.tunes` with its loaded tune, if any.
 */
function toReference(ref, indices, release, model, matches) {
  const [url, ...moreUrls] = ref.urls?.length
    ? ref.urls
    : (release?.urls ?? []);
  // Per mention of the tune: its time range, then its own notes.
  const mentions = indices.flatMap((i) => {
    const { startTime, endTime, notes } = ref.tunes[i];
    return [
      startTime && `Tune from ${startTime}${endTime ? ` to ${endTime}` : ""}`,
      notes
    ];
  });
  const tuneList = tuneListLine(matches, indices);
  const notes = [
    [has(ref.trackNumber) && `Track ${ref.trackNumber}`, ref.title]
      .filter(Boolean)
      .join(": "),
    tuneList,
    ...mentions,
    ref.notes,
    ...moreUrls // bare URLs are linkified by formatReference
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    referenceId: ref.id,
    tuneList: tuneList || undefined, // lets calculateCrossRefs tell these links from hand-written ones
    type: ref.type,
    language: ref.language,
    // The reference's own credits, else the release's.
    artists:
      creditLine(ref, indices, model) ||
      creditLine(release, indices, model) ||
      undefined,
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
 * reference that links to no loaded tune isn't published in any list. A reference
 * with several tunes lists them all in each tune's notes (see tuneListLine).
 * A tune that a reference mentions more than once gets one merged reference.
 * Mutates `tunes`.
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
    const matches = (ref.tunes ?? []).map((entry) => ({
      entry,
      tune: bySessionId.get(entry.theSessionId) ?? byTtId.get(entry.ttId)
    }));
    const positions = new Map(); // tune -> its positions in ref.tunes
    matches.forEach(({ entry, tune }, index) => {
      if (tune) positions.set(tune, [...(positions.get(tune) ?? []), index]);
      else if (has(entry.theSessionId) || has(entry.ttId))
        unmatched.push(entry.theSessionId ?? `ttId ${entry.ttId}`);
    });
    positions.forEach((indices, tune) =>
      (tune.referencesFromEntities ??= []).push(
        toReference(ref, indices, release, model, matches)
      )
    );
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
 * instruments those references and releases use. Empty sections are omitted, so lists
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
  const releases = new Set(references.map(model.resolveRelease));
  const credits = [...references, ...releases].flatMap((e) => e?.credits ?? []);
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
