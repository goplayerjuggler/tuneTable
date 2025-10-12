import BaseModal from "./BaseModal.js";
import processTuneData from "../../processTuneData.js";

/**
 * Load JSON Modal
 * Allows loading complete tune table from JSON/JS format
 */
export default class LoadJsonModal extends BaseModal {
    static getTemplate() {
    return `
    <div id="loadJsonModal" class="modal add-tunes-modal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 style="flex: 1; margin: 0; color: #2c3e50">
            Load Full Tune Table
          </h2>
          <button class="close-btn" id="closeLoadJsonBtn">&times;</button>
        </div>
        <div style="margin-bottom: 20px">
          <p style="color: #666; margin-bottom: 10px">
            Paste an array of tune objects below, in JSON or Javascript format. This will replace all existing tunes.
          </p>
          <textarea
            id="jsonInput"
            placeholder="Paste array here…

Example:
[
  {
    &quot;abc&quot;: &quot;X:1\nT:Example\n…&quot;,
  }
]"
          ></textarea>
        </div>
        <div style="display: flex; gap: 10px; justify-content: flex-end">
          <button id="clearJsonBtn" class="modal-btn secondary">Clear</button>
          <button id="loadJsonDataBtn" class="modal-btn primary">Load data</button>
        </div>
        <div id="loadJsonStatus"></div>
      </div>
    </div>

    `;
  }
  constructor(callbacks) {
    super("loadJsonModal");

    this.callbacks = callbacks;

    this.elements = {
      closeBtn: document.getElementById("closeLoadJsonBtn"),
      input: document.getElementById("jsonInput"),
      clearBtn: document.getElementById("clearJsonBtn"),
      loadBtn: document.getElementById("loadJsonDataBtn"),
      status: document.getElementById("loadJsonStatus"),
    };

    this.setupControls();
  }

  setupControls() {
    this.elements.closeBtn?.addEventListener("click", () => this.close());
    this.elements.clearBtn?.addEventListener("click", () => this.clear());
    this.elements.loadBtn?.addEventListener("click", () => this.loadData());
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
      }, 1500);
    } catch (error) {
      this.showStatus(`Error loading JSON: ${error.message}`);
    }
  }

  onOpen() {
    this.elements.status.style.display = "none";
    this.elements.input.value = "";
  }
}
