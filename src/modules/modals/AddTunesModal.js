import BaseModal from "./BaseModal.js";
import processTuneData from "../../processTuneData.js";

/**
 * Add Tunes Modal
 * Allows importing tunes via ABC notation
 */
export default class AddTunesModal extends BaseModal {
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

  splitAbcTunes(abcText) {
    const tunes = [];
    let currentTune = "";
    const lines = abcText.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.trim().match(/^X:\s*\d+/)) {
        if (currentTune.trim()) {
          tunes.push(currentTune.trim());
        }
        currentTune = line + "\n";
      } else {
        currentTune += line + "\n";
      }
    }

    if (currentTune.trim()) {
      tunes.push(currentTune.trim());
    }

    if (tunes.length === 0 && abcText.trim()) {
      return abcText.split(/\n\s*\n/).filter((t) => t.trim());
    }

    return tunes;
  }

  addTunes() {
    const abcText = this.elements.input.value.trim();

    if (!abcText) {
      this.showStatus("Please paste some ABC notation first.");
      return;
    }

    try {
      const abcTunes = this.splitAbcTunes(abcText);
      let addedCount = 0;

      abcTunes.forEach((abc) => {
        if (abc.trim()) {
          const newTune = {
            abc: abc,
            name: "",
            key: "",
            rhythm: "",
            references: [],
            scores: [],
          };

          const processed = processTuneData(newTune);
          window.tunesData.push(processed);
          addedCount++;
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
