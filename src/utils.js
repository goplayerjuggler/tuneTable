/**
 * Adds line breaks to plain text to limit width, preserving words where possible.
 * @param {string} text - The input plain text.
 * @param {number} maxWidth - The maximum width of each line.
 * @param {number} minWidth - The minimum width before trying to break a word (not used unless a word is too long).
 * @param {string} newLinePrefix - The prefix to add at the start of each new line.
 * @returns {string} - The text with line breaks and optional prefixes.
 */
function addLineBreaks(text, maxWidth = 40, minWidth = 20, newLinePrefix = 'N:') {
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    // If the word is longer than maxWidth, forcibly break it
    while (word.length > maxWidth) {
      if (currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = '';
      }
      lines.push(word.slice(0, maxWidth));
      word = word.slice(maxWidth);
    }

    // If adding the word would exceed maxWidth
    if (
      currentLine.length &&
      currentLine.length + 1 + word.length > maxWidth
    ) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      // Add a space if not the first word in the line
      currentLine = currentLine.length ? currentLine + ' ' + word : word;
    }
  }
  if (currentLine.length > 0) lines.push(currentLine);

  // Add prefix
  return lines.map((l) => newLinePrefix + l).join('\n');
}
export {addLineBreaks}