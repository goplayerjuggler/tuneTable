import {
	canDoubleBarLength,
	canHalveBarLength,
	convertStandardReel,
	convertToStandardJig,
	convertToStandardHornpipe,
	convertToStandardReel,
	convertStandardJig,
	convertStandardHornpipe
} from "@goplayerjuggler/abc-tools";
import Modal from "./Modal.js";
import AbcJs from "abcjs";
import { getHeaderValue } from "@goplayerjuggler/abc-tools/src/parse/header-parser.js";

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
 *
 * **Key Methods**:
 * - `openWithTune(tune)`: Initialise and show modal with tune data
 * - `transpose(semitones)`: Transpose the displayed music
 * - `navigate(direction)`: Move between tune settings
 * - `toggleView()`: Switch between rendered and text views
 * - `nextPage()`: Navigate to next page of score
 * - `prevPage()`: Navigate to previous page of score
 */
export default class AbcModal extends Modal {
	constructor() {
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
	}

	onOpen() {
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
			pageCounter: document.getElementById("pageCounter")
		};

		// Pagination state
		this.currentPage = 0;
		this.allSvgs = [];
		this.LINES_PER_PAGE = 9;

		this.setupControls();

		// Ensure rendered view is shown
		this.elements.rendered.style.display = "block";
		this.elements.text.classList.remove("active");
		this.elements.toggleBtn.textContent = "Show ABC text";

		// Add cursor pointer style to rendered area
		this.elements.rendered.style.cursor = "pointer";

		this.updateDisplayAfterTranspose();
		this.updateNavigationButtons();
		this.updateBarLengthButtons();
	}

	updateBarLengthButtons() {
		if (canDoubleBarLength(this.currentTuneAbc))
			this.elements.doubleBtn.style.display = "block";
		else this.elements.doubleBtn.style.display = "none";

		if (canHalveBarLength(this.currentTuneAbc))
			this.elements.halveBtn.style.display = "block";
		else this.elements.halveBtn.style.display = "none";
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

		this.handleKeydown = (e) => {
			if (!super.isOpen()) return false;

			if (e.key === "ArrowLeft") {
				this.prevPage();
				return false;
			} else if (e.key === "ArrowRight") {
				this.nextPage();
				return false;
			} else if (e.key === "ArrowUp") {
				this.navigate(-1);
				return false;
			} else if (e.key === "ArrowDown") {
				this.navigate(1);
				return false;
			}

			return false;
		};

		document.addEventListener("keydown", this.handleKeydown);
	}

	openWithTune(tune) {
		if (!tune.abc) return;
		this.currentAbcArray = Array.isArray(tune.abc) ? tune.abc : [tune.abc];
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
		this.currentAbcIndex += direction;
		if (this.currentAbcIndex < 0) {
			this.currentAbcIndex = this.currentAbcArray.length - 1;
		}
		if (this.currentAbcIndex >= this.currentAbcArray.length) {
			this.currentAbcIndex = 0;
		}

		this.currentTuneAbc = this.currentAbcArray[this.currentAbcIndex];
		this.currentTranspose = 0;
		this.currentPage = 0;
		this.updateDisplayAfterTranspose();
		this.updateNavigationButtons();
	}

	transpose(semitones) {
		this.currentTranspose += semitones;
		this.updateDisplayAfterTranspose();
	}

	nextPage() {
		if (this.allSvgs.length === 0) return;

		const totalLines = this.allSvgs.length;
		const totalPages = Math.ceil(totalLines / this.LINES_PER_PAGE);

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

		const totalLines = this.allSvgs.length;
		const totalPages = Math.ceil(totalLines / this.LINES_PER_PAGE);

		// Clear the display
		this.elements.rendered.innerHTML = "";

		// Add only the SVGs for the current page
		const startLine = this.currentPage * this.LINES_PER_PAGE;
		const endLine = Math.min(startLine + this.LINES_PER_PAGE, totalLines);

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
		let transposedAbc = this.currentTuneAbc;

		if (this.currentTranspose !== 0) {
			transposedAbc = this.transposeAbcNotation(
				this.currentTuneAbc,
				this.currentTranspose
			);
		}

		// Update text view
		this.elements.textContent.textContent = transposedAbc;

		// Update rendered view with pagination support
		this.elements.rendered.innerHTML = "";
		AbcJs.renderAbc("abcRendered", transposedAbc, {
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

		// Apply pagination
		this.updatePagination();
	}

	transposeAbcNotation(abc, transposeAmount) {
		const visualObj = AbcJs.renderAbc("*", abc);
		return AbcJs.strTranspose(abc, visualObj, transposeAmount);
	}

	onClose() {
		this.currentTranspose = 0;
		this.currentAbcIndex = 0;
		this.currentPage = 0;
		this.allSvgs = [];
	}
}
