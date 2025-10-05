"use strict";
import tunesDataRaw from "./tunes.json.js";
import getIncipit from "./incipits.js";
import AbcJs from "abcjs";

let tunesData = [];
let filteredData = [];
let currentSort = { column: null, direction: "asc" };
let currentViewMode = "rendered";
let currentTranspose = 0;
let currentTuneAbc = "";
let currentAbcArray = [];
let currentAbcIndex = 0;

function parseAbc(abc) {
  const lines = abc.split("\n"),
    metadata = {},
    comments = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("T:") && !metadata.title) {
      metadata.title = trimmed.substring(2).trim();
    } else if (trimmed.startsWith("R:")) {
      metadata.rhythm = trimmed.substring(2).trim();
    } else if (trimmed.startsWith("K:")) {
      metadata.key = trimmed.substring(2).trim();
      break; //K is the last in the header
    } else if (trimmed.startsWith("S:")) {
      metadata.source = trimmed.substring(2).trim();
    } else if (trimmed.startsWith("F:")) {
      metadata.url = trimmed.substring(2).trim();
    } else if (trimmed.startsWith("D:")) {
      metadata.recording = trimmed.substring(2).trim();
    } else if (trimmed.startsWith("N:")) {
      comments.push(trimmed.substring(2).trim());
    }
  }
  if (comments.length > 0) {
    metadata.comments = comments;
  }

  return metadata;
}

function processTuneData(tune) {
  const processed = { ...tune };

  if (tune.abc) {
    const abcArray = Array.isArray(tune.abc) ? tune.abc : [tune.abc];

    abcArray.forEach((abcString, index) => {
      const abcMeta = parseAbc(abcString);

      if (index === 0) {
        if (!processed.name && abcMeta.title) {
          processed.name = abcMeta.title;
        }
        if (!processed.rhythm && abcMeta.rhythm) {
          processed.rhythm = abcMeta.rhythm;
        }
        if (!processed.key && abcMeta.key) {
          processed.key = abcMeta.key;
        }
      }

      if (!processed.references) {
        processed.references = [];
      }

      if (
        abcMeta.source ||
        abcMeta.url ||
        abcMeta.recording ||
        abcMeta.comments
      ) {
        const abcRef = {
          artists: abcMeta.source || "",
          url: abcMeta.url || "",
          notes:
            (abcMeta.recording || "") +
            `${abcMeta.recording ? "\n" : ""}${
              abcMeta.comments ? abcMeta.comments.join("\n") : ""
            }`,
        };

        processed.references.push(abcRef);
      }
    });
    if (!tune.incipit) {
      processed.incipit = getIncipit(abcArray[0]);
    }
    processed.rhythm = processed.rhythm?.toLowerCase();
  }

  if (!processed.name) processed.name = "Untitled";
  if (!processed.key) processed.key = "";
  if (!processed.rhythm) processed.rhythm = "";
  if (!processed.references) processed.references = [];
  if (!processed.scores) processed.scores = [];

  return processed;
}

function initialiseData() {
  tunesData = tunesDataRaw.tunes
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
  filteredData = [...tunesData];
  populateFilters();
  renderTable();
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

  const modal = document.getElementById("abcModal");
  const abcRendered = document.getElementById("abcRendered");
  const abcText = document.getElementById("abcText");

  currentAbcArray = Array.isArray(tune.abc) ? tune.abc : [tune.abc];

  currentAbcIndex = 0;
  currentTuneAbc = currentAbcArray[0];
  currentTranspose = 0;

  updateAbcDisplay();
  updateNavigationButtons();

  currentViewMode = "rendered";
  abcRendered.style.display = "block";
  abcText.classList.remove("active");
  document.getElementById("toggleViewBtn").textContent = "Show ABC Text";

  modal.classList.add("active");
}

function closeAbcModal() {
  const modal = document.getElementById("abcModal");
  modal.classList.remove("active");
  currentTranspose = 0;
  currentAbcIndex = 0;
}

function openAddTunesModal() {
  const modal = document.getElementById("addTunesModal");
  const statusDiv = document.getElementById("addTunesStatus");
  statusDiv.style.display = "none";
  document.getElementById("abcInput").value = "";
  modal.classList.add("active");
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
    tunesData = []; //don't keep existing tunes
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
        tunesData.push(processed);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      tunesData.sort((a, b) =>
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
    responsive: "resize"
  });
}

function transposeAbcNotation(abc, transposeAmount) {
  var visualObj = AbcJs.renderAbc("*", abc);
  return AbcJs.strTranspose(abc, visualObj, transposeAmount);
}

