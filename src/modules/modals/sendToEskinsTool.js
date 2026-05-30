"use strict";

/**
 * sendToEskinsTool.js
 *
 * Compresses an array of ABC strings and opens Michael Eskin's ABC Transcription
 * Tools (https://michaeleskin.com/abctools/abctools.html) in a new tab with the
 * content preloaded.
 *
 * Public API:
 *   sendToEskinsTool(abcStrings, options?)
 *
 * @param {string[]} abcStrings - Pre-resolved ABC strings (one per tune, in order)
 * @param {object}  [options]
 * @param {string}  [options.shareName] - Default share/tab name (e.g. set list name)
 */

import pako from "pako";

const ABC_TOOLS_URL = "https://michaeleskin.com/abctools/abctools.html";
const SHARE_LINK_MAX = 8100;

// Headers removed by default (user may override via prompt)
const DEFAULT_REMOVE_HEADERS = ["N", "S", "D", "H"];

// ─── Header filtering ────────────────────────────────────────────────────────

/**
 * Strip specified ABC header lines from a single ABC string.
 * @param {string}   abc
 * @param {string[]} headers - Single-letter header codes, e.g. ["N","S","D","H"]
 * @returns {string}
 */
function stripHeaders(abc, headers) {
	if (!headers.length) return abc;
	const prefixes = new Set(headers.map((h) => `${h.toUpperCase()}:`));
	return abc
		.split("\n")
		.filter((line) => !prefixes.has(line.slice(0, 2)))
		.join("\n");
}

/**
 * Prompt the user for which headers to remove.
 * Returns null if the user cancelled (→ remove nothing),
 * otherwise returns an array of single-letter header codes.
 */
function promptForHeadersToRemove() {
	const defaults = DEFAULT_REMOVE_HEADERS.join("");
	const msg =
		"Headers to strip from the ABC before sending.\n\n" +
		'Enter a string of single-letter codes (e.g. "NSDH"), ' +
		"or leave blank to accept the defaults (" +
		defaults +
		").\n" +
		"Press Cancel to send the ABC unmodified.";

	const result = prompt(msg, defaults);
	if (result === null) return []; // cancelled → no stripping
	if (result.trim() === "") return DEFAULT_REMOVE_HEADERS; // blank → defaults

	// Each character in the input is treated as one header code
	return [...result.trim().toUpperCase()];
}

// ─── Compression ─────────────────────────────────────────────────────────────

function bytesToBase64URL(bytes) {
	let binary = "";
	for (let i = 0; i < bytes.length; i++)
		binary += String.fromCharCode(bytes[i]);
	return btoa(binary)
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

function compressDeflate(text) {
	const utf8Bytes = new TextEncoder().encode(text);
	const deflated = pako.deflate(utf8Bytes, { level: 6 });
	return bytesToBase64URL(deflated);
}

// ─── URL builder ─────────────────────────────────────────────────────────────

/**
 * Build the share URL, or return null if the result would exceed SHARE_LINK_MAX.
 * @param {string} abcPayload - The full (possibly filtered) ABC text
 * @param {string} shareName
 * @returns {string|null}
 */
function buildShareUrl(abcPayload, shareName) {
	const params = new URLSearchParams({
		def: compressDeflate(abcPayload),
		ssp: "10",
		name: shareName
	});
	const url = `${ABC_TOOLS_URL}?${params.toString()}`;
	return url.length > SHARE_LINK_MAX ? null : url;
}

// ─── Public entry point ──────────────────────────────────────────────────────

/**
 * Filter, confirm, compress and open the tunes in Eskin's ABC Transcription Tools.
 *
 * @param {string[]} abcStrings - Pre-resolved ABC strings, in playback order
 * @param {object}  [options]
 * @param {string}  [options.shareName="Share_Link"]
 */
export function sendToEskinsTool(abcStrings, options = {}) {
	if (!abcStrings?.length) {
		alert("No ABC content to send.");
		return;
	}

	// 1) Ask which headers to strip (null → cancelled → keep all)
	const headers = promptForHeadersToRemove();

	// 2) Filter and join
	const payload = abcStrings
		.map((abc) => stripHeaders(abc, headers))
		.join("\n\n");

	// 3) Let the user confirm / edit the share name
	const defaultName = options.shareName ?? "Share_Link";
	const shareName = prompt("Name for this share link:", defaultName);
	if (shareName === null) return; // user cancelled the name prompt

	// 4) Build URL and open
	const url = buildShareUrl(payload, shareName.trim() || defaultName);
	if (!url) {
		alert(
			"The ABC content is too large to encode in a URL " +
				`(limit: ${SHARE_LINK_MAX} characters).\n\n` +
				"Try reducing the number of tunes."
		);
		return;
	}

	window.open(url, "_blank", "noopener,noreferrer");
}
