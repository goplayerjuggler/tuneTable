/**
 * Incipit Generator for ABC Tunes
 *
 * This script processes tunes.json.js to generate incipits for entries that:
 * - Have an 'abc' property (string or array)
 * - Do NOT have an 'incipit' property
 *
 * USAGE IN VS CODE:
 * 1. Open terminal in VS Code (Terminal > New Terminal)
 * 2. Run: node incipit_generator.mjs
 * 3. The script will update tunes.json.js in place
 *
 * REQUIREMENTS:
 * - incipits.js must be in the same directory
 * - tunes.json.js must be in the same directory
 * - Node.js must be installed
 * - package.json must have "type": "module"
 *
 * BACKUP RECOMMENDATION:
 * The script creates a backup (tunes.json.js.backup) before making changes
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateIncipit } from "@goplayerjuggler/abc-tools";

// Get current directory in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const makeBackup = false;
const TUNES_FILE = path.join(__dirname, "tunes.json.js");
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
 * Format a string as a template literal for JS file output
 * @param {string} str - String to format
 * @returns {string} - Formatted as `...`
 */
function formatAsTemplateLiteral(str) {
  // Escape backticks and ${} in the string
  const escaped = str.replace(/`/g, "\\`").replace(/\$/g, "\\$");
  return `\`${escaped}\``;
}

/**
 * Process tunes and generate incipits
 */
async function processIncipits() {
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

    // Build a map of which tunes need incipits and what they are
    const incipitsToAdd = new Map();

    // Process each tune
    for (let i = 0; i < tunesData.tunes.length; i++) {
      const tune = tunesData.tunes[i];

      // Skip if no abc property or already has incipit
      if (!tune.abc) {
        skippedCount++;
        continue;
      }

      if (tune.incipit) {
        console.log(`  Tune ${i}: Already has incipit, skipping`);
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
        // Generate incipit
        const incipit = generateIncipit(abcString);
        incipitsToAdd.set(i, incipit);
        console.log(`  Tune ${i}: Generated incipit`);
        processedCount++;
      } catch (error) {
        console.error(`  Tune ${i}: Error generating incipit:`, error.message);
        skippedCount++;
      }
    }

    console.log(`\nProcessed: ${processedCount} tunes`);
    console.log(`Skipped: ${skippedCount} tunes`);

    if (processedCount === 0) {
      console.log("\nNo incipits generated. File not modified.");
      return;
    }

    // Now update the file by inserting incipits
    console.log("\nUpdating tunes.json.js...");

    let updatedContent = fileContent;
    let currentTuneIndex = 0;

    // Find the tunes array
    const tunesArrayMatch = updatedContent.match(/tunes:\s*\[/);
    if (!tunesArrayMatch) {
      throw new Error("Could not find tunes array in file");
    }

    // Process each object in the tunes array
    // Match objects with proper brace counting
    let inTunesArray = false;
    let braceDepth = 0;
    let currentObjectStart = -1;
    let result = "";
    let i = 0;

    while (i < updatedContent.length) {
      const char = updatedContent[i];

      // Check if we're entering the tunes array
      if (!inTunesArray && updatedContent.substring(i).match(/^tunes:\s*\[/)) {
        const match = updatedContent.substring(i).match(/^tunes:\s*\[/)[0];
        result += match;
        i += match.length;
        inTunesArray = true;
        continue;
      }

      if (inTunesArray) {
        // Track when we find an object
        if (char === "{" && braceDepth === 0) {
          currentObjectStart = i;
          braceDepth = 1;
          result += char;
          i++;
          continue;
        } else if (char === "{") {
          braceDepth++;
        } else if (char === "}") {
          braceDepth--;

          if (braceDepth === 0 && currentObjectStart !== -1) {
            // We've found the end of a tune object
            const tuneContent = updatedContent.substring(
              currentObjectStart + 1,
              i
            );

            // Check if this tune needs an incipit
            if (incipitsToAdd.has(currentTuneIndex)) {
              const incipit = incipitsToAdd.get(currentTuneIndex);
              const incipitString = formatAsTemplateLiteral(incipit);

              // Add the incipit property before the closing brace
              // Check if we need a comma
              const needsComma =
                tuneContent.trim().length > 0 &&
                !tuneContent.trim().endsWith(",");
              result += (needsComma ? "," : "") + " incipit: " + incipitString;
            }

            currentTuneIndex++;
            currentObjectStart = -1;
          }
        } else if (char === "]" && braceDepth === 0) {
          // End of tunes array
          inTunesArray = false;
        }
      }

      result += char;
      i++;
    }

    // Write the updated file
    fs.writeFileSync(TUNES_FILE, result, "utf8");
    console.log("tunes.json.js updated successfully!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

// Run the script
processIncipits();
