"use strict";
import "./styles.css";
import tunesDataRaw from "./tunes.json.js";
import {
	normaliseKey,
	compare,
	getContourFromFullAbc,
	//contourToSvg,
} from "@goplayerjuggler/abc-tools";

import processTuneData from "./processTuneData.js";
// import theSessionImport from "./thesession-import.js";
import AbcJs from "abcjs";
import AbcModal from "./modules/modals/AbcModal.js";
import EditModal from "./modules/modals/EditModal.js";
import AddTunesModal from "./modules/modals/AddTunesModal.js";
import LoadJsonModal from "./modules/modals/LoadJsonModal.js";

import TheSessionImportModal from "./modules/modals/TheSessionImportModal.js";
import { eventBus } from "./modules/events/EventBus.js";
import javascriptify from "@goplayerjuggler/abc-tools/src/javascriptify.js";

const STORAGE_KEY = "tunesData";

const getEmptySort = () => {
	return { column: null, direction: "asc" };
};
let currentSort = getEmptySort();
let editModal, addTunesModal, loadJsonModal;

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
		["name", "key", "rhythm", "meter"].forEach((prop) => {
			if (tune[`${prop}IsFromAbc`]) {
				delete tune[prop];
				delete tune[`${prop}IsFromAbc`];
			}
		});
		tune.references = tune.references?.filter((r) => !r.fromAbc);

		if (tune.abc) {
			//delete data that's derived from the abc in 99% of cases
			delete tune.contour;
			delete tune.incipit;
		}
	});
	const result = javascriptify(tunesData);
	navigator.clipboard.writeText(result).then(
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
		},
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
	editModal.openWithTune(newTune, newIndex);
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
		`.notes-truncated[data-tune-index="${tuneIndex}"][data-ref-index="${refIndex}"]`,
	);
	const full = document.querySelector(
		`.notes-full[data-tune-index="${tuneIndex}"][data-ref-index="${refIndex}"]`,
	);

	if (truncated && full) {
		truncated.style.display = "none";
		full.style.display = "block";
	}
}

