// References, releases, artists and instruments: first-class entities kept
// under `src/data/{references,releases,artists,instruments}/*.data.js`.
//
// A reference is anything outside the tune data that points at tunes (and
// artists): an audio or video recording (typically a track of a release), a
// web page, a book… Not to be confused with a tune's own `references`.
// A reference lives in a file of its own, or inside its release (`release.references`):
// then it needn't name the release, which it takes from its parent.
//
// Pipeline (driven by build-tune-lists.mjs):
//   1. loadEntities       — read, validate, resolve; returns the entity model
//   2. projectReferences  — link each tune to the references that mention it
//                           (`tune.referencesFromEntities`, as `{ referenceId, indices }`),
//                           and note on each reference's `tunes` what the data knows of them
//   3. entitiesFor        — per generated list, the subset of entities related
//                           to that list's tunes, to embed in the list JSON
//
// The tunes only carry links: the app expands them into tune-shaped references
// when it loads a list (see src/entityReferences.mjs, shared with this build).
import fs from "fs/promises";
import path from "path";
import { parseDataFile } from "./parse-data-file.mjs";
import {
  has,
  abcXs,
  RELEASE_ID_FIELDS,
  entityResolvers
} from "../src/entityReferences.mjs";

// ─── Identity ─────────────────────────────────────────────────────────────────

// At least one of these must be non-null on each entity.
const ARTIST_ID_FIELDS = ["id", "qId", "theSessionComposerId"];
// A reference names its release (an album, a book…) with any one of these fields
// (the counterparts of RELEASE_ID_FIELDS, in the same order: `id` is `releaseId`).
const RELEASE_REF_FIELDS = [
  "releaseId",
  "mbId",
  "discogsId",
  "theSessionRecordingId"
];
// Known values for `reference.type` (optional; an unknown value is only a warning).
const REFERENCE_TYPES = ["audio", "video", "web", "book"];

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

/** How a reference names `release`: `{ releaseId }` for its `id`, else `{ mbId }`, … (nothing if it has no identifier). */
const releaseIdentifier = (release) => {
  const i = RELEASE_ID_FIELDS.findIndex((f) => has(release[f]));
  return i < 0
    ? {}
    : { [RELEASE_REF_FIELDS[i]]: release[RELEASE_ID_FIELDS[i]] };
};

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

/**
 * The references embedded in releases (`release.references`), as entries like those read
 * from the `references/` files: each names its release as its parent does, and is
 * private if the release is.
 */
const embeddedReferences = (releasePairs) =>
  releasePairs.flatMap(({ entry: release, fileName }) =>
    (release.references ?? [])
      .filter((ref) => !ref.excludeFromBuild)
      .map((ref) => ({
        entry: {
          ...ref,
          ...releaseIdentifier(release),
          isPrivate: release.isPrivate || ref.isPrivate
        },
        fileName
      }))
  );

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
 * URL, if not given). References embedded in a release (`release.references`)
 * are loaded with the others; the published release doesn't carry them. An absent `language` means English. A credit (of a
 * reference or a release) that names a known artist but gives neither `role`
 * nor `instruments` gets the artist's first instrument.
 *
 * @returns {Promise<{references: object[], releases: object[], artists: object[],
 *   instruments: object, resolveArtist: Function, resolveRelease: Function}>}
 */
export async function loadEntities(dataDir, { isDevelopment = false } = {}) {
  const [artistPairs, releasePairs, fileReferencePairs, instrumentPairs] =
    await Promise.all(
      ["artists", "releases", "references", "instruments"].map((name) =>
        readEntries(path.join(dataDir, name))
      )
    );
  const referencePairs = [
    ...fileReferencePairs,
    ...embeddedReferences(releasePairs)
  ];
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
  // Warnings — checked against everything, so private entities don't cause noise.
  const all = entityResolvers(artists, releases);
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
  // const visibleArtists = artistPairs.filter(visible).map((p) => p.entry);
  const visibleArtists = artistPairs
    .filter(visible)
    .map(({ entry: { notes, ...rest } }) => rest); //filter out notes for now

  const { resolveArtist } = entityResolvers(visibleArtists, []);
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
    .map(({ entry: { references, ...release } }) =>
      withDefaultInstruments(release)
    ); // `references`: published as references, not as part of the release
  const resolvers = entityResolvers(visibleArtists, visibleReleases);
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

/** A tune's id as written in a note link: `theSessionId=2`, or `ttId=7`. */
const tuneIdStr = (t) =>
  t.theSessionId ? `theSessionId=${t.theSessionId}` : `ttId=${t.ttId}`;

/**
 * Link each tune to the references that mention it: for each reference, push
 * `{ referenceId, indices }` onto `referencesFromEntities` of every tune it
 * points to (matched by `theSessionId`, then `ttId`). `indices` are the
 * positions of the tune in `ref.tunes` (several if the reference mentions it more
 * than once: they make one reference). Tunes entries with only a title are kept
 * in the data but can't be linked, and a reference that links to no loaded tune
 * isn't published in any list. Mutates `tunes`.
 *
 * A `tunes` entry's `abcX` (the `X:` header of one of the tune's `abc` items; see
 * getCombinedReferences in processTuneData.js) that matches none is only a warning.
 *
 * Each `ref.tunes` entry that is found in the database also gets
 * `inDatabase: { idStr, name, rhythm }`, so that the reference can list all its
 * tunes (see tuneListLine in src/entityReferences.mjs) in a list that doesn't
 * contain them. Mutates the references of `model`.
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
    const unmatched = [];
    const noAbcX = [];
    const matches = (ref.tunes ?? []).map((entry) => ({
      entry,
      tune: bySessionId.get(entry.theSessionId) ?? byTtId.get(entry.ttId)
    }));
    const positions = new Map(); // tune -> its positions in ref.tunes
    matches.forEach(({ entry, tune }, index) => {
      if (tune) {
        positions.set(tune, [...(positions.get(tune) ?? []), index]);
        if (
          has(entry.abcX) &&
          ![tune.abc].flat().flatMap(abcXs).includes(String(entry.abcX))
        )
          noAbcX.push(`${entry.abcX} (${tuneIdStr(tune)})`);
      } else if (has(entry.theSessionId) || has(entry.ttId))
        unmatched.push(entry.theSessionId ?? `ttId ${entry.ttId}`);
    });
    positions.forEach((indices, tune) =>
      (tune.referencesFromEntities ??= []).push({
        referenceId: ref.id,
        indices
      })
    );
    if (ref.tunes)
      ref.tunes = matches.map(({ entry, tune }) =>
        tune
          ? {
              ...entry,
              inDatabase: {
                idStr: tuneIdStr(tune),
                name: tuneName(tune),
                rhythm: tuneRhythm(tune)
              }
            }
          : entry
      );
    if (unmatched.length)
      console.warn(
        `Warning: reference "${ref.id}" has tunes not in the database: ${unmatched.join(", ")}`
      );
    if (noAbcX.length)
      console.warn(
        `Warning: reference "${ref.id}" has abcX matching no X: header: ${noAbcX.join(", ")}`
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
