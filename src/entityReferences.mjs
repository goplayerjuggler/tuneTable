// How references, releases, artists and instruments become the tune-shaped
// references that tune rows show (`tune.referencesFromEntities`).
//
// Shared by the build (Node; see build/build-entities.mjs) and the app
// (browser), hence plain `.mjs` with no imports. A list JSON carries the
// entities once, and each tune only links to its references:
// `{ referenceId, indices }`, `indices` being the positions of the tune in the
// reference's `tunes`. `hydrateReferencesFromEntities` expands those links into
// the shape `formatReference` renders (artists, album, url, notes, _tuneList).
//
// To name the other tunes of a reference, the build adds to each of its `tunes`
// entries that is found in the database: `inDatabase: { idStr, name, rhythm }`
// (`idStr` as in a note link: `theSessionId=2`). A list needn't contain those tunes.
//
// A `tunes` entry may also have `abcX`: the `X:` header of the item of `tune.abc` that
// the reference is about. The hydrated reference carries those as `abcX` (strings), and
// getCombinedReferences (processTuneData.js) merges the ABC's N: and H: comments into it.

// ─── Identity and lookup ──────────────────────────────────────────────────────

export const has = (v) => v != null;

/** The `X:` header values, as strings, of some ABC text: one for a tune, several for a multi-tune string, none for no ABC. */
export const abcXs = (abc) =>
  [...(abc ?? "").matchAll(/^X:[ \t]*(\S+)/gm)].map((m) => m[1]);

// At least one of these must be non-null on each release.
export const RELEASE_ID_FIELDS = [
  "id",
  "mbId",
  "discogsId",
  "theSessionRecordingId"
];

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

/** `resolveArtist` (by `id`, then `qId`) and `resolveRelease` (a reference's release) over the given lists. */
export const entityResolvers = (artists, releases) => {
  const findRelease = lookup(releases, RELEASE_ID_FIELDS);
  return {
    resolveArtist: lookup(artists, ["id", "qId"]),
    resolveRelease: (ref) => findRelease(asReleaseRef(ref))
  };
};

/** The entity model of a list JSON (`{ references, releases, artists, instruments }`; any may be absent). */
export const createEntityModel = ({
  references = [],
  releases = [],
  artists = [],
  instruments = {}
}) => ({
  references,
  releases,
  artists,
  instruments,
  ...entityResolvers(artists, releases)
});

// ─── Tune-shaped references ───────────────────────────────────────────────────

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

/** "jig" -> "jigs", "march" -> "marches"; a word already ending in "s" is left alone. */
const plural = (word) =>
  /(ch|sh|x|z)$/.test(word)
    ? `${word}es`
    : word.endsWith("s")
      ? word
      : `${word}s`;

/** Counts the rhythms of the tunes found in the database, in order of first appearance: "2 jigs; hop jig". */
function rhythmSummary(entries) {
  const counts = new Map();
  for (const { inDatabase } of entries) {
    const rhythm = inDatabase?.rhythm?.trim().toLowerCase();
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
function tuneListLine(entries, indices) {
  if (entries.length < 2) return null;
  const labels = entries.map((entry, i) => {
    const name = (
      entry.name ??
      entry.inDatabase?.name ??
      entry.title ??
      `#${entry.theSessionId ?? entry.ttId ?? "?"}`
    ).replace(/[[\]]/g, ""); // brackets would break the link syntax
    return entry.inDatabase && !indices.includes(i)
      ? `[${name}](${entry.inDatabase.idStr})`
      : name;
  });
  const summary = rhythmSummary(entries);
  return labels.join(" / ") + (summary ? ` (${summary})` : "");
}

/**
 * A reference seen from one of its tunes, shaped like a manual `references` entry.
 * `indices` are the positions in `ref.tunes` of that tune (several if the reference
 * mentions it more than once: they are merged into one reference).
 * `abcX` lists the settings of the tune (`X:` headers) that those mentions point to.
 */
export function toReference(ref, indices, model) {
  const release = model.resolveRelease(ref);
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
  const abcX = [
    ...new Set(
      indices
        .map((i) => ref.tunes[i].abcX)
        .filter(has)
        .map(String)
    )
  ];
  const tuneList = tuneListLine(ref.tunes ?? [], indices);
  // "Track 4 (3:17)"; without a track number, "(3:17)"; neither if both are absent.
  const trackInfo = has(ref.trackNumber)
    ? `Track ${ref.trackNumber}${ref.duration ? ` (${ref.duration})` : ""}`
    : ref.duration && `(${ref.duration})`;
  const notes = [
    [trackInfo, ref.title].filter(Boolean).join(": "),
    ...mentions,
    ref.notes,
    ...moreUrls // bare URLs are linkified by formatReference
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    referenceId: ref.id,
    _tuneList: tuneList || undefined, // generated, so not part of `notes` nor exported: formatReference renders it, calculateCrossRefs scans it apart
    type: ref.type,
    language: ref.language,
    abcX: abcX.length ? abcX : undefined,
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
 * Expands the `referencesFromEntities` links of a list's tunes (`{ referenceId, indices }`)
 * into tune-shaped references, using the entities of the same list JSON (`data`).
 * Call it on loading a list, before processTuneData. Mutates and returns `tunes`.
 * Already expanded references (e.g. in a local list) are left as they are; a link to
 * a reference that is not in `data` is dropped.
 */
export function hydrateReferencesFromEntities(tunes, data) {
  const model = createEntityModel(data);
  const referencesById = new Map(model.references.map((r) => [r.id, r]));
  tunes.forEach((tune) => {
    if (!tune.referencesFromEntities) return;
    tune.referencesFromEntities = tune.referencesFromEntities.flatMap(
      (link) => {
        if (!link.indices) return [link];
        const ref = referencesById.get(link.referenceId);
        return ref ? [toReference(ref, link.indices, model)] : [];
      }
    );
  });
  return tunes;
}
