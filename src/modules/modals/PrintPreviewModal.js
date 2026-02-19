"use strict";
import AbcJs from "abcjs";
import Modal from "./Modal.js";

/**
 * Derive a short rhythm-summary string for a set, e.g. "jig + reel".
 * Uses the tunes' rhythm fields; deduplicates while preserving order.
 * @param {object[]} tunes  - resolved tune objects (may be undefined for unknown tunes)
 * @returns {string}
 */
function rhythmSummary(tunes) {
	const seen = new Set();
	const parts = [];
	for (const t of tunes) {
		if (!t?.rhythm) continue;
		const r = t.rhythm.toLowerCase();
		if (!seen.has(r)) {
			seen.add(r);
			parts.push(t.rhythm);
		}
	}
	return parts.join(" + ");
}

/**
 * Resolve a tune object from a set-list entry against window.tunesData.
 * (Mirrors findTuneByEntry in TuneSelectionsModal; duplicated to keep this
 * module self-contained.)
 */
function findTune(entry) {
	return window.tunesData?.find((t) => {
		if (entry.theSessionId) return t.theSessionId === entry.theSessionId;
		if (entry.norbeckId)
			return (
				t.norbeckId === entry.norbeckId &&
				(t.norbeckR === entry.norbeckR || t.rhythm === entry.norbeckR)
			);
		if (entry.itiId) return t.itiId === entry.itiId;
		if (entry.fwId) return t.fwId === entry.fwId;
		if (entry.ttId) return t.ttId === entry.ttId;
		return false;
	});
}

/**
 * Modal for print preview of a set list.
 * Opened from TuneSelectionsModal via a Preview button.
 * Renders a configurable, printable view with a live options panel.
 * The base Modal.close() destroys the DOM — that is intentional here,
 * as each open() creates a fresh preview from the current set list state.
 */
export default class PrintPreviewModal extends Modal {
	/**
	 * @param {object} setList - the set list to preview (deep-copied internally)
	 */
	constructor(setList) {
		super({
			id: "print-preview-modal",
			title: "🖨️ Print preview",
			size: "large"
		});
		// Deep-copy so changes to the live set list don't affect the preview
		this._setList = JSON.parse(JSON.stringify(setList));

		// Display options
		this._opts = {
			showIncipit: true,
			showContour: true,
			showBadges: true,
			showNotes: true,
			showRhythm: true,
			showNumbers: true,
			showSetNames: true,
			showPageNums: true,
			showDate: false,
			columns: 1,
			incipitScale: 0.65
		};

		// Per-set include flags (all true by default)
		this._includedSets = this._setList.sets.map(() => true);
	}

	// ─── Lifecycle ───────────────────────────────────────────────────────────────

	open() {
		if (this._opening) return;
		this._opening = true;
		this.render();
		document.body.appendChild(this.element);
		this._buildOptionsPanel();
		this._initialRenderDone = false;
		super.open();
		requestAnimationFrame(() => {
			requestAnimationFrame(() => {
				this._renderPreview();
				this._initialRenderDone = true;
				this._opening = false;
			});
		});
	}

	// ─── DOM skeleton ────────────────────────────────────────────────────────────

	render() {
		super.render();

		const body = this.element.querySelector(".modal__body");
		body.classList.add("pp-body");
		body.innerHTML = `
			<div class="pp-options"></div>
			<div class="pp-preview-wrap">
				<div class="pp-preview-label">Preview · A4</div>
				<div class="pp-preview-scroll">
					<div class="pp-paper" id="pp-paper"></div>
				</div>
			</div>`;

		// Append footer inside .modal__container (after __body)
		const container = this.element.querySelector(".modal__container");
		const footer = document.createElement("div");
		footer.className = "modal__footer pp-footer";
		footer.innerHTML = `
			<button class="btn pp-back-btn">← Back</button>
			<button class="btn pp-copy-btn">📋 Copy as text</button>
			<button class="btn btn-primary pp-print-btn">🖨️ Print / Save as PDF</button>`;
		container.appendChild(footer);

		footer
			.querySelector(".pp-back-btn")
			.addEventListener("click", () => this.close());
		footer
			.querySelector(".pp-copy-btn")
			.addEventListener("click", () => this._copyAsText());
		footer
			.querySelector(".pp-print-btn")
			.addEventListener("click", () => this._print());

		return this.element;
	}

	// ─── Options panel ───────────────────────────────────────────────────────────

