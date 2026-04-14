import {
	canDoubleBarLength,
	canHalveBarLength,
	convertStandardTune,
	convertToStandardTune
} from "@goplayerjuggler/abc-tools";
import Modal from "./Modal.js";
import AbcJs from "abcjs";
import { reprocessTune } from "../../processTuneData.js";
import { resolveAbcForEntry, tuneMatchesEntry } from "../setUtils.js";

/**
 * ### AbcModal
 * **Purpose**: Display sheet music for a single tune or for a full set of tunes.
 *
 * **Modes**:
 * - *Solo mode* (default): renders the tune that was clicked, with full editing controls.
 * - *Set mode*: renders all tunes in a set as a single concatenated score; editing
 *   controls are hidden (transpose, bar length, ABC text view, save, settings nav).
 *
 * When the tune belongs to one or more sets (from `window._setLists`), a context
 * selector row appears above the controls so the user can switch between solo and
 * each set the tune belongs to.
 *
 * **Features**:
 * - Render ABC notation as sheet music (both modes)
 * - Pagination for long scores, with click and keyboard navigation (both modes)
 * - Auto-hiding header to maximise score viewing area
 * - Toggle between rendered and text views (solo only)
 * - Transpose up/down by semitones (solo only)
 * - Double or halve bar length (solo only)
 * - Navigate between multiple tune settings (solo only)
 * - Dirty-state detection with Save button (solo only)
 *
 * **Key methods**:
 * - `openWithTune(tune)`: Initialise and open the modal for a tune
 * - `selectContext(idx)`: Switch between solo view (0) and set views (1+)
 * - `transpose(semitones)`: Transpose the displayed music (solo)
 * - `navigate(direction)`: Move between tune settings (solo)
 * - `toggleView()`: Switch between rendered and text views (solo)
 * - `nextPage() / prevPage()`: Paginate the score
 * - `save()`: Persist all modified settings back to the tune data (solo)
 *
 * **State variables for ABC content (solo mode):**
 * - `currentTuneAbc` — the pre-transposition base for the active setting.
 *   Only ever changed by `changeBarLength`. Always the input to
 *   `transposeAbcNotation`, so transpositions accumulate correctly (+1
 *   then +1 equals +2).
 * - `currentTransposedAbc` — the effective ABC for the active setting:
 *   `currentTuneAbc` transposed by `currentTranspose`, or `currentTuneAbc`
 *   itself when `currentTranspose === 0`. Used for display, and as the
 *   value committed to `currentAbcArray` on navigate, and to `tune.abc`
 *   on save.
 * - `currentAbcArray` — working copy of all settings for the open tune.
 *   Initialised from `tune.abc` at open; only written to in `navigate()`
 *   (committing the departing setting before switching index). Compared
 *   against `originalAbcArray` by `isDirty`.
 * - `originalAbcArray` — immutable snapshot of `currentAbcArray` at open,
 *   used solely for dirty-state comparison.
 *
 * **State variables for context / set mode:**
 * - `setContexts` — array of set contexts found in `window._setLists` that
 *   contain the current tune. Each entry: `{ setListName, setName, tunes }`.
 *   Deduplicates sets by their tunes-array content.
 * - `currentContextIndex` — 0 = solo; 1+ = `setContexts[currentContextIndex - 1]`.
 */
export default class AbcModal extends Modal {
	constructor(callbacks) {
		super({
			id: "abcModal",
			size: "large",
			title: "Score viewer",
			autoHideHeader: true,
			autoHideDelay: 0,
			content: `
        <div id="abcRendered" class="abc-rendered"></div>
        <div id="abcText" class="abc-text">
          <pre id="abcTextContent"></pre>
        </div>
        <div class="modal-controls">
          <div class="control-row">
            <button id="saveAbcBtn" class="save-btn" style="display:none">
              Save changes
            </button>
            <button id="doubleBtn" class="transpose-btn">double bar length</button>
            <button id="halveBtn" class="transpose-btn">halve bar length</button>
            <button id="transposeDownBtn" class="transpose-btn">♭ (down)</button>
            <button id="transposeUpBtn" class="transpose-btn">♯ (up)</button>
            <button class="toggle-view-btn" id="toggleViewBtn">Show ABC text</button>
          </div>
          <div class="control-row">
            <button id="prevAbcBtn" class="nav-btn">↑ Previous setting</button>
            <span id="abcCounter"></span>
            <button id="nextAbcBtn" class="nav-btn">↓ Next setting</button>
          </div>
		  <div class="control-row pagination-controls">
  <div id="abcContextRow" style="display:none">
    <label for="abcContextSelect">Mode</label>
    <select id="abcContextSelect"></select>
  </div>
  <button id="prevPageBtn" class="nav-btn">← Prev page</button>
  <span id="pageCounter"></span>
  <button id="nextPageBtn" class="nav-btn">Next page →</button>
</div>
        </div>
      `
		});

		this.callbacks = callbacks;
	}

