// Recordings, releases, artists and instruments: first-class entities kept
// under `src/data/{recordings,releases,artists,instruments}/*.data.js`.
//
// Pipeline (driven by build-tune-lists.mjs):
//   1. loadEntities       — read, validate, resolve; returns the entity model
//   2. projectRecordings  — attach reference-shaped objects to the tunes that
//                           a recording contains (`tune.referencesFromRecordings`)
//   3. entitiesFor        — per generated list, the subset of entities related
//                           to that list's tunes, to embed in the list JSON
import fs from "fs/promises";
import path from "path";
import { parseDataFile } from "./parse-data-file.mjs";

// ─── Identity ─────────────────────────────────────────────────────────────────

// At least one of these must be non-null on each entity.
const ARTIST_ID_FIELDS = ["id", "qId", "theSessionComposerId"];
const RELEASE_ID_FIELDS = ["id", "mbId", "discogsId", "theSessionRecordingId"];
// A recording names its release with any one of these fields.
const RELEASE_REF_FIELDS = [
  "releaseId",
  "mbId",
  "discogsId",
  "theSessionRecordingId"
];

const has = (v) => v != null;
const releaseRefField = (rec) => RELEASE_REF_FIELDS.find((f) => has(rec[f]));
const trackKey = (rec) =>
  releaseRefField(rec) && has(rec.trackNumber)
    ? `${rec[releaseRefField(rec)]}#${rec.trackNumber}`
    : null;

/** Every identifier an entity can be known by, as strings — for validity and duplicate checks. */
const idKeys = (fields) => (e) =>
  fields.filter((f) => has(e[f])).map((f) => `${f}=${e[f]}`);
const recordingKeys = (rec) =>
  [
    has(rec.id) && `id=${rec.id}`,
    trackKey(rec) && `track=${trackKey(rec)}`
  ].filter(Boolean);

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
 * `recording.tunes`. Everything else that fails to resolve is a warning.
 *
 * Entities flagged `excludeFromBuild` are dropped on reading; those flagged
 * `isPrivate` are dropped after validation unless `isDevelopment` is true.
 * Recordings always get an `id` (derived from release + track if not given).
 *
 * @returns {Promise<{recordings: object[], releases: object[], artists: object[],
 *   instruments: object, resolveArtist: Function, resolveRelease: Function}>}
 */
