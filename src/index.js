"use strict";
import "./styles.css";
import { normaliseKey, sort as contourSort } from "@goplayerjuggler/abc-tools";

import { processTuneData } from "./processTuneData.js";
// import theSessionImport from "./thesession-import.js";
import AbcJs from "abcjs";
import AbcModal from "./modules/modals/AbcModal.js";
import EditModal from "./modules/modals/EditModal.js";
import AddTunesModal from "./modules/modals/AddTunesModal.js";
import LoadJsonModal from "./modules/modals/LoadJsonModal.js";
import TuneListSelectorModal from "./modules/modals/TuneListSelectorModal.js";
import TuneListSlotManager from "./modules/TuneListSlotManager.js";

import TheSessionImportModal from "./modules/modals/TheSessionImportModal.js";
import TuneSelectionsModal from "./modules/modals/TuneSelectionsModal.js";
import TheSessionSetsImportModal from "./modules/modals/TheSessionSetsImportModal.js";
import { eventBus } from "./modules/events/EventBus.js";
import javascriptify from "@goplayerjuggler/abc-tools/src/javascriptify.js";

// Legacy key kept for one-time cleanup only
const storageKey = "tunesData";
const CURRENT_LIST_KEY = "currentTuneList";

const getEmptySort = () => {
	return { column: null, direction: "asc" };
};
let currentSort = getEmptySort();
let editModal,
	getAbcModal,
	addTunesModal,
	loadJsonModal,
	tuneListSelectorModal,
	tuneSelectionsModal,
	tsSetImportModal;

let slotManager;
let currentListState = null;
let isDirty = false;
let pendingUrlParams = null;
let _manifestCache = null;

// -- Storage ------------------------------------------------------------------

function saveTunesToStorage() {
	if (currentListState?.source === "local") {
		try {
			slotManager.saveSlot(
				currentListState.sourceId,
				currentListState.displayName,
				prepareTunesForExport(window.tunesData), // strip derived properties,
				window._setLists ?? []
			);
		} catch (e) {
			console.error("Failed to save slot:", e);
		}
	} else {
		isDirty = true;
	}
	updateFooter();
}

/** Save set lists to local storage without re-saving tunes. Called by TuneSelectionsModal. */
function saveSetListsToStorage(setLists) {
	window._setLists = setLists;
	saveTunesToStorage();
}

async function fetchManifest() {
	if (_manifestCache) return _manifestCache;
	try {
		const res = await fetch("./tune-lists/manifest.json");
		if (!res.ok) return null;
		_manifestCache = await res.json();
		return _manifestCache;
	} catch {
		return null;
	}
}

function readCurrentListState() {
	try {
		const stored = localStorage.getItem(CURRENT_LIST_KEY);
		return stored ? JSON.parse(stored) : null;
	} catch {
		return null;
	}
}

// -- List loading -------------------------------------------------------------

async function onListSelected({
	source,
	sourceId,
	displayName,
	tunes,
	setLists,
	lastUpdate
}) {
	// Server/external tunes are raw; local tunes are already processed.
	window.tunesData = window.tunesData = (tunes ?? [])
		.filter(Boolean)
		.map(processTuneData);

	window._setLists = setLists ?? [];
	tuneSelectionsModal.loadSetLists(window._setLists);

	currentListState = {
		source,
		sourceId,
		displayName,
		//loadedAt: new Date().toISOString(),
		lastUpdate
	};
	localStorage.setItem(CURRENT_LIST_KEY, JSON.stringify(currentListState));

	if (source === "local") slotManager.touchSlot(sourceId);

	isDirty = false;

	sortWithDefaultSort();
	populateFilters();

	if (pendingUrlParams) {
		applyUrlFilters(pendingUrlParams);
		pendingUrlParams = null;
	} else {
		applyFilters();
	}

	updateFooter();
}

async function loadServerListById(listId, listFile, displayName, lastUpdate) {
	const res = await fetch(`./tune-lists/${listFile}`);
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const { tunes, setLists } = await res.json();
	await onListSelected({
		source: "server",
		sourceId: listId,
		displayName,
		tunes,
		setLists,
		lastUpdate
	});
}

async function resumeCurrentList(listState, manifest) {
	if (listState.source === "local") {
		const slot = slotManager.getSlot(listState.sourceId);
		if (!slot) throw new Error("Slot not found");
		await onListSelected({
			source: "local",
			sourceId: listState.sourceId,
			displayName: slot.name,
			tunes: slot.tunes ?? [],
			setLists: slot.setLists ?? []
		});
	} else if (listState.source === "server") {
		const listInfo = manifest?.lists.find((l) => l.id === listState.sourceId);
		if (!listInfo) throw new Error("Server list not found in manifest");
		await loadServerListById(
			listState.sourceId,
			listInfo.file,
			listInfo.name,
			listInfo.lastUpdate
		);
	} else {
		throw new Error(`Unsupported source: ${listState.source}`);
	}
}

