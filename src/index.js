"use strict";
import "./styles.css";
import {
	normaliseKey,
	sort as sortTunesArray,
	contourToSvg,
	sortConstants,
	canDoubleBarLength,
	canHalveBarLength,
	convertStandardTune,
	convertToStandardTune
} from "@goplayerjuggler/abc-tools";

import manifest from "./generated/tune-lists-manifest.json";
import { processTuneData, reprocessTune } from "./processTuneData.js";
// import theSessionImport from "./thesession-import.js";
import AbcJs from "abcjs";
import AbcModal from "./modules/modals/AbcModal.js";
import EditModal from "./modules/modals/EditModal.js";
import AddTunesModal from "./modules/modals/AddTunesModal.js";
import LoadJsonModal from "./modules/modals/LoadJsonModal.js";
import {
	TuneListSelectorModal,
	relativeTime
} from "./modules/modals/TuneListSelectorModal.js";
import TuneListSlotManager from "./modules/TuneListSlotManager.js";

import TheSessionImportModal from "./modules/modals/TheSessionImportModal.js";
import TuneSelectionsModal from "./modules/modals/TuneSelectionsModal.js";
import { eventBus } from "./modules/events/EventBus.js";
import javascriptify from "@goplayerjuggler/abc-tools/src/javascriptify.js";
import IntroModal from "./modules/modals/IntroModal.js";

// Legacy key kept for one-time cleanup only
const storageKey = "tunesData";
const CURRENT_LIST_KEY = "currentTuneList";
window.currentSortType = sortConstants.PREDEFINED_SORT_NAMES[0];
let currentSortIndex = 0;

let editModal,
	getAbcModal,
	addTunesModal,
	loadJsonModal,
	tuneListSelectorModal,
	tuneSelectionsModal;

let slotManager;
let currentListState = null;
let isDirty = false;
let activeBadgeFilters = new Map(); // Map<metaType, Set<lowercaseValue>> — badge-click filter state
let pendingUrlParams = null;
let pendingSetParam = null;
let _manifestCache = null;
let _spinnerHidden = false;

// Lookup maps for cross-reference resolution; populated by calculateCrossRefs when a list is loaded.
let _crBySessionId = new Map();
let _crByTtId = new Map();

