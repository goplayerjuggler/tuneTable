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
 * ABC Notation Display Modal
 * Shows rendered sheet music with transposition controls
 *
 * ### AbcModal
 * **Purpose**: Display sheet music with interactive controls
 *
 * **Features**:
 * - Render ABC notation as sheet music
 * - Toggle between rendered and text views
 * - Transpose music up/down by semitones
 * - Navigate between multiple tune settings
 * - Keyboard navigation support
 * - Auto-hiding header to maximise score viewing area
 *
 * **Key Methods**:
 * - `openWithTune(tune)`: Initialise and show modal with tune data
 * - `transpose(semitones)`: Transpose the displayed music
 * - `navigate(direction)`: Move between tune settings
 * - `toggleView()`: Switch between rendered and text views
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
            <button id="prevAbcBtn" class="nav-btn">← Previous</button>
            <span id="abcCounter"></span>
            <button id="nextAbcBtn" class="nav-btn">Next →</button>
          </div>
        </div>
        <div id="abcRendered" class="abc-rendered"></div>
        <div id="abcText" class="abc-text">
          <pre id="abcTextContent"></pre>
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
			counter: document.getElementById("abcCounter")
		};

		this.setupControls();

		// Ensure rendered view is shown
		this.elements.rendered.style.display = "block";
		this.elements.text.classList.remove("active");
		this.elements.toggleBtn.textContent = "Show ABC text";

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

		document.addEventListener("keydown", this.handleKeydown);
	}

	openWithTune(tune) {
		if (!tune.abc) return;
		this.currentAbcArray = Array.isArray(tune.abc) ? tune.abc : [tune.abc];
		this.currentAbcIndex = 0;
		this.currentTuneAbc = this.currentAbcArray[0];
		this.currentTranspose = 0;
		this.currentViewMode = "rendered";

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
		this.updateDisplayAfterTranspose();
		this.updateNavigationButtons();
	}

	transpose(semitones) {
		this.currentTranspose += semitones;
		this.updateDisplayAfterTranspose();
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

		// Update rendered view
		this.elements.rendered.innerHTML = "";
		AbcJs.renderAbc("abcRendered", transposedAbc, {
			scale: 1.0,
			staffwidth: 900,
			paddingtop: 10,
			paddingbottom: 10,
			paddingright: 20,
			paddingleft: 20,
			responsive: "resize"
		});
	}

	transposeAbcNotation(abc, transposeAmount) {
		const visualObj = AbcJs.renderAbc("*", abc);
		return AbcJs.strTranspose(abc, visualObj, transposeAmount);
	}

	handleKeydown(e) {
		if (!super.isOpen()) return false;

		if (e.key === "ArrowLeft") {
			this.navigate(-1);
			return true;
		} else if (e.key === "ArrowRight") {
			this.navigate(1);
			return true;
		}

		return false;
	}

	onClose() {
		this.currentTranspose = 0;
		this.currentAbcIndex = 0;
	}
}
