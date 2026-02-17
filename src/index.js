"use strict";
import "./styles.css";
import tunesDataRaw from "./tunes.json.js";
import { normaliseKey, sort as contourSort } from "@goplayerjuggler/abc-tools";

import { processTuneData } from "./processTuneData.js";
// import theSessionImport from "./thesession-import.js";
import AbcJs from "abcjs";
import AbcModal from "./modules/modals/AbcModal.js";
import EditModal from "./modules/modals/EditModal.js";
import AddTunesModal from "./modules/modals/AddTunesModal.js";
import LoadJsonModal from "./modules/modals/LoadJsonModal.js";

import TheSessionImportModal from "./modules/modals/TheSessionImportModal.js";
import { eventBus } from "./modules/events/EventBus.js";
import javascriptify from "@goplayerjuggler/abc-tools/src/javascriptify.js";

const storageKey = "tunesData";

const getEmptySort = () => {
	return { column: null, direction: "asc" };
};
let currentSort = getEmptySort();
let editModal, getAbcModal, addTunesModal, loadJsonModal;

// Local Storage Functions
function saveTunesToStorage() {
	try {
		localStorage.setItem(storageKey, JSON.stringify(window.tunesData));
		console.log("Saved to local storage");
	} catch (e) {
		console.error("Failed to save to local storage:", e);
	}
}

function loadTunesFromStorage() {
	try {
		const stored = localStorage.getItem(storageKey);
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
		localStorage.removeItem(storageKey);
		location.reload();
	}
}

function emptyTunes() {
	if (
		!localStorage.getItem(storageKey) ||
		confirm("You may lose some data. This cannot be undone. Continue?")
	) {
		localStorage.removeItem(storageKey);
	}
	window.tunesData = [];
	window.filteredData = [];

	renderTable();
	saveTunesToStorage();
}

function prepareTunesForExport(tunes) {
	// deep copy so the original data is never mutated.
	const tunesCopy = JSON.parse(JSON.stringify(tunes));
	tunesCopy.forEach((tune) => {
		["name", "key", "rhythm", "meter", "composer", "origin", "titles"].forEach(
			(prop) => {
				if (tune[`${prop}IsFromAbc`]) {
					delete tune[prop];
					delete tune[`${prop}IsFromAbc`];
				}
			}
		);
		tune.references = tune.references?.filter((r) => !r.fromAbc);
		delete tune.selected;
		if (tune.abc) {
			//delete data that's derived from the abc in 99% of cases
			delete tune.incipit;
		}
		delete tune.contour;
	});
	return tunesCopy;
}

function copyTuneDataToClipboard(tunes, button) {
	const result = javascriptify(prepareTunesForExport(tunes));
	navigator.clipboard.writeText(result).then(
		() => {
			const originalText = button.textContent;
			button.textContent = "✓ Copied!";
			setTimeout(() => {
				button.textContent = originalText;
			}, 2000);
		},
		(err) => {
			console.error("Failed to copy:", err);
			alert("Failed to copy to clipboard");
		}
	);
}

function copyTunesToClipboard() {
	copyTuneDataToClipboard(
		window.tunesData,
		document.getElementById("copyTunesBtn")
	);
}

/**
 * Copy a single tune's data to clipboard as a JavaScript literal.
 * @param {number} tuneIndex - Index of the tune in filteredData
 */
