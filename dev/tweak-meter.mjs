import fs from "fs";
import path from "path";
import { format, resolveConfig } from "prettier";
import { fileURLToPath } from "url";
import abcTools from "@goplayerjuggler/abc-tools";
const {
  convertStandardHornpipe,
  convertStandardJig,
  convertStandardReel,
  getMetadata,
  javascriptify
} = abcTools;

/**
 *
 * @param {*} javascript - string of javascript to format
 * @returns
 */
async function formatJavascript(javascript) {
  const options = await resolveConfig(TUNES_FILE); // Resolves current config
  const formatted = format(javascript, {
    ...options,
    parser: "espree" // Default parser for JavaScript
    //https://prettier.io/blog/2020/11/20/2.2.0
  });
  return formatted;
}

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const makeBackup = true;
// other constants
const TUNES_FILE = path.join(__dirname, "..", "src", "tunes.json.js");
const date = new Date();
const formattedDate = `${date.getFullYear().toString().slice(-2)}_${String(date.getMonth() + 1).padStart(2, "0")}_${String(date.getDate()).padStart(2, "0")}`;
const BACKUP_FILE = path.join(
  __dirname,
  "..",
  "src",
  `tunes_${formattedDate}.json.js.backup`
);

const maxNbToProcess = 3;
const title = "Castle Kelly",
  doJig = false,
  doReel = true;
/**
 * Get the first ABC string from a tune entry
 * @param {string|string[]} abc - ABC notation (string or array)
 * @returns {string|null} - First ABC string or null
 */
function getFirstAbc(abc) {
  if (typeof abc === "string") {
    return abc;
  }
  if (Array.isArray(abc) && abc.length > 0) {
    return abc[0];
  }
  return null;
}

/**
 * Process tunes
 */
async function process() {
  try {
    console.log("Reading tunes.json.js...");

    // Read the file
    const fileContent = fs.readFileSync(TUNES_FILE, "utf8");

    // Create backup
    if (makeBackup) {
      fs.writeFileSync(BACKUP_FILE, fileContent, "utf8");
      console.log(`Backup created: ${BACKUP_FILE}`);
    }

    // Import the data
    const tunesModule = await import("../src/tunes.json.js");
    const tunesData = tunesModule.default;

    let processedCount = 0;
    let skippedCount = 0;

    // Process each tune
    for (let i = 0; i < tunesData.tunes.length; i++) {
      const tune = tunesData.tunes[i];

      // Skip if no abc property
      // , or if it's not in the cohort imported on 2025-10-25
      // , or if it has the comment "edited"
      if (
        !tune ||
        !tune.abc
        // || tune.abc.indexOf("N:Imported into *tuneTable* on 2025-10-25") < 0 ||
        // tune.abc.match(/N:[^\n]*edited/i)
      ) {
        skippedCount++;
        continue;
      }

      // Get the first ABC string
      const abcString = getFirstAbc(tune.abc);

      if (!abcString) {
        console.log(`  Tune ${i}: No valid ABC string found`);
        skippedCount++;
        continue;
      }
      // get metadata
      const rhythmMatch = abcString.match(/R:\s*(.+)/i),
        rhythm = rhythmMatch ? rhythmMatch[1] : null;
      const metadata = getMetadata(abcString),
        isReelLike = ["reel", "barndance", "hornpipe"].indexOf(rhythm) >= 0,
        isReel = rhythm?.indexOf("reel") > 0,
        isJig = abcString.match(/\n\s*R:\s*jig\s*\n/i);

      if (
        (title && metadata.title !== title) ||
        (doReel && (!abcString.match(/\n\s*M:\s*4\/4\s*\n/) || !isReelLike)) ||
        // abcString.match(/\[\d/) || //skip those with 1st & 2nd repeats / variant endings
        abcString.match(/\[M:/) || //inline meter marking
        abcString.match(/\[L:/) || //inline unit length marking
        !abcString.match(/\n\s*L:\s*1\/8\s*\n/)
      ) {
        // console.log(`skip: ${metadata.title}`);
        skippedCount++;
        continue;
      }
      if (
        (title && metadata.title !== title) ||
        (doJig && (!abcString.match(/\n\s*M:\s*6\/8\s*\n/) || !isJig)) ||
        // abcString.match(/\[\d/) || //skip those with 1st & 2nd repeats / variant endings
        abcString.match(/\[M:/) || //inline meter marking
        abcString.match(/\[L:/) || //inline unit length marking
        !abcString.match(/\n\s*L:\s*1\/8\s*\n/)
      ) {
        // console.log(`skip: ${metadata.title}`);
        skippedCount++;
        continue;
      }

      try {
        console.log(`process: ${metadata.title}`);
        if (isReelLike) {
          if (isReel) tune.abc = convertStandardReel(abcString);
          else tune.abc = convertStandardHornpipe(abcString);
        } else if (isJig) {
          tune.abc = convertStandardJig(abcString);
        }

        // tune.incipit = getIncipit(tune.abc);

        console.log(`  Tune ${i} - ${metadata.title}: processed`);
        processedCount++;
        if (processedCount >= maxNbToProcess) {
          break;
        }
      } catch (error) {
        console.error(
          `  Tune ${i} - ${metadata.title}: Error :`,
          error.message
        );
        skippedCount++;
      }
    }

    console.log(`\nProcessed: ${processedCount} tunes`);
    console.log(`Skipped: ${skippedCount} tunes`);

    if (processedCount === 0) {
      console.log("\n processedCount 0. File not modified.");
      return;
    }

    // Now update the file
    console.log("\nUpdating tunes.json.js...");

    const formatted = await formatJavascript(
      `export default ${javascriptify(tunesData)}`,
      {
        parser: "js"
      }
    );
    // Write the updated file
    fs.writeFileSync(TUNES_FILE, formatted, "utf8");
    console.log("tunes.json.js updated successfully!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the script
process();