	_buildOptionsPanel() {
		const panel = this.element.querySelector(".pp-options");

		/** Create a labelled checkbox row bound to this._opts[key]. */
		const optRow = (label, sublabel, key) => {
			const wrap = document.createElement("label");
			wrap.className = "pp-opt-row";
			const cb = document.createElement("input");
			cb.type = "checkbox";
			cb.checked = !!this._opts[key];
			cb.addEventListener("change", () => {
				this._opts[key] = cb.checked;
				if (this._initialRenderDone) this._renderPreview();
			});
			const txt = document.createElement("span");
			txt.className = "pp-opt-label";
			txt.textContent = label;
			if (sublabel) {
				const small = document.createElement("small");
				small.textContent = sublabel;
				txt.appendChild(small);
			}
			wrap.appendChild(cb);
			wrap.appendChild(txt);
			return wrap;
		};

		/** Thin horizontal rule between sections. */
		const divider = () => {
			const hr = document.createElement("hr");
			hr.className = "pp-divider";
			return hr;
		};

		/** Section with a small-caps heading. */
		const section = (title) => {
			const sec = document.createElement("div");
			sec.className = "pp-section";
			const h = document.createElement("div");
			h.className = "pp-section-title";
			h.textContent = title;
			sec.appendChild(h);
			return sec;
		};

		// ── Layout ──────────────────────────────────────────────────────────────
		const secLayout = section("Layout");
		const layoutSel = document.createElement("div");
		layoutSel.className = "pp-layout-sel";
		["1 column", "2 columns"].forEach((label, i) => {
			const btn = document.createElement("button");
			btn.className =
				"pp-layout-btn" + (this._opts.columns === i + 1 ? " active" : "");
			btn.textContent = label;
			btn.addEventListener("click", () => {
				this._opts.columns = i + 1;
				layoutSel
					.querySelectorAll(".pp-layout-btn")
					.forEach((b, j) => b.classList.toggle("active", j === i));
				if (this._initialRenderDone) this._renderPreview();
			});
			layoutSel.appendChild(btn);
		});
		secLayout.appendChild(layoutSel);

		// ── Content ─────────────────────────────────────────────────────────────
		const secContent = section("Show in output");
		[
			["Notation (incipit)", "", "showIncipit"],
			["Melodic contour", "", "showContour"],
			["Badges", "key, rhythm, parts…", "showBadges"],
			["Tune notes", "", "showNotes"],
			["Set rhythm summary", "", "showRhythm"],
			["Tune numbers", "", "showNumbers"],
			["Set names", "Set 1, Set 2…", "showSetNames"]
		].forEach(([lbl, sub, key]) =>
			secContent.appendChild(optRow(lbl, sub, key))
		);

		// Notation size slider
		const scaleWrap = document.createElement("div");
		scaleWrap.className = "pp-scale-wrap";
		const scaleLabel = document.createElement("div");
		scaleLabel.className = "pp-scale-label";
		scaleLabel.textContent = "Notation size";
		const slider = document.createElement("input");
		slider.type = "range";
		slider.min = "0.45";
		slider.max = "0.9";
		slider.step = "0.05";
		slider.value = String(this._opts.incipitScale);
		slider.addEventListener("input", () => {
			this._opts.incipitScale = parseFloat(slider.value);
			if (this._initialRenderDone) this._applyIncipitZoom();
		});
		const scaleHints = document.createElement("div");
		scaleHints.className = "pp-scale-hints";
		scaleHints.innerHTML = "<span>Compact</span><span>Large</span>";
		scaleWrap.appendChild(scaleLabel);
		scaleWrap.appendChild(slider);
		scaleWrap.appendChild(scaleHints);
		secContent.appendChild(scaleWrap);

		// ── Page ────────────────────────────────────────────────────────────────
		const secPage = section("Page");
		secPage.appendChild(optRow("Page numbers", "", "showPageNums"));
		secPage.appendChild(optRow("Date in header", "", "showDate"));

		// ── Sets to include ──────────────────────────────────────────────────────
		const secSets = section("Sets to include");
		this._setList.sets.forEach((set, i) => {
			const resolvedTunes = set.tunes.map(findTune);
			const summary = rhythmSummary(resolvedTunes);
			const wrap = document.createElement("label");
			wrap.className = "pp-opt-row";
			const cb = document.createElement("input");
			cb.type = "checkbox";
			cb.checked = this._includedSets[i];
			cb.addEventListener("change", () => {
				this._includedSets[i] = cb.checked;
				if (this._initialRenderDone) this._renderPreview();
			});
			const txt = document.createElement("span");
			txt.className = "pp-opt-label";
			txt.textContent = set.name || `Set ${i + 1}`;
			if (summary) {
				const small = document.createElement("small");
				small.textContent = summary;
				txt.appendChild(small);
			}
			wrap.appendChild(cb);
			wrap.appendChild(txt);
			secSets.appendChild(wrap);
		});

		panel.appendChild(secLayout);
		panel.appendChild(divider());
		panel.appendChild(secContent);
		panel.appendChild(divider());
		panel.appendChild(secPage);
		panel.appendChild(divider());
		panel.appendChild(secSets);
	}

