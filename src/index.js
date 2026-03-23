"use strict";
import "./styles.css";
import {
	normaliseKey,
	sort as contourSort,
	contourToSvg
} from "@goplayerjuggler/abc-tools";

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

/* Lazy SVG system ----------------------------------------------------------

SVGs are rendered only when their row is near the viewport and destroyed when
it leaves — keeping memory constant regardless of scroll position.

Two IntersectionObservers per render pass:
  rowObserver      (rootMargin "1000px") — adds rows to the buffer queue as
                   they approach the viewport; removes and destroys on exit.
  viewportObserver (rootMargin "0px")    — upgrades visible rows to the urgent
                   queue and downgrades them back to buffer when they scroll out.

Two render queues, both drained one item per idle slot:
  urgentQueue — scheduled with requestIdleCallback { timeout: 200 } so visible
                rows get SVGs promptly even under load (important for
                page-up/page-down jumps).
  bufferQueue — scheduled with plain requestIdleCallback; runs only when
                urgentQueue is empty.

requestIdleCallback (rIC) is a browser API that defers work until the browser
has spare time between frames, avoiding jank. The optional timeout parameter
sets a deadline: if the browser hasn't found idle time by then, the callback
fires anyway. Safari doesn't support rIC, so a setTimeout(fn, 0) fallback is
used throughout.

Both SVG types are generated on demand and cached on the tune object:
  tune.incipitSvg  — outerHTML string from abcjs, via a single persistent
                     hidden sandbox div (#abcjs-sandbox). cloneNode(true) ensures
                     no event listener references escape into the live DOM.
  tune.contour.svg — SVG string from contourToSvg(). processTuneData sets this
                     to null to defer generation until first render.

After each renderTable() call, a background rIC chain pre-generates both SVG
types for all visible tunes so rows are cache-warm before the user reaches them.
A generation counter aborts stale precalc chains when renderTable() is called again.

Cache invalidation (in EditModal / wherever abc/contour data is mutated):
  - tune.incipit changed  → set tune.incipitSvg = null
  - tune.contour changed  → set tune.contour.svg = null

Cache invalidation ( wherever abc/contour data is mutated):
	EditModal
  - tune.abc changed      → set tune.incipitSvg = null and tune.contour.svg = null
  - tune.incipit changed  → set tune.incipitSvg = null and tune.contour.svg = null
	AbcModal
  - tune.abc changed      → set tune.incipitSvg = null but preserve tune.contour & tune.contour.svg
	This is because the two operations supported by AbcModal (transposition and bar length changes) should
	have no impact on the contour (octave shifts aside, which we want to avoid anyway...)
*/
const INCIPIT_OPTIONS = {
	scale: 0.8,
	staffwidth: 330,
	paddingtop: 1,
	paddingbottom: 1,
	paddingright: 1,
	paddingleft: 1
};

// Two-tier render queue: urgent = currently in viewport, buffer = in pre-render margin only.
// Urgent items are scheduled with a timeout so they fire even when the browser is busy;
// buffer items run purely at idle priority.
const urgentQueue = new Set();
const bufferQueue = new Set();
let urgentHandle = null;
let bufferHandle = null;
let viewportObserver = null; // rootMargin "0px"  — upgrades rows to urgent
let rowObserver = null; // rootMargin "1000px" — adds rows to buffer queue
let precalcGeneration = 0;

// Single persistent hidden div for all abcjs renders.
// visibility:hidden keeps it in layout flow (abcjs needs real dimensions) but off-screen.
function getAbcjsSandbox() {
	let el = document.getElementById("abcjs-sandbox");
	if (!el) {
		el = document.createElement("div");
		el.id = "abcjs-sandbox";
		el.style.cssText =
			"visibility:hidden;position:absolute;pointer-events:none;top:0;left:0;";
		document.body.appendChild(el);
	}
	return el;
}

// Render incipit into sandbox, clone the SVG (no event listeners on clone),
// cache outerHTML on the tune, then clear the sandbox without innerHTML leaks.
function renderAndCacheIncipit(tune) {
	AbcJs.renderAbc("abcjs-sandbox", tune.incipit, INCIPIT_OPTIONS);
	const svgEl = getAbcjsSandbox().querySelector("svg");
	if (svgEl) tune.incipitSvg = svgEl.cloneNode(true).outerHTML;
	getAbcjsSandbox().replaceChildren();
}