/* Lazy SVG system ----------------------------------------------------------

SVGs are rendered only when their row is near the viewport and destroyed when
it leaves — keeping memory constant regardless of scroll position.

Two IntersectionObservers per render pass:
  rowObserver      (rootMargin "1000px") — adds rows to the buffer queue as
				   they approach the viewport; removes and destroys on exit.
  viewportObserver (rootMargin "0px")    — upgrades visible rows to the urgent
				   queue and downgrades them back to buffer when they scroll out.

Two render queues, both drained one idle slot at a time:
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

async function saveTunesToStorage() {
	if (currentListState?.source === "local") {
		try {
			await slotManager.saveSlot(
				currentListState.sourceId,
				currentListState.displayName,
				prepareTunesForExport(window.tunesData), // strip derived properties
				window._setLists ?? []
			);
		} catch (e) {
			console.error("Failed to save slot:", e);
		}
	} else {
		const id = slotManager.generateSlotId();
		const name = `${currentListState?.displayName ?? "Tune list"} (local copy)`;
		await slotManager.saveSlot(
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
async function saveSetListsToStorage(setLists) {
	window._setLists = setLists;
	await saveTunesToStorage();
}

async function fetchManifest() {
	if (_manifestCache) return _manifestCache;
	try {
		_manifestCache = manifest;
		const params = new URLSearchParams(window.location.search);
		//pwd protect the "su" (Steam Up!) server list
		//not really sensitive data, but prefer not to show this info to casual users
		const sha = async (input) => {
			const encoder = new TextEncoder();
			const data = encoder.encode(input);
			const hashBuffer = await crypto.subtle.digest("SHA-256", data);
			const hashArray = Array.from(new Uint8Array(hashBuffer));
			const hashHex = hashArray
				.map((b) => b.toString(16).padStart(2, "0"))
				.join("");
			return hashHex;
		};
		if (
			!params.has("suPwd") ||
			(await sha(params.get("suPwd"))) !==
				"c6d77287906f75674e46e1a01cefb0ec32f42baf7bc3b200e303f25e48f06468"
		)
			_manifestCache.lists = _manifestCache.lists?.filter(
				(l) => l.id !== "group-su"
			);

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
	lastUpdate,
	defaultSort
}) {
	// Server/external tunes are raw; local tunes are already processed.
	window.tunesData = window.tunesData = (tunes ?? [])
		.filter(Boolean)
		.map(processTuneData);

	calculateCrossRefs(window.tunesData);

	window._setLists = setLists ?? [];
	tuneSelectionsModal.loadSetLists(window._setLists);

	currentListState = {
		source,
		sourceId,
		displayName,
		//loadedAt: new Date().toISOString(),
		lastUpdate,
		defaultSort
	};
	localStorage.setItem(CURRENT_LIST_KEY, JSON.stringify(currentListState));

	if (source === "local") await slotManager.touchSlot(sourceId);

	isDirty = false;
	if (defaultSort) window.currentSortType = defaultSort;
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

async function loadServerListById(
	listId,
	listFile,
	displayName,
	lastUpdate,
	defaultSort
) {
	const res = await fetch(`./tune-lists/${listFile}`);
	if (!res.ok) throw new Error(`HTTP ${res.status}`);
	const { tunes, setLists } = await res.json();
	await onListSelected({
		source: "server",
		sourceId: listId,
		displayName,
		tunes,
		setLists,
		lastUpdate,
		defaultSort
	});
}

async function resumeCurrentList(listState, manifest) {
	if (listState.source === "local") {
		const slot = await slotManager.getSlot(listState.sourceId);
		if (!slot) throw new Error("Slot not found");
		await onListSelected({
			source: "local",
			sourceId: listState.sourceId,
			displayName: slot.name,
			tunes: slot.tunes ?? [],
			setLists: slot.setLists ?? [],
			lastUpdate: slot.modified,
			defaultSort: slot.defaultSort
		});
	} else if (listState.source === "server") {
		const listInfo = manifest?.lists.find((l) => l.id === listState.sourceId);
		if (!listInfo) throw new Error("Server list not found in manifest");
		await loadServerListById(
			listState.sourceId,
			listInfo.file,
			listInfo.name,
			listInfo.lastUpdate,
			listInfo.defaultSort
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

	const idProperties = ["ttId", "theSessionId"];
	for (let i = 0; i < idProperties.length; i++) {
		const idProperty = idProperties[i];
		const value = +params.get(idProperty);
		if (value) {
			selectByIdProperty(idProperty, value);
			filtered = true;
			break;
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
		` (${currentListState.source}; ${counts})Tunes sorted by: “${window.currentSortType}”` +
		` &bull; Last updated: ${relativeTime(currentListState.lastUpdate ?? currentListState.modified)}${dirty}` +
		//+ ` &bull; Loaded ${relativeTime(currentListState.loadedAt)}`
		`<button id="footer-list-link">tune lists</button>
		<br/><button id="footer-about-link" title="About “Tune table”" type="button"
        aria-label="About “Tune table”">
        about “Tune table”
      </button>
	  
		
	  `;
	document
		.getElementById("footer-list-link")
		?.addEventListener("click", (e) => {
			e.preventDefault();
			openTuneListSelector();
		});
	document
		.getElementById("footer-about-link")
		?.addEventListener("click", (e) => {
			e.preventDefault();
			new IntroModal().open();
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

async function emptyTunes() {
	if (!confirm("You may lose some data. This cannot be undone. Continue?"))
		return;
	window.tunesData = [];
	window.filteredData = [];
	window._setLists = [];
	tuneSelectionsModal.loadSetLists(window._setLists);
	renderTable();
	await saveTunesToStorage();
}

function prepareTunesForExport(tunes) {
	// deep copy so the original data is never mutated.
	const tunesCopy = JSON.parse(JSON.stringify(tunes));
	tunesCopy.forEach((tune) => {
		[
			"name",
			"key",
			"rhythm",
			"meter",
			"composer",
			"origin",
			"titles",
			"incipit"
		].forEach((prop) => {
			if (tune[`${prop}IsFromAbc`]) {
				delete tune[prop];
				delete tune[`${prop}IsFromAbc`];
			}
		});
		delete tune.selected;
		delete tune.incipitSvg;
		delete tune.referencesFromAbc;
		if (tune.abc) {
			//delete data that's derived from the abc in 99% of cases
			delete tune.incipit;
		}
		delete tune.contour;
		// Strip cross-reference runtime annotations
		delete tune._crId;
		delete tune._isCrTarget;
		delete tune._resolvedCrossRefs;
		(tune.references ?? []).forEach((ref) => delete ref._crId);

		if (tune.scores?.length === 0) delete tune.scores;
		if (tune.references?.length === 0) delete tune.references;
	});
	return tunesCopy;
}

function copyTuneDataToClipboard(tunes, button) {
	const result = javascriptify(prepareTunesForExport(tunes));
	navigator.clipboard.writeText(result).then(
		() => {
			const originalText = button.textContent;
			button.textContent = "✓ Code copied!";
			setTimeout(() => {
				button.textContent = originalText;
			}, 2000);
		},
		(err) => {
			console.error("Failed to copy code:", err);
			alert("Failed to copy code");
		}
	);
}
function copyShareToClipboard(tune, button) {
	const root = window.location.origin + (window.location.pathname ?? "");
	const remaining = tune.ttId
		? "ttId=" + tune.ttId
		: tune.theSessionId
			? "theSessionId=" + tune.theSessionId
			: "n=" + encodeURIComponent(tune.name);
	const result = `${root}?l=${currentListState.sourceId}&${remaining}`;
	navigator.clipboard.writeText(result).then(
		() => {
			const originalText = button.textContent;
			button.textContent = "✓ share link copied!";
			if (!tune.ttId && !tune.theSessionId)
				button.textContent = "⚠ name-only link";
			setTimeout(() => {
				button.textContent = originalText;
			}, 2000);
		},
		(err) => {
			console.error("Failed to copy share link:", err);
			alert("Failed to copy share link");
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
 * Apply a bar-length conversion to all eligible tunes in tunesData.
 * Mirrors the per-tune changeBarLength / save logic in AbcModal.
 * @param {1|-1} direction  1 = double, -1 = halve
 */
