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
import { Modal } from "@daypilot/modal";

const ABC_TOOLS_URL = "https://michaeleskin.com/abctools/abctools.html";
const SHARE_LINK_MAX = 8100;

// Headers removed by default (user may override via the modal)
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
 * Show a single modal to collect options, then compress and dispatch the tunes
 * to Eskin's ABC Transcription Tools (open in tab or copy link to clipboard).
 *
 * @param {string[]} abcStrings - Pre-resolved ABC strings, in playback order
 * @param {object}  [options]
 * @param {string}  [options.shareName="Share_Link"]
 */
export async function sendToEskinsTool(abcStrings, options = {}) {
	if (!abcStrings?.length) {
		await Modal.alert("No ABC content to send.");
		return;
	}

	const defaultName = options.shareName ?? "Share_Link";
	const defaultHeaders = DEFAULT_REMOVE_HEADERS.join("");

	const form = [
		{
			name: "Share link name",
			id: "shareName",
			type: "text"
		},
		{
			html: "<small>Enter header codes to strip (e.g. <code>NSDH</code>), or leave blank to keep all.</small>",
			name: ""
		},
		{
			name: "Headers to strip",
			id: "stripHeaders",
			type: "text"
		},
		{
			name: "Action",
			id: "action",
			type: "radio",
			options: [
				{ name: "Copy link to clipboard", id: "copy" },
				{ name: "Open in new tab", id: "open" }
			]
		}
	];

	const data = {
		shareName: defaultName,
		stripHeaders: defaultHeaders,
		action: "copy"
	};

	const modal = await Modal.form(form, data);
	if (modal.canceled) return;

	const { shareName, stripHeaders: headerInput, action } = modal.result;

	// Parse header codes: each character is one code; blank string → no stripping
	const headers = headerInput.trim()
		? [...headerInput.trim().toUpperCase()]
		: [];

	// Filter and join
	const payload = abcStrings
		.map((abc) => stripHeaders(abc, headers))
		.join("\n\n");

	// Build URL
	const url = buildShareUrl(payload, shareName.trim() || defaultName);
	if (!url) {
		await Modal.alert(
			`The ABC content is too large to encode in a URL ` +
				`(limit: ${SHARE_LINK_MAX} characters).\n\nTry reducing the number of tunes.`
		);
		return;
	}

	// Dispatch
	if (action === "open") {
		window.open(url, "_blank", "noopener,noreferrer");
	} else {
		try {
			await navigator.clipboard.writeText(url);
		} catch {
			await Modal.alert("Copy failed.");
		}
	}
}
