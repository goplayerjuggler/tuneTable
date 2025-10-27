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
const makeBackup = false;
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
