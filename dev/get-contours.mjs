import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import abcTools from "@goplayerjuggler/abc-tools";
const {
  contourToSvg,
  getContour,
  getIncipitForContourGeneration,
  javascriptify,
} = abcTools;

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

      //tmp 251025
      // delete tune.contour;

      // Skip if no abc property
      if (!tune || !tune.abc) {
        skippedCount++;
        continue;
      }

      // skip if  already has contour
      if (tune.contour && tune.contour.svg && false) {
        console.log(`  Tune ${i}: Already has contour & contour svg, skipping`);
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

      try {
        if (
          !tune.contour ||
          //true //!! force complete rerun
        ) {
          const incipit = getIncipitForContourGeneration(abcString);
          // Generate contour
          //const contour = getContour(incipit);
          tune.contour = getContour(incipit);
          console.log(`  Tune ${i}: Generated contour`);
        }
        tune.contour.svg = contourToSvg(tune.contour);

        console.log(`  Tune ${i}: Generated contour svg`);
        processedCount++;
      } catch (error) {
        console.error(`  Tune ${i}: Error generating contour:`, error.message);
        skippedCount++;
      }
    }

    console.log(`\nProcessed: ${processedCount} tunes`);
    console.log(`Skipped: ${skippedCount} tunes`);

    if (processedCount === 0) {
      console.log("\nNo contours generated. File not modified.");
      return;
    }

    // Now update the file by inserting contours
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
