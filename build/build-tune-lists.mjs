// build/build-tune-lists.mjs
import { createHash } from "crypto";
import process from "process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import abcTools from "@goplayerjuggler/abc-tools";

const { getMetadata, getTunes } = abcTools;

const __dirName = path.dirname(fileURLToPath(import.meta.url));

const SOURCE_DIR = path.resolve(__dirName, "../src/tunes");
const TEMPLATE_FILE = path.resolve(__dirName, "../src/tunes-template.data.js");
const DEFAULT_OUT_DIR = path.resolve(__dirName, "../dist/tune-lists");
const DATES_FILE = path.resolve(__dirName, "tune-dates.json");
const defaultListName = "goPlayer’s tune list";
const subsetComment = ` – extracted from ${defaultListName}`;

// ─── Configuration ────────────────────────────────────────────────────────────

/** Composer-based list definitions. */
const COMPOSER_EXTRACTS = [
  // {
  //   id: "paddy-fahey",
  //   label: "Paddy Fahey",
  //   match: (c) => /paddy\s+fahey/i.test(c)
  // },
  // { id: "ed-reavy", label: "Ed Reavy", match: (c) => /ed\s+reavy/i.test(c) },
  // {
  //   id: "tommy-peoples",
  //   label: "Tommy Peoples",
  //   match: (c) => /tommy\s+peoples/i.test(c)
  // },
  {
    id: "go-player",
    label: "GoPlayer",
    match: (c) => /malcolm\s+schonfield/i.test(c)
  }
];

/** Origin-based list definitions. */
const ORIGIN_EXTRACTS = [
  { id: "france", label: "France", match: (o) => /^france/i.test(o) },
  //{ id: "england", label: "England", match: (o) => /england/i.test(o) },
  {
    id: "nordic",
    label: "Nordic",
    match: (o) => /^sweden|norway/i.test(o),
    description: "Swedish & Norwegian tunes" + subsetComment
  },
  { id: "québec", label: "Québec", match: (o) => /qu[eé]bec/i.test(o) }
];

function toDateString(ms) {
  const d = new Date(ms);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");
}

// ─── Tune-dates cache ─────────────────────────────────────────────────────────

/**
 * Load the committed tune-dates cache and return a Map from fileName → YYYY-MM-DD.
 * Dates are never written here; run `npm run update-dates` to refresh from git.
 *
 * @param {string[]} tuneFileNames - File names (not paths) of all tune files.
 * @returns {Promise<Map<string, string>>}
 */
async function loadTuneDates(tuneFileNames) {
  let tuneDates1 = [];
  let tuneDates2 = {};
  try {
    const raw = await fs.readFile(DATES_FILE, "utf8");
    ({ tuneDates1, tuneDates2 } = JSON.parse(raw));
  } catch {
    console.warn(
      "Warning: tune-dates.json not found — run `npm run update-dates`"
    );
  }

  const dateMap = new Map();

  tuneFileNames
    .filter((f) => /^(\d+)\s/.test(f))
    .forEach((fileName) => {
      const i = parseInt(fileName.match(/^(\d+)\s/)[1], 10);
      if (tuneDates1[i]) dateMap.set(fileName, tuneDates1[i]);
      else
        console.warn(
          `Warning: no date cached for ${fileName} — commit it, then run \`npm run update-dates -- only-check 30m\``
        );
    });

  tuneFileNames
    .filter((f) => !/^(\d+)\s/.test(f))
    .forEach((fileName) => {
      if (tuneDates2[fileName]) dateMap.set(fileName, tuneDates2[fileName]);
      else
        console.warn(
          `Warning: no date cached for ${fileName} — run \`npm run update-dates\``
        );
    });

  return dateMap;
}

// ─── File parsing ─────────────────────────────────────────────────────────────

/**
 * Evaluate a tune `.data.js` file without going through the Node module cache.
 * Each file exports a single object literal, or an array of such objects; this converts
 * `export default` to a `return` statement and run it with `new Function`.
 * Leading line comments (e.g. the fileName comment) are harmless and left in place.
 *
 * @param {string} content - Raw file content.
 * @returns {object}
 */
