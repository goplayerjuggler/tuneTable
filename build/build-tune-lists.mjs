// build/build-tune-lists.mjs
import process from "process";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import abcTools from "@goplayerjuggler/abc-tools";

const { getMetadata } = abcTools;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SOURCE_DIR = path.resolve(__dirname, "../src/tunes");
const TEMPLATE_FILE = path.resolve(__dirname, "../src/tunes-template.data.js");
const DEFAULT_OUT_DIR = path.resolve(__dirname, "../dist/tune-lists");
const DATES_FILE = path.resolve(__dirname, "tune-dates.json");

// ─── Configuration ────────────────────────────────────────────────────────────

/**
 * JSON filenames (without path) that are built in dev mode only and excluded
 * from the production / GitHub Pages output.
 * @type {string[]}
 */
export const JSON_TO_NOT_PUBLISH = [];

/** Composer-based list definitions. */
const COMPOSER_EXTRACTS = [
  {
    id: "paddy-fahey",
    label: "Paddy Fahey",
    match: (c) => /paddy\s+fahey/i.test(c)
  },
  { id: "ed-reavy", label: "Ed Reavy", match: (c) => /ed\s+reavy/i.test(c) }
];

/** Origin-based list definitions. */
const ORIGIN_EXTRACTS = [
  { id: "france", label: "France", match: (o) => /^france/i.test(o) },
  { id: "québec", label: "Québec", match: (o) => /qu[eé]bec/i.test(o) }
];

// ─── Tune-dates cache ─────────────────────────────────────────────────────────

/**
 * Serialise tune-dates data with 10 entries per line in `tuneDates1`
 * for human readability.
 *
 * @param {Array<string|null>} tuneDates1
 * @param {Record<string, string>} tuneDates2
 * @returns {string}
 */
function serializeTuneDates(tuneDates1, tuneDates2) {
  const CHUNK = 10;
  const rows = [];
  for (let i = 0; i < tuneDates1.length; i += CHUNK) {
    rows.push(
      tuneDates1
        .slice(i, i + CHUNK)
        .map((d) => (d === null ? "null" : `"${d}"`))
        .join(", ")
    );
  }
  const arr = rows.length ? `[\n    ${rows.join(",\n    ")}\n  ]` : "[]";
  const dict = JSON.stringify(tuneDates2, null, 2).replace(/\n/g, "\n  ");
  return `{\n  "tuneDates1": ${arr},\n  "tuneDates2": ${dict}\n}\n`;
}

function toDateString(ms) {
  const d = new Date(ms);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0")
  ].join("-");
}

/**
 * Load the committed tune-dates cache, update any entries whose filesystem
 * mtime is newer than the stored date, write back if changed, and return a
 * Map from filename → YYYY-MM-DD date string.
 *
 * Tune files named `[integer] [name].data.js` are stored in the compact
 * `tuneDates1` array (indexed by the leading integer); all others go into
 * the `tuneDates2` dictionary keyed by full filename.
 *
 * The cache is committed to source control so that CI/CD environments
 * (where a fresh checkout sets all mtimes to "now") use accurate dates.
 *
 * @param {string[]} tuneFiles - Absolute paths to all tune files.
 * @returns {Promise<Map<string, string>>}
 */
async function loadAndUpdateTuneDates(tuneFiles) {
  let tuneDates1 = [];
  let tuneDates2 = {};
  try {
    const raw = await fs.readFile(DATES_FILE, "utf8");
    ({ tuneDates1, tuneDates2 } = JSON.parse(raw));
  } catch {
    // Cache doesn't exist yet — will be created below
  }

  const stats = await Promise.all(tuneFiles.map((f) => fs.stat(f)));
  let dirty = false;
  const dateMap = new Map();

  tuneFiles.forEach((file, i) => {
    const filename = path.basename(file);
    const fsDate = toDateString(stats[i].mtimeMs);
    const numbered = filename.match(/^(\d+)\s/);

    if (numbered) {
      const idx = parseInt(numbered[1], 10);
      while (tuneDates1.length <= idx) {
        tuneDates1.push(null);
        dirty = true;
      }
      if (!tuneDates1[idx] || fsDate > tuneDates1[idx]) {
        tuneDates1[idx] = fsDate;
        dirty = true;
      }
      dateMap.set(filename, tuneDates1[idx]);
    } else {
      if (!tuneDates2[filename] || fsDate > tuneDates2[filename]) {
        tuneDates2[filename] = fsDate;
        dirty = true;
      }
      dateMap.set(filename, tuneDates2[filename]);
    }
  });

  if (dirty) {
    await fs.writeFile(DATES_FILE, serializeTuneDates(tuneDates1, tuneDates2));
    console.log("✓ tune-dates.json updated");
  }

  return dateMap;
}

// ─── File parsing ─────────────────────────────────────────────────────────────

/**
 * Evaluate a tune `.data.js` file without going through the Node module cache.
 * Each file exports a single object literal; we convert `export default` to a
 * `return` statement and run it with `new Function`. Leading line comments
 * (e.g. the filename comment) are harmless and left in place.
 *
 * @param {string} content - Raw file content.
 * @returns {object}
 */