async function bulkChangeBarLength(direction) {
	const checkFn = direction === 1 ? canDoubleBarLength : canHalveBarLength;
	const convertFn =
		direction === 1 ? convertStandardTune : convertToStandardTune;
	const toArray = (abc) => (Array.isArray(abc) ? abc : [abc]);

	const indices = window.tunesData.reduce((acc, tune, idx) => {
		if (tune.abc && toArray(tune.abc).some(checkFn)) acc.push(idx);
		return acc;
	}, []);

	if (!indices.length) {
		alert("No tunes are eligible for this conversion.");
		return;
	}
	if (
		!confirm(
			`Apply bar-length conversion to ${indices.length} tune${indices.length !== 1 ? "s" : ""}?`
		)
	)
		return;

	for (const idx of indices) {
		const tune = window.tunesData[idx];
		const isArray = Array.isArray(tune.abc);
		try {
			const newAbc = toArray(tune.abc).map((abc) =>
				checkFn(abc) ? (convertFn(abc) ?? abc) : abc
			);
			tune.abc = isArray ? newAbc : newAbc[0];
			// Regenerate incipit; preserve contour (bar-length changes don't affect melodic contour)
			window.tunesData[idx] = reprocessTune(tune, { removeContour: false });
		} catch (error) {
			console.log(
				`error: ${error} / tune: ${JSON.stringify({ name: tune.name, theSessionId: tune.theSessionId, abc: tune.abc, incipit: tune.incipit })}`
			);
		}
	}

	await saveTunesToStorage();
	populateFilters();
	applyFilters(); // → renderTable() → lazy observer regenerates on-screen incipits first
}

/**
 * Copy a single tune's data to clipboard as a JavaScript literal.
 * @param {number} tuneIndex - Index of the tune in filteredData
 */
function copySingleTune(tuneIndex, triggerButton) {
	const tune = window.filteredData[tuneIndex];
	copyTuneDataToClipboard([tune], triggerButton);
}

function copyShare(tuneIndex, triggerButton) {
	const tune = window.filteredData[tuneIndex];
	copyShareToClipboard(tune, triggerButton);
}
// Add New Tune
async function addNewTune() {
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

	await saveTunesToStorage();
	renderTable();

	// Open edit modal for the new tune
	const newIndex = window.filteredData.length - 1;
	editModal.openWithTune(newTune, newIndex);
}

// Delete Tune
async function deleteTune(tuneIndex) {
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

	await saveTunesToStorage();
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

function expandNotes(btn) {
	const truncated = btn.closest(".notes-truncated");
	const full = truncated.nextElementSibling; // .notes-full
	truncated.style.display = "none";
	full.style.display = "block";
}

function collapseNotes(btn) {
	const full = btn.closest(".notes-full");
	const truncated = full.previousElementSibling; // .notes-truncated
	full.style.display = "none";
	truncated.style.display = "block";
}

// Extract all metadata values from a tune for display and filtering.
// Returns an array of { type, value } objects covering rhythm, parts, key,
// composer(s), origin, tags, and structure.
function getTuneMetadata(tune) {
	const tags = tune.tags
		? Array.isArray(tune.tags)
			? tune.tags
			: [tune.tags]
		: [];
	const origins = tune.origin
		? tune.origin.match(/([^;.]+)/g).map((o) => o.trim())
		: [];
	const composers = tune.composer ? tune.composer.split("; ") : [];

	return [
		tune.rhythm && { type: "rhythm", value: tune.rhythm },
		tune.parts && { type: "parts", value: tune.parts },
		tune.key && { type: "key", value: tune.key },
		...composers.map((v) => ({ type: "composer", value: v })),
		...origins.map((v) => ({ type: "origin", value: v })),
		...tags.map((v) => ({ type: "tag", value: v })),
		tune.structure && { type: "structure", value: tune.structure }
	].filter(Boolean);
}

// Toggle a badge filter on/off. Uses AND-logic between types, OR-logic within
// the same type: clicking two tags shows tunes matching either tag.
// anchorTune / anchorOffset: restore the tune's vertical position after re-render.
function toggleBadgeFilter(type, value, anchorTune, anchorOffset) {
	const key = value.toLowerCase();
	if (!activeBadgeFilters.has(type)) activeBadgeFilters.set(type, new Set());
	const set = activeBadgeFilters.get(type);
	set.has(key) ? set.delete(key) : set.add(key);
	if (set.size === 0) activeBadgeFilters.delete(type);

	applyFilters();

	// After re-render, scroll so the anchor tune is back at the same viewport position.

	const newIndex = window.filteredData.indexOf(anchorTune);
	if (newIndex >= 0) {
		const newRow =
			document.getElementById("tunesTableBody")?.children[newIndex];
		if (newRow)
			window.scrollBy(0, newRow.getBoundingClientRect().top - anchorOffset);
	}
}

// -- Cross-references ---------------------------------------------------------

// Extract just the musician names from an artists string "name, instrument; name2, instrument2; ..."
function extractArtistNames(artists) {
	if (!artists) return "";
	return artists
		.split(";")
		.map((a) => a.trim().split(",")[0].trim())
		.filter(Boolean)
		.join(", ");
}

// Parse an identifier strings like "key=123", with key = ttId or theSessionId, into a plain object.
function parseTuneIdStr(str) {
	const split = str?.split("=");
	if (split?.length !== 2 || ["ttId", "theSessionId"].indexOf(split[0]) < 0)
		return;
	const obj = {};
	obj[split[0]] = +split[1];
	return obj;
}

// Resolve an ID object (with theSessionId or ttId) to a tune in the current data set.
function resolveTuneById(idObj) {
	if (idObj.theSessionId) return _crBySessionId.get(idObj.theSessionId) ?? null;
	if (idObj.ttId) return _crByTtId.get(idObj.ttId) ?? null;
	return null;
}

// Replace [label](target) patterns in note text.
// Internal ID patterns (ttId=, theSessionId=) become anchor links to the target tune's row;
// all other patterns become external links.
function formatNoteLinks(text) {
	return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, target) => {
		if (/^(?:ttId|theSessionId)=/.test(target)) {
			const t = resolveTuneById(parseTuneIdStr(target));
			if (t) {
				if (window.filteredData.indexOf(t) >= 0)
					return `<a href="#cr-t${t._crId}">${label}</a>`;
				else return `[${label}] (cross-reference not on-screen)`;
			}
		}
		return `<a href="${target}" target="_blank" rel="noopener noreferrer">${label}</a>`;
	});
}