	onOpen() {
		// Resolve element references and set up listeners once — the modal HTML
		// is created at construction time and persists for the lifetime of the instance
		if (!this.elements) {
			this.elements = {
				rendered: document.getElementById("abcRendered"),
				text: document.getElementById("abcText"),
				textContent: document.getElementById("abcTextContent"),
				toggleBtn: document.getElementById("toggleViewBtn"),
				transposeUpBtn: document.getElementById("transposeUpBtn"),
				transposeDownBtn: document.getElementById("transposeDownBtn"),
				prevBtn: document.getElementById("prevAbcBtn"),
				nextBtn: document.getElementById("nextAbcBtn"),
				doubleBtn: document.getElementById("doubleBtn"),
				halveBtn: document.getElementById("halveBtn"),
				counter: document.getElementById("abcCounter"),
				prevPageBtn: document.getElementById("prevPageBtn"),
				nextPageBtn: document.getElementById("nextPageBtn"),
				pageCounter: document.getElementById("pageCounter"),
				saveBtn: document.getElementById("saveAbcBtn"),
				contextRow: document.getElementById("abcContextRow"),
				contextSelect: document.getElementById("abcContextSelect")
			};
			this.setupControls();
		}

		// Pagination state
		this.currentPage = 0;
		this.allSvgs = [];
		this.LINES_PER_PAGE = 11;

		// Ensure rendered view is shown
		this.elements.rendered.style.display = "block";
		this.elements.text.classList.remove("active");
		this.elements.toggleBtn.textContent = "Show ABC text";
		this.elements.rendered.style.cursor = "pointer";

		this.updateContextRow();
		this.updateDisplayAfterTranspose();
		this.updateControls();
	}

	// ── Context (solo / set) ──────────────────────────────────────────────────

	/** True when a set context is active (currentContextIndex > 0). */
	get isSetMode() {
		return this.currentContextIndex > 0;
	}

	/**
	 * Search `window._setLists` for sets containing the given tune.
	 * Deduplicates sets by their tunes-array content, so the same set appearing
	 * in multiple set lists is shown only once (first occurrence wins for naming).
	 * @param {object} tune
	 * @returns {{ setListName: string, setName: string, tunes: object[] }[]}
	 */
	findSetContexts(tune) {
		const setLists = window._setLists ?? [];
		const seen = new Set();
		const contexts = [];

		for (const setList of setLists) {
			for (const set of setList.sets ?? []) {
				const tunes = set.tunes ?? [];
				if (!tunes.some((entry) => tuneMatchesEntry(tune, entry))) continue;

				const key = JSON.stringify(tunes);
				if (seen.has(key)) continue;
				seen.add(key);

				contexts.push({ setListName: setList.name, setName: set.name, tunes });
			}
		}
		return contexts;
	}

	/**
	 * Switch the display context: 0 = solo tune; 1+ = set at `setContexts[idx - 1]`.
	 * Resets to rendered view (set mode has no text view) and page 0.
	 * @param {number} idx
	 */
	selectContext(idx) {
		this.currentContextIndex = idx;
		if (this.elements?.contextSelect) this.elements.contextSelect.value = idx;
		this.currentPage = 0;

		// Set mode has no text view — switch back to rendered if needed
		if (this.isSetMode && this.currentViewMode === "text") {
			this.currentViewMode = "rendered";
			this.elements.rendered.style.display = "block";
			this.elements.text.classList.remove("active");
			this.elements.toggleBtn.textContent = "Show ABC text";
		}

		this.updateContextRow();
		this.updateControls();

		if (this.isSetMode) {
			this.renderSetAbc();
		} else {
			this.updateDisplayAfterTranspose();
		}
	}

	/** Rebuild the context-selector button row. Hidden when the tune has no sets. */
	updateContextRow() {
		const { contextRow, contextSelect } = this.elements;
		if (!this.setContexts?.length) {
			contextRow.style.display = "none";
			return;
		}
		contextRow.style.display = "";
		contextSelect.innerHTML = "";
		const options = [
			{ label: "Single tune", idx: 0 },
			...this.setContexts.map((ctx, i) => ({
				label: `Set: ${ctx.setName}`,
				idx: i + 1,
				title: ctx.setListName
			}))
		];
		options.forEach(({ label, idx, title }) => {
			const opt = document.createElement("option");
			opt.value = idx;
			opt.textContent = label;
			if (title) opt.title = title;
			if (idx === this.currentContextIndex) opt.selected = true;
			contextSelect.appendChild(opt);
		});
	}

