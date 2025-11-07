import Modal from "./Modal.js";
import { processTuneData } from "../../processTuneData.js";
import { getTunes, getTitles } from "@goplayerjuggler/abc-tools";

/**
 * Add Tunes Modal
 * Allows importing tunes via ABC notation
 *
 * ### AddTunesModal
 * **Purpose**: Import new tunes via ABC notation
 *
 * **Features**:
 * - Parse single or multiple ABC tunes
 * - Automatic tune splitting by X: headers
 * - Status feedback for import operations
 * - Integration with main tune database
 *
 * **Key Methods**:
 * - `open()`: Open modal and reset state
 * - `addTunes()`: Process and import ABC notation
 * - `clear()`: Clear input and status
 * - `showStatus(message, type)`: Display success/error messages
 */
export default class AddTunesModal extends Modal {
	constructor(callbacks) {
		super({
			id: "addTunesModal",
			size: "large",
			title: "Import tunes via ABC",
			content: `
        <div class="modal-body">
          <div style="margin-bottom: 20px">
            <p style="color: #666; margin-bottom: 10px">
              Paste ABC notation below. Multiple tunes can be separated by blank
              lines or X: headers.
            </p>
            <textarea
              id="abcInput"
              class="form-control abc-textarea"
              rows="12"
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
          <div id="addTunesStatus" style="display: none; padding: 10px; border-radius: 4px; margin-top: 10px"></div>
        </div>

        <div class="modal-footer">
          <button id="clearAbcBtn" class="btn btn-secondary">Clear</button>
          <button id="addAbcBtn" class="btn btn-primary">Add Tunes</button>
        </div>
      `,
		});

		this.callbacks = callbacks;
	}

	onOpen() {
		this.elements = {
			input: document.getElementById("abcInput"),
			clearBtn: document.getElementById("clearAbcBtn"),
			addBtn: document.getElementById("addAbcBtn"),
			status: document.getElementById("addTunesStatus"),
		};

		this.setupControls();

		// Reset state
		this.elements.status.style.display = "none";
		this.elements.input.value = "";
		this.elements.input.focus();
	}

	setupControls() {
		this.elements.clearBtn?.addEventListener("click", () => this.clear());
		this.elements.addBtn?.addEventListener("click", () => this.addTunes());
	}

	clear() {
		this.elements.input.value = "";
		this.elements.status.style.display = "none";
	}

	/**
	 * Display status message to user
	 * @param {string} message - Message to display
	 * @param {string} type - Message type: 'success' or 'error'
	 */
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

	/**
	 * Process and import ABC notation into the tune database
	 */
	addTunes() {
		const abcText = this.elements.input.value.trim();

		if (!abcText) {
			this.showStatus("Please paste some ABC notation first.");
			return;
		}

		try {
			const abcTunes = getTunes(abcText);
			let addedCount = 0;
			let failedCount = 0;
			const failedNames = [];
			const errors = [];

			abcTunes.forEach((abc) => {
				try {
					if (abc.trim()) {
						const newTune = { abc };
						const processed = processTuneData(newTune);
						window.tunesData.push(processed);
						addedCount++;
					}
				} catch (error) {
					failedCount++;
					// Extract title from failed tune for error reporting
					const titles = getTitles(abc);
					if (titles.length > 0 && failedNames.length < 10) {
						failedNames.push(titles[0]);
					}
					if (errors.indexOf(error) < 0) {
						errors.push(error);
					}
				}
			});

			const fails = `nb failures: ${failedCount}${
				failedNames.length === 0
					? ""
					: `; titles of failed: ${failedNames.join(", ")}; errors: ${errors.join("<br />")}`
			}`;

			if (addedCount > 0) {
				this.callbacks.sortWithDefaultSort();
				this.callbacks.saveTunesToStorage();
				this.callbacks.populateFilters();
				this.callbacks.applyFilters();

				const successes = `Successfully added ${addedCount} tune${
					addedCount !== 1 ? "s" : ""
				}`;
				this.showStatus(
					successes + (failedCount === 0 ? "" : `; ${fails}`),
					"success",
				);

				this.elements.input.value = "";

				setTimeout(() => {
					this.close();
				}, 4000);
			} else {
				this.showStatus(fails, "error");
			}
		} catch (error) {
			this.showStatus(`Error processing ABC: ${error.message}`);
		}
	}

	onClose() {
		// Cleanup if needed
	}
}