/**
 * Annotate tunes with cross-reference data. Called once when a full data set is loaded.
 * Sets on each tune:
 *   _crId              — stable integer ID (tunesData index) for generating anchor targets
 *   _isCrTarget        — true if this tune is the target of any cross-reference link
 *   _resolvedCrossRefs — array of { tuneName, tuneId, refIndex, artistNames, notes } for rendering
 * Sets on each referenced reference object:
 *   _crId              — string "tuneId-refIndex" for generating anchor IDs on reference items
 */
function calculateCrossRefs(tunes) {
	_crBySessionId = new Map();
	_crByTtId = new Map();

	tunes.forEach((tune, idx) => {
		tune._crId = idx;
		tune._isCrTarget = false;
		tune._resolvedCrossRefs = [];
		if (tune.theSessionId) _crBySessionId.set(tune.theSessionId, tune);
		if (tune.ttId) _crByTtId.set(tune.ttId, tune);
	});

	tunes.forEach((tune) => {
		// Resolve explicit crossReferences entries
		(tune.crossReferences ?? []).forEach((cr) => {
			const target = resolveTuneById(cr);
			if (!target) return;

			const refIndex = cr.index ?? 0;
			const ref = //target.references?.[refIndex];
				(target.referencesFromAbc ?? []).concat(target.references ?? [])?.[
					refIndex
				];
			if (!ref) return;

			target._isCrTarget = true;
			ref._crId = `${target._crId}-${refIndex}`;

			tune._resolvedCrossRefs.push({
				...{
					tuneName: target.name,
					tuneId: target._crId,
					refIndex,
					artistNames: extractArtistNames(ref.artists)
				},
				...(cr.notes ? { notes: cr.notes } : {})
			});
		});

		/*	
		if (tune.name === "Le chapeau de paille") {
			console.log("Le chapeau de paille");
		}
		if (tune.ttId === 512) {
			console.log("debug");
		}
		*/

		// Mark tunes referenced by [label](id) patterns in notes as anchor targets
		(tune.references ?? [])
			.concat(tune.referencesFromAbc ?? [])
			.forEach((ref) => {
				const note = ref.notes;
				if (!note) return;

				const RE = /\[([^\]]+)\]\(((?:ttId|theSessionId)=[^)]+)\)/g;
				let m;
				while ((m = RE.exec(note)) !== null) {
					const t = resolveTuneById(parseTuneIdStr(m[2]));
					if (t) {
						t._isCrTarget = true;
						return;
					}
				}
			});
	});
}

function sortWithDefaultSort() {
	sortTunesArray(window.tunesData, { predefinedSort: window.currentSortType });
}

function openTheSessionImport(e, dropdown, howToOpen) {
	e.preventDefault();
	dropdown.classList.remove("active");
	const modal = new TheSessionImportModal(
		window.tunesData,
		copyTuneDataToClipboard,
		async (setLists) => {
			const existing = tuneSelectionsModal.getSetLists();
			window._setLists = [...existing, ...setLists];
			tuneSelectionsModal.loadSetLists(window._setLists);
			await saveTunesToStorage();
		}
	);
	if (howToOpen === 0) modal.open();
	if (howToOpen === 1) modal.openInSetsMode();
}

// -- Filters ------------------------------------------------------------------

// Chromatic sort order for tonics, sharp/flat-aware.
// Maps each tonic to its chromatic position (C=0 … B=11).
// Enharmonics share a position (e.g. F♯ and G♭ both = 6) and are kept as
// separate entries with separate counts; relative order between them is
// not guaranteed and not significant.
const TONIC_SORT_KEY = new Map([
	["C", 0],
	["C♯", 1],
	["D♭", 1],
	["D", 2],
	["D♯", 3],
	["E♭", 3],
	["E", 4],
	["F", 5],
	["F♯", 6],
	["G♭", 6],
	["G", 7],
	["G♯", 8],
	["A♭", 8],
	["A", 9],
	["A♯", 10],
	["B♭", 10],
	["B", 11]
]);

// Split a normalised key string (e.g. "D major", "B♭ minor") into { tonic, mode }.
// Keys with no space (unusual) are treated as tonic-only with an empty mode.
function splitKey(keyStr) {
	const spaceIdx = keyStr.indexOf(" ");
	return spaceIdx === -1
		? { tonic: keyStr, mode: "" }
		: { tonic: keyStr.slice(0, spaceIdx), mode: keyStr.slice(spaceIdx + 1) };
}