function applyUrlFilters(params) {
	let filtered = false;
	if (params.has("q")) {
		const q = params.get("q");
		if (q) {
			document.getElementById("searchInput").value = q;
			applyFilters();
			filtered = true;
		}
	}
	if (params.has("n")) {
		const n = params.get("n");
		if (n) {
			filterByName(n);
			populateFilters();
			filtered = true;
		}
	}
	if (!filtered) applyFilters();
}

// -- Footer -------------------------------------------------------------------

const relativeTime = (iso) => {
	if (!iso) return "unknown";
	const diff = Date.now() - new Date(iso).getTime();
	const mins = Math.floor(diff / 60000);
	// if (mins < 1) return "just now";
	// if (mins < 60) return `${mins}m ago`;
	const hrs = Math.floor(mins / 60);
	// if (hrs < 24) return `${hrs}h ago`;
	return `${Math.floor(hrs / 24)}d ago`;
};

function updateFooter() {
	const el = document.getElementById("spLastUpdated");
	if (!el || !currentListState) return;

	const tuneCount = window.tunesData?.length ?? 0;
	const setCount = window._setLists?.length ?? 0;
	const counts = `${tuneCount} tune${tuneCount !== 1 ? "s" : ""}${setCount > 0 ? `, ${setCount} set${setCount !== 1 ? "s" : ""}` : ""}`;
	const dirty = isDirty
		? ' <span class="footer-local-warning">&bull; Unsaved changes</span>'
		: "";

	el.innerHTML =
		`tune list: ${currentListState.displayName}` +
		` (${currentListState.source}; ${counts})` +
		` &bull; Last updated: ${relativeTime(currentListState.lastUpdate ?? currentListState.modified)}${dirty}` +
		//+ ` &bull; Loaded ${relativeTime(currentListState.loadedAt)}`
		`&bull; <button id="footer-list-link">tune lists</button>`;
	document
		.getElementById("footer-list-link")
		?.addEventListener("click", (e) => {
			e.preventDefault();
			openTuneListSelector();
		});
}

function openTuneListSelector() {
	if (isDirty) {
		if (
			!confirm(
				`You have unsaved changes to "${currentListState?.displayName}". Switch list anyway?`
			)
		)
			return;
	}
	tuneListSelectorModal.openWithContext(_manifestCache, currentListState);
}

// -- Tune operations ----------------------------------------------------------

function emptyTunes() {
	if (!confirm("You may lose some data. This cannot be undone. Continue?"))
		return;
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

	if (tuneSelectionsModal?.isTuneInSetLists(tune)) {
		alert(`"${tune.name}" is in one or more set lists and can't be deleted.`);
		return;
	}

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
// Returns an array of metadata strings including rhythm, parts, key, composer(s), origin, and tags.
function getTuneMetadata(tune) {
	const tags = tune.tags
		? Array.isArray(tune.tags)
			? tune.tags
			: [tune.tags]
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
		...tags
	].filter((m) => m);
}

function sortWithDefaultSort() {
	contourSort(window.tunesData);
}

function openSessionImport() {
	const modal = new TheSessionImportModal(
		window.tunesData,
		copyTuneDataToClipboard
	);
	modal.open();
}

// -- Initialisation -----------------------------------------------------------

