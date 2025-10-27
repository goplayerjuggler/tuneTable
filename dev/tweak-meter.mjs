import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import abcTools from "@goplayerjuggler/abc-tools";
const { getIncipit, toggleMeter_4_4_to_4_2, javascriptify } = abcTools;

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const makeBackup = true;
const TUNES_FILE = path.join(__dirname, "..", "src", "tunes.json.js");
const BACKUP_FILE = path.join(__dirname, "tunes.json.js.backup");

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
      console.log("Backup created: tunes.json.js.backup");
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
      // , or if it's not in the cohort imported yesterday
      if (
        !tune ||
        !tune.abc ||
        tune.abc.indexOf("N:Imported into *tuneTable* on 2025-10-25") < 0
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

      //barndances in 4/4 => 4/2
      if (
        !abcString.match(/\n\s*M:\s*4\/4\s*\n/) ||
        !abcString.match(/\n\s*R:\s*reel\s*\n/i) ||
        abcString.match(/\[\d/) || //skip those with 1st & 2nd repeats / variant endings
        abcString.match(/\[M:/) || //inline meter marking
        !abcString.match(/\n\s*L:\s*1\/8\s*\n/)
      ) {
        skippedCount++;
        continue;
      }

      try {
        // 251026 - know that for yesterday's cohort, there's only one abc
        tune.abc = toggleMeter_4_4_to_4_2(abcString)
          .replace("M:4/2", "M:4/4")
          .replace("L:1/8", "L:1/16");

        tune.incipit = getIncipit(tune.abc);

        console.log(`  Tune ${i}: processed`);
        processedCount++;
      } catch (error) {
        console.error(`  Tune ${i}: Error :`, error.message);
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

    // Write the updated file
    fs.writeFileSync(
      TUNES_FILE,
      `export default ${javascriptify(tunesData)}`,
      "utf8"
    );
    console.log("tunes.json.js updated successfully!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the script
process();
