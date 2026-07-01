/**
 * Adds line breaks to plain text to limit width, preserving words where possible.
 * @param {string} text - The input plain text.
 * @param {number} maxWidth - The maximum width of each line.
 * @param {number} minWidth - The minimum width before trying to break a word (not used unless a word is too long).
 * @param {string} newLinePrefix - The prefix to add at the start of each new line.
 * @returns {string} - The text with line breaks and optional prefixes.
 */
function addLineBreaks(text, maxWidth = 40, newLinePrefix = "N:") {
	const words = text.split(/\s+/);
	const lines = [];
	let currentLine = "";

	for (let i = 0; i < words.length; i++) {
		let word = words[i];

		// If the word is longer than maxWidth, forcibly break it
		while (word.length > maxWidth) {
			if (currentLine.length > 0) {
				lines.push(currentLine);
				currentLine = "";
			}
			lines.push(word.slice(0, maxWidth));
			word = word.slice(maxWidth);
		}

		// If adding the word would exceed maxWidth
		if (currentLine.length && currentLine.length + 1 + word.length > maxWidth) {
			lines.push(currentLine);
			currentLine = word;
		} else {
			// Add a space if not the first word in the line
			currentLine = currentLine.length ? currentLine + " " + word : word;
		}
	}
	if (currentLine.length > 0) lines.push(currentLine);

	// Add prefix
	return lines.map((l) => newLinePrefix + l).join("\n");
}

const noCrossRefLink = (label) => `[${label}]`;
//label=>`[${label}] (cross-reference not on-screen)`;

// Replace:
// - line returns with <br />
// - [label](target) patterns in note text.
// Internal ID patterns (ttId=, theSessionId=) become anchor links to the target tune's row;
// all other patterns become external links.
function formatNoteLinks(text, setUpCrossRefLink = noCrossRefLink) {
	return text
		.replace(/\n/g, "<br />")
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, target) => {
			if (/^(?:ttId|theSessionId)=/.test(target)) {
				return setUpCrossRefLink(label, target);
			}
			return `<a href="${target}" target="_blank" rel="noopener noreferrer">${label}</a>`;
		});
}

const formatReference = (ref, acc, setUpCrossRefLink = noCrossRefLink) => {
	let notesHtml = "";

	if (ref.notes || ref.album) {
		const rawText =
			(ref.album ? `album: ${ref.album}\n` : "") + (ref.notes ?? "");
		const formattedNotes = formatNoteLinks(rawText, setUpCrossRefLink)
			.replace(/(?<!")https?:\/\/[^\s<>"']+/g, (url) => {
				try {
					const { hostname, pathname, search } = new URL(url);
					if (
						!acc.hasTheSessionLink &&
						hostname === "thesession.org" &&
						pathname &&
						pathname.match(/\/tunes\/\d+/)
					)
						acc.hasTheSessionLink = true;
					const display = hostname + pathname + search;
					return `<a href="${url}" target="_blank" rel="noopener noreferrer">${display}</a>`;
				} catch {
					// In case URL parsing fails, leave the original
					return url;
				}
			})
			.replace(/```([^`]+)```/g, "<pre>$1</pre>");

		const lines = rawText.split("\n");
		if (lines.length > 12) {
			const truncatedNotes = formatNoteLinks(
				lines.slice(0, 5).join("\n"),
				setUpCrossRefLink
			);
			notesHtml = `
					<div class="notes notes-truncated"">
					  ${truncatedNotes}
					  <br /><button class="more-btn" onclick="expandNotes(this)">More…</button>
					</div>
					<div class="notes notes-full" style="display: none;">
					  ${formattedNotes}
					  <br /><button class="more-btn" onclick="collapseNotes(this)">Less</button>
					</div>`;
		} else {
			notesHtml = `<div class="notes">${formattedNotes}</div>`;
		}
	}
	const domain = ref.url
		? ref.url.match(/^(?:https?:\/\/)?(?:www\.)?([^/]+)/)[1]
		: "";
	const refHeader =
		ref.artists && ref.url
			? `<div class="url">${ref.artists} <a href="${ref.url}" target="_blank" rel="noopener noreferrer">${domain}</a></div>`
			: ref.artists
				? `<div class="artists">${ref.artists}</div>`
				: ref.url
					? `<div class="url"><a href="${ref.url}" target="_blank" rel="noopener noreferrer">${domain}</a></div>` //extract the domain for display so as not to waste space on the full url
					: "";
	const refItemId = ref._crId ? ` id="cr-r${ref._crId}"` : "";
	acc.referencesHtml += `
					<div class="reference-item"${refItemId}>
						${refHeader}
						${notesHtml}
					</div>`;
};

export { addLineBreaks, formatNoteLinks, formatReference };