function copySingleTune(tuneIndex) {
	const tune = window.filteredData[tuneIndex];
	const button = document.querySelector(
		`.btn-copy[data-tune-index="${tuneIndex}"]`
	);
	copyTuneDataToClipboard([tune], button);
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
		incipit: null
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

function toggleTuneSelected(tuneIndex, row) {
	const tune = window.filteredData[tuneIndex];
	tune.selected = !tune.selected;
	row.classList.toggle("tune-selected", tune.selected);
	const btn = row.querySelector(".btn-select");
	btn.textContent = tune.selected ? "☑" : "☐";
	btn.classList.toggle("btn-select--checked", tune.selected);
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

// Extract all metadata values from a tune for display and filtering.
// Returns an array of metadata strings including rhythm, parts, key, composer(s), origin, and badges.
function getTuneMetadata(tune) {
	const badges = tune.badges
		? Array.isArray(tune.badges)
			? tune.badges
			: [tune.badges]
		: [];
	const origin = tune.origin
		? tune.origin.match(/([^;.]+)/g).map((o) => o.trim())
		: [];

	const composer = tune.composer ? tune.composer.split("; ") : [];

	return [
		tune.rhythm,
		tune.parts,
		tune.key,
		...composer,
		...origin,
		...badges
	].filter((m) => m);
}

function sortWithDefaultSort() {
	contourSort(window.tunesData);
	window.tunesData.forEach((t) => delete t.baseRhythm); //todo: could handle baseRhythm in processTuneData instead
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
	window.copySingleTune = copySingleTune;
	window.deleteTune = deleteTune;
	window.toggleTuneSelected = toggleTuneSelected;
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
		window.tunesData.push(tuneData);
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
		sortWithDefaultSort
	};

	editModal = new EditModal(callbacks);
	getAbcModal = () => new AbcModal(callbacks);
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
			filtered = true;
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
			window.tunesData
				.map((tune) => tune.rhythm?.toLowerCase())
				.filter((r) => r)
		)
	].sort();
	const keys = [
		...new Set(
			window.tunesData
				.map((tune) => tune.key)
				.filter((k) => k)
				.map((k) => normaliseKey(k).join(" "))
		)
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

	getAbcModal().openWithTune(tune);
}