function collapseNotes(tuneIndex, refIndex) {
	const truncated = document.querySelector(
		`.notes-truncated[data-tune-index="${tuneIndex}"][data-ref-index="${refIndex}"]`,
	);
	const full = document.querySelector(
		`.notes-full[data-tune-index="${tuneIndex}"][data-ref-index="${refIndex}"]`,
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

function canBeCompared(tune1, tune2) {
	//todo: use a Tune class and expose abcOrIncipit
	if ((!tune1.abc && !tune1.incipit) || (!tune2.abc && !tune2.incipit))
		return false;
	try {
		if (!tune1.contour) {
			tune1.contour = getContourFromFullAbc(tune1.abc || tune1.incipit);
		}
		if (!tune2.contour) {
			tune2.contour = getContourFromFullAbc(tune2.abc || tune2.incipit);
		}
	} catch (error) {
		console.log(error);
	}
	if (!tune1.contour || !tune2.contour) return false;
	// return true;
	//can compare all the different reels
	if (
		tune1.rhythm?.indexOf("reel") >= 0 &&
		tune2.rhythm?.indexOf("reel") >= 0
	) {
		return true;
	}

	// but not hop jigs with different meters
	if (
		tune1.rhythm?.indexOf("hope jig") >= 0 &&
		tune2.rhythm?.indexOf("hope jig") >= 0 &&
		tune1.meter !== tune2.meter
	) {
		return false;
	}
	const comparable = [
		["jig", "slide"],
		["hornpipe", "barndance"],
	];
	comparable.forEach((list) => {
		if (list.indexOf(tune1.rhythm) >= 0 && list.indexOf(tune2.rhythm) >= 0) {
			return true;
		}
	});

	return tune1.rhythm?.toLowerCase() === tune2.rhythm.toLowerCase();
}

function sortWithDefaultSort() {
	// debugger;
	window.tunesData.sort(
		(a, b) =>
			// a.rhythm === b.rhythm
			//   ? a.name === b.name
			//     ? 0
			//     : a.name < b.name
			//     ? -1
			//     : 1
			{
				const comparison = canBeCompared(a, b)
					? compare(a.contour, b.contour)
					: a.contour && !b.contour
						? -1
						: b.contour && !a.contour
							? 1
							: a.rhythm !== b.rhythm
								? a.rhythm < b.rhythm
									? -1
									: 1
								: a.name !== b.name
									? a.name < b.name
										? -1
										: 1
									: 0;
				return comparison;
			},

		// a.rhythm !== b.rhythm
		// 	? a.rhythm < b.rhythm
		// 		? -1
		// 		: 1
		// 	: compare(a.contour, b.contour)
	);
}

function openSessionImport() {
	const modal = new TheSessionImportModal(window.tunesData);
	modal.open();
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

	//window.showTheSessionImportModal = theSessionImport.showTheSessionImportModal;
	// window.closeTheSessionImportModal =
	//   theSessionImport.closeTheSessionImportModal;
	// window.importFromTheSession = theSessionImport.importFromTheSession;

	eventBus.on("tuneImported", (tuneData) => {
		tunesData.push(tuneData);
		saveTunesToStorage();
	});
	eventBus.on("refreshTable", () => {
		sortWithDefaultSort();
		populateFilters();
		applyFilters();
	});

	// Initialise modals with callbacks
	let callbacks = {
		saveTunesToStorage,
		populateFilters,
		applyFilters,
		renderTable,
		sortWithDefaultSort,
	};

	editModal = new EditModal(callbacks);
	addTunesModal = new AddTunesModal(callbacks);
	loadJsonModal = new LoadJsonModal(callbacks);

	window.tunesData = [];
	window.filteredData = [];
	const storedData = loadTunesFromStorage();

	//! todo - revise - no need to sort when loading from local storage(?)
	if (storedData) {
		console.log("Loading from local storage");
		window.tunesData = storedData;
	} else {
		console.log("Loading from tunesDataRaw and processing");
		window.tunesData = tunesDataRaw.tunes
			.filter((t) => t !== undefined)
			.map(processTuneData); //aaa
		sortWithDefaultSort();
	}
	let filtered = false;

	populateFilters();
	let params = new URLSearchParams(new URL(window.location).search.slice(1));
	if (params.has("g")) {
		let g = params.get("g");
		if (g) {
			window.tunesData = window.tunesData.filter((tune) =>
				tune.groups?.toLowerCase().includes(g.toLowerCase()),
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
		...new Set(
			tunesData.map((tune) => tune.rhythm?.toLowerCase()).filter((r) => r),
		),
	].sort();
	const keys = [
		...new Set(
			tunesData
				.map((tune) => tune.key)
				.filter((k) => k)
				.map((k) => normaliseKey(k).join(" ")),
		),
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

	let abcModal = new AbcModal();
	abcModal.openWithTune(tune);
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
						'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
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
					})
					.replace(/```([^`]+)```/g, "<pre>$1</pre>");

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
		// debugger;
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
        <button class="btn-icon btn-edit" title="Edit tune">
          ✎
        </button>
        <button class="btn-icon btn-danger" onclick="deleteTune(${index})" title="Delete tune">
          🗑
        </button>
      </div>
    </div>`;

		row.innerHTML = `
    <td>
        <div class="tune-header">
            <div class="tune-title">${title}</div>
            ${tune.contour?.svg ? `<div class="tune-contour">${tune.contour.svg}</div>` : ""}
        </div>
        <div id="${incipitId}" class="incipitClass"></div>
    </td>
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
		const editButtonEl = row.querySelector(".btn-edit");
		editButtonEl.addEventListener("click", () => {
			editModal.openWithTune(window.filteredData[index], index);
		});

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
	document.getElementById("spCount").innerText =
		`${filteredData.length}/${tunesData.length}`;
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
					ref.notes?.toLowerCase().includes(searchTerm),
			);

		const matchesRhythm = rhythmFilter === "" || tune.rhythm === rhythmFilter;
		const matchesKey = keyFilter === "" || tune.key === keyFilter;

		return matchesSearch && matchesRhythm && matchesKey;
	});

	renderTable();
}

function filterByName(searchTerm) {
	window.filteredData = window.tunesData.filter((tune) =>
		tune.name?.toLowerCase().includes(searchTerm.toLowerCase()),
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
		currentSort.direction === "asc" ? "sort-asc" : "sort-desc",
	);

	renderTable();
}

document.addEventListener("DOMContentLoaded", function () {
	// debugger;
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
		addTunesModal.open();
	});

	document.getElementById("loadJsonBtn").addEventListener("click", (e) => {
		e.preventDefault();
		loadJsonModal.open();
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

	// theSessionImport.setupTheSessionImportModal();
	document
		.getElementById("thesession-import-btn")
		.addEventListener("click", openSessionImport);
});
