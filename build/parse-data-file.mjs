/**
 * Evaluate a `.data.js` file without going through the Node module cache.
 * Each file exports a single object literal, or an array of such objects; this
 * converts `export default` to a `return` statement and runs it with
 * `new Function`. Leading line comments (e.g. the fileName comment) are
 * harmless and left in place.
 *
 * Used for tunes, set lists, and the recordings / releases / artists /
 * instruments entities.
 *
 * @param {string} content - Raw file content.
 * @returns {object|object[]}
 */
export function parseDataFile(content) {
  const body = content.replace(/export\s+default\s*(?=[{[])/, "return ");

  return new Function(body)();
}
