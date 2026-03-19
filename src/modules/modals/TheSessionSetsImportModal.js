"use strict";
import Modal from "./Modal.js";

/**
 * Modal for importing sets from thesession.org into the TuneSelectionsModal.
 *
 * Usage:
 *   new TheSessionSetsImportModal({ onImport }).open();
 *
 * onImport(setLists) is called with an array of set-list objects (same shape as
 * TuneSelectionsModal uses) ready to be merged with existing set lists.
 */

/** Generate a simple unique ID (timestamp + random suffix). */
function generateId() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

/**
 * Parse a comma-separated string of set IDs into an array of trimmed numeric strings.
 * Returns an empty array for blank input.
 */
function parseSetIds(str) {
	return str
		.split(",")
		.map((s) => s.trim())
		.filter((s) => /^\d+$/.test(s));
}

/**
 * Fetch JSON from thesession.org, appending ?format=json.
 * Throws on HTTP error.
 */
async function fetchApi(url) {
	const sep = url.includes("?") ? "&" : "?";
	const res = await fetch(`${url}${sep}format=json`);
	if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
	return res.json();
}

/**
 * Fetch all pages of a member's sets, up to maxSets results.
 * thesession.org paginates at 10 items per page.
 */
async function fetchMemberSets(memberId, maxSets) {
	const sets = [];
	let page = 1;
	while (sets.length < maxSets) {
		const data = await fetchApi(
			`https://thesession.org/members/${memberId}/sets?page=${page}`
		);
		const items = data.sets ?? [];
		if (!items.length) break;
		sets.push(...items);
		const total = data.sets?.total ?? 0;
		if (sets.length >= total) break;
		if (items.length < 10) break; // last page
		page++;
	}
	return sets.slice(0, maxSets);
}

/**
 * Fetch a single set by ID.
 */
async function fetchSet(setId) {
	return fetchApi(`https://thesession.org/sets/${setId}`);
}

/**
 * Convert a thesession.org set object into our set-list shape.
 * Matches tunes against window.tunesData by theSessionId.
 * Returns { setList, skipped } where skipped is an array of tune names not found locally.
 */
function convertSet(tsSet) {
	// The API returns tunes under different keys depending on the endpoint
	const tunes = tsSet.settings;
	const entries = [];
	const skipped = [];

	for (const tsTune of tunes) {
		const tsId = tsTune.id;
		const name = tsTune.name;
		if (
			tsId != null &&
			window.tunesData?.some((t) => t.theSessionId === tsId)
		) {
			entries.push({ theSessionId: tsId });
		} else {
			skipped.push(name);
		}
	}

	const setList = {
		id: generateId(),
		name: tsSet.name ?? tsSet.title ?? `Imported set ${tsSet.id}`,
		dateCreated: new Date().toISOString(),
		dateModified: new Date().toISOString(),
		sets: [
			{
				name: "Set 1",
				comments: "",
				tunes: entries,
				collapsed: false
			}
		]
	};

	return { setList, skipped };
}

export default class TheSessionSetsImportModal extends Modal {
	/**
	 * @param {object} options
	 * @param {function} options.onImport  Called with array of set-list objects to merge
	 */
	constructor({ onImport }) {
		super({
			id: "ts-sets-import-modal",
			title: "📥 Import sets from thesession.org",
			size: "small"
		});
		this._onImport = onImport;
	}

	// ─── Lifecycle ───────────────────────────────────────────────────────────────

	open() {
		if (!this.element) {
			this._buildDOM();
			document.body.appendChild(this.element);
		}
		this._reset();
		super.open();
	}

	// ─── DOM construction ─────────────────────────────────────────────────────────

	_buildDOM() {
		super.render();
		const body = this.element.querySelector(".modal__body");
		body.innerHTML = "";
		body.appendChild(this._buildForm());
	}

	_buildForm() {
		const wrap = document.createElement("div");
		wrap.className = "tssi-wrap";

		// ── Member ID ──────────────────────────────────────────────────────────
		wrap.appendChild(
			this._row(
				"Member ID",
				"Your thesession.org member ID (optional if Set IDs are provided)"
			)
		);
		this._memberInput = document.createElement("input");
		this._memberInput.type = "number";
		this._memberInput.min = "1";
		this._memberInput.className = "tssi-input";
		this._memberInput.placeholder = "e.g. 12345";
		wrap.lastChild.appendChild(this._memberInput);

		// ── Set IDs ────────────────────────────────────────────────────────────
		wrap.appendChild(
			this._row(
				"Set IDs",
				"Comma-separated set IDs to import (optional if Member ID is provided)"
			)
		);
		this._setIdsInput = document.createElement("input");
		this._setIdsInput.type = "text";
		this._setIdsInput.className = "tssi-input";
		this._setIdsInput.placeholder = "e.g. 12345, 67890, 54321";
		wrap.lastChild.appendChild(this._setIdsInput);

		// ── Max sets ───────────────────────────────────────────────────────────
		wrap.appendChild(
			this._row(
				"Max sets",
				"Maximum number of sets to import when using Member ID (1–5)"
			)
		);
		this._maxInput = document.createElement("input");
		this._maxInput.type = "number";
		this._maxInput.min = "1";
		this._maxInput.max = "5";
		this._maxInput.value = "3";
		this._maxInput.className = "tssi-input tssi-input--small";
		wrap.lastChild.appendChild(this._maxInput);

		// ── Status / summary area ──────────────────────────────────────────────
		this._status = document.createElement("div");
		this._status.className = "tssi-status";
		this._status.hidden = true;
		wrap.appendChild(this._status);

		// ── Footer buttons ─────────────────────────────────────────────────────
		const footer = document.createElement("div");
		footer.className = "tssi-footer";

		const cancelBtn = document.createElement("button");
		cancelBtn.className = "btn";
		cancelBtn.textContent = "Cancel";
		cancelBtn.addEventListener("click", () => this.close());

		this._importBtn = document.createElement("button");
		this._importBtn.className = "btn btn-primary";
		this._importBtn.textContent = "Import";
		this._importBtn.addEventListener("click", () => this._doImport());

		footer.appendChild(cancelBtn);
		footer.appendChild(this._importBtn);
		wrap.appendChild(footer);

		return wrap;
	}