// Generate and cache contour SVG on demand.
// No-op if already cached or no contour data present.
function ensureContourSvg(tune) {
	if (tune.contour && tune.contour.svg === null) {
		tune.contour.svg = contourToSvg(tune.contour);
	}
}

// Inject cached (or freshly generated) SVGs into a row's placeholder divs.
function injectSvgs(row, tune) {
	const contourEl = row.querySelector(".tune-contour");
	if (contourEl) {
		ensureContourSvg(tune);
		if (tune.contour?.svg) {
			contourEl.innerHTML = tune.contour.svg;
			contourEl.classList.remove("svg-pending");
			contourEl.removeAttribute("title");
		}
	}

	const incipitEl = row.querySelector(".tune-incipit");
	if (incipitEl && tune.incipit) {
		if (!tune.incipitSvg) renderAndCacheIncipit(tune);
		if (tune.incipitSvg) {
			incipitEl.innerHTML = tune.incipitSvg;
			incipitEl.classList.remove("svg-pending");
			incipitEl.removeAttribute("title");
		}
	}
}

// Remove SVG DOM nodes from a row. Text content is in separate elements and untouched.
// data-pending marks elements that have data to render; restore svg-pending so the
// placeholder reappears if the row is scrolled back into view.
function destroySvgs(row) {
	const contourEl = row.querySelector(".tune-contour");
	if (contourEl) {
		contourEl.replaceChildren();
		if (contourEl.hasAttribute("data-pending"))
			contourEl.classList.add("svg-pending");
	}
	const incipitEl = row.querySelector(".tune-incipit");
	if (incipitEl) {
		incipitEl.replaceChildren();
		if (incipitEl.hasAttribute("data-pending"))
			incipitEl.classList.add("svg-pending");
	}
}
function drainOne(queue) {
	const { value: index, done } = queue.values().next();
	if (done) return;
	queue.delete(index);
	const tune = window.filteredData?.[index];
	const row = document.getElementById("tunesTableBody")?.children[index];
	if (tune && row) injectSvgs(row, tune);
}

function scheduleQueues() {
	if (urgentQueue.size > 0 && urgentHandle === null) {
		const run = () => {
			urgentHandle = null;
			drainOne(urgentQueue);
			if (urgentQueue.size > 0) scheduleQueues();
			else if (bufferQueue.size > 0) scheduleQueues();
		};
		urgentHandle =
			typeof requestIdleCallback !== "undefined"
				? requestIdleCallback(run, { timeout: 200 }) // fire promptly for visible rows
				: setTimeout(run, 0);
	} else if (
		bufferQueue.size > 0 &&
		bufferHandle === null &&
		urgentQueue.size === 0
	) {
		const run = () => {
			bufferHandle = null;
			drainOne(bufferQueue);
			if (bufferQueue.size > 0) scheduleQueues();
		};
		bufferHandle =
			typeof requestIdleCallback !== "undefined"
				? requestIdleCallback(run) // pure idle for off-screen buffer rows
				: setTimeout(run, 0);
	}
}

function cancelRenderQueue() {
	if (urgentHandle !== null) {
		typeof cancelIdleCallback !== "undefined"
			? cancelIdleCallback(urgentHandle)
			: clearTimeout(urgentHandle);
		urgentHandle = null;
	}
	if (bufferHandle !== null) {
		typeof cancelIdleCallback !== "undefined"
			? cancelIdleCallback(bufferHandle)
			: clearTimeout(bufferHandle);
		bufferHandle = null;
	}
	urgentQueue.clear();
	bufferQueue.clear();
}
function getRowObserver() {
	if (!rowObserver) {
		// Buffer observer: pre-render rows approaching the viewport.
		rowObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const index = parseInt(entry.target.dataset.tuneIndex, 10);
					if (entry.isIntersecting) {
						bufferQueue.add(index);
						scheduleQueues();
					} else {
						// Left buffer entirely: cancel and free DOM.
						bufferQueue.delete(index);
						urgentQueue.delete(index);
						destroySvgs(entry.target);
					}
				});
			},
			{ rootMargin: "1000px" }
		);
	}
	if (!viewportObserver) {
		// Viewport observer: upgrade/downgrade between urgent and buffer queues.
		viewportObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const index = parseInt(entry.target.dataset.tuneIndex, 10);
					if (entry.isIntersecting) {
						// Promote to urgent — process ahead of buffer rows.
						bufferQueue.delete(index);
						urgentQueue.add(index);
						scheduleQueues();
					} else {
						// Back to buffer priority if still in the outer margin.
						urgentQueue.delete(index);
						if (bufferQueue.has(index)) scheduleQueues(); // resume if stalled
					}
				});
			},
			{ rootMargin: "0px" }
		);
	}
	return rowObserver;
}