function populateFilters() {
	activeBadgeFilters.clear(); // reset badge filters when the tune list changes

	// Build a flat list of normalised key strings from all tunes
	const allKeys = window.tunesData
		.map((tune) => tune.key)
		.filter(Boolean)
		.map((k) => normaliseKey(k).join(" "));

	// Count tunes per rhythm, tonic, and mode (global counts across all tunes)
	const rhythmCounts = new Map();
	const tonicCounts = new Map();
	const modeCounts = new Map();

	window.tunesData.forEach((tune) => {
		if (tune.rhythm) {
			const r = tune.rhythm.toLowerCase();
			rhythmCounts.set(r, (rhythmCounts.get(r) ?? 0) + 1);
		}
	});
	allKeys.forEach((k) => {
		const { tonic, mode } = splitKey(k);
		tonicCounts.set(tonic, (tonicCounts.get(tonic) ?? 0) + 1);
		if (mode) modeCounts.set(mode, (modeCounts.get(mode) ?? 0) + 1);
	});

	// Sort by count descending, then alphanumerically
	const sortByCountThenAlpha = (a, b, counts) => {
		const countDiff = (counts.get(b) ?? 0) - (counts.get(a) ?? 0);
		if (countDiff !== 0) return countDiff;
		return a.localeCompare(b);
	};

	// Musical sort for tonics: by chromatic position (C=0 … B=11).
	// Enharmonics share a position; relative order between them is not significant.
	const tonics = [...new Set(allKeys.map((k) => splitKey(k).tonic))].sort(
		(a, b) => (TONIC_SORT_KEY.get(a) ?? 999) - (TONIC_SORT_KEY.get(b) ?? 999)
	);

	const rhythms = [...rhythmCounts.keys()].sort((a, b) =>
		sortByCountThenAlpha(a, b, rhythmCounts)
	);

	const modes = [
		...new Set(allKeys.map((k) => splitKey(k).mode).filter(Boolean))
	].sort((a, b) => sortByCountThenAlpha(a, b, modeCounts));

	const toOption = (value, counts) =>
		`<option value="${value}">${value} (${counts.get(value) ?? 0})</option>`;

	document.getElementById("rhythmFilter").innerHTML =
		'<option value="">All rhythms</option>' +
		rhythms.map((r) => toOption(r, rhythmCounts)).join("");

	document.getElementById("tonicFilter").innerHTML =
		'<option value="">All tonics</option>' +
		tonics.map((t) => toOption(t, tonicCounts)).join("");

	document.getElementById("modeFilter").innerHTML =
		'<option value="">All modes</option>' +
		modes.map((m) => toOption(m, modeCounts)).join("");
}