export async function loadEntities(dataDir, { isDevelopment = false } = {}) {
  const [artistPairs, releasePairs, recordingPairs, instrumentPairs] =
    await Promise.all(
      ["artists", "releases", "recordings", "instruments"].map((name) =>
        readEntries(path.join(dataDir, name))
      )
    );
  const errors = [];

  checkIdentity("artist", artistPairs, idKeys(ARTIST_ID_FIELDS), errors);
  checkIdentity("release", releasePairs, idKeys(RELEASE_ID_FIELDS), errors);
  checkIdentity("recording", recordingPairs, recordingKeys, errors);

  // Instruments: keyed objects, merged across files.
  const instruments = {};
  for (const { entry, fileName } of instrumentPairs)
    for (const [key, definition] of Object.entries(entry)) {
      if (key in instruments)
        errors.push(`${fileName}: duplicate instrument "${key}"`);
      instruments[key] = definition;
    }

  recordingPairs.forEach(({ entry: rec, fileName }) => {
    const count = rec.tunes?.length ?? 0;
    (rec.credits ?? []).forEach((credit) =>
      (credit.indexes ?? []).forEach((i) => {
        if (!Number.isInteger(i) || i < 0 || i >= count)
          errors.push(
            `${fileName}: recording "${rec.id ?? rec.title}" has credit index ${i} outside its ${count} tune(s)`
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
      resolveRelease: (rec) => findRelease(asReleaseRef(rec))
    };
  };

  // Warnings — checked against everything, so private entities don't cause noise.
  const all = finders(artists, releases);
  recordingPairs.forEach(({ entry: rec, fileName }) => {
    const warn = (msg) =>
      console.warn(
        `Warning: ${fileName}: recording "${rec.id ?? rec.title}" ${msg}`
      );
    if (has(rec.releaseId) && !all.resolveRelease(rec))
      warn(`refers to unknown release "${rec.releaseId}"`);
    (rec.credits ?? []).forEach((credit) => {
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
  const recordings = recordingPairs
    .filter(visible)
    .map(({ entry }) => ({ ...entry, id: entry.id ?? trackKey(entry) }));

  return {
    recordings,
    releases: visibleReleases,
    artists: visibleArtists,
    instruments,
    ...finders(visibleArtists, visibleReleases)
  };
}

// ─── Projection onto tunes ────────────────────────────────────────────────────

/** "Name (instrument, instrument), …" for whoever plays on tune `index` of a recording. */
function performers(rec, index, { instruments, resolveArtist }) {
  return (rec.credits ?? [])
    .filter((c) => !c.indexes || c.indexes.includes(index))
    .map((c) => {
      const name = resolveArtist(c)?.name ?? c.name;
      if (!name) return null; // unknown performer: slot kept in the data, nothing to show
      const played = (c.instruments ?? []).map((k) => instruments[k]?.en ?? k);
      return played.length ? `${name} (${played.join(", ")})` : name;
    })
    .filter(Boolean)
    .join(", ");
}

/** A recording seen from one of its tunes, shaped like a manual `references` entry. */
function toReference(rec, index, release, model) {
  const entry = rec.tunes[index];
  const [url, ...moreUrls] = rec.urls?.length
    ? rec.urls
    : (release?.urls ?? []);
  const timing = entry.startTime
    ? `Tune from ${entry.startTime}${entry.endTime ? ` to ${entry.endTime}` : ""}`
    : null;
  const notes = [
    [has(rec.trackNumber) && `Track ${rec.trackNumber}`, rec.title]
      .filter(Boolean)
      .join(": "),
    timing,
    entry.notes,
    rec.notes,
    ...moreUrls // bare URLs are linkified by formatReference
  ]
    .filter(Boolean)
    .join("\n");

  return {
    recordingId: rec.id,
    artists: performers(rec, index, model) || undefined,
    url,
    album:
      release && `${release.title}${release.year ? ` (${release.year})` : ""}`,
    notes
  };
}

/**
 * For each recording, append a reference to `referencesFromRecordings` on every
 * tune it contains (matched by `theSessionId`, then `ttId`). Tunes entries with
 * only a title are kept in the data but can't be linked. Mutates `tunes`.
 *
 * `referencesFromRecordings` is last in the combined reference order (see
 * getCombinedReferences in processTuneData.js), so existing cross-reference
 * indices are unaffected.
 */
export function projectRecordings(model, tunes) {
  const bySessionId = new Map();
  const byTtId = new Map();
  tunes.forEach((t) => {
    if (t.theSessionId) bySessionId.set(t.theSessionId, t);
    if (t.ttId) byTtId.set(t.ttId, t);
  });

  for (const rec of model.recordings) {
    const release = model.resolveRelease(rec);
    const unmatched = [];
    (rec.tunes ?? []).forEach((entry, index) => {
      const tune =
        bySessionId.get(entry.theSessionId) ?? byTtId.get(entry.ttId);
      if (tune)
        (tune.referencesFromRecordings ??= []).push(
          toReference(rec, index, release, model)
        );
      else if (has(entry.theSessionId) || has(entry.ttId))
        unmatched.push(entry.theSessionId ?? `ttId ${entry.ttId}`);
    });
    if (unmatched.length)
      console.warn(
        `Warning: recording "${rec.id}" has tunes not in the database: ${unmatched.join(", ")}`
      );
  }
}

// ─── Per-list subsets ─────────────────────────────────────────────────────────

/**
 * The entities related to a list's tunes, as extra sections for the list JSON:
 * the recordings that reference those tunes, plus the releases, artists and
 * instruments those recordings use. Empty sections are omitted, so lists
 * without any recordings are unchanged. Call after projectRecordings, with the
 * tunes that will actually be published.
 */
export function entitiesFor(tunes, model) {
  const ids = new Set(
    tunes
      .flatMap((t) => t.referencesFromRecordings ?? [])
      .map((r) => r.recordingId)
  );
  const recordings = model.recordings.filter((r) => ids.has(r.id));
  const credits = recordings.flatMap((r) => r.credits ?? []);
  const releases = new Set(recordings.map(model.resolveRelease));
  const artists = new Set(credits.map(model.resolveArtist));
  const instrumentKeys = new Set(credits.flatMap((c) => c.instruments ?? []));

  const sections = {
    recordings,
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