function resetObserver() {
	rowObserver?.disconnect();
	viewportObserver?.disconnect();
	cancelRenderQueue();
}
// Background precalculation: after table render, generate all SVG caches at
// idle priority so that most rows are ready before the user scrolls to them.
// A generation counter ensures stale callbacks from prior renderTable() calls abort early.
function schedulePrecalculation() {
	const gen = ++precalcGeneration;
	const tunes = window.filteredData.slice(); // snapshot; filteredData may change
	let i = 0;

	const step = (deadline) => {
		if (gen !== precalcGeneration) return; // renderTable() was called again; abort
		while (i < tunes.length) {
			const tune = tunes[i++];
			ensureContourSvg(tune);
			if (tune.incipit && !tune.incipitSvg) renderAndCacheIncipit(tune);
			// Yield back to browser if idle time is running out
			if (deadline.timeRemaining() < 5 && i < tunes.length) break;
		}
		if (i < tunes.length && gen === precalcGeneration) {
			if (typeof requestIdleCallback !== "undefined") {
				requestIdleCallback(step);
			} else {
				setTimeout(() => step({ timeRemaining: () => Infinity }), 0);
			}
		}
	};

	if (typeof requestIdleCallback !== "undefined") {
		requestIdleCallback(step);
	} else {
		setTimeout(() => step({ timeRemaining: () => Infinity }), 0);
	}
}

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
		const id = slotManager.generateSlotId();
		const name = `${currentListState?.displayName ?? "Tune list"} (local copy)`;
		slotManager.saveSlot(
			id,
			name,
			prepareTunesForExport(window.tunesData),
			window._setLists ?? []
		);
		currentListState = {
			source: "local",
			sourceId: id,
			displayName: name,
			loadedAt: new Date().toISOString()
		};
		localStorage.setItem(CURRENT_LIST_KEY, JSON.stringify(currentListState));
		isDirty = false;
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
		delete tune.incipitSvg;
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

	// Disconnect the previous observer and flush all pending SVG work before
	// rebuilding the DOM. Old row elements are about to be discarded.
	resetObserver();

	if (window.filteredData.length === 0) {
		tbody.innerHTML =
			'<tr><td colspan="2" class="no-results">No tunes found matching your criteria.</td></tr>';
		return;
	}

	tbody.innerHTML = "";
	const observer = getRowObserver();

	window.filteredData.forEach((tune, index) => {
		const row = document.createElement("tr");
		row.dataset.tuneIndex = index; // used by the IntersectionObserver callback
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

		// .tune-contour and .tune-incipit are always present as empty placeholders;
		// their SVG content is injected lazily by the IntersectionObserver / render queue.
		row.innerHTML = `
	<td>
		<div class="tune-header">
			<div class="tune-title">${title}</div>
			<div class="notes">${metadata}</div>
			</div>
			<div>
			
		<div class="tune-header tune-header--actions">
		${tune.contour ? '<div class="tune-contour svg-pending" data-pending title="preparing the contour…"></div>' : '<div class="tune-contour"></div>'}
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
		<div class="tune-incipit${tune.incipit ? ' svg-pending" data-pending title="preparing the incipit…' : ""}"></div>
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
		observer.observe(row); // buffer margin
		viewportObserver.observe(row); // viewport — for priority upgrade
	});

	document.getElementById("spCount").innerText =
		`${window.filteredData.length}/${window.tunesData.length}`;

	// Kick off background precalculation so caches are warm before the user scrolls.
	schedulePrecalculation();
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