function openAbcModal(tune) {
	if (!tune.abc) return;
	getAbcModal().openWithTune(tune);
}
function findSetByName(name) {
	const needle = name.toLowerCase();
	for (const setList of window._setLists ?? []) {
		const set = setList.sets?.find((s) => s.name?.toLowerCase() === needle);
		if (set)
			return { setListName: setList.name, setName: set.name, tunes: set.tunes };
	}
	return null;
}
function scrollToFirstTune(tunes) {
	const first = tunes?.[0];
	if (!first || !first._crId) return;
	const el = document.getElementById(`cr-t${first._crId}`);
	el?.scrollIntoView({ block: "center" });
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
		if (tune._isCrTarget) row.id = `cr-t${tune._crId}`;

		// ── References column ─────────────────────────────────────────
		let referencesHtml = "",
			hasTheSessionLink = false;
		(tune.referencesFromAbc ?? [])
			.concat(tune.references ?? [])
			.forEach((ref) => {
				let notesHtml = "";

				if (ref.notes || ref.album) {
					const rawText =
						(ref.album ? `album: ${ref.album}\n` : "") + (ref.notes ?? "");
					const formattedNotes = formatNoteLinks(
						rawText.replace(/\n/g, "<br />")
					)
						.replace(/(?<!")https?:\/\/[^\s<>"']+/g, (url) => {
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
						})
						.replace(/```([^`]+)```/g, "<pre>$1</pre>");

					const lines = rawText.split("\n");
					if (lines.length > 12) {
						const truncatedNotes = formatNoteLinks(
							lines.slice(0, 5).join("\n").replace(/\n/g, "<br />")
						);
						notesHtml = `
					<div class="notes notes-truncated"">
					  ${truncatedNotes}
					  <br /><button class="more-btn" onclick="expandNotes(this)">More…</button>
					</div>
					<div class="notes notes-full" style="display: none;">
					  ${formattedNotes}
					  <br /><button class="more-btn" onclick="collapseNotes(this)">Less</button>
					</div>`;
					} else {
						notesHtml = `<div class="notes">${formattedNotes}</div>`;
					}
				}
				const domain = ref.url
					? ref.url.match(/^(?:https?:\/\/)?(?:www\.)?([^/]+)/)[1]
					: "";
				const refHeader =
					ref.artists && ref.url
						? `<div class="url">${ref.artists} <a href="${ref.url}" target="_blank" rel="noopener noreferrer">${domain}</a></div>`
						: ref.artists
							? `<div class="artists">${ref.artists}</div>`
							: ref.url
								? `<div class="url"><a href="${ref.url}" target="_blank" rel="noopener noreferrer">${domain}</a></div>` //extract the domain for display so as not to waste space on the full url
								: "";
				const refItemId = ref._crId ? ` id="cr-r${ref._crId}"` : "";
				referencesHtml += `
					<div class="reference-item"${refItemId}>
						${refHeader}
						${notesHtml}
					</div>`;
			});

		// Cross-reference items
		(tune._resolvedCrossRefs ?? []).forEach((cr) => {
			const artistLink = cr.artistNames
				? //`<a href="#cr-r${cr.tuneId}-${cr.refIndex}">${cr.artistNames}</a>`
					//260506 broken - todo - fix
					cr.artistNames
				: "";
			const targetIsPresent =
				window.filteredData.some((t) => t._crId === cr.tuneId) >= 0;
			const notes = cr.notes ? " " + cr.notes : "";
			if (targetIsPresent) {
				const tuneLink = `<a href="#cr-t${cr.tuneId}">${cr.tuneName}</a>`;
				referencesHtml += `<div class="reference-item reference-item--cr">${artistLink ? `[See ${artistLink}.` : "[See entry"} under ${tuneLink}.${notes}]</div>`;
			} else
				referencesHtml += `<div class="reference-item reference-item--cr">[Cross-referenced to: ${artistLink ? ` ${artistLink}] / ` : ""}  ${cr.tuneName}.${notes} (currently not on-screen)]</div>`;
		});

		// ── Score links ───────────────────────────────────────────────
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
		const scoresHtml =
			scores.length > 0
				? `<div class="tune-scores">${scores.map((s) => `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a>`).join(", ")}</div>`
				: "";

		// ── Tune name ─────────────────────────────────────────────────
		const hasAbc = !!tune.abc;
		const aka = tune.aka ? tune.aka.join(", ") : "",
			tooltip =
				aka || tune.titles
					? ` title="${tune.titles ? tune.titles.join(", ") + (aka && tune.titles ? "; " : "") : ""}${aka ? `AKA: ${aka}` : ""}"`
					: "";
		const settingsLabel =
			Array.isArray(tune.abc) && tune.abc.length > 1
				? ` <span class="tune-settings-count">(${tune.abc.length} settings)</span>`
				: "";

		const nameHtml = hasAbc
			? `<a href="#" class="tune-name has-abc" data-tune-index="${index}"${tooltip}>${tune.name}</a>${settingsLabel}`
			: `<span class="tune-name" data-tune-index="${index}"${tooltip}>${tune.name}</span>`;

		const metadata = getTuneMetadata(tune)
			.map(({ type, value }) => {
				const isActive = activeBadgeFilters.get(type)?.has(value.toLowerCase());
				return `<span class="badge${isActive ? " badge--active" : ""}" data-meta-type="${type}" data-meta-value="${value}">${value}</span>`;
			})
			.join(" ");

		// .tune-contour and .tune-incipit are always present as empty placeholders;
		// SVG content is injected lazily by the IntersectionObserver / render queue.
		const contourHtml = tune.contour
			? '<div class="tune-contour svg-pending" data-pending title="preparing the contour…"></div>'
			: '<div class="tune-contour"></div>';

		const incipitClass = tune.incipit
			? 'tune-incipit svg-pending" data-pending title="preparing the incipit…'
			: "tune-incipit";

		const shareButton =
			currentListState.source === "server"
				? //no extra check on ttId / theSessionId being available
					`<button class="tune-menu-item btn-share" role="menuitem">🔗 Copy share link</button>`
				: "";

		// ── Row HTML ──────────────────────────────────────────────────
		row.innerHTML = `
			<td>
				<div class="tune-main-row">
					<div class="tune-info">
						<div class="tune-name-row">${nameHtml}</div>
						<div class="tune-meta">${metadata}</div>
					</div>
					<div class="tune-right">
						<div class="tune-actions">
							<button class="btn-icon tune-menu-trigger" title="Actions" aria-haspopup="true"
								aria-expanded="false">⋯</button>
							<div class="tune-context-menu" hidden role="menu">
								<button class="tune-menu-item btn-select${tune.selected ? " btn-select--checked" : ""}"
									role="menuitem">${tune.selected ? "☑" : "☐"} Select</button>
								${shareButton}
								<button class="tune-menu-item btn-delete" role="menuitem">🗑 Delete</button>
								<button class="tune-menu-item btn-copy" role="menuitem">📋 Copy code</button>
								<button class="tune-menu-item btn-edit" role="menuitem">✏️ Edit</button>
							</div>
						</div>
					   ${contourHtml}
					</div>
				</div>
				<div class="${incipitClass}"></div>
			</td>
			<td class="col-references">${referencesHtml}${scoresHtml}</td>`;

		// ── Event listeners (no inline JS for action buttons) ─────────
		if (hasAbc) {
			row.querySelector(".tune-name").addEventListener("click", (e) => {
				openAbcModal(window.filteredData[index], index);
				e.preventDefault();
			});
		}

		// ⋯ context menu
		const trigger = row.querySelector(".tune-menu-trigger");
		const menu = row.querySelector(".tune-context-menu");

		trigger.addEventListener("click", (e) => {
			e.stopPropagation();
			const opening = menu.hidden;
			// close any other open menus
			document
				.querySelectorAll(".tune-context-menu:not([hidden])")
				.forEach((m) => {
					m.hidden = true;
					m.closest(".tune-actions")
						?.querySelector(".tune-menu-trigger")
						?.setAttribute("aria-expanded", "false");
				});
			if (opening) {
				menu.hidden = false;
				trigger.setAttribute("aria-expanded", "true");
			}
		});

		row.querySelector(".btn-select").addEventListener("click", () => {
			menu.hidden = true;
			trigger.setAttribute("aria-expanded", "false");
			toggleTuneSelected(index, row);
		});
		row.querySelector(".btn-edit").addEventListener("click", () => {
			menu.hidden = true;
			editModal.openWithTune(window.filteredData[index], index);
		});

		row.querySelector(".btn-copy").addEventListener("click", () => {
			menu.hidden = true;
			copySingleTune(index, trigger);
		});
		row.querySelector(".btn-share")?.addEventListener("click", () => {
			menu.hidden = true;
			copyShare(index, trigger);
		});
		row.querySelector(".btn-delete").addEventListener("click", () => {
			menu.hidden = true;
			deleteTune(index);
		});
		// Badge clicks toggle metadata filters; preserve the tune's viewport position
		row.querySelector(".tune-meta").addEventListener("click", (e) => {
			const badge = e.target.closest(".badge");
			if (!badge) return;
			const anchorOffset = row.getBoundingClientRect().top;
			toggleBadgeFilter(
				badge.dataset.metaType,
				badge.dataset.metaValue,
				tune,
				anchorOffset
			);
		});

		tbody.appendChild(row);
		observer.observe(row);
		viewportObserver.observe(row);
	});

	document.getElementById("spCount").innerText =
		`${window.filteredData.length}/${window.tunesData.length} tunes`;

	schedulePrecalculation();
}

function applyFilters() {
	const searchTerm = document.getElementById("searchInput").value.toLowerCase();
	const rhythmFilter = document.getElementById("rhythmFilter").value;
	const tonicFilter = document.getElementById("tonicFilter").value;
	const modeFilter = document.getElementById("modeFilter").value;

	// Extracted to avoid repeating the same checks in every search branch.
	// Tonic and mode are matched against the normalised key string split on first space.
	const matchesDropdowns = (tune) => {
		if (rhythmFilter !== "" && tune.rhythm?.toLowerCase() !== rhythmFilter)
			return false;
		if (tonicFilter !== "" || modeFilter !== "") {
			const normKey = tune.key ? normaliseKey(tune.key).join(" ") : "";
			const { tonic, mode } = splitKey(normKey);
			if (tonicFilter !== "" && tonic !== tonicFilter) return false;
			if (modeFilter !== "" && mode !== modeFilter) return false;
		}
		return true;
	};

	// AND across types, OR within the same type
	const matchesBadgeFilters = (tune) => {
		if (activeBadgeFilters.size === 0) return true;
		const meta = getTuneMetadata(tune);
		for (const [type, values] of activeBadgeFilters) {
			if (
				!meta.some((m) => m.type === type && values.has(m.value.toLowerCase()))
			)
				return false;
		}
		return true;
	};

	window.filteredData = window.tunesData.filter((tune) => {
		if (!matchesDropdowns(tune)) return false;
		if (!matchesBadgeFilters(tune)) return false;
		if (searchTerm === "") return true;

		// Search in tune name
		if (tune.name?.toLowerCase().includes(searchTerm)) return true;

		// Search in aka and titles (alternate names)
		if (
			tune.aka?.some((t) => t.toLowerCase().includes(searchTerm)) ||
			tune.titles?.some((t) => t.toLowerCase().includes(searchTerm))
		)
			return true;

		// Search in metadata (rhythm, parts, key, composer, origin, tags, structure)
		if (
			getTuneMetadata(tune).some((m) =>
				m.value.toLowerCase().includes(searchTerm)
			)
		)
			return true;

		// Search in references (artists and notes)
		if (
			(tune.references ?? [])
				.concat(tune.referencesFromAbc ?? [])
				.some(
					(ref) =>
						ref.artists?.toLowerCase().includes(searchTerm) ||
						ref.notes?.toLowerCase().includes(searchTerm)
				)
		)
			return true;

		// Search in ABC content
		if (tune.abc) {
			const abcContent = Array.isArray(tune.abc)
				? tune.abc.join(" ")
				: tune.abc;
			if (abcContent.toLowerCase().includes(searchTerm)) return true;
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

function selectByIdProperty(idProperty, id) {
	const tunes = window.tunesData.filter((tune) => tune[idProperty] === id);
	if (tunes.length > 0) {
		tunes[0]._isCrTarget = true;
		tunes[0].selected = true;
	}

	populateFilters();
	applyFilters();
	removeSpinner();
	scrollToFirstTune(tunes);
}

function removeSpinner() {
	if (!_spinnerHidden) {
		document.getElementById("page-spinner").setAttribute("hidden", "");
		document.getElementById("page-main").removeAttribute("hidden");
	}
	_spinnerHidden = true;
}

function sortData() {
	if (currentSortIndex < sortConstants.PREDEFINED_SORT_NAMES.length - 1) {
		currentSortIndex++;
	} else {
		currentSortIndex = 0;
	}
	window.currentSortType =
		sortConstants.PREDEFINED_SORT_NAMES[currentSortIndex];
	sortTunesArray(window.filteredData, {
		predefinedSort: window.currentSortType
	});
	renderTable();
	updateFooter();
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

	eventBus.on("tuneImported", async (tuneData) => {
		window.tunesData.push(tuneData);
		await saveTunesToStorage();
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
	await slotManager.init();

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
	if (
		params.has("q") ||
		params.has("n") ||
		params.has("ttId") ||
		params.has("theSessionId")
	)
		pendingUrlParams = params;
	if (params.has("s")) pendingSetParam = params.get("s");

	// ?g= auto-selects a matching server list
	const gParam = params.get("g");
	if (gParam && manifest) {
		const match = manifest.lists.find(
			(l) => l.group?.toLowerCase() === gParam.toLowerCase()
		);
		if (match) {
			try {
				await loadServerListById(
					match.id,
					match.file,
					match.name,
					match.lastUpdate,
					match.defaultSort
				);
				return;
			} catch (e) {
				console.warn("Failed to auto-load ?g= list:", e);
			}
		}
	}
	// ?l= auto-selects a matching server list
	const lParam = params.get("l");
	if (lParam && manifest) {
		const match = manifest.lists.find(
			(l) => l.id.toLowerCase() === lParam.toLowerCase()
		);
		if (match) {
			try {
				await loadServerListById(
					match.id,
					match.file,
					match.name,
					match.lastUpdate
				);
				return;
			} catch (e) {
				console.warn("Failed to auto-load ?l= list:", e);
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

// -- DOMContentLoaded ---------------------------------------------------------

document.addEventListener("DOMContentLoaded", async function () {
	let initResult;
	try {
		initResult = await initialiseData();
	} catch (e) {
		console.error("Initialisation error:", e);
	} finally {
		removeSpinner();
	}

	document.getElementById("searchForm").addEventListener("submit", (e) => {
		e.preventDefault();
		applyFilters();
	});
	document
		.getElementById("rhythmFilter")
		.addEventListener("change", applyFilters);
	document
		.getElementById("tonicFilter")
		.addEventListener("change", applyFilters);
	document
		.getElementById("modeFilter")
		.addEventListener("change", applyFilters);

	document.querySelectorAll("th.sortable").forEach((th) => {
		th.addEventListener("click", function () {
			sortData();
		});
	});

	// Dropdown menu
	const editMenuBtn = document.getElementById("editMenuBtn");
	const dropdown = editMenuBtn.parentElement;

	// Toggle .active and aria-expanded in one place
	const setDropdownOpen = (open) => {
		dropdown.classList.toggle("active", open);
		editMenuBtn.setAttribute("aria-expanded", String(open));
	};

	editMenuBtn.addEventListener("click", (e) => {
		e.stopPropagation();
		setDropdownOpen(!dropdown.classList.contains("active"));
	});

	// Close any open tune context menus when clicking outside
	document.addEventListener("click", (e) => {
		if (!dropdown.contains(e.target)) setDropdownOpen(false);
		document
			.querySelectorAll(".tune-context-menu:not([hidden])")
			.forEach((m) => {
				m.hidden = true;
				m.closest(".tune-actions")
					?.querySelector(".tune-menu-trigger")
					?.setAttribute("aria-expanded", "false");
			});
	});

	// Helper: close dropdown then invoke action
	const dropdownAction = (id, fn) => {
		document.getElementById(id)?.addEventListener("click", (e) => {
			e.preventDefault();
			setDropdownOpen(false);
			fn(e);
		});
	};

	dropdownAction("addTunesBtn", () => addTunesModal.open());
	dropdownAction("loadJsonBtn", () => loadJsonModal.open());
	dropdownAction("addNewTuneBtn", () => addNewTune());
	dropdownAction("copyTunesBtn", () => copyTunesToClipboard());
	dropdownAction("emptyTunesBtn", () => emptyTunes());
	dropdownAction("manageSlotsBtn", () => openTuneListSelector());
	dropdownAction("tuneListSelectorBtn", () => openTuneListSelector());
	dropdownAction("doubleBtn2", () => bulkChangeBarLength(1));
	dropdownAction("halveBtn2", () => bulkChangeBarLength(-1));

	// thesession import: openTheSessionImport needs the original event and dropdown ref
	document
		.getElementById("thesession-import-btn")
		?.addEventListener("click", (e) => openTheSessionImport(e, dropdown, 0));

	// document
	// 	.getElementById("thesession-sets-import-btn")
	// 	?.addEventListener("click", (e) => openTheSessionImport(e, dropdown, 1));

	const tuneSelectionsBtn = document.getElementById("tuneSelectionsBtn");
	if (tuneSelectionsBtn) {
		tuneSelectionsBtn.addEventListener("click", (e) => {
			e.preventDefault();
			setDropdownOpen(false);
			tuneSelectionsModal.open();
		});
		// Keep enabled state in sync when the dropdown opens
		editMenuBtn.addEventListener("click", () => {
			tuneSelectionsBtn.disabled = !tuneSelectionsModal.isEnabled();
			const toArray = (abc) => (Array.isArray(abc) ? abc : [abc]);
			document
				.getElementById("doubleBtn2")
				?.toggleAttribute(
					"disabled",
					!window.tunesData?.some(
						(t) => t.abc && toArray(t.abc).some(canDoubleBarLength)
					)
				);
			document
				.getElementById("halveBtn2")
				?.toggleAttribute(
					"disabled",
					!window.tunesData?.some(
						(t) => t.abc && toArray(t.abc).some(canHalveBarLength)
					)
				);
		});
	}

	window.addEventListener("beforeunload", (e) => {
		if (isDirty) {
			e.preventDefault();
			e.returnValue = "";
		}
	});

	// ── Help / intro button ───────────────────────────────────────────────────
	const helpBtns = document.getElementsByClassName("btn-help");
	for (let index = 0; index < helpBtns.length; index++) {
		const el = helpBtns[index];
		el.addEventListener("click", () => {
			new IntroModal().open();
		});
	}

	// ── Post-load action ──────────────────────────────────────────────────────
	// Shared logic that runs either immediately (returning user) or after the
	// intro modal is dismissed (first-time user).
	//
	// Priority order:
	//   1. No list loaded yet         → open the tune-list selector.
	//   2. URL params narrowed to one tune or set → open the score viewer for it
	//   3. Otherwise                  → do nothing; table is already shown.
	function runPostLoadAction() {
		if (initResult?.needsSelector) {
			tuneListSelectorModal.openWithContext(initResult.manifest, null);
			return;
		}
		// ?s= opens the set viewer for a named set
		if (pendingSetParam) {
			const setData = findSetByName(pendingSetParam);

			if (setData)
				getAbcModal().openWithSet({
					...setData,
					onClose: () => scrollToFirstTune(setData.tunes)
				});
			else console.warn(`?s=: no set found matching "${pendingSetParam}"`);
			pendingSetParam = null;
			return;
		}
		// // Open score viewer automatically when a ?n= / ?q= param resolves to a
		// // single tune with ABC notation attached.
		// if (
		// 	window.location.search.length > 0 &&
		// 	window.filteredData?.length === 1 &&
		// 	window.filteredData[0].abc
		// ) {
		// 	openAbcModal(window.filteredData[0]);
		// }
	}

	if (!IntroModal.hasBeenSeen()) {
		// First visit: always show intro first, regardless of URL params.
		// The post-load action fires only after the user dismisses it.
		new IntroModal({ onDismiss: runPostLoadAction }).open();
	} else {
		runPostLoadAction();
	}
});
