import Modal from "./Modal.js";
import processTuneData from "../../processTuneData.js";

/**
 * Load JSON Modal
 * Allows loading complete tune table from JSON/JS format
 *
 * ### LoadJsonModal
 * **Purpose**: Import complete tune database from JSON or JavaScript
 *
 * **Features**:
 * - Support for JSON and JavaScript literal formats
 * - Data validation and error handling
 * - Replace entire tune collection
 * - Confirmation before destructive operations
 *
 * **Key Methods**:
 * - `open()`: Open modal and reset state
 * - `loadData()`: Parse and import tune data
 * - `clear()`: Clear input and status
 * - `showStatus(message, type)`: Display success/error messages
 */
export default class LoadJsonModal extends Modal {
	constructor(callbacks) {
		super({
			id: "loadJsonModal",
			size: "large",
			title: "Load full tune table",
			content: `
        <div class="modal-body">
          <div style="margin-bottom: 20px">
            <p style="color: #666; margin-bottom: 10px">
              Paste an array of tune objects below; the format must be either JSON or Javascript. This will replace all existing tunes.
            </p>
            <textarea
              id="jsonInput"
              class="form-control abc-textarea"
              rows="12"
              placeholder="Paste array here…

Example:
[
  {
    abc: \`X:1\nT:Example\n…\`,
  }
]"
            ></textarea>
          </div>
          <div id="loadJsonStatus" style="display: none; padding: 10px; border-radius: 4px; margin-top: 10px"></div>
        </div>

        <div class="modal-footer">
          <button id="clearJsonBtn" class="btn btn-secondary">Clear</button>
          <button id="loadJsonDataBtn" class="btn btn-primary">Load data</button>
        </div>
      `,
		});

		this.callbacks = callbacks;
	}

	onOpen() {
		this.elements = {
			input: document.getElementById("jsonInput"),
			clearBtn: document.getElementById("clearJsonBtn"),
			loadBtn: document.getElementById("loadJsonDataBtn"),
			status: document.getElementById("loadJsonStatus"),
		};

		this.setupControls();

		// Reset state
		this.elements.status.style.display = "none";
		this.elements.input.value = "";
		this.elements.input.focus();
	}

	setupControls() {
		this.elements.clearBtn?.addEventListener("click", () => this.clear());
		this.elements.loadBtn?.addEventListener("click", () => this.loadData());
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
	 * Parse and import tune data from JSON or JavaScript literal format
	 * Replaces entire tune database after user confirmation
	 */
	loadData() {
		const jsonText = this.elements.input.value.trim();

		if (!jsonText) {
			this.showStatus("Please paste data first.");
			return;
		}

		if (!confirm("This will replace ALL existing tunes. Continue?")) {
			return;
		}

		try {
			let parsedData;

			// Try JSON first (safer)
			try {
				parsedData = JSON.parse(jsonText);
			} catch (jsonError) {
				// Fall back to JavaScript literal evaluation
				try {
					const evaluateJS = new Function("return (" + jsonText + ")");
					parsedData = evaluateJS();
				} catch (jsError) {
					throw new Error(
						`Failed to parse as JSON or JavaScript literal.\n` +
							`JSON error: ${jsonError.message}\n` +
							`JS error: ${jsError.message}`
					);
				}
			}

			if (!Array.isArray(parsedData)) {
				throw new Error("Data must be an array of tune objects");
			}

			// Process and validate the data
			window.tunesData = parsedData
				.filter((t) => t !== undefined && t !== null)
				.map(processTuneData);

			this.callbacks.sortWithDefaultSort();
			this.callbacks.saveTunesToStorage();
			this.callbacks.populateFilters();
			this.callbacks.applyFilters();

			this.showStatus(
				`Successfully loaded ${window.tunesData.length} tune${
					window.tunesData.length !== 1 ? "s" : ""
				}!`,
				"success"
			);

			this.elements.input.value = "";

			setTimeout(() => {
				this.close();
			}, 2500);
		} catch (error) {
			this.showStatus(`Error loading JSON: ${error.message}`);
		}
	}

	onClose() {
		// Cleanup if needed
	}
}