	/**
	 * Build and render the score for the current set context.
	 * ABC is read from `window.tunesData`, respecting each entry's preferred setting.
	 *
	 * Each tune is rendered individually into a scratch element so that
	 * `oneSvgPerLine: true` works correctly for every tune (ABCJS only honours
	 * that option for the first tune in a multi-tune string). The resulting SVGs
	 * are harvested across all tunes and fed into the shared pagination system.
	 */
	renderSetAbc() {
		const ctx = this.setContexts[this.currentContextIndex - 1];
		const scratch = document.createElement("div");
		scratch.style.cssText =
			"position:absolute;visibility:hidden;pointer-events:none";
		document.body.appendChild(scratch);

		const abcOptions = {
			scale: 1.0,
			staffwidth: 900,
			paddingtop: 10,
			paddingbottom: 10,
			paddingright: 20,
			paddingleft: 20,
			responsive: "resize",
			oneSvgPerLine: true
			//fields: { header: false } omit N:, V2 : does nothing
		};

		const svgs = [];
		for (const entry of ctx.tunes) {
			const tune = (window.tunesData ?? []).find((t) =>
				tuneMatchesEntry(t, entry)
			);
			let abc = resolveAbcForEntry(entry, tune);
			if (!abc) continue;
			// omit N:, V1 : next bit doesn't work so use the ABCJS `fields` option instead
			// // Suppress N/S/D info fields per the ABC spec directive
			// abc = "%%writefields NSD false\n" + abc;

			scratch.innerHTML = "";
			AbcJs.renderAbc(
				scratch,
				abc
					// omit header data, V3
					.split("\n")
					.filter(
						(line) =>
							!line.startsWith("N:") &&
							!line.startsWith("S:") &&
							!line.startsWith("D:") &&
							!line.startsWith("Z:") &&
							!line.startsWith("H:")
					)
					/*
					 `+:` line continuations aren't handled
					  todo: move to abc-tools
					*/
					.join("\n"),
				abcOptions
			);
			scratch
				.querySelectorAll("svg")
				.forEach((svg) => svgs.push(svg.cloneNode(true)));
		}

		document.body.removeChild(scratch);

		this.elements.rendered.innerHTML = "";
		this.allSvgs = svgs;
		this.updatePagination();
	}

	// ── Controls ──────────────────────────────────────────────────────────────

	/**
	 * Show or hide all mode-dependent controls in one pass.
	 * Transpose and toggle-view buttons are always hidden in set mode;
	 * the per-setting controls (nav, bar-length, save) delegate to their own
	 * update methods, which also check `isSetMode` internally.
	 */
	updateControls() {
		const setMode = this.isSetMode;
		[
			this.elements.transposeUpBtn,
			this.elements.transposeDownBtn,
			this.elements.toggleBtn
		].forEach((el) => el && (el.style.display = setMode ? "none" : ""));

		this.updateNavigationButtons();
		this.updateBarLengthButtons();
		this.updateSaveButton();
	}

	updateBarLengthButtons() {
		const show = !this.isSetMode;
		this.elements.doubleBtn.style.display =
			show && canDoubleBarLength(this.currentTuneAbc) ? "block" : "none";
		this.elements.halveBtn.style.display =
			show && canHalveBarLength(this.currentTuneAbc) ? "block" : "none";
	}

	/**
	 * Returns true if any setting in `currentAbcArray` differs from the
	 * snapshot taken when the modal was opened (`originalAbcArray`).
	 * Transposing back to the original key, or reverting a bar-length change,
	 * will therefore restore a clean state.
	 *
	 * Note: `currentAbcArray` is only updated when leaving a setting (navigate)
	 * or saving — not on every transposition step — so that `currentTuneAbc`
	 * always remains the unmodified base for cumulative transposition.
	 */
	get isDirty() {
		const effectiveArray = this.currentAbcArray.map((abc, i) =>
			i === this.currentAbcIndex ? this.currentTransposedAbc : abc
		);
		return effectiveArray.some((abc, i) => abc !== this.originalAbcArray[i]);
	}

	updateSaveButton() {
		this.elements.saveBtn.style.display =
			!this.isSetMode && this.isDirty ? "inline-block" : "none";
	}

