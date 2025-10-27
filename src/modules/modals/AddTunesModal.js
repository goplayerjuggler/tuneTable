import BaseModal from "./BaseModal.js";
import processTuneData from "../../processTuneData.js";
import { getTunes } from "@goplayerjuggler/abc-tools";

/**
 * Add Tunes Modal
 * Allows importing tunes via ABC notation
 * 
### AddTunesModal
**Purpose**: Import new tunes via ABC notation

**Features**:
- Parse single or multiple ABC tunes
- Automatic tune splitting by X: headers
- Status feedback for import operations
- Integration with main tune database

**Key Methods**:
- `addTunes()`: Process and import ABC notation
- `splitAbcTunes(abcText)`: Parse ABC text into individual tunes

 */
export default class AddTunesModal extends BaseModal {
	static getTemplate() {
		return `
<div id="addTunesModal" class="modal add-tunes-modal">
  <div class="modal-content">
    <div class="modal-header">
      <h2 style="flex: 1; margin: 0; color: #2c3e50">
        Import tunes via ABC
      </h2>
      <button class="close-btn" id="closeAddTunesBtn">&times;</button>
    </div>
    <div style="margin-bottom: 20px">
      <p style="color: #666; margin-bottom: 10px">
        Paste ABC notation below. Multiple tunes can be separated by blank
        lines or X: headers.
      </p>
      <textarea
        id="abcInput"
        placeholder="Paste ABC notation here…

Example:

X:1
T:The Black Rogue
R:jig
L:1/8
M:12/8
K:A major
d|cAA BGB cAA A2d | cAA BGB AFD D2
…"
      ></textarea>
    </div>
    <div style="display: flex; gap: 10px; justify-content: flex-end">
      <button id="clearAbcBtn" class="modal-btn secondary">Clear</button>
      <button id="addAbcBtn" class="modal-btn primary">Add Tunes</button>
    </div>
    <div id="addTunesStatus"></div>
  </div>
</div>
    `;
	}

	constructor(callbacks) {
		super("addTunesModal");

		this.callbacks = callbacks;

		this.elements = {
			closeBtn: document.getElementById("closeAddTunesBtn"),
			input: document.getElementById("abcInput"),
			clearBtn: document.getElementById("clearAbcBtn"),
			addBtn: document.getElementById("addAbcBtn"),
			status: document.getElementById("addTunesStatus"),
		};

		this.setupControls();
	}

	setupControls() {
		this.elements.closeBtn?.addEventListener("click", () => this.close());
		this.elements.clearBtn?.addEventListener("click", () => this.clear());
		this.elements.addBtn?.addEventListener("click", () => this.addTunes());
	}

	clear() {
		this.elements.input.value = "";
		this.elements.status.style.display = "none";
	}

	showStatus(message, type = "error") {
		this.elements.status.style.display = "block";

		if (type === "success") {
			this.elements.status.style.background = "#efe";
			this.elements.status.style.color = "#2a7";
		} else {
			this.elements.status.style.background = "#fee";
			this.elements.status.style.color = "#c33";
		}

		this.elements.status.textContent = message;
	}

	addTunes() {
		const abcText = this.elements.input.value.trim();

		if (!abcText) {
			this.showStatus("Please paste some ABC notation first.");
			return;
		}

		try {
			const abcTunes = getTunes(abcText);
			let addedCount = 0,
				failedCount = 0;

			abcTunes.forEach((abc) => {
				try {
					if (abc.trim()) {
						const newTune = {
							abc,
						};

						const processed = processTuneData(newTune);
						window.tunesData.push(processed);
						addedCount++;
					}
				} catch (error) {
					failedCount++;

					this.showStatus(`Failed - nb failures: ${failedCount}`, "error");
				}
			});

			if (addedCount > 0) {
				this.callbacks.sortWithDefaultSort();
				this.callbacks.saveTunesToStorage();
				this.callbacks.populateFilters();
				this.callbacks.applyFilters();

				this.showStatus(
					`Successfully added ${addedCount} tune${
						addedCount !== 1 ? "s" : ""
					}!`,
					"success"
				);

				this.elements.input.value = "";

				setTimeout(() => {
					this.close();
				}, 1500);
			} else {
				this.showStatus("No valid tunes found in the ABC notation.");
			}
		} catch (error) {
			this.showStatus(`Error processing ABC: ${error.message}`);
		}
	}

	onOpen() {
		this.elements.status.style.display = "none";
		this.elements.input.value = "";
	}
}