function parseTuneFile(content) {
  const body = content.replace(/export\s+default\s*(?=\{)/, "return ");

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
// eslint-disable-next-line no-unused-vars
function sanitizeTune({ groups, excludeFromDefault, _fileDate, ...tune }) {
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
  maxDate(...tunes.map((t) => t._fileDate), ...setLists.map(setListDate));

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Build all tune-list JSON files and `manifest.json` from the source
 * `.data.js` files and the set lists in `tunes-template.data.js`.
 *
 * `lastUpdate` for each generated list reflects the most recent date among
 * the constituent tunes' filesystem modification dates (tracked in
 * `build/tune-dates.json`, committed to source control for CI accuracy) and
 * the `dateModified` fields of its set lists.
 *
 * In production mode (`isDevelopment: false`) any filename listed in
 * {@link JSON_TO_NOT_PUBLISH} is silently skipped so it never reaches
 * GitHub Pages.
 *
 * @param {{ isDevelopment?: boolean, outputDir?: string }} [options]
 * @returns {Promise<void>}
 */
export async function buildTuneLists({
  isDevelopment = false,
  outputDir = DEFAULT_OUT_DIR
} = {}) {
  console.log("Building tune lists from source files...");

  const tuneFileNames = (await fs.readdir(SOURCE_DIR)).filter((f) =>
    f.endsWith(".data.js")
  );
  const tuneFiles = tuneFileNames.map((f) => path.join(SOURCE_DIR, f));

  console.log(`Found ${tuneFiles.length} tune files`);

  const dateMap = await loadAndUpdateTuneDates(tuneFiles);

  const allTunes = [];
  for (const file of tuneFiles) {
    const content = await fs.readFile(file, "utf8");
    const tune = parseTuneFile(content);
    let metadata = {};
    try {
      const firstAbc = getFirstAbc(tune);
      if (firstAbc) metadata = getMetadata(firstAbc);
    } catch {
      console.warn(
        `Warning: could not parse ABC metadata from ${path.basename(file)}`
      );
    }
    allTunes.push({
      ...metadata,
      ...tune,
      _fileDate: dateMap.get(path.basename(file))
    });
  }

  const templateContent = await fs.readFile(TEMPLATE_FILE, "utf8");
  const template = parseTemplateFile(templateContent);
  const allSetLists = template.setLists ?? [];

  await fs.mkdir(outputDir, { recursive: true });

  const generatedLists = [];

  /**
   * Write a list JSON file, unless it is excluded from publication.
   * @returns {Promise<boolean>} `true` if the file was written.
   */
  const writeList = async (filename, tunes, setLists = []) => {
    if (!isDevelopment && JSON_TO_NOT_PUBLISH.includes(filename)) return false;
    const data = {
      tunes: tunes.map(sanitizeTune),
      setLists: setLists.map(sanitizeSetList)
    };
    await fs.writeFile(
      path.join(outputDir, filename),
      JSON.stringify(data, null, 2)
    );
    return true;
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
  const defaultTunes = allTunes.filter((t) => !t.excludeFromDefault);
  const defaultSetLists = setListsFor("default");
  await writeList("default.json", defaultTunes, defaultSetLists);
  generatedLists.push({
    id: "default",
    name: "Main tune list",
    file: "default.json",
    lastUpdate: listLastUpdate(defaultTunes, defaultSetLists),
    count: defaultTunes.length,
    description: "main tune list",
    default: true
  });
  console.log(
    `✓ default.json (${defaultTunes.length} tunes, ${defaultSetLists.length} sets)`
  );

  // Group-based lists
  const groupMap = new Map();
  allTunes.forEach((tune) => {
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
    const filename = `group-${group}.json`;
    let description = "";
    const setLists = setListsFor(group);
    if (await writeList(filename, tunes, setLists)) {
      switch (group) {
        case "su":
          description = "Steam Up! tunes";
          break;
        case "alora":
          description = "ALORA trad music tunes";
          break;

        default:
          break;
      }

      generatedLists.push({
        id: `group-${group}`,
        name: getGroupDisplayName(group),
        file: filename,
        lastUpdate: listLastUpdate(tunes, setLists),
        count: tunes.length,
        description: description,
        category: "groups",
        group
      });
      console.log(
        `✓ ${filename} (${tunes.length} tunes, ${setLists.length} sets)`
      );
    }
  }

  // Origin-based lists
  for (const { id, label, match } of ORIGIN_EXTRACTS) {
    const tunes = allTunes.filter((t) => t.origin && match(t.origin));
    if (tunes.length === 0) continue;
    const filename = `origin-${id}.json`;
    if (await writeList(filename, tunes)) {
      generatedLists.push({
        id: `origin-${id}`,
        name: label,
        file: filename,
        lastUpdate: listLastUpdate(tunes, []),
        count: tunes.length,
        description: `Tunes originating from ${label}`,
        category: "origins"
      });
      console.log(`✓ ${filename} (${tunes.length} tunes)`);
    }
  }

  // Composer-based lists
  for (const { id, label, match } of COMPOSER_EXTRACTS) {
    const tunes = allTunes.filter((t) => t.composer && match(t.composer));
    if (tunes.length === 0) continue;
    const filename = `composer-${id}.json`;
    if (await writeList(filename, tunes)) {
      generatedLists.push({
        id: `composer-${id}`,
        name: label,
        file: filename,
        lastUpdate: listLastUpdate(tunes, []),
        count: tunes.length,
        description: `Tunes by ${label}`,
        category: "composers"
      });
      console.log(`✓ ${filename} (${tunes.length} tunes)`);
    }
  }

  // Manifest
  const manifest = {
    version: "1.0",
    generated: new Date().toISOString(),
    lists: generatedLists,
    externalSources: []
  };
  await fs.writeFile(
    path.join(outputDir, "manifest.json"),
    JSON.stringify(manifest, null, 2)
  );
  console.log(
    `✓ manifest.json\n\nTune list build complete! (${generatedLists.length} lists)`
  );
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildTuneLists({ isDevelopment: true }).catch((err) => {
    console.error("Build failed:", err);
    process.exit(1);
  });
}