	updateNavigationButtons() {
		if (this.isSetMode || this.currentAbcArray.length <= 1) {
			this.elements.prevBtn.style.display = "none";
			this.elements.nextBtn.style.display = "none";
			this.elements.counter.style.display = "none";
		} else {
			this.elements.prevBtn.style.display = "inline-block";
			this.elements.nextBtn.style.display = "inline-block";
			this.elements.counter.style.display = "inline-block";
			this.elements.counter.textContent = `${this.currentAbcIndex + 1} / ${this.currentAbcArray.length}`;
		}
	}

	setupControls() {
		this.elements.doubleBtn?.addEventListener("click", () =>
			this.changeBarLength(1)
		);
		this.elements.halveBtn?.addEventListener("click", () =>
			this.changeBarLength(-1)
		);
		this.elements.toggleBtn?.addEventListener("click", () => this.toggleView());
		this.elements.transposeUpBtn?.addEventListener("click", () =>
			this.transpose(1)
		);
		this.elements.transposeDownBtn?.addEventListener("click", () =>
			this.transpose(-1)
		);
		this.elements.prevBtn?.addEventListener("click", () => this.navigate(-1));
		this.elements.nextBtn?.addEventListener("click", () => this.navigate(1));
		this.elements.saveBtn?.addEventListener(
			"click",
			async () => await this.save()
		);
		this.elements.prevPageBtn?.addEventListener("click", () => this.prevPage());
		this.elements.nextPageBtn?.addEventListener("click", () => this.nextPage());

		// Click navigation on the rendered score
		this.elements.rendered?.addEventListener("click", (e) => {
			if (this.currentViewMode !== "rendered") return;
			const rect = this.elements.rendered.getBoundingClientRect();
			if (e.clientX - rect.left < rect.width / 2) this.prevPage();
			else this.nextPage();
		});

		this.elements.contextSelect?.addEventListener("change", (e) =>
			this.selectContext(Number(e.target.value))
		);

		// Keyboard navigation — added once; isOpen() prevents firing when closed
		document.addEventListener("keydown", (e) => {
			if (!this.isOpen()) return;
			let handled = true;
			switch (e.key) {
				case "ArrowLeft":
					this.prevPage();
					break;
				case "ArrowRight":
					this.nextPage();
					break;
				case "ArrowUp":
					this.navigate(-1);
					break;
				case "ArrowDown":
					this.navigate(1);
					break;
				default:
					handled = false;
					break;
			}
			if (handled) {
				e.preventDefault();
				e.stopPropagation();
			}
		});
	}

	// ── Lifecycle ─────────────────────────────────────────────────────────────

	/**
	 * Initialise and open the modal for a given tune.
	 * Discovers any sets in `window._setLists` that contain this tune and
	 * stores them in `setContexts` for the context-selector row.
	 * @param {object} tune - must have an `abc` property
	 */
	openWithTune(tune) {
		if (!tune.abc) return;
		this.tune = tune;
		this.currentAbcArray = Array.isArray(tune.abc) ? [...tune.abc] : [tune.abc];
		this.originalAbcArray = [...this.currentAbcArray];
		this.currentAbcIndex = 0;
		this.currentTuneAbc = this.currentAbcArray[0];
		this.currentTranspose = 0;
		this.currentViewMode = "rendered";
		this.currentPage = 0;
		this.currentContextIndex = 0;
		this.setContexts = this.findSetContexts(tune);

		this.open();
	}

	toggleView() {
		if (this.currentViewMode === "rendered") {
			this.currentViewMode = "text";
			this.elements.rendered.style.display = "none";
			this.elements.text.classList.add("active");
			this.elements.toggleBtn.textContent = "Show rendered";
		} else {
			this.currentViewMode = "rendered";
			this.elements.rendered.style.display = "block";
			this.elements.text.classList.remove("active");
			this.elements.toggleBtn.textContent = "Show ABC text";
		}
	}

	navigate(direction) {
		if (this.isSetMode) return;

		// Commit the effective (possibly transposed) ABC for the current setting
		// before switching, so isDirty and save() see the right value
		this.currentAbcArray[this.currentAbcIndex] = this.currentTransposedAbc;

		this.currentAbcIndex =
			(this.currentAbcIndex + direction + this.currentAbcArray.length) %
			this.currentAbcArray.length;

		this.currentTuneAbc = this.currentAbcArray[this.currentAbcIndex];
		this.currentTranspose = 0;
		this.currentPage = 0;
		this.updateDisplayAfterTranspose();
		this.updateBarLengthButtons();
		this.updateNavigationButtons();
	}

	transpose(semitones) {
		if (this.isSetMode) return;
		this.currentTranspose += semitones;
		this.updateDisplayAfterTranspose();
	}

