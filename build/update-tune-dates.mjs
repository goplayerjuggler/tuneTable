// build/update-tune-dates.mjs
//
// Updates build/tune-dates.json using git commit dates as the source of truth.
// Run via:  npm run update-dates
//
// Uses `git log --follow` so renames are handled correctly.
import process from "process";
import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);

const __dirName = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_DIR = path.resolve(__dirName, "../src/tunes");
const DATES_FILE = path.resolve(__dirName, "tune-dates.json");

// ─── Duration parsing ─────────────────────────────────────────────────────────

function parseDuration(str) {
  const match = str.match(/^(\d+)(m|h|d)$/);
  if (!match)
    throw new Error(`Invalid duration: "${str}". Use e.g. 24h, 7d, 30m`);
  const n = parseInt(match[1], 10);
  const units = { m: 60_000, h: 3_600_000, d: 86_400_000 };
  return n * units[match[2]];
}

// ─── Serialisation (mirrors build-tune-lists.mjs) ─────────────────────────────

function serialiseTuneDates(tuneDates1, tuneDates2) {
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

// ─── Git date lookup ──────────────────────────────────────────────────────────

/**
 * Returns the date of the most recent commit touching `filePath` as YYYY-MM-DD,
 * or `null` if the file has no git history (e.g. untracked).
 */
async function getGitDate(filePath) {
  try {
    const { stdout } = await execFileAsync("git", [
      "log",
      "--follow",
      "--format=%ai",
      "--",
      filePath
    ]);
    const firstLine = stdout.trim().split("\n")[0];
    // "%ai" → "2024-03-15 14:23:45 +0100"
    return firstLine ? firstLine.split(" ")[0] : null;
  } catch {
    return null;
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function updateTuneDates({ onlyCheckWithin = null } = {}) {
  let tuneDates1 = [];
  let tuneDates2 = {};
  try {
    const raw = await fs.readFile(DATES_FILE, "utf8");
    ({ tuneDates1, tuneDates2 } = JSON.parse(raw));
  } catch {
    // Cache doesn't exist yet — will be created below
  }

  const tuneFileNames = (await fs.readdir(SOURCE_DIR)).filter((f) =>
    f.endsWith(".data.js")
  );

  let filesToCheck = tuneFileNames;
  if (onlyCheckWithin != null) {
    const cutoff = Date.now() - onlyCheckWithin;
    const stats = await Promise.all(
      tuneFileNames.map((f) => fs.stat(path.join(SOURCE_DIR, f)))
    );
    filesToCheck = tuneFileNames.filter((_, i) => stats[i].mtimeMs >= cutoff);
    console.log(
      `Checking ${filesToCheck.length}/${tuneFileNames.length} files modified within the last ${process.argv[3]}`
    );
  }

  if (filesToCheck.length === 0) {
    console.log("No files to check.");
    return;
  }

  let dirty = false;
  let processed = 0;

  for (const fileName of filesToCheck) {
    const gitDate = await getGitDate(path.join(SOURCE_DIR, fileName));
    if (!gitDate) {
      console.warn(`Warning: no git history for ${fileName} (untracked?)`);
      continue;
    }

    const numbered = fileName.match(/^(\d+)\s/);
    if (numbered) {
      const i = parseInt(numbered[1], 10);
      while (tuneDates1.length < i) {
        tuneDates1.push(null);
        dirty = true;
      }
      if (tuneDates1[i] !== gitDate) {
        tuneDates1[i] = gitDate;
        dirty = true;
      }
    } else {
      if (tuneDates2[fileName] !== gitDate) {
        tuneDates2[fileName] = gitDate;
        dirty = true;
      }
    }

    processed++;
    if (processed % 20 === 0)
      console.log(`  ${processed}/${filesToCheck.length} files processed...`);
  }

  if (dirty) {
    await fs.writeFile(DATES_FILE, serialiseTuneDates(tuneDates1, tuneDates2));
    console.log("✓ tune-dates.json updated");
  } else {
    console.log("tune-dates.json is already up to date");
  }
}

// ─── CLI entry point ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let onlyCheckWithin = null;
if (args[0] === "only-check") {
  if (!args[1])
    throw new Error("only-check requires a duration (e.g. 24h, 7d, 30m)");
  onlyCheckWithin = parseDuration(args[1]);
}

updateTuneDates({ onlyCheckWithin }).catch((err) => {
  console.error("update-dates failed:", err);
  process.exit(1);
});