async function initialiseData() {
	// Expose global functions
	window.addNewTune = addNewTune;
	window.applyFilters = applyFilters;
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
	window.openTuneSelections = () => tuneSelectionsModal?.open();
	window.saveSetListsToStorage = saveSetListsToStorage;

	eventBus.on("tuneImported", (tuneData) => {
		window.tunesData.push(tuneData);
		saveTunesToStorage();
	});
	eventBus.on("refreshTable", () => {
		sortWithDefaultSort();
		populateFilters();
		applyFilters();
	});

	const callbacks = {
		saveTunesToStorage,
		populateFilters,
		applyFilters,
		renderTable,
		sortWithDefaultSort
	};

	slotManager = new TuneListSlotManager();
	editModal = new EditModal(callbacks);
	getAbcModal = () => new AbcModal(callbacks);
	addTunesModal = new AddTunesModal(callbacks);
	loadJsonModal = new LoadJsonModal(callbacks);
	tuneListSelectorModal = new TuneListSelectorModal({
		slotManager,
		onSelect: onListSelected
	});
	tuneSelectionsModal = new TuneSelectionsModal({
		saveSetListsToStorage,
		applyFilters
	});
	tsSetImportModal = new TheSessionSetsImportModal({
		onImport: (setLists) => {
			const existing = tuneSelectionsModal.getSetLists();
			tuneSelectionsModal.loadSetLists([...existing, ...setLists]);
			callbacks.saveTunesToStorage?.();
		}
	});

	window.tunesData = [];
	window.filteredData = [];
	window._setLists = [];

	// Cleanup from previous storage format
	localStorage.removeItem(storageKey + "_saveDate");
	localStorage.removeItem(storageKey + "_setLists");

	// -- Async: resolve which list to load ------------------------------------

	const manifest = await fetchManifest();
	const params = new URLSearchParams(window.location.search);

	// Store q/n params for post-load application via onListSelected
	if (params.has("q") || params.has("n")) pendingUrlParams = params;

	// ?g= auto-selects a matching server list
	const gParam = params.get("g");
	if (gParam && manifest) {
		const match = manifest.lists.find(
			(l) => l.group?.toLowerCase() === gParam.toLowerCase()
		);
		if (match) {
			try {
				await loadServerListById(match.id, match.file, match.name);
				return;
			} catch (e) {
				console.warn("Failed to auto-load ?g= list:", e);
			}
		}
	}

	// Resume last used list
	const saved = readCurrentListState();
	if (saved) {
		try {
			await resumeCurrentList(saved, manifest);
			return;
		} catch (e) {
			console.warn("Failed to resume last list:", e);
			localStorage.removeItem(CURRENT_LIST_KEY);
		}
	}

	// Signal to caller: open the selector
	return { needsSelector: true, manifest };
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

		// Search in aka and titles (alternate names)
		if (
			tune.aka?.some((t) => t.toLowerCase().includes(searchTerm)) ||
			tune.titles?.some((t) => t.toLowerCase().includes(searchTerm))
		) {
			const matchesRhythm = rhythmFilter === "" || tune.rhythm === rhythmFilter;
			const matchesKey = keyFilter === "" || tune.key === keyFilter;
			return matchesRhythm && matchesKey;
		}

		// Search in metadata (rhythm, parts, key, composer, origin, tags)
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

// -- DOMContentLoaded ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", async function () {
	let initResult;
	try {
		initResult = await initialiseData();
	} catch (e) {
		console.error("Initialisation error:", e);
	} finally {
		document.getElementById("page-spinner").setAttribute("hidden", "");
		document.getElementById("page-main").removeAttribute("hidden");
	}

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
	document.getElementById("emptyTunesBtn")?.addEventListener("click", (e) => {
		e.preventDefault();
		dropdown.classList.remove("active");
		emptyTunes();
	});

	document.getElementById("manageSlotsBtn")?.addEventListener("click", (e) => {
		e.preventDefault();
		dropdown.classList.remove("active");
		openTuneListSelector();
	});

	document
		.getElementById("tuneListSelectorBtn")
		?.addEventListener("click", (e) => {
			e.preventDefault();
			dropdown.classList.remove("active");
			openTuneListSelector();
		});

	// Tune selections menu item - enabled when there are saved set lists or >=2 tunes selected
	const tuneSelectionsBtn = document.getElementById("tuneSelectionsBtn");
	if (tuneSelectionsBtn) {
		tuneSelectionsBtn.addEventListener("click", (e) => {
			e.preventDefault();
			dropdown.classList.remove("active");
			tuneSelectionsModal.open();
		});
		// Keep enabled state in sync when the dropdown opens
		editMenuBtn.addEventListener("click", () => {
			tuneSelectionsBtn.disabled = !tuneSelectionsModal.isEnabled();
		});
	}

	// theSessionImport.setupTheSessionImportModal();
	document
		.getElementById("thesession-import-btn")
		.addEventListener("click", openSessionImport);
	document
		.getElementById("thesession-sets-import-btn")
		?.addEventListener("click", (e) => {
			e.preventDefault();
			dropdown.classList.remove("active");
			tsSetImportModal.open();
		});

	// Warn before leaving with unsaved changes on a server/external list
	window.addEventListener("beforeunload", (e) => {
		if (isDirty) {
			e.preventDefault();
			e.returnValue = "";
		}
	});

	// Show selector if no list was auto-loaded at startup
	if (initResult?.needsSelector) {
		tuneListSelectorModal.openWithContext(initResult.manifest, null);
	}
});