	/** Create a labelled field row div. */
	_row(label, hint) {
		const row = document.createElement("div");
		row.className = "tssi-row";
		const lbl = document.createElement("label");
		lbl.className = "tssi-label";
		lbl.textContent = label;
		if (hint) {
			const small = document.createElement("small");
			small.className = "tssi-hint";
			small.textContent = hint;
			lbl.appendChild(document.createElement("br"));
			lbl.appendChild(small);
		}
		row.appendChild(lbl);
		return row;
	}

	_reset() {
		this._memberInput.value = "";
		this._setIdsInput.value = "";
		this._maxInput.value = "3";
		this._setStatus("", false);
		this._importBtn.disabled = false;
		this._importBtn.textContent = "Import";
	}

	// ─── Status display ───────────────────────────────────────────────────────────

	_setStatus(html, isError = false) {
		if (!html) {
			this._status.hidden = true;
			return;
		}
		this._status.removeAttribute("hidden");
		this._status.innerHTML = html;
		this._status.className =
			"tssi-status " + (isError ? "tssi-status--error" : "tssi-status--ok");
	}

	// ─── Import logic ─────────────────────────────────────────────────────────────

	async _doImport() {
		const memberId = this._memberInput.value.trim();
		const setIdsRaw = this._setIdsInput.value.trim();
		const maxSets = Math.min(
			5,
			Math.max(1, parseInt(this._maxInput.value) || 3)
		);

		// Validation — one of member ID or set IDs required
		if (!memberId && !setIdsRaw) {
			this._setStatus(
				"Please provide a Member ID or at least one Set ID.",
				true
			);
			return;
		}

		this._importBtn.disabled = true;
		this._importBtn.textContent = "Importing…";
		this._setStatus("Fetching from thesession.org…");

		try {
			// ── Fetch raw set data ─────────────────────────────────────────────
			let rawSets = [];

			if (setIdsRaw) {
				// Explicit set IDs take priority over member ID
				const ids = parseSetIds(setIdsRaw);
				if (!ids.length) {
					this._setStatus(
						"No valid set IDs found. Use comma-separated numbers.",
						true
					);
					this._importBtn.disabled = false;
					this._importBtn.textContent = "Import";
					return;
				}
				rawSets = await Promise.all(ids.map(fetchSet));
			} else {
				rawSets = await fetchMemberSets(memberId, maxSets);
			}

			if (!rawSets.length) {
				this._setStatus("No sets found for the given ID(s).", true);
				this._importBtn.disabled = false;
				this._importBtn.textContent = "Import";
				return;
			}

			// ── Convert to set-list format ─────────────────────────────────────
			const importedSetLists = [];
			let totalTunes = 0;
			const allSkipped = [];

			for (const rawSet of rawSets) {
				const { setList, skipped } = convertSet(rawSet);
				if (setList.sets[0].tunes.length > 0) {
					importedSetLists.push(setList);
					totalTunes += setList.sets[0].tunes.length;
				}
				allSkipped.push(...skipped);
			}

			if (!importedSetLists.length) {
				this._setStatus(
					"None of the tunes in these sets were found in your local tune database. Nothing imported.",
					true
				);
				this._importBtn.disabled = false;
				this._importBtn.textContent = "Import";
				return;
			}

			// ── Hand off imported set lists to caller ──────────────────────────
			this._onImport(importedSetLists);

			// ── Show summary ───────────────────────────────────────────────────
			const s = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
			let summary =
				`&#10003; ${s(importedSetLists.length, "set")} imported ` +
				`(${s(totalTunes, "tune")} total).`;
			if (allSkipped.length) {
				summary +=
					`<br><span class="tssi-skipped">Tunes not found locally and skipped: ` +
					`${allSkipped.map((n) => `<em>${n}</em>`).join(", ")}.</span>`;
			}
			this._setStatus(summary, false);
			this._importBtn.disabled = false;
			this._importBtn.textContent = "Import more";
		} catch (err) {
			console.error("[TheSessionSetsImport]", err);
			this._setStatus(
				`Import failed: ${err.message}.<br>Check the IDs and try again.`,
				true
			);
			this._importBtn.disabled = false;
			this._importBtn.textContent = "Import";
		}
	}
}
