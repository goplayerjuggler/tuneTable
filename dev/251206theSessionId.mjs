/**
 * Ad hoc script to clean up the tune data - remove the scores array and replace it with theSessionId & optionally theSessionSettingId, when it only contains a single link to thesession
 *
 */

import fs from "fs";
import path from "path";
import { format, resolveConfig } from "prettier";
import { fileURLToPath } from "url";
import abcTools from "@goplayerjuggler/abc-tools";
const { javascriptify } = abcTools;

/**
 *
 * @param {*} javascript - string of javascript to format
 * @returns
 */
async function formatJavascript(javascript) {
  const options = await resolveConfig(TUNES_FILE); // Resolves current config
  const formatted = format(javascript, {
    ...options,
    parser: "espree", // Default parser for JavaScript
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
const BACKUP_FILE = path.join(__dirname, "..", "src", "tunes.json.js.backup");
const maxNbToProcess = 999;

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
    const theSessionUrl = "https://thesession.org/tunes/";
    const r = new RegExp(
      String.raw`https://thesession.org/tunes/(\d+)(?:#setting)?(\d+)?`,
    );

    let processedCount = 0;
    let skippedCount = 0;

    // Process each tune
    for (let i = 0; i < tunesData.tunes.length; i++) {
      const tune = tunesData.tunes[i],
        theScore = tune.scores?.find(
          (s) => s.url && s.url.indexOf(theSessionUrl) >= 0,
        );

      // Skip those outside of scope
      if (!tune || !tune.scores || !theScore) {
        skippedCount++;
        continue;
      }
      const m = r.exec(theScore.url);
      if (!m || m.length < 2) {
        throw new Error(`error. url: ${theScore.url}`);
      }
      tune.theSessionId = m[1];
      if (m[2]) {
        if (tune.theSessionSettingId) {
          tune.todoInspectScores251206_1 = true;
        } else if (m[2] !== m[1]) tune.theSessionSettingId = m[2];
      }
      if (tune.scores.length === 1) {
        delete tune.scores;
      } else tune.todoInspectScores251206_2 = true;

      try {
        console.log(`  Tune ${i}: processed`);
        processedCount++;
        if (processedCount >= maxNbToProcess) {
          break;
        }
      } catch (error) {
        console.error(`  Tune ${i} -: Error :`, error.message);
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