function renderTable() {
	const tbody = document.getElementById("tunesTableBody");

	if (window.filteredData.length === 0) {
		tbody.innerHTML =
			'<tr><td colspan="2" class="no-results">No tunes found matching your criteria.</td></tr>';
		return;
	}

	tbody.innerHTML = "";

	window.filteredData.forEach((tune, index) => {
		const row = document.createElement("tr");
		if (tune.selected) row.classList.add("tune-selected");

		let referencesHtml = "",
			hasTheSessionLink = false;
		tune.references?.forEach((ref, refIndex) => {
			let notesHtml = "";
			if (ref.notes) {
				const formattedNotes = ref.notes
					.replace(/\n/g, "<br />")
					.replace(
						/\[([^\]]+)\]\(([^)]+)\)/g, // markdown [label](url) syntax
						'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
					)
					.replace(
						/(?<!")https?:\/\/[^\s<>"']+/g, //only match URLs not preceded by `"` so as to avoid handling the ones we did previously for markdown syntax
						(url) => {
							try {
								const { hostname, pathname, search } = new URL(url);
								if (
									!hasTheSessionLink &&
									hostname === "thesession.org" &&
									pathname &&
									pathname.match(/\/tunes\/\d+/)
								)
									hasTheSessionLink = true;
								const display = hostname + pathname + search;
								return `<a href="${url}" target="_blank" rel="noopener noreferrer">${display}</a>`;
							} catch {
								// In case URL parsing fails, leave the original
								return url;
							}
						}
					)
					.replace(/```([^`]+)```/g, "<pre>$1</pre>");

				const lines = ref.notes.split("\n");
				if (lines.length > 12) {
					const truncatedLines = lines.slice(0, 5);
					const truncatedNotes = truncatedLines
						.join("\n")
						.replace(/\n/g, "<br />")
						.replace(
							/\[([^\]]+)\]\(([^)]+)\)/g, // markdown [label](url) syntax
							'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
						);

					notesHtml = `
				    <div class="notes notes-truncated" data-tune-index="${index}" data-ref-index="${refIndex}">
				      ${truncatedNotes}
				      <br /><button class="more-btn" onclick="expandNotes(${index}, ${refIndex})">More…</button>
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
			const domain = ref.url
				? ref.url.match(/^(?:https?:\/\/)?(?:www\.)?([^/]+)/)[1]
				: "";
			const refHeader =
				ref.artists && ref.url
					? `<div class="url">${ref.artists} <a href="${ref.url}" target="_blank">${domain}</a></div>`
					: ref.artists
						? `<div class="artists">${ref.artists}</div>`
						: ref.url
							? `<div class="url"><a href="${ref.url}" target="_blank">${domain}</a></div>` //extract the domain for display so as not to waste space on the full url
							: "";
			referencesHtml += `
                        <div class="reference-item">
                            ${refHeader}
                            ${notesHtml}
                        </div>
                    `;
		});

		const metadata = getTuneMetadata(tune)
			.map((m) => `<span class="badge">${m}</span>`)
			.join(" ");

		const aka = tune.aka ? tune.aka.join(", ") : "",
			tooltip =
				aka || tune.titles
					? ` title="${tune.titles ? tune.titles.join(", ") + (aka && tune.titles ? "; " : "") : ""}${aka ? `AKA: ${aka}` : ""}"`
					: "";

		const hasAbc = !!tune.abc;
		const tuneNameClass = hasAbc ? "tune-name has-abc" : "tune-name";

		const incipitId = `incipit${index}`;
		const title = `<div class="tune-header">
      ${
				hasAbc
					? `<a href="#" class="${tuneNameClass}" data-tune-index="${index}" onclick="return false;" ${tooltip}>
        ${tune.name}
      </a>${
				Array.isArray(tune.abc) && tune.abc.length > 1
					? ` - ${tune.abc.length} settings`
					: ""
			}`
					: `<div class="${tuneNameClass}" data-tune-index="${index}" ${tooltip}>
        ${tune.name}
      </div>`
			}`;

		const scores = [...tune.scores];
		if (tune.theSessionId && !hasTheSessionLink) {
			const setting = tune.theSessionSettingId
				? `#setting${tune.theSessionSettingId}`
				: "";

			scores.push({
				url: `https://thesession.org/tunes/${tune.theSessionId}${setting}`,
				name: "thesession"
			});
		}
		if (tune.norbeckId) {
			scores.push({
				url: `https://www.norbeck.nu/abc/display.asp?rhythm=${tune.norbeckR ?? tune.rhythm.replace(" ", "+")}&ref=${tune.norbeckId}`,
				name: "norbeck"
			});
		}
		if (tune.itiId) {
			scores.push({
				url: `https://www.irishtune.info/tune/${tune.norbeckId}/`,
				name: "irishtune.info"
			});
		}

		row.innerHTML = `
    <td>
        <div class="tune-header">
            <div class="tune-title">${title}</div>
			<div class="notes">${metadata}</div>
			</div>
			<div>
			
        <div class="tune-header tune-header--actions">
		${tune.contour?.svg ? `<div class="tune-contour">${tune.contour.svg}</div>` : ""}
			<div class="tune-actions">
			<button class="btn-icon btn-select${tune.selected ? " btn-select--checked" : ""}" title="Select tune">
				${tune.selected ? "☑" : "☐"}
			</button>
			<button class="btn-icon btn-edit" title="Edit tune">
				✎
			</button>
			<button class="btn-icon btn-copy" data-tune-index="${index}" title="Copy tune data">
				📋
			</button>
			<button class="btn-icon btn-danger" onclick="deleteTune(${index})" title="Delete tune">
				🗑
			</button>
			</div>
		</div>
        <div id="${incipitId}" class="tune-incipit"></div>
		</div>
    </div>
    </td>
	<td class="notes">${referencesHtml}${
		scores && scores.length > 0
			? `${scores
					.map((s) => `<a href="${s.url}" target="_blank">${s.name}</a>`)
					.join(", ")}`
			: ""
	}</td>`;

		const tuneNameEl = row.querySelector(".tune-name");
		if (hasAbc) {
			tuneNameEl.addEventListener("click", () => {
				openAbcModal(window.filteredData[index], index);
			});
		}
		row.querySelector(".btn-select").addEventListener("click", () => {
			toggleTuneSelected(index, row);
		});

		const editButtonEl = row.querySelector(".btn-edit");
		editButtonEl.addEventListener("click", () => {
			editModal.openWithTune(window.filteredData[index], index);
		});

		const copyButtonEl = row.querySelector(".btn-copy");
		copyButtonEl.addEventListener("click", () => {
			copySingleTune(index);
		});

		tbody.appendChild(row);
		if (tune.incipit) {
			AbcJs.renderAbc(incipitId, tune.incipit, {
				scale: 0.8,
				staffwidth: 330,
				paddingtop: 1,
				paddingbottom: 1,
				paddingright: 1,
				paddingleft: 1
			});
		}
	});
	document.getElementById("spCount").innerText =
		`${window.filteredData.length}/${window.tunesData.length}`;
}

