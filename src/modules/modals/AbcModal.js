import {
	canDoubleBarLength,
	canHalveBarLength,
	convertStandardReel,
	convertToStandardJig,
	convertToStandardHornpipe,
	convertToStandardReel,
	convertStandardJig,
	convertStandardHornpipe,
	convertStandardPolka,
	convertToStandardPolka
} from "@goplayerjuggler/abc-tools";
import Modal from "./Modal.js";
import AbcJs from "abcjs";
import { getHeaderValue } from "@goplayerjuggler/abc-tools/src/parse/header-parser.js";
import { processTuneData } from "../../processTuneData.js";

/**
 *
 * ### AbcModal
 * **Purpose**: Display sheet music with interactive controls
 *
 * **Features**:
 * - Render ABC notation as sheet music
 * - Toggle between rendered and text views
 * - Transpose music up/down by semitones
 * - Navigate between multiple tune settings
 * - Pagination for long scores with click navigation
 * - Auto-hiding header to maximise score viewing area
 * - Dirty-state detection: compares current ABC strings against the originals
 *   opened with, showing a Save button when any setting has been modified
 *
 * **Key Methods**:
 * - `openWithTune(tune)`: Initialise and show modal with tune data
 * - `transpose(semitones)`: Transpose the displayed music
 * - `navigate(direction)`: Move between tune settings
 * - `toggleView()`: Switch between rendered and text views
 * - `nextPage()`: Navigate to next page of score
 * - `prevPage()`: Navigate to previous page of score
 * - `save()`: Persist all modified settings back to the tune data
 *
 *  **State variables for ABC content:**
 *  - `currentTuneAbc` — the pre-transposition base for the active setting.
 *    Only ever changed by `changeBarLength`. Always the input to
 *    `transposeAbcNotation`, so transpositions accumulate correctly (+1
 *    then +1 equals +2).
 *  - `currentTransposedAbc` — the effective ABC for the active setting:
 *    `currentTuneAbc` transposed by `currentTranspose`, or `currentTuneAbc`
 *    itself when `currentTranspose === 0`. Used for display, and as the
 *    value committed to `currentAbcArray` on navigate, and to `tune.abc`
 *    on save.
 *  - `currentAbcArray` — working copy of all settings for the open tune.
 *    Initialised from `tune.abc` at open; only written to in `navigate()`
 *    (committing the departing setting before switching index). Compared
 *    against `originalAbcArray` by `isDirty`.
 *  - `originalAbcArray` — immutable snapshot of `currentAbcArray` at open,
 *    used solely for dirty-state comparison.
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
            <button id="doubleBtn" class="transpose-btn">
              double bar length
            </button>
            <button id="halveBtn" class="transpose-btn">
              halve bar length
            </button>
            <button id="transposeDownBtn" class="transpose-btn">
              ♭ (down)
            </button>
            <button id="transposeUpBtn" class="transpose-btn">♯ (up)</button>
            <button class="toggle-view-btn" id="toggleViewBtn">
              Show ABC text
            </button>
          </div>
          <div class="control-row">
            <button id="prevAbcBtn" class="nav-btn">↑ Previous setting</button>
            <span id="abcCounter"></span>
            <button id="nextAbcBtn" class="nav-btn">↓ Next setting</button>
          </div>
          <div class="control-row pagination-controls">
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
				saveBtn: document.getElementById("saveAbcBtn")
			};
			this.setupControls();
		}

		// Pagination state
		this.currentPage = 0;
		this.allSvgs = [];
		this.LINES_PER_PAGE = 9;

		// Ensure rendered view is shown
		this.elements.rendered.style.display = "block";
		this.elements.text.classList.remove("active");
		this.elements.toggleBtn.textContent = "Show ABC text";

		// Add cursor pointer style to rendered area
		this.elements.rendered.style.cursor = "pointer";

		this.updateDisplayAfterTranspose();
		this.updateNavigationButtons();
		this.updateBarLengthButtons();
		this.updateSaveButton();
	}

	updateBarLengthButtons() {
		this.elements.doubleBtn.style.display = canDoubleBarLength(
			this.currentTuneAbc
		)
			? "block"
			: "none";
		this.elements.halveBtn.style.display = canHalveBarLength(
			this.currentTuneAbc
		)
			? "block"
			: "none";
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
		// Incorporate any uncommitted transposition on the current setting
		const effectiveArray = this.currentAbcArray.map((abc, i) =>
			i === this.currentAbcIndex ? this.currentTransposedAbc : abc
		);
		return effectiveArray.some((abc, i) => abc !== this.originalAbcArray[i]);
	}

	updateSaveButton() {
		this.elements.saveBtn.style.display = this.isDirty
			? "inline-block"
			: "none";
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
		this.elements.saveBtn?.addEventListener("click", () => this.save());

		// Pagination controls
		this.elements.prevPageBtn?.addEventListener("click", () => this.prevPage());
		this.elements.nextPageBtn?.addEventListener("click", () => this.nextPage());

		// Click navigation on the rendered score
		this.elements.rendered?.addEventListener("click", (e) => {
			if (this.currentViewMode !== "rendered") return;

			const rect = this.elements.rendered.getBoundingClientRect();
			const clickX = e.clientX - rect.left;
			const midpoint = rect.width / 2;

			if (clickX < midpoint) {
				this.prevPage();
			} else {
				this.nextPage();
			}
		});

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

	/**
	 * Initialise and open the modal for a given tune.
	 * @param {object} tune       - The tune object (must have an `abc` property)
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
		// Update pagination UI
		if (this.allSvgs.length === 0) return;

		const totalPages = Math.ceil(this.allSvgs.length / this.LINES_PER_PAGE);

		// Clear the display
		this.elements.rendered.innerHTML = "";

		// Add only the SVGs for the current page
		const startLine = this.currentPage * this.LINES_PER_PAGE;
		const endLine = Math.min(
			startLine + this.LINES_PER_PAGE,
			this.allSvgs.length
		);

		for (let i = startLine; i < endLine; i++) {
			if (this.allSvgs[i]) {
				this.elements.rendered.appendChild(this.allSvgs[i].cloneNode(true));
			}
		}

		// Update pagination UI
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

	updateNavigationButtons() {
		if (this.currentAbcArray.length > 1) {
			this.elements.prevBtn.style.display = "inline-block";
			this.elements.nextBtn.style.display = "inline-block";
			this.elements.counter.style.display = "inline-block";
			this.elements.counter.textContent = `${this.currentAbcIndex + 1} / ${this.currentAbcArray.length}`;
		} else {
			this.elements.prevBtn.style.display = "none";
			this.elements.nextBtn.style.display = "none";
			this.elements.counter.style.display = "none";
		}
	}

	changeBarLength(direction) {
		const r = getHeaderValue(this.currentTuneAbc, "R");
		let newAbc = "";
		if (direction === 1)
			switch (r) {
				case "reel":
					newAbc = convertStandardReel(this.currentTuneAbc);
					break;
				case "jig":
					newAbc = convertStandardJig(this.currentTuneAbc);
					break;
				case "polka":
					newAbc = convertStandardPolka(this.currentTuneAbc);
					break;
				case "hornpipe":
					newAbc = convertStandardHornpipe(this.currentTuneAbc);
					break;
			}
		else
			switch (r) {
				case "reel":
					newAbc = convertToStandardReel(this.currentTuneAbc);
					break;
				case "jig":
					newAbc = convertToStandardJig(this.currentTuneAbc);
					break;
				case "polka":
					newAbc = convertToStandardPolka(this.currentTuneAbc);
					break;
				case "hornpipe":
					newAbc = convertToStandardHornpipe(this.currentTuneAbc);
					break;
			}
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

		// Update text view
		this.elements.textContent.textContent = this.currentTransposedAbc;

		// Update rendered view with pagination support
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

		// Store all SVG elements for pagination
		this.allSvgs = Array.from(this.elements.rendered.querySelectorAll("svg"));
		//this.allSvgs = Array.from(document.querySelectorAll("abcRendered > svg"));

		// Apply pagination
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
	save() {
		const tune = this.tune;
		const originalTuneDataIndex = window.tunesData.findIndex((t) => t === tune);

		// Commit the current setting's effective ABC before building the saved array
		const abcToSave = this.currentAbcArray.map((abc, i) =>
			i === this.currentAbcIndex ? this.currentTransposedAbc : abc
		);

		tune.abc = abcToSave.length === 1 ? abcToSave[0] : abcToSave;

		// Reprocess tune data
		let reprocessed = Object.assign({}, tune);
		delete reprocessed.name;
		delete reprocessed.nameIsFromAbc;
		delete reprocessed.key;
		delete reprocessed.keyIsFromAbc;
		delete reprocessed.rhythm;
		delete reprocessed.rhythmIsFromAbc;
		delete reprocessed.references;
		delete reprocessed.incipit;

		reprocessed = processTuneData(reprocessed);

		Object.assign(tune, reprocessed);

		if (originalTuneDataIndex !== -1) {
			window.tunesData[originalTuneDataIndex] = tune;
		}

		this.callbacks.saveTunesToStorage();
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
