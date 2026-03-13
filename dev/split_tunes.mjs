import fs from "fs";
import path from "path";

// Configuration
const INPUT_FILE = `.\\src\\tunes.json.js`;
const OUTPUT_DIR = `.\\src\\tunes`;
const ARRAY_END_LINE = 9418; // Line number of the closing ], or null to auto-detect
const doWrite = true;

// Helper to extract title from ABC notation
function extractTitle(abcString) {
  const lines = abcString.split("\n");
  for (const line of lines) {
    if (line.trim().startsWith("T:")) {
      return line.substring(2).trim();
    }
  }
  return null;
}

// Helper to get ABC string from item
function getAbc(item) {
  if (item.abc) {
    return Array.isArray(item.abc) ? item.abc[0] : item.abc;
  }
  if (item.incipit) {
    return item.incipit;
  }
  return null;
}

// Helper to get title from item
function getTuneTitle(item, index) {
  // Try ABC first
  const abc = getAbc(item);
  if (abc) {
    const title = extractTitle(abc);
    if (title) return title;
  }

  // Try name property
  if (item.name) {
    return item.name;
  }

  // Fallback to index
  return `untitled_${String(index).padStart(4, "0")}`;
}

// Helper to create safe filename (preserving spaces and accents)
function createFilename(title) {
  // Only remove characters that are truly problematic for filesystems
  return title
    .replace(/[<>:"|?*\/\\]/g, "_") // Windows/Unix forbidden chars
    .replace(/\s+/g, " ") // Normalise whitespace
    .trim()
    .substring(0, 55); // Reasonable length limit
}

// Read the original file
const content = fs.readFileSync(INPUT_FILE, "utf8");

// Find the array in the file
// Match: export default { tunes: [ ... ] } or const data = [ ... ]
let arrayStart, arrayEnd;

// Try to find 'tunes: [' pattern first (for export default { tunes: [...] })
const tunesMatch = content.match(/tunes:\s*\[/);
if (tunesMatch) {
  arrayStart = tunesMatch.index + tunesMatch[0].indexOf("[");

  // Use hard-coded line number if provided
  if (ARRAY_END_LINE !== null) {
    const lines = content.split("\n");
    let charCount = 0;
    for (let i = 0; i < ARRAY_END_LINE - 1; i++) {
      charCount += lines[i].length + 1; // +1 for newline
    }
    // Find the ] on that line
    const lineContent = lines[ARRAY_END_LINE - 1];
    const bracketPos = lineContent.indexOf("]");
    if (bracketPos === -1) {
      throw new Error(`No closing bracket found on line ${ARRAY_END_LINE}`);
    }
    arrayEnd = charCount + bracketPos;
  } else {
    // Auto-detect the matching closing bracket
    let braceCount = 0;
    for (let i = arrayStart; i < content.length; i++) {
      if (content[i] === "[") braceCount++;
      if (content[i] === "]") {
        braceCount--;
        if (braceCount === 0) {
          arrayEnd = i;
          break;
        }
      }
    }
  }
} else {
  // Fallback: try const/let/var pattern
  const arrayMatch = content.match(/(?:const|let|var)\s+\w+\s*=\s*\[/);
  if (!arrayMatch) {
    throw new Error("Could not find array in data structure");
  }
  arrayStart = arrayMatch.index + arrayMatch[0].indexOf("[");
  let braceCount = 0;
  for (let i = arrayStart; i < content.length; i++) {
    if (content[i] === "[") braceCount++;
    if (content[i] === "]") {
      braceCount--;
      if (braceCount === 0) {
        arrayEnd = i;
        break;
      }
    }
  }
}

if (!arrayEnd) {
  throw new Error("Could not find closing bracket for array");
}

// Find object boundaries by tracking brace depth
const arrayContent = content.substring(arrayStart + 1, arrayEnd);
const objects = [];
let braceDepth = 0;
let objStart = -1;
let inString = false;
let stringChar = null;
let escapeNext = false;

for (let i = 0; i < arrayContent.length; i++) {
  const char = arrayContent[i];

  // Handle string escapes
  if (escapeNext) {
    escapeNext = false;
    continue;
  }
  if (char === "\\") {
    escapeNext = true;
    continue;
  }

  // Track string state
  if ((char === '"' || char === "'" || char === "`") && !inString) {
    inString = true;
    stringChar = char;
    continue;
  }
  if (char === stringChar && inString) {
    inString = false;
    stringChar = null;
    continue;
  }

  // Only count braces outside strings
  if (!inString) {
    if (char === "{") {
      if (braceDepth === 0) {
        objStart = i;
      }
      braceDepth++;
    } else if (char === "}") {
      braceDepth--;
      if (braceDepth === 0 && objStart !== -1) {
        // Found complete object
        const objText = arrayContent.substring(objStart, i + 1);
        objects.push({
          text: objText,
          startPos: arrayStart + 1 + objStart,
          endPos: arrayStart + 1 + i + 1
        });
        objStart = -1;
      }
    }
  }
}

console.log(`Found ${objects.length} objects to split...`);

// Parse objects to get titles
const itemsWithTitles = objects.map((obj, index) => {
  try {
    const item = eval(`(${obj.text})`);
    const title = getTuneTitle(item, index);

    return {
      ...obj,
      title,
      index
    };
  } catch (e) {
    console.error(`Error parsing object ${index}:`, e.message);
    return {
      ...obj,
      title: `untitled_${String(index).padStart(4, "0")}`,
      index
    };
  }
});

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Write each object to its own file with original formatting
const fileMap = new Map(); // Track duplicate titles
itemsWithTitles.forEach((item, i) => {
  let filename = createFilename(item.title);

  // Handle duplicate filenames
  if (fileMap.has(filename)) {
    const count = fileMap.get(filename) + 1;
    fileMap.set(filename, count);
    filename = `${filename}_${count}`;
    console.log(`duplicate filename: ${filename}`);
  } else {
    fileMap.set(filename, 1);
  }

  filename = `${i} ${filename}.data.js`;

  // Write with original formatting preserved
  const fileContent = `export default ${item.text};`;

  const filepath = path.join(OUTPUT_DIR, filename);
  if (doWrite) fs.writeFileSync(filepath, fileContent, "utf8");

  if ((item.index + 1) % 10 === 0 || item.index === objects.length - 1) {
    console.log(`Progress: ${item.index + 1}/${objects.length}`);
  }
});

console.log(`\nComplete! Created ${objects.length} files in ${OUTPUT_DIR}/`);
console.log(`Run generate-index.mjs to create the index file.`);