	// ─── Preview rendering ───────────────────────────────────────────────────────

	_renderPreview() {
		const paper = this.element.querySelector("#pp-paper");
		if (!paper) return;
		paper.innerHTML = "";
		paper.style.columns = this._opts.columns === 2 ? "2" : "";
		paper.style.columnGap = this._opts.columns === 2 ? "28px" : "";

		// Title block — always spans full width in two-column mode
		const titleBlock = document.createElement("div");
		titleBlock.className = "pp-title-block";
		if (this._opts.columns === 2) titleBlock.style.columnSpan = "all";

		const titleEl = document.createElement("div");
		titleEl.className = "pp-sl-title";
		titleEl.textContent = this._setList.name || "Set list";
		titleBlock.appendChild(titleEl);

		if (this._opts.showDate) {
			const dateEl = document.createElement("div");
			dateEl.className = "pp-sl-date";
			dateEl.textContent = new Date().toLocaleDateString("en-GB", {
				day: "numeric",
				month: "long",
				year: "numeric"
			});
			titleBlock.appendChild(dateEl);
		}
		paper.appendChild(titleBlock);

		// Sets
		let globalPos = 0;
		this._setList.sets.forEach((set, setIdx) => {
			if (!this._includedSets[setIdx]) {
				globalPos += set.tunes.length; // keep numbering consistent
				return;
			}
			const resolvedTunes = set.tunes.map(findTune);

			// Set divider
			if (this._opts.showSetNames || this._opts.showRhythm) {
				const divider = document.createElement("div");
				divider.className = "pp-set-divider";
				if (this._opts.showSetNames) {
					const r1 = document.createElement("div");
					r1.className = "pp-rule";
					const lbl = document.createElement("span");
					lbl.className = "pp-set-label";
					lbl.textContent = set.name || `Set ${setIdx + 1}`;
					const r2 = document.createElement("div");
					r2.className = "pp-rule";
					divider.appendChild(r1);
					divider.appendChild(lbl);
					divider.appendChild(r2);
				} else {
					const r = document.createElement("div");
					r.className = "pp-rule pp-rule--full";
					divider.appendChild(r);
				}
				paper.appendChild(divider);
			}

			if (this._opts.showRhythm) {
				const summary = rhythmSummary(resolvedTunes);
				if (summary) {
					const el = document.createElement("div");
					el.className = "pp-set-rhythm";
					el.textContent = summary;
					paper.appendChild(el);
				}
			}

			// Tune entries
			set.tunes.forEach((entry, tuneIdx) => {
				globalPos++;
				paper.appendChild(
					this._buildTuneEntry(resolvedTunes[tuneIdx], entry, globalPos)
				);
			});
		});

		// Page numbers are rendered by the browser via @page CSS counter rules —
		// no static DOM element needed (a hardcoded "1" also caused a spurious
		// second page in the on-screen preview by pushing the paper height over
		// the page threshold).

		// AbcJs rendering happens after layout

		if (this._opts.showIncipit) this._renderIncipits();
	}

	/** Build one tune entry row for the paper. */
	_buildTuneEntry(tune, entry, position) {
		const el = document.createElement("div");
		el.className = "pp-tune";

		if (this._opts.showNumbers) {
			const num = document.createElement("div");
			num.className = "pp-tune-num";
			num.textContent = position;
			el.appendChild(num);
		}

		const content = document.createElement("div");
		content.className = "pp-tune-content";

		// Name + badges
		const titleRow = document.createElement("div");
		titleRow.className = "pp-tune-title-row";
		const nameEl = document.createElement("span");
		nameEl.className = "pp-tune-name";
		nameEl.textContent = tune
			? tune.name
			: `(unknown: ${JSON.stringify(entry)})`;
		titleRow.appendChild(nameEl);

		if (this._opts.showBadges && tune) {
			const badges = document.createElement("span");
			badges.className = "pp-tune-badges";
			[tune.rhythm, tune.key, tune.parts].filter(Boolean).forEach((text) => {
				const b = document.createElement("span");
				b.className = "pp-badge";
				b.textContent = text;
				badges.appendChild(b);
			});
			titleRow.appendChild(badges);
		}
		content.appendChild(titleRow);

		// Incipit (rendered by _renderIncipits after DOM insertion)
		if (this._opts.showIncipit && tune?.incipit) {
			const incipitEl = document.createElement("div");
			incipitEl.id = `pp-incipit-${position}`;
			incipitEl.className = "pp-incipit";
			incipitEl.dataset.abc = tune.incipit;
			content.appendChild(incipitEl);
		}

		// Contour SVG
		if (this._opts.showContour && tune?.contour?.svg) {
			const contourEl = document.createElement("div");
			contourEl.className = "pp-contour";
			contourEl.innerHTML = tune.contour.svg;
			content.appendChild(contourEl);
		}

		// Notes
		if (this._opts.showNotes && entry.notes?.trim()) {
			const notesEl = document.createElement("div");
			notesEl.className = "pp-tune-notes";
			notesEl.textContent = entry.notes;
			content.appendChild(notesEl);
		}

		el.appendChild(content);
		return el;
	}