function applyFilters() {
	const searchTerm = document.getElementById("searchInput").value.toLowerCase();
	const rhythmFilter = document.getElementById("rhythmFilter").value;
	const keyFilter = document.getElementById("keyFilter").value;

	window.filteredData = window.tunesData.filter((tune) => {
		if (searchTerm === "") {
			// No search term, skip all search checks
			const matchesRhythm = rhythmFilter === "" || tune.rhythm === rhythmFilter;
			const matchesKey = keyFilter === "" || tune.key === keyFilter;
			return matchesRhythm && matchesKey;
		}

		// Search in tune name
		if (tune.name?.toLowerCase().includes(searchTerm)) {
			const matchesRhythm = rhythmFilter === "" || tune.rhythm === rhythmFilter;
			const matchesKey = keyFilter === "" || tune.key === keyFilter;
			return matchesRhythm && matchesKey;
		}

		// Search in aka (alternate names)
		if (tune.aka?.some((aka) => aka.toLowerCase().includes(searchTerm))) {
			const matchesRhythm = rhythmFilter === "" || tune.rhythm === rhythmFilter;
			const matchesKey = keyFilter === "" || tune.key === keyFilter;
			return matchesRhythm && matchesKey;
		}

		// Search in metadata (rhythm, parts, key, composer, origin, badges)
		const metadata = getTuneMetadata(tune);
		if (metadata.some((m) => m.toLowerCase().includes(searchTerm))) {
			const matchesRhythm = rhythmFilter === "" || tune.rhythm === rhythmFilter;
			const matchesKey = keyFilter === "" || tune.key === keyFilter;
			return matchesRhythm && matchesKey;
		}

		// Search in references (artists and notes)
		if (
			tune.references?.some(
				(ref) =>
					ref.artists?.toLowerCase().includes(searchTerm) ||
					ref.notes?.toLowerCase().includes(searchTerm)
			)
		) {
			const matchesRhythm = rhythmFilter === "" || tune.rhythm === rhythmFilter;
			const matchesKey = keyFilter === "" || tune.key === keyFilter;
			return matchesRhythm && matchesKey;
		}

		// Search in ABC content
		if (tune.abc) {
			const abcContent = Array.isArray(tune.abc)
				? tune.abc.join(" ")
				: tune.abc;
			if (abcContent.toLowerCase().includes(searchTerm)) {
				const matchesRhythm =
					rhythmFilter === "" || tune.rhythm === rhythmFilter;
				const matchesKey = keyFilter === "" || tune.key === keyFilter;
				return matchesRhythm && matchesKey;
			}
		}

		return false;
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
		currentSort.direction =
			currentSort.direction === "asc"
				? "desc"
				: currentSort.direction === "desc"
					? "default"
					: "asc";
	} else {
		currentSort.column = column;
		currentSort.direction = "asc";
	}

	if (currentSort.direction === "default") {
		contourSort(window.filteredData);

		document.querySelectorAll("th").forEach((th) => {
			th.classList.remove("sort-asc", "sort-desc");
		});
		applyFilters();
		return;
	}

	const collator = new Intl.Collator("en", { sensitivity: "base" }),
		compare = (a, b) => {
			if (typeof a === "string" && typeof b === "string") {
				return (
					(currentSort.direction === "asc" ? -1 : 1) * collator.compare(a, b)
				);
			}
			if (a < b) return currentSort.direction === "asc" ? -1 : 1;
			if (a > b) return currentSort.direction === "asc" ? 1 : -1;
			return 0;
		};
	window.filteredData.sort((a, b) => compare(a[column], b[column]));

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
	// debugger;
	initialiseData();

	// document
	// 	.getElementById("searchInput")
	// 	.addEventListener("input", applyFilters);
	document.getElementById("searchForm").addEventListener("submit", (e) => {
		e.preventDefault();
		applyFilters();
	});
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
