import fs from "fs";
import path from "path";
import { format, resolveConfig } from "prettier";
import { fileURLToPath } from "url";
import abcTools from "@goplayerjuggler/abc-tools";
const { javascriptify } = abcTools;

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const makeBackup = false;
const TUNES_FILE = path.join(__dirname, "..", "src", "tunes.json.js");
const BACKUP_FILE = path.join(__dirname, "tunes.json.js.backup");

// Function to format the file with Prettier using current settings
async function format2(s) {
  const options = await resolveConfig(TUNES_FILE); // Resolves current config
  const formatted = format(s, {
    ...options,
    parser: "espree", // Default parser for JavaScript
    //https://prettier.io/blog/2020/11/20/2.2.0
  });
  return formatted;
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

    tunesData.tunes.forEach((tune) => {
      if (tune.contour) delete tune.contour;
      // if (tune.contour?.svg) delete tune.contour.svg;
      if (tune.abc && tune.incipit) delete tune.incipit;
    });

    const formatted = await format2(
      `export default ${javascriptify(tunesData)}`,
      {
        parser: "js",
      },
    );
    // Write the updated file
    fs.writeFileSync(TUNES_FILE, formatted, "utf8");
    console.log("tunes.json.js updated successfully!");
  } catch (error) {
    console.error("Error:", error);
    // process.exit(1);
  }
}

// Run the script
process();