function parseTuneFile(content) {
  const body = content.replace(/export\s+default\s*(?=[{[])/, "return ");

  return new Function(body)();
}

/**
 * Load `tunes-template.data.js` without the webpack pre-processing step by
 * substituting the `//CopyTunesHere` placeholder with an empty tunes array.
 *
 * @param {string} content - Raw template file content.
 * @returns {object}
 */
function parseTemplateFile(content) {
  const body = content
    .replace("//CopyTunesHere", "tunes: [],")
    .replace(/export\s+default\s*(?=\{)/, "return ");

  return new Function(body)();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFirstAbc({ abc, incipit } = {}) {
  if (typeof abc === "string") return abc;
  if (Array.isArray(abc) && abc.length > 0) return abc[0];
  return incipit ?? "";
}

/** Returns a copy of a tune with build-time-only properties removed. */
function sanitizeTune({
  // eslint-disable-next-line no-unused-vars
  groups,
  // eslint-disable-next-line no-unused-vars
  excludeFromDefault,
  // eslint-disable-next-line no-unused-vars
  metadataFromAbc,
  ...tune
}) {
  return tune;
}

/** Returns a copy of a set list with build-time-only properties removed. */
// eslint-disable-next-line no-unused-vars
function sanitizeSetList({ groups, ...setList }) {
  return setList;
}

function getGroupDisplayName(group) {
  const names = {
    alora: "ALORA (lunchtime workshops)",
    su: "Steam Up!"
  };
  return names[group] ?? `Group: ${group}`;
}

/**
 * Parse list metadata from an ABC file header — the lines before the first
 * `X:` field. Recognises three optional directives:
 *   %% list-name:        <string>
 *   %% list-description: <string>
 *   %% list-date:        YYYY-MM-DD
 *
 * @param {string} content - Raw ABC file content.
 * @param {string} stem    - File stem used as fallback name.
 * @returns {{ name: string, description: string, listDate: string|undefined, defaultSort: string|undefined}}
 */
function parseAbcHeader(content, stem) {
  const header = content.split(/^X:/m)[0];
  const find = (key) => {
    const m = header.match(new RegExp(`^%%\\s*list-${key}:\\s*(.+)`, "m"));
    return m?.[1].trim() ?? null;
  };
  return {
    name: find("name") ?? stem,
    description: find("description") ?? "",
    listDate: find("date") ?? undefined,
    defaultSort: find("defaultSort") ?? undefined
  };
}

/**
 * Returns the most recent YYYY-MM-DD date among the provided values,
 * or today as a fallback.
 */
function maxDate(...dates) {
  const valid = dates.filter(Boolean);
  return valid.length ? valid.sort().at(-1) : toDateString(Date.now());
}

/** Extracts the date component from a set list's `dateModified` ISO string. */
const setListDate = (sl) => sl.dateModified?.split("T")[0];

/**
 * Compute `lastUpdate` for a generated list: the most recent date among
 * constituent tune file dates and set list modification dates.
 */
const listLastUpdate = (tunes, setLists) =>
  maxDate(...tunes.map((t) => t.fileDate), ...setLists.map(setListDate));

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Build all tune-list JSON files and `manifest.json` from the source
 * `.data.js` files and the set lists in `tunes-template.data.js`.
 *
 * `lastUpdate` for each generated list reflects the most recent date among
 * the constituent tunes' commit dates (tracked in `build/tune-dates.json`,
 * updated via `npm run update-dates`) and the `dateModified` fields of its set lists.
 *
 * In production mode (`isDevelopment: false`) any tune flagged isPrivate never reaches
 * GitHub Pages.
 *
 * @param {{ isDevelopment?: boolean, outputDir?: string, manifestPath?: string }} [options]
 * @returns {Promise<void>}
 */
export async function buildTuneLists({
  isDevelopment = false,
  outputDir = DEFAULT_OUT_DIR,
  manifestPath = null
} = {}) {
  console.log("Building tune lists from source files...");

  const tuneFileNames = (await fs.readdir(SOURCE_DIR)).filter((f) =>
    f.endsWith(".data.js")
  );
  const tuneFiles = tuneFileNames.map((f) => path.join(SOURCE_DIR, f));

  console.log(`Found ${tuneFiles.length} tune files`);

  const dateMap = await loadTuneDates(tuneFileNames);

  const tunesFromDataJsFiles = [];
  for (const file of tuneFiles) {
    const content = await fs.readFile(file, "utf8");
    let data = parseTuneFile(content);
    if (!Array.isArray(data)) data = [data];
    data.forEach((tune) => {
      if (tune.excludeFromBuild) return;
      let metadata = {};
      try {
        const firstAbc = getFirstAbc(tune);
        if (firstAbc) metadata = getMetadata(firstAbc);
      } catch {
        console.warn(
          `Warning: could not parse ABC metadata from ${path.basename(file)}`
        );
      }
      tunesFromDataJsFiles.push({
        metadataFromAbc: metadata,
        ...tune,
        fileDate: tune.fileDate ?? dateMap.get(path.basename(file))
      });
    });
  }

  const templateContent = await fs.readFile(TEMPLATE_FILE, "utf8");
  const template = parseTemplateFile(templateContent);
  const allSetLists = template.setLists ?? [];

  await fs.mkdir(outputDir, { recursive: true });

  const generatedLists = [];

  const writtenFiles = new Set();

  /**
   * Write a list JSON file, unless it is excluded from publication.
   * Serialises, hashes content, writes `${baseId}.${hash}.json`; returns hashed filename. */
  const writeList = async (baseId, tunes, setLists = []) => {
    const data = {
      tunes: tunes
        .filter((t) => isDevelopment || !t.isPrivate)
        .map(sanitizeTune),
      setLists: setLists.map(sanitizeSetList)
    };
    const json = JSON.stringify(data, null, 2);
    const hash = createHash("md5").update(json).digest("hex").slice(0, 10);
    const fileName = `${baseId}.${hash}.json`;
    await fs.writeFile(path.join(outputDir, fileName), json);
    writtenFiles.add(fileName);
    return fileName;
  };

  /** Set lists associated with a given group name. */
  const setListsFor = (group) =>
    allSetLists.filter((sl) =>
      sl.groups
        ?.split(",")
        .map((g) => g.trim().toLowerCase())
        .includes(group)
    );

  // Default list — excludes tunes flagged with `excludeFromDefault: true`
  const defaultTunes = tunesFromDataJsFiles.filter(
    (t) => !t.excludeFromDefault
  );
  const defaultSetLists = setListsFor("default");
  const defaultFileName = await writeList(
    "default",
    defaultTunes,
    defaultSetLists
  );

  generatedLists.push({
    id: "default",
    name: defaultListName,
    file: defaultFileName,
    lastUpdate: listLastUpdate(defaultTunes, defaultSetLists),
    count: defaultTunes.length,
    setListCount: defaultSetLists.length,
    description: "My tunebook: tunes I play or am interested in",
    default: true
  });
  console.log(
    `✓ default.json (${defaultTunes.length} tunes, ${defaultSetLists.length} sets)`
  );

  // Group-based lists
  const groupMap = new Map();
  tunesFromDataJsFiles.forEach((tune) => {
    tune.groups
      ?.split(",")
      .map((g) => g.trim().toLowerCase())
      .forEach((group) => {
        if (!groupMap.has(group)) groupMap.set(group, []);
        groupMap.get(group).push(tune);
      });
  });

  for (const [group, tunes] of [...groupMap.entries()].sort((a, b) =>
    a[0].localeCompare(b[0])
  )) {
    let description = "";
    const setLists = setListsFor(group);
    const fileName = await writeList(`group-${group}`, tunes, setLists);
    if (fileName) {
      switch (group) {
        case "su":
          description = "Steam Up! tunes" + subsetComment;
          break;
        case "alora":
          description = "ALORA trad music tunes" + subsetComment;
          break;

        default:
          break;
      }

      generatedLists.push({
        id: `group-${group}`,
        name: getGroupDisplayName(group),
        file: fileName,
        lastUpdate: listLastUpdate(tunes, setLists),
        count: tunes.length,
        setListCount: setLists.length,
        description: description,
        category: "groups",
        group
      });
      console.log(
        `✓ ${fileName} (${tunes.length} tunes, ${setLists.length} sets)`
      );
    }
  }

  // Origin-based lists
  for (const { id, label, match, description } of ORIGIN_EXTRACTS) {
    const tunes = tunesFromDataJsFiles.filter(
      (t) => t.metadataFromAbc?.origin && match(t.metadataFromAbc?.origin)
    );
    if (tunes.length === 0) continue;
    const fileName = await writeList(`origin-${id}`, tunes);
    if (fileName) {
      generatedLists.push({
        id: `origin-${id}`,
        name: label,
        file: fileName,
        lastUpdate: listLastUpdate(tunes, []),
        count: tunes.length,
        description:
          description ?? `Tunes originating from ${label}` + subsetComment,
        category: "origins"
      });
      console.log(`✓ ${fileName} (${tunes.length} tunes)`);
    }
  }

  // Composer-based lists
  if (isDevelopment) {
    for (const { id, label, match } of COMPOSER_EXTRACTS) {
      const tunes = tunesFromDataJsFiles.filter(
        (t) => t.metadataFromAbc?.composer && match(t.metadataFromAbc?.composer)
      );
      if (tunes.length === 0) continue;
      const fileName = await writeList(`composer-${id}`, tunes);
      if (fileName) {
        generatedLists.push({
          id: `composer-${id}`,
          name: label,
          file: fileName,
          lastUpdate: listLastUpdate(tunes, []),
          count: tunes.length,
          description: `Tunes by ${label}` + subsetComment,
          category: "composers"
        });
        console.log(`✓ ${fileName} (${tunes.length} tunes)`);
      }
    }
  }

  // ABC file lists
  const abcFileNames = (await fs.readdir(SOURCE_DIR)).filter((f) =>
    f.endsWith(".abc")
  );
  for (const abcFileName of abcFileNames.sort()) {
    const content = await fs.readFile(
      path.join(SOURCE_DIR, abcFileName),
      "utf8"
    );
    const stem = path.basename(abcFileName, ".abc");
    const { name, description, listDate, defaultSort } = parseAbcHeader(
      content,
      stem
    );
    const abcTunes = getTunes(content)
      .filter((abc) => abc.trim())
      .map((abc) => ({ abc }));
    if (abcTunes.length === 0) continue;
    const id = `abc-${stem}`;
    const fileName = await writeList(id, abcTunes);
    if (fileName) {
      generatedLists.push({
        id,
        name,
        file: fileName,
        ...(listDate && { lastUpdate: listDate }),
        defaultSort: defaultSort ?? "rhythmContourName",
        count: abcTunes.length,
        description,
        category: "other sources"
      });
      console.log(`✓ ${fileName} (${abcTunes.length} tunes) [ABC]`);
    }
  }

  generatedLists.forEach((l) => {
    if (!l.defaultSort) l.defaultSort = "rhythmContourName";
  });

  // Manifest
  // Prune stale hashed files left by a previous build
  for (const existing of await fs.readdir(outputDir)) {
    if (existing.endsWith(".json") && !writtenFiles.has(existing)) {
      await fs.rm(path.join(outputDir, existing));
      console.log(`  removed stale: ${existing}`);
    }
  }

  const manifest = {
    version: "1.0",
    generated: new Date().toISOString(),
    lists: generatedLists,
    externalSources: []
  };
  const manifestJson = JSON.stringify(manifest, null, 2);

  // Always write to dist/tune-lists/ (useful for CLI inspection)
  await fs.writeFile(path.join(outputDir, "manifest.json"), manifestJson);
  console.log(`✓ manifest.json`);

  // Write to src/generated/ for static import into the bundle.
  // This path is in watchOptions.ignored so it never triggers recompilation.
  if (manifestPath) {
    await fs.mkdir(path.dirname(manifestPath), { recursive: true });
    await fs.writeFile(manifestPath, manifestJson);
    console.log(`✓ ${path.basename(manifestPath)} (bundle import)`);
  }

  console.log(`\nTune list build complete! (${generatedLists.length} lists)`);
}
// ─── CLI entry point ──────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildTuneLists({ isDevelopment: true }).catch((err) => {
    console.error("Build failed:", err);
    process.exit(1);
  });
}