	/**
	 * Render all incipit placeholders at scale=1 (fixed, called once per preview build).
	 * Visual scaling is handled entirely via CSS zoom on .pp-incipit — see _applyIncipitZoom().
	 */
	_renderIncipits() {
		this.element.querySelectorAll(".pp-incipit[data-abc]").forEach((el) => {
			AbcJs.renderAbc(el.id, el.dataset.abc, {
				scale: 1.0,
				staffwidth: this._opts.columns === 2 ? 240 : 500,
				paddingtop: 2,
				paddingbottom: 2,
				paddingright: 2,
				paddingleft: 2
			});
		});
		// Apply current zoom immediately after rendering
		this._applyIncipitZoom();
	}

	/**
	 * Apply the current incipitScale as CSS zoom to all .pp-incipit elements.
	 * zoom (unlike transform:scale) affects layout flow, so containers
	 * collapse correctly without any height calculation.
	 */
	_applyIncipitZoom() {
		const z = this._opts.incipitScale;
		this.element.querySelectorAll(".pp-incipit").forEach((el) => {
			el.style.zoom = z;
		});
	}

	// ─── Text export ─────────────────────────────────────────────────────────────

	/**
	 * Trigger browser print dialog, but first ensure all incipits are rendered.
	 * We wait for any pending AbcJs work by giving the browser a layout frame.
	 */
	/**
	 * Clone the paper to a top-level print container so no ancestor overflow:hidden
	 * or height constraint can clip the content. Remove the clone after printing.
	 */
	_print() {
		// Ensure zoom is up to date on all incipit elements before cloning
		this._applyIncipitZoom();

		// Clone paper to a dedicated top-level element that won't be clipped
		const paper = this.element.querySelector("#pp-paper");
		const printRoot = document.createElement("div");
		printRoot.id = "pp-print-root";
		printRoot.appendChild(paper.cloneNode(true));
		document.body.appendChild(printRoot);

		const cleanup = () => {
			document.body.removeChild(printRoot);
			window.removeEventListener("afterprint", cleanup);
		};
		window.addEventListener("afterprint", cleanup);

		// Small delay to let the browser register the new DOM before printing
		setTimeout(() => window.print(), 100);
	}

	/** Copy the set list as plain text (for WhatsApp etc.). */
	_copyAsText() {
		const lines = [this._setList.name || "Set list", ""];
		let globalPos = 0;

		this._setList.sets.forEach((set, setIdx) => {
			if (!this._includedSets[setIdx]) {
				globalPos += set.tunes.length;
				return;
			}
			if (this._opts.showSetNames) {
				lines.push(`── ${set.name || `Set ${setIdx + 1}`} ──`);
			}
			const resolvedTunes = set.tunes.map(findTune);
			if (this._opts.showRhythm) {
				const summary = rhythmSummary(resolvedTunes);
				if (summary) lines.push(`(${summary})`);
			}
			set.tunes.forEach((entry, tuneIdx) => {
				globalPos++;
				const tune = resolvedTunes[tuneIdx];
				const prefix = this._opts.showNumbers ? `${globalPos}. ` : "• ";
				let line = prefix + (tune?.name ?? "(unknown tune)");
				if (this._opts.showBadges && tune) {
					const meta = [tune.rhythm, tune.key].filter(Boolean);
					if (meta.length) line += `  [${meta.join(", ")}]`;
				}
				lines.push(line);
				if (this._opts.showNotes && entry.notes?.trim()) {
					lines.push(`   ${entry.notes}`);
				}
			});
			lines.push("");
		});

		const text = lines.join("\n").trimEnd();
		const btn = this.element.querySelector(".pp-copy-btn");
		const orig = btn.textContent;
		navigator.clipboard.writeText(text).then(
			() => {
				btn.textContent = "✓ Copied!";
				setTimeout(() => {
					btn.textContent = orig;
				}, 2000);
			},
			() => {
				btn.textContent = "✗ Failed";
				setTimeout(() => {
					btn.textContent = orig;
				}, 2000);
			}
		);
	}
}