	nextPage() {
		if (this.allSvgs.length === 0) return;
		const totalPages = Math.ceil(this.allSvgs.length / this.LINES_PER_PAGE);
		if (this.currentPage < totalPages - 1) {
			this.currentPage++;
			this.updatePagination();
		}
	}

	prevPage() {
		if (this.currentPage > 0) {
			this.currentPage--;
			this.updatePagination();
		}
	}

	updatePagination() {
		if (this.allSvgs.length === 0) return;

		const totalPages = Math.ceil(this.allSvgs.length / this.LINES_PER_PAGE);

		this.elements.rendered.innerHTML = "";
		const startLine = this.currentPage * this.LINES_PER_PAGE;
		const endLine = Math.min(
			startLine + this.LINES_PER_PAGE,
			this.allSvgs.length
		);
		for (let i = startLine; i < endLine; i++) {
			if (this.allSvgs[i])
				this.elements.rendered.appendChild(this.allSvgs[i].cloneNode(true));
		}

		this.updatePaginationButtons(totalPages);
	}

	updatePaginationButtons(totalPages) {
		if (totalPages > 1) {
			this.elements.prevPageBtn.style.display = "inline-block";
			this.elements.nextPageBtn.style.display = "inline-block";
			this.elements.pageCounter.style.display = "inline-block";
			this.elements.pageCounter.textContent = `Page ${this.currentPage + 1} / ${totalPages}`;
			this.elements.prevPageBtn.disabled = this.currentPage === 0;
			this.elements.nextPageBtn.disabled = this.currentPage >= totalPages - 1;
		} else {
			this.elements.prevPageBtn.style.display = "none";
			this.elements.nextPageBtn.style.display = "none";
			this.elements.pageCounter.style.display = "none";
		}
	}

	changeBarLength(direction) {
		const newAbc =
			direction === 1
				? convertStandardTune(this.currentTuneAbc)
				: convertToStandardTune(this.currentTuneAbc);
		if (newAbc) {
			this.currentTuneAbc = newAbc;
			this.currentPage = 0;
			this.updateBarLengthButtons();
			this.updateDisplayAfterTranspose();
		}
	}

	updateDisplayAfterTranspose() {
		// currentTuneAbc is always the pre-transposition base; transposition is
		// applied cumulatively via currentTranspose. The result is held in
		// currentTransposedAbc for use by isDirty, navigate, and save.
		this.currentTransposedAbc =
			this.currentTranspose !== 0
				? this.transposeAbcNotation(this.currentTuneAbc, this.currentTranspose)
				: this.currentTuneAbc;

		this.elements.textContent.textContent = this.currentTransposedAbc;

		this.elements.rendered.innerHTML = "";
		AbcJs.renderAbc("abcRendered", this.currentTransposedAbc, {
			scale: 1.0,
			staffwidth: 900,
			paddingtop: 10,
			paddingbottom: 10,
			paddingright: 20,
			paddingleft: 20,
			responsive: "resize",
			oneSvgPerLine: true
		});

		this.allSvgs = Array.from(this.elements.rendered.querySelectorAll("svg"));
		this.updatePagination();
		this.updateSaveButton();
	}

	transposeAbcNotation(abc, transposeAmount) {
		const visualObj = AbcJs.renderAbc("*", abc);
		return AbcJs.strTranspose(abc, visualObj, transposeAmount);
	}

	/**
	 * Persist all modified settings to the source tune object and propagate
	 * the change through to storage and the UI.
	 * Saves all settings in `currentAbcArray`, not just the one currently visible.
	 */
	async save() {
		const tune = this.tune;
		const originalTuneDataIndex = window.tunesData.findIndex((t) => t === tune);

		// Commit the current setting's effective ABC before building the saved array
		const abcToSave = this.currentAbcArray.map((abc, i) =>
			i === this.currentAbcIndex ? this.currentTransposedAbc : abc
		);

		tune.abc = abcToSave.length === 1 ? abcToSave[0] : abcToSave;

		if (originalTuneDataIndex !== -1) {
			window.tunesData[originalTuneDataIndex] = reprocessTune(
				tune,
				// do not delete the contour - see note for Lazy SVG system in index.js
				{ removeContour: false }
			);
		}

		await this.callbacks.saveTunesToStorage();
		this.callbacks.renderTable();
		this.callbacks.populateFilters();
		this.close();
	}

	onClose() {
		document.removeEventListener("keydown", this.handleKeydown);
		this.handleKeydown = null;

		this.currentTranspose = 0;
		this.currentAbcIndex = 0;
		this.currentPage = 0;
		this.allSvgs = [];
	}
}
