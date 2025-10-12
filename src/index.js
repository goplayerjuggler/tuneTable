"use strict";
import "./styles.css";
import tunesDataRaw from "./tunes.json.js";

import processTuneData from "./processTuneData.js";
import theSessionImport from "./thesession-import.js";
import AbcJs from "abcjs";
import ModalManager from "./modules/modals/ModalManager.js";
import AbcModal from "./modules/modals/AbcModal.js";

const STORAGE_KEY = "tunesData";

const getEmptySort = () => {
  return { column: null, direction: "asc" };
};
let currentSort = getEmptySort();
let modalManager;

function stringifyWithTemplatesLiteral(obj, indent = 2) {
  // Helper to determine if a string is a valid JS identifier
  function isValidIdentifier(str) {
    return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(str);
  }

  // Use a WeakSet to handle circular references
  const seen = new WeakSet();

  function serialize(value, depth) {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) return "[Circular]";
      seen.add(value);

      if (Array.isArray(value)) {
        const arr = value.map((v) => serialize(v, depth + 1));
        return `[\n${" ".repeat((depth + 1) * indent)}${arr.join(
          `,\n${" ".repeat((depth + 1) * indent)}`
        )}\n${" ".repeat(depth * indent)}]`;
      } else {
        const entries = Object.entries(value).map(([k, v]) => {
          const key = isValidIdentifier(k) ? k : JSON.stringify(k);
          return `${key}: ${serialize(v, depth + 1)}`;
        });
        return `{\n${" ".repeat((depth + 1) * indent)}${entries.join(
          `,\n${" ".repeat((depth + 1) * indent)}`
        )}\n${" ".repeat(depth * indent)}}`;
      }
    } else if (typeof value === "string") {
      if (value.includes("\n") || value.includes("\r")) {
        // Use a template literal for multi-line strings
        return "`" + value.replace(/`/g, "\\`") + "`";
      } else {
        return JSON.stringify(value);
      }
    } else {
      return String(value);
    }
  }

  return serialize(obj, 0);
}

// Local Storage Functions
function saveTunesToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tunesData));
    console.log("Saved to local storage");
  } catch (e) {
    console.error("Failed to save to local storage:", e);
  }
}

function loadTunesFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Failed to load from local storage:", e);
  }
  return null;
}

function clearStorage() {
  if (confirm("This will reset all tunes to the original data. Continue?")) {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  }
}

function emptyTunes() {
  if (
    !localStorage.getItem(STORAGE_KEY) ||
    confirm("You may lose some data. This cannot be undone. Continue?")
  ) {
    localStorage.removeItem(STORAGE_KEY);
  }
  window.tunesData = [];
  window.filteredData = [];

  renderTable();
  saveTunesToStorage();
}

function copyTunesToClipboard() {
  window.tunesData.forEach((tune) => {
    if (tune.nameIsFromAbc) {
      delete tune.name;
      delete tune.nameIsFromAbc;
    }
    if (tune.keyIsFromAbc) {
      delete tune.key;
      delete tune.keyIsFromAbc;
    }
    if (tune.rhythmIsFromAbc) {
      delete tune.rhythm;
      delete tune.rhythmIsFromAbc;
    }
    tune.references = tune.references?.filter((r) => !r.fromAbc);

    if (tune.references?.length === 0) delete tune.references;
    if (tune.scores?.length === 0) delete tune.scores;
    if (!tune.abc) delete tune.abc;
  });
  const jsonString = stringifyWithTemplatesLiteral(tunesData, 2);
  navigator.clipboard.writeText(jsonString).then(
    () => {
      const btn = document.getElementById("copyTunesBtn");
      const originalText = btn.textContent;
      btn.textContent = "✓ Copied!";
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    },
    (err) => {
      console.error("Failed to copy:", err);
      alert("Failed to copy to clipboard");
    }
  );
}

// Add New Tune
function addNewTune() {
  const newTune = {
    name: "New Tune",
    key: "",
    rhythm: "",
    abc: null,
    references: [],
    scores: [],
    incipit: null,
  };

  window.tunesData.push(newTune);
  window.filteredData.push(newTune);

  saveTunesToStorage();
  renderTable();

  // Open edit modal for the new tune
  const newIndex = window.filteredData.length - 1;
  modalManager.openEdit(newTune, newIndex);
}

// Delete Tune
function deleteTune(tuneIndex) {
  const tune = window.filteredData[tuneIndex];

  if (!confirm(`Delete tune "${tune.name}"? This cannot be undone.`)) {
    return;
  }

  const originalTuneDataIndex = window.tunesData.findIndex((t) => t === tune);

  if (originalTuneDataIndex !== -1) {
    window.tunesData.splice(originalTuneDataIndex, 1);
  }

  saveTunesToStorage();
  populateFilters();
  applyFilters();
}

function expandNotes(tuneIndex, refIndex) {
  const truncated = document.querySelector(
    `.notes-truncated[data-tune-index="${tuneIndex}"][data-ref-index="${refIndex}"]`
  );
  const full = document.querySelector(
    `.notes-full[data-tune-index="${tuneIndex}"][data-ref-index="${refIndex}"]`
  );

  if (truncated && full) {
    truncated.style.display = "none";
    full.style.display = "block";
  }
}

function collapseNotes(tuneIndex, refIndex) {
  const truncated = document.querySelector(
    `.notes-truncated[data-tune-index="${tuneIndex}"][data-ref-index="${refIndex}"]`
  );
  const full = document.querySelector(
    `.notes-full[data-tune-index="${tuneIndex}"][data-ref-index="${refIndex}"]`
  );

  if (truncated && full) {
    truncated.style.display = "block";
    full.style.display = "none";
  }
}

// function applyDefaultSort() {
//   currentSort = getEmptySort();
//   sortData();
// }

function sortWithDefaultSort() {
  window.tunesData.sort((a, b) =>
    a.rhythm === b.rhythm
      ? a.name === b.name
        ? 0
        : a.name < b.name
        ? -1
        : 1
      : a.rhythm < b.rhythm
      ? -1
      : 1
  );
}

function initialiseData() {
  // Expose global functions
  window.addNewTune = addNewTune;
  // window.applyDefaultSort = applyDefaultSort;
  window.applyFilters = applyFilters;
  window.clearStorage = clearStorage;
  window.collapseNotes = collapseNotes;
  window.copyTunesToClipboard = copyTunesToClipboard;
  window.deleteTune = deleteTune;
  window.emptyTunes = emptyTunes;
  window.expandNotes = expandNotes;
  window.populateFilters = populateFilters;
  window.saveTunesToStorage = saveTunesToStorage;
  window.sortWithDefaultSort = sortWithDefaultSort;

  window.showTheSessionImportModal = theSessionImport.showTheSessionImportModal;
  window.closeTheSessionImportModal =
    theSessionImport.closeTheSessionImportModal;
  window.importFromTheSession = theSessionImport.importFromTheSession;

  // Initialize modal manager with callbacks
  modalManager = new ModalManager({
    saveTunesToStorage,
    populateFilters,
    applyFilters,
    renderTable,
    sortWithDefaultSort,
  });

  // Expose modal functions globally for inline handlers
  modalManager.exposeGlobalFunctions();

  window.tunesData = [];
  window.filteredData = [];
  const storedData = loadTunesFromStorage();

  if (storedData) {
    console.log("Loading from local storage");
    window.tunesData = storedData;
  } else {
    console.log("Loading from tunesDataRaw and processing");
    window.tunesData = tunesDataRaw.tunes
      .filter((t) => t !== undefined)
      .map(processTuneData)
      .sort((a, b) =>
        a.rhythm === b.rhythm
          ? a.name === b.name
            ? 0
            : a.name < b.name
            ? -1
            : 1
          : a.rhythm < b.rhythm
          ? -1
          : 1
      );
  }
  let filtered = false;

  populateFilters();
  let params = new URLSearchParams(new URL(window.location).search.slice(1));
  if (params.has("g")) {
    let g = params.get("g");
    if (g) {
      window.tunesData = window.tunesData.filter((tune) =>
        tune.groups?.toLowerCase().includes(g.toLowerCase())
      );
    }
  }
  if (params.has("q")) {
    let q = params.get("q");
    if (q) {
      document.getElementById("searchInput").value = q;
      applyFilters();
      filtered = true;
    }
  }
  if (params.has("n")) {
    let n = params.get("n");
    if (n) {
      filterByName(n);
    }
    populateFilters();

    // renderTable();
  }
  if (!filtered) {
    applyFilters();
  }
  if (window.filteredData.length === 1 && window.filteredData[0].abc) {
    
    openAbcModal(window.filteredData[0]);
  }
}

function populateFilters() {
  const rhythms = [
    ...new Set(tunesData.map((tune) => tune.rhythm).filter((r) => r)),
  ].sort();
  const keys = [
    ...new Set(tunesData.map((tune) => tune.key).filter((k) => k)),
  ].sort();

  const rhythmFilter = document.getElementById("rhythmFilter");
  const keyFilter = document.getElementById("keyFilter");

  rhythmFilter.innerHTML = '<option value="">All rhythms</option>';
  rhythms.forEach((rhythm) => {
    rhythmFilter.innerHTML += `<option value="${rhythm}">${rhythm}</option>`;
  });

  keyFilter.innerHTML = '<option value="">All keys</option>';
  keys.forEach((key) => {
    keyFilter.innerHTML += `<option value="${key}">${key}</option>`;
  });
}

function openAbcModal(tune) {
  if (!tune.abc) return;

  let abcModal = new AbcModal()
  abcModal.openWithTune(tune)

}


function closeAddTunesModal() {
  const modal = document.getElementById("addTunesModal");
  modal.classList.remove("active");
}

function splitAbcTunes(abcText) {
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

function addTunesFromAbc() {
  const abcInput = document.getElementById("abcInput");
  const statusDiv = document.getElementById("addTunesStatus");
  const abcText = abcInput.value.trim();

  if (!abcText) {
    statusDiv.style.display = "block";
    statusDiv.style.background = "#fee";
    statusDiv.style.color = "#c33";
    statusDiv.textContent = "Please paste some ABC notation first.";
    return;
  }

  try {
    const abcTunes = splitAbcTunes(abcText);
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
      sortWithDefaultSort();

      saveTunesToStorage();
      populateFilters();
      applyFilters();

      statusDiv.style.display = "block";
      statusDiv.style.background = "#efe";
      statusDiv.style.color = "#2a7";
      statusDiv.textContent = `Successfully added ${addedCount} tune${
        addedCount !== 1 ? "s" : ""
      }!`;

      abcInput.value = "";

      setTimeout(() => {
        closeAddTunesModal();
      }, 1500);
    } else {
      statusDiv.style.display = "block";
      statusDiv.style.background = "#fee";
      statusDiv.style.color = "#c33";
      statusDiv.textContent = "No valid tunes found in the ABC notation.";
    }
  } catch (error) {
    statusDiv.style.display = "block";
    statusDiv.style.background = "#fee";
    statusDiv.style.color = "#c33";
    statusDiv.textContent = `Error processing ABC: ${error.message}`;
  }
}

function loadJson() {
  const jsonInput = document.getElementById("jsonInput");
  const statusDiv = document.getElementById("loadJsonStatus");
  const jsonText = jsonInput.value.trim();

  if (!jsonText) {
    statusDiv.style.display = "block";
    statusDiv.style.background = "#fee";
    statusDiv.style.color = "#c33";
    statusDiv.textContent = "Please paste data first.";
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
    sortWithDefaultSort();

    saveTunesToStorage();
    populateFilters();
    applyFilters();

    statusDiv.style.display = "block";
    statusDiv.style.background = "#efe";
    statusDiv.style.color = "#2a7";
    statusDiv.textContent = `Successfully loaded ${tunesData.length} tune${
      window.tunesData.length !== 1 ? "s" : ""
    }!`;

    jsonInput.value = "";

    setTimeout(() => {
      closeLoadJsonModal();
    }, 1500);
  } catch (error) {
    statusDiv.style.display = "block";
    statusDiv.style.background = "#fee";
    statusDiv.style.color = "#c33";
    statusDiv.textContent = `Error loading JSON: ${error.message}`;
  }
}

function toggleView() {
  const abcRendered = document.getElementById("abcRendered");
  const abcText = document.getElementById("abcText");
  const toggleBtn = document.getElementById("toggleViewBtn");

  if (currentViewMode === "rendered") {
    currentViewMode = "text";
    abcRendered.style.display = "none";
    abcText.classList.add("active");
    toggleBtn.textContent = "Show Rendered";
  } else {
    currentViewMode = "rendered";
    abcRendered.style.display = "block";
    abcText.classList.remove("active");
    toggleBtn.textContent = "Show ABC Text";
  }
}

function navigateAbc(direction) {
  currentAbcIndex += direction;
  if (currentAbcIndex < 0) currentAbcIndex = currentAbcArray.length - 1;
  if (currentAbcIndex >= currentAbcArray.length) currentAbcIndex = 0;

  currentTuneAbc = currentAbcArray[currentAbcIndex];
  currentTranspose = 0;
  updateAbcDisplay();
  updateNavigationButtons();
}

function updateNavigationButtons() {
  const prevBtn = document.getElementById("prevAbcBtn");
  const nextBtn = document.getElementById("nextAbcBtn");
  const counter = document.getElementById("abcCounter");

  if (currentAbcArray.length > 1) {
    prevBtn.style.display = "inline-block";
    nextBtn.style.display = "inline-block";
    counter.style.display = "inline-block";
    counter.textContent = `${currentAbcIndex + 1} / ${currentAbcArray.length}`;
  } else {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    counter.style.display = "none";
  }
}

function transposeAbc(semitones) {
  currentTranspose += semitones;
  updateAbcDisplay();
}

function updateAbcDisplay() {
  const abcTextContent = document.getElementById("abcTextContent");
  const abcRendered = document.getElementById("abcRendered");

  let transposedAbc = currentTuneAbc;

  if (currentTranspose !== 0) {
    transposedAbc = transposeAbcNotation(currentTuneAbc, currentTranspose);
  }

  abcTextContent.textContent = transposedAbc;

  abcRendered.innerHTML = "";
  AbcJs.renderAbc("abcRendered", transposedAbc, {
    scale: 1.0,
    staffwidth: 900,
    paddingtop: 10,
    paddingbottom: 10,
    paddingright: 20,
    paddingleft: 20,
    responsive: "resize",
  });
}

function transposeAbcNotation(abc, transposeAmount) {
  var visualObj = AbcJs.renderAbc("*", abc);
  return AbcJs.strTranspose(abc, visualObj, transposeAmount);
}

function renderTable() {
  const tbody = document.getElementById("tunesTableBody");

  if (window.filteredData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="no-results">No tunes found matching your criteria.</td></tr>';
    return;
  }

  tbody.innerHTML = "";

  window.filteredData.forEach((tune, index) => {
    const row = document.createElement("tr");

    let referencesHtml = "";
    tune.references?.forEach((ref, refIndex) => {
      let notesHtml = "";
      if (ref.notes) {
        const formattedNotes = ref.notes
          .replace(/\n/g, "<br />")
          .replace(
            /\[([^\]]+)\]\(([^)]+)\)/g,
            '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
          )
          .replace(/https?:\/\/[^\s<>"']+/g, (url) => {
            try {
              const { hostname, pathname, search } = new URL(url);
              const display = hostname + pathname + search;
              return `<a href="${url}" target="_blank" rel="noopener noreferrer">${display}</a>`;
            } catch {
              // In case URL parsing fails, leave the original
              return url;
            }
          });

        const lines = ref.notes.split("\n");
        if (lines.length > 5) {
          const truncatedLines = lines.slice(0, 5);
          const truncatedNotes = truncatedLines
            .join("\n")
            .replace(/\n/g, "<br />")
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

          notesHtml = `
            <div class="notes notes-truncated" data-tune-index="${index}" data-ref-index="${refIndex}">
              ${truncatedNotes}
              <br /><button class="more-btn" onclick="expandNotes(${index}, ${refIndex})">More...</button>
            </div>
            <div class="notes notes-full" data-tune-index="${index}" data-ref-index="${refIndex}" style="display: none;">
              ${formattedNotes}
              <br /><button class="more-btn" onclick="collapseNotes(${index}, ${refIndex})">Less</button>
            </div>
          `;
        } else {
          notesHtml = `<div class="notes">${formattedNotes}</div>`;
        }
      }

      referencesHtml += `
                        <div class="reference-item">
                            ${
                              ref.artists
                                ? `<div class="artists">${ref.artists}</div>`
                                : ""
                            }
                            ${
                              ref.url
                                ? `<div class="url"><a href="${ref.url}" target="_blank">${ref.url}</a></div>`
                                : ""
                            }
                            ${notesHtml}
                        </div>
                    `;
    });

    const hasAbc = !!tune.abc;
    const tuneNameClass = hasAbc ? "tune-name has-abc" : "tune-name";

    let incipitId = `incipit${index}`;
    let title = `<div class="tune-header">
      ${
        hasAbc
          ? `<a href="#" class="${tuneNameClass}" data-tune-index="${index}" onclick="return false;">
        ${tune.name}
      </a>${
        Array.isArray(tune.abc) && tune.abc.length > 1
          ? ` - ${tune.abc.length} settings`
          : ""
      }`
          : `<div class="${tuneNameClass}" data-tune-index="${index}">
        ${tune.name}
      </div>`
      }
      <div class="tune-actions">
        <button class="btn-icon btn-edit" onclick="openEditModal(window.filteredData[${index}], ${index})" title="Edit tune">
          ✎
        </button>
        <button class="btn-icon btn-danger" onclick="deleteTune(${index})" title="Delete tune">
          🗑
        </button>
      </div>
    </div>`;

    row.innerHTML = `
                    <td>${title}
                    <div id="${incipitId}" class="incipitClass"></div></td>
                    <td><span class="badge">${tune.key}</span></td>
                    <td><span class="badge">${tune.rhythm}</span></td>
                    <td class="references">${referencesHtml}</td>
                    <td class="scores">
                        ${
                          tune.scores && tune.scores.length > 0
                            ? `<a href="${tune.scores[0].url}" target="_blank">${tune.scores[0].name}</a>`
                            : ""
                        }
                    </td>
                `;

    const tuneNameEl = row.querySelector(".tune-name");
    if (hasAbc && tuneNameEl) {
      tuneNameEl.addEventListener("click", () => {
        openAbcModal(tune)
      });
    }

    tbody.appendChild(row);
    if (tune.incipit) {
      AbcJs.renderAbc(incipitId, tune.incipit, {
        scale: 0.8,
        staffwidth: 330,
        paddingtop: 1,
        paddingbottom: 1,
        paddingright: 1,
        paddingleft: 1,
      });
    }
  });
  document.getElementById(
    "spCount"
  ).innerText = `${filteredData.length}/${tunesData.length}`;
}

function applyFilters() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase();
  const rhythmFilter = document.getElementById("rhythmFilter").value;
  const keyFilter = document.getElementById("keyFilter").value;

  window.filteredData = window.tunesData.filter((tune) => {
    const matchesSearch =
      searchTerm === "" ||
      tune.name.toLowerCase().includes(searchTerm) ||
      tune.rhythm.toLowerCase().includes(searchTerm) ||
      tune.key.toLowerCase().includes(searchTerm) ||
      tune.references.some(
        (ref) =>
          ref.artists?.toLowerCase().includes(searchTerm) ||
          ref.notes?.toLowerCase().includes(searchTerm)
      );

    const matchesRhythm = rhythmFilter === "" || tune.rhythm === rhythmFilter;
    const matchesKey = keyFilter === "" || tune.key === keyFilter;

    return matchesSearch && matchesRhythm && matchesKey;
  });

  renderTable();
}

function filterByName(searchTerm) {
  window.filteredData = window.tunesData.filter((tune) =>
    tune.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  renderTable();
}

function sortData(column) {
  if (currentSort.column === column) {
    currentSort.direction = currentSort.direction === "asc" ? "desc" : "asc";
  } else {
    currentSort.column = column;
    currentSort.direction = "asc";
  }

  window.filteredData.sort((a, b) => {
    let aVal = a[column];
    let bVal = b[column];

    if (typeof aVal === "string") {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return currentSort.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return currentSort.direction === "asc" ? 1 : -1;
    return 0;
  });

  document.querySelectorAll("th").forEach((th) => {
    th.classList.remove("sort-asc", "sort-desc");
  });

  const currentTh = document.querySelector(`th[data-column="${column}"]`);
  currentTh?.classList?.add(
    currentSort.direction === "asc" ? "sort-asc" : "sort-desc"
  );

  renderTable();
}

document.addEventListener("DOMContentLoaded", function () {
  initialiseData();

  document
    .getElementById("searchInput")
    .addEventListener("input", applyFilters);
  document
    .getElementById("rhythmFilter")
    .addEventListener("change", applyFilters);
  document.getElementById("keyFilter").addEventListener("change", applyFilters);

  document.querySelectorAll("th.sortable").forEach((th) => {
    th.addEventListener("click", function () {
      sortData(this.dataset.column);
    });
  });

  // Modal button event listeners
  document.getElementById("addTunesBtn").addEventListener("click", (e) => {
    e.preventDefault();
    modalManager.openAddTunes();
  });

  document.getElementById("loadJsonBtn").addEventListener("click", (e) => {
    e.preventDefault();
    modalManager.openLoadJson();
  });

  // Dropdown menu toggle
  const editMenuBtn = document.getElementById("editMenuBtn");
  const dropdown = editMenuBtn.parentElement;

  editMenuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    dropdown.classList.toggle("active");
  });

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove("active");
    }
  });

  // Dropdown menu items
  document.getElementById("addNewTuneBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.remove("active");
    addNewTune();
  });
  document.getElementById("copyTunesBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.remove("active");
    copyTunesToClipboard();
  });
  document.getElementById("clearStorageBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.remove("active");
    clearStorage();
  });
  document.getElementById("emptyTunesBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    dropdown.classList.remove("active");
    emptyTunes();
  });

  document.getElementById("spLastUpdated").innerHTML = tunesDataRaw.lastUpdate;

  theSessionImport.setupTheSessionImportModal();
});