function renderTable() {
  const tbody = document.getElementById("tunesTableBody");

  if (filteredData.length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="no-results">No tunes found matching your criteria.</td></tr>';
    return;
  }

  tbody.innerHTML = "";

  filteredData.forEach((tune, index) => {
    const row = document.createElement("tr");

    let referencesHtml = "";
    tune.references.forEach((ref, refIndex) => {
      let notesHtml = "";
      if (ref.notes) {
        const formattedNotes = ref.notes
          .replace(/\n/g, "<br />")
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

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
    let title = hasAbc
      ? `<div> <a href="#" class="${tuneNameClass}" data-tune-index="${index}" onclick="return false;">
            ${tune.name}
        </a></div>`
      : `<div class="${tuneNameClass}" data-tune-index="${index}">
            ${tune.name}
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
    if (hasAbc) {
      tuneNameEl.addEventListener("click", () => {
        openAbcModal(tune);
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

  filteredData = tunesData.filter((tune) => {
    const matchesSearch =
      searchTerm === "" ||
      tune.name.toLowerCase().includes(searchTerm) ||
      tune.rhythm.toLowerCase().includes(searchTerm) ||
      tune.key.toLowerCase().includes(searchTerm) ||
      tune.references.some(
        (ref) =>
          ref.artists?.toLowerCase().includes(searchTerm) ||
          ref.notes.toLowerCase().includes(searchTerm)
      );

    const matchesRhythm = rhythmFilter === "" || tune.rhythm === rhythmFilter;
    const matchesKey = keyFilter === "" || tune.key === keyFilter;

    return matchesSearch && matchesRhythm && matchesKey;
  });

  renderTable();
}

function filterByName(searchTerm) {
  filteredData = tunesData.filter((tune) =>
    tune.name.toLowerCase().includes(searchTerm.toLowerCase())
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

  filteredData.sort((a, b) => {
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
  currentTh.classList.add(
    currentSort.direction === "asc" ? "sort-asc" : "sort-desc"
  );

  renderTable();
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

window.expandNotes = expandNotes;
window.collapseNotes = collapseNotes;

document.addEventListener("DOMContentLoaded", function () {
  initialiseData();

  let params = new URLSearchParams(new URL(window.location).search.slice(1));
  if (params.has("q")) {
    let q = params.get("q");
    if (q) {
      document.getElementById("searchInput").value = q;
      applyFilters();
    }
  }
  if (params.has("n")) {
    let n = params.get("n");
    if (n) {
      filterByName(n);
    }
  }
  if (filteredData.length === 1 && filteredData[0].abc) {
    openAbcModal(filteredData[0]);
  }

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

  document
    .getElementById("closeModalBtn")
    .addEventListener("click", closeAbcModal);
  document
    .getElementById("toggleViewBtn")
    .addEventListener("click", toggleView);

  document
    .getElementById("addTunesBtn")
    .addEventListener("click", openAddTunesModal);
  document
    .getElementById("closeAddTunesBtn")
    .addEventListener("click", closeAddTunesModal);
  document
    .getElementById("addAbcBtn")
    .addEventListener("click", addTunesFromAbc);
  document.getElementById("clearAbcBtn").addEventListener("click", () => {
    document.getElementById("abcInput").value = "";
    document.getElementById("addTunesStatus").style.display = "none";
  });

  document.getElementById("spLastUpdated").innerHTML = tunesDataRaw.lastUpdate;

  document
    .getElementById("transposeUpBtn")
    .addEventListener("click", () => transposeAbc(1));
  document
    .getElementById("transposeDownBtn")
    .addEventListener("click", () => transposeAbc(-1));

  document
    .getElementById("prevAbcBtn")
    .addEventListener("click", () => navigateAbc(-1));
  document
    .getElementById("nextAbcBtn")
    .addEventListener("click", () => navigateAbc(1));

  document.getElementById("abcModal").addEventListener("click", function (e) {
    if (e.target === this) {
      closeAbcModal();
    }
  });

  document
    .getElementById("addTunesModal")
    .addEventListener("click", function (e) {
      if (e.target === this) {
        closeAddTunesModal();
      }
    });

  document.addEventListener("keydown", function (e) {
    const addTunesModal = document.getElementById("addTunesModal");
    const abcModal = document.getElementById("abcModal");

    if (e.key === "Escape") {
      if (addTunesModal.classList.contains("active")) {
        closeAddTunesModal();
      } else if (abcModal.classList.contains("active")) {
        closeAbcModal();
      }
    } else if (abcModal.classList.contains("active")) {
      if (e.key === "ArrowLeft") {
        navigateAbc(-1);
      } else if (e.key === "ArrowRight") {
        navigateAbc(1);
      }
    }
  });
});
