"use strict";
import AbcJs from "abcjs";
import Modal from "./Modal.js";
import PrintPreviewModal from "./PrintPreviewModal.js";
import { getIncipit } from "@goplayerjuggler/abc-tools";
import javascriptify from "@goplayerjuggler/abc-tools/src/javascriptify.js";

import { findTuneByEntry } from "../setUtils.js";

/**
 * Build a short human-readable label for one setting within tune.abc.
 * @param {string} abc
 * @param {number} index - 0-based index, used only in the last-resort fallback
 * @returns {string}
 */
function buildSettingLabel(abc, index) {
	const settingMatch = abc.match(/tunes\/\d+#setting(\d+)/);
	const userMatch = abc.match(/by user "([^"]+)" on ([\d-]+)/);
	const keyMatch = abc.match(/^K:(.+)/m);
	const settingId = settingMatch?.[1];
	const user = userMatch?.[1] ?? "";
	const date = userMatch?.[2] ?? "";
	const key = keyMatch?.[1]?.trim() ?? "";

	if (settingId) {
		return [`#${settingId}`, user, date, key].filter(Boolean).join(" · ");
	}
	const xMatch = abc.match(/^X:(\d+)/m);
	return `Setting ${xMatch?.[1] ?? index + 1}`;
}

/**
 * Resolve a stable ID object for a tune, for storage in a set list.
 * Returns null and calls onError if no ID is available.
 * @param {object} tune
 * @param {function} onError
 * @returns {object|null}
 */
function resolveTuneId(tune, onError) {
	if (tune.theSessionId) return { theSessionId: tune.theSessionId };
	if (tune.norbeckId) {
		const r = tune.norbeckR ?? tune.rhythm;
		if (r) return { norbeckId: tune.norbeckId, norbeckR: r };
	}
	if (tune.itiId) return { itiId: tune.itiId };
	if (tune.fwId) return { fwId: tune.fwId };
	if (tune.ttId) return { ttId: tune.ttId };

	onError(
		`"${tune.name}" has no external or internal ID and can't be added to a set list.`
	);
	return null;
}

function generateId() {
	return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function createSetList(name) {
	return {
		id: generateId(),
		name,
		dateCreated: new Date().toISOString(),
		dateModified: new Date().toISOString(),
		sets: [{ name: "Set 1", comments: "", tunes: [], collapsed: false }]
	};
}

/**
 * Modal for creating and managing set lists (tune selections).
 */
export default class TuneSelectionsModal extends Modal {
	/** @param {{ saveTunesToStorage: function, applyFilters: function }} callbacks */
	constructor(callbacks) {
		super({
			id: "tune-selections-modal",
			title: "📑 Tune selections",
			size: "large"
		});

		this._callbacks = callbacks;

		this._setLists = [];
		this._current = null;
		this._isDirty = false;
		this._sortOrder = "date";
		this._dragItem = null;
		this._selectedSetIdx = 0;
	}

	// ─── Public API ─────────────────────────────────────────────────────────────

	open() {
		if (!this._current) {
			const selected = window.tunesData.filter((t) => t.selected);
			if (selected.length >= 2) {
				this._current = createSetList(this._uniqueSetListName());
				for (const tune of selected) {
					const idObj = resolveTuneId(tune, (msg) => console.warn(msg));
					if (idObj) this._current.sets[0].tunes.push({ ...idObj, notes: "" });
				}
			} else if (this._setLists.length) {
				this._current = this._setLists
					.slice()
					.sort((a, b) => b.dateModified.localeCompare(a.dateModified))[0];
			} else {
				this._current = createSetList(this._uniqueSetListName());
			}
		}

		if (!this.element) {
			this.render();
			document.body.appendChild(this.element);
		}

		this._renderContents();
		this._recomputeDirty();
		super.open();
	}

	close() {
		if (!this.element) return;
		if (
			this._isDirty &&
			!confirm("You have unsaved changes. Close anyway and lose them?")
		)
			return;

		this._clearDirty();
		this.element.classList.remove("modal-active");
		this.clearAutoHideTimer();

		if (this.escHandler) {
			document.removeEventListener("keydown", this.escHandler);
			this.escHandler = null;
		}

		window.tunesData.forEach((t) => {
			t.selected = false;
		});
		this._callbacks.applyFilters?.();
	}

	isEnabled() {
		return (
			this._setLists.length > 0 ||
			window.tunesData.filter((t) => t.selected).length >= 2
		);
	}

	isTuneInSetLists(tune) {
		const idObj = resolveTuneId(tune, () => {});
		if (!idObj) return false;
		const [key, val] = Object.entries(idObj)[0];
		return this._setLists.some((sl) =>
			sl.sets.some((s) => s.tunes?.some((e) => e[key] === val))
		);
	}

	// ─── DOM construction ────────────────────────────────────────────────────────

	render() {
		super.render();

		this.element.querySelector(".modal__body").innerHTML = `
			<div class="tune-selections-body">
				<div class="ts-pane ts-pane--available">
					<h3 class="ts-pane-title">Available tunes <span class="ts-count"></span></h3>
					<div class="ts-available-list"></div>
				</div>
				<div class="ts-pane ts-pane--builder">
					<div class="ts-header">
						<div class="ts-name-row">
							<input type="text" class="ts-name-input" placeholder="Set list name…" />
						</div>
						<div class="ts-action-row">
							<button class="btn btn-sm ts-new-btn"       title="Create a new set list">✨ New</button>
							<button class="btn btn-sm ts-save-btn"      title="Save">💾 Save</button>
							<button class="btn btn-sm ts-duplicate-btn" title="Duplicate">📋 Duplicate</button>
							<button class="btn btn-sm ts-copy-btn"      title="Copy set list data to clipboard as JS literal">⬡ Copy data</button>
							<button class="btn btn-sm ts-delete-btn"    title="Delete this set list">🗑️ Delete</button>
						</div>
						<div class="ts-saved-row">
							<span>Saved set lists:</span>
							<select class="ts-sort-select">
								<option value="date">Sort: by date</option>
								<option value="name">Sort: by name</option>
							</select>
							<div class="ts-saved-list"></div>
						</div>
					</div>
					<div class="ts-builder"></div>
				</div>
			</div>
			<div class="modal__footer">
				<button class="btn ts-close-btn">Close</button>
				<button class="btn btn-primary ts-preview-btn" title="Print preview">🖨️ Preview &amp; print</button>
			</div>`;

		this.element
			.querySelector(".ts-close-btn")
			.addEventListener("click", () => this.close());
		this.element
			.querySelector(".ts-preview-btn")
			.addEventListener("click", () => this._openPreview());
		this.element
			.querySelector(".ts-new-btn")
			.addEventListener("click", () => this._newSetList());
		this.element
			.querySelector(".ts-save-btn")
			.addEventListener("click", () => this._save());
		this.element
			.querySelector(".ts-duplicate-btn")
			.addEventListener("click", () => this._duplicate());
		this.element
			.querySelector(".ts-copy-btn")
			.addEventListener("click", () => this._copyToClipboard());
		this.element
			.querySelector(".ts-delete-btn")
			.addEventListener("click", () => this._delete());
		this.element
			.querySelector(".ts-sort-select")
			.addEventListener("change", (e) => {
				this._sortOrder = e.target.value;
				this._renderSavedList();
			});
		this.element
			.querySelector(".ts-name-input")
			.addEventListener("input", (e) => {
				if (this._current) {
					this._current.name = e.target.value;
					this._markDirty();
				}
			});

		return this.element;
	}

	// ─── Rendering ──────────────────────────────────────────────────────────────

	_renderContents() {
		this._renderAvailable();
		this._renderSavedList();
		this._renderBuilder();
		this.element.querySelector(".ts-name-input").value =
			this._current?.name ?? "";
	}

	_renderAvailable() {
		const selected = window.tunesData.filter((t) => t.selected);
		const pane = this.element.querySelector(".ts-available-list");
		const count = this.element.querySelector(".ts-count");
		count.textContent = selected.length ? `(${selected.length} selected)` : "";

		pane.innerHTML = "";
		if (!selected.length) {
			pane.innerHTML = `<p class="ts-empty-msg">No tunes selected in the main table.</p>`;
			return;
		}

		selected.forEach((tune) => {
			const card = this._buildTuneCard(tune);

			// ── Mouse drag-and-drop (desktop) ──
			card.draggable = true;
			card.classList.add("ts-draggable");
			card.title = "Drag to a set, or tap + to add";
			card.addEventListener("dragstart", (e) => {
				this._dragItem = { type: "available", tune };
				e.dataTransfer.effectAllowed = "copy";
				card.classList.add("dragging");
			});
			card.addEventListener("dragend", () => {
				card.classList.remove("dragging");
				this._dragItem = null;
			});

			// ── Keyboard: → adds to currently selected set ──
			card.addEventListener("keydown", (e) => {
				if (e.key === "ArrowRight") this._addTuneToCurrentSet(tune);
			});
			card.tabIndex = 0;
			pane.appendChild(card);
		});

		// Render single-setting incipits after insertion into DOM
		selected.forEach((tune) => {
			if (tune.incipit) {
				const id = `ts-avail-incipit-${tune.ttId ?? tune.theSessionId ?? tune.name.replace(/\s+/g, "-")}`;
				const el = pane.querySelector(`[data-incipit-id="${id}"]`);
				if (el)
					AbcJs.renderAbc(el.id, tune.incipit, {
						scale: 0.7,
						staffwidth: 200,
						paddingtop: 1,
						paddingbottom: 1,
						paddingright: 1,
						paddingleft: 1
					});
			}
		});
	}

	_renderSavedList() {
		const container = this.element.querySelector(".ts-saved-list");
		if (!this._setLists.length) {
			container.innerHTML = `<span class="ts-empty-msg">None saved yet.</span>`;
			return;
		}

		const sorted = this._setLists
			.slice()
			.sort((a, b) =>
				this._sortOrder === "name"
					? a.name.localeCompare(b.name)
					: b.dateModified.localeCompare(a.dateModified)
			);

		container.innerHTML = "";
		sorted.forEach((sl) => {
			const item = document.createElement("div");
			item.className = "ts-saved-item";
			if (sl.id === this._current?.id)
				item.classList.add("ts-saved-item--active");
			item.textContent =
				sl.name + (sl.id === this._current?.id ? " (editing)" : "");
			item.addEventListener("click", () => {
				if (
					this._isDirty &&
					!confirm(
						"You have unsaved changes. Discard them and switch set list?"
					)
				)
					return;
				this._current = sl;
				this._renderContents();
				this._recomputeDirty();
			});
			container.appendChild(item);
		});
	}

	_renderBuilder() {
		const builder = this.element.querySelector(".ts-builder");
		builder.innerHTML = "";
		if (!this._current) return;

		this._current.sets.forEach((set, setIdx) => {
			builder.appendChild(this._buildSetBlock(set, setIdx));
		});

		const addSetBtn = document.createElement("button");
		addSetBtn.className = "btn btn-sm ts-add-set-btn";
		addSetBtn.textContent = "+ Add set divider";
		addSetBtn.addEventListener("click", () => this._addSet());
		builder.appendChild(addSetBtn);
	}

	/**
	 * Build a set block: header (accordion toggle + reorder buttons) +
	 * collapsible body with tune entries.
	 */
	_buildSetBlock(set, setIdx) {
		const multiSet = this._current.sets.length > 1;
		const block = document.createElement("div");
		block.className = "ts-set-block";
		if (set.collapsed) block.classList.add("ts-set-block--collapsed");
		if (setIdx === this._selectedSetIdx)
			block.classList.add("ts-set-block--selected");
		block.dataset.setIdx = setIdx;

		// ── Header ──
		const header = document.createElement("div");
		header.className = "ts-set-header";

		const chevron = document.createElement("span");
		chevron.className = "ts-set-chevron";
		chevron.setAttribute("aria-hidden", "true");
		header.appendChild(chevron);

		const nameInput = document.createElement("input");
		nameInput.type = "text";
		nameInput.className = "ts-set-name-input";
		nameInput.value = set.name;
		nameInput.addEventListener("input", (e) => {
			set.name = e.target.value;
			this._markDirty();
		});
		nameInput.addEventListener("click", (e) => e.stopPropagation());
		nameInput.addEventListener("mousedown", (e) => e.stopPropagation());
		header.appendChild(nameInput);

		const tuneCount = document.createElement("span");
		tuneCount.className = "ts-set-tune-count";
		tuneCount.textContent = set.tunes?.length
			? `${set.tunes.length} tune${set.tunes.length !== 1 ? "s" : ""}`
			: "";
		header.appendChild(tuneCount);

		if (multiSet) {
			// ── Visible reorder buttons (touch-friendly; keyboard ↑/↓ also works) ──
			const reorderWrap = document.createElement("div");
			reorderWrap.className = "ts-reorder-btns";
			reorderWrap.setAttribute("aria-label", "Reorder set");

			const upBtn = document.createElement("button");
			upBtn.className = "btn-icon ts-reorder-btn";
			upBtn.textContent = "▲";
			upBtn.title = "Move set up";
			upBtn.setAttribute("aria-label", "Move set up");
			upBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				if (setIdx > 0) {
					[this._current.sets[setIdx - 1], this._current.sets[setIdx]] = [
						this._current.sets[setIdx],
						this._current.sets[setIdx - 1]
					];
					this._selectedSetIdx = setIdx - 1;
					this._renderBuilder();
					this._markDirty();
					this._focusSetHeader(this._selectedSetIdx);
				}
			});

			const downBtn = document.createElement("button");
			downBtn.className = "btn-icon ts-reorder-btn";
			downBtn.textContent = "▼";
			downBtn.title = "Move set down";
			downBtn.setAttribute("aria-label", "Move set down");
			downBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				if (setIdx < this._current.sets.length - 1) {
					[this._current.sets[setIdx + 1], this._current.sets[setIdx]] = [
						this._current.sets[setIdx],
						this._current.sets[setIdx + 1]
					];
					this._selectedSetIdx = setIdx + 1;
					this._renderBuilder();
					this._markDirty();
					this._focusSetHeader(this._selectedSetIdx);
				}
			});

			reorderWrap.appendChild(upBtn);
			reorderWrap.appendChild(downBtn);
			header.appendChild(reorderWrap);

			const removeBtn = document.createElement("button");
			removeBtn.className = "btn-icon btn-danger ts-remove-set-btn";
			removeBtn.title = "Remove this set";
			removeBtn.setAttribute("aria-label", "Remove set");
			removeBtn.textContent = "×";
			removeBtn.addEventListener("click", (e) => {
				e.stopPropagation();
				this._current.sets.splice(setIdx, 1);
				this._selectedSetIdx = Math.min(
					this._selectedSetIdx,
					this._current.sets.length - 1
				);
				this._renderBuilder();
				this._markDirty();
			});
			header.appendChild(removeBtn);
		}

		header.addEventListener("click", () => {
			if (this._selectedSetIdx !== setIdx) {
				const prev = this.element.querySelector(".ts-set-block--selected");
				prev?.classList.remove("ts-set-block--selected");
				block.classList.add("ts-set-block--selected");
				this._selectedSetIdx = setIdx;
				return;
			}
			set.collapsed = !set.collapsed;
			block.classList.toggle("ts-set-block--collapsed", set.collapsed);
			body.style.display = set.collapsed ? "none" : "";
		});

		// Set reordering by drag (desktop) — also works alongside the ▲/▼ buttons
		if (multiSet) {
			block.draggable = true;
			block.classList.add("ts-draggable");

			block.addEventListener("dragstart", (e) => {
				if (e.target.closest?.(".ts-set-body")) return;
				this._dragItem = { type: "set", setIdx };
				e.dataTransfer.effectAllowed = "move";
				block.classList.add("dragging");
			});
			block.addEventListener("dragend", () => {
				block.classList.remove("dragging");
				this._dragItem = null;
			});

			block.addEventListener("dragover", (e) => {
				if (this._dragItem?.type !== "set" || this._dragItem.setIdx === setIdx)
					return;
				e.preventDefault();
				e.dataTransfer.dropEffect = "move";
				block.classList.add("ts-drop-target--set");
			});
			block.addEventListener("dragleave", (e) => {
				if (!block.contains(e.relatedTarget))
					block.classList.remove("ts-drop-target--set");
			});
			block.addEventListener("drop", (e) => {
				block.classList.remove("ts-drop-target--set");
				if (this._dragItem?.type !== "set" || this._dragItem.setIdx === setIdx)
					return;
				e.preventDefault();
				e.stopPropagation();
				const [moved] = this._current.sets.splice(this._dragItem.setIdx, 1);
				this._current.sets.splice(setIdx, 0, moved);
				this._selectedSetIdx = setIdx;
				this._renderBuilder();
				this._markDirty();
			});

			// Keyboard ↑/↓ on focused header as a complement to the visible buttons
			header.tabIndex = 0;
			header.addEventListener("keydown", (e) => {
				if (e.key === "ArrowUp" && setIdx > 0) {
					e.preventDefault();
					[this._current.sets[setIdx - 1], this._current.sets[setIdx]] = [
						this._current.sets[setIdx],
						this._current.sets[setIdx - 1]
					];
					this._selectedSetIdx = setIdx - 1;
					this._renderBuilder();
					this._markDirty();
					this._focusSetHeader(this._selectedSetIdx);
				} else if (
					e.key === "ArrowDown" &&
					setIdx < this._current.sets.length - 1
				) {
					e.preventDefault();
					[this._current.sets[setIdx + 1], this._current.sets[setIdx]] = [
						this._current.sets[setIdx],
						this._current.sets[setIdx + 1]
					];
					this._selectedSetIdx = setIdx + 1;
					this._renderBuilder();
					this._markDirty();
					this._focusSetHeader(this._selectedSetIdx);
				}
			});
		}

		block.appendChild(header);

		// ── Collapsible body ──
		const body = document.createElement("div");
		body.className = "ts-set-body";

		let tunePos = this._current.sets
			.slice(0, setIdx)
			.reduce((n, s) => n + (s.tunes?.length ?? 0), 0);

		set.tunes?.forEach((entry, tuneIdx) => {
			tunePos++;
			const tune = findTuneByEntry(entry, window.tunesData);
			body.appendChild(
				this._buildSetTuneEntry(tune, entry, setIdx, tuneIdx, tunePos)
			);
		});

		if (set.collapsed) body.style.display = "none";
		block.appendChild(body);
		this._attachDropZone(body, setIdx);
		this._attachHeaderDropZone(header, setIdx);

		return block;
	}

	/** Build a tune entry row inside a set block. */
	_buildSetTuneEntry(tune, entry, setIdx, tuneIdx, position) {
		if (!tune) return;
		const el = document.createElement("div");
		el.className = "ts-set-tune";
		el.draggable = true;
		el.dataset.setIdx = setIdx;
		el.dataset.tuneIdx = tuneIdx;

		const pos = document.createElement("span");
		pos.className = "ts-tune-pos";
		pos.textContent = position;
		el.appendChild(pos);

		const info = document.createElement("div");
		info.className = "ts-tune-info";
		if (tune) {
			const nameEl = document.createElement("div");
			nameEl.className = "ts-tune-name";
			nameEl.textContent = tune.name;
			info.appendChild(nameEl);

			const abcs = Array.isArray(tune.abc)
				? tune.abc
				: tune.abc
					? [tune.abc]
					: [];
			let settingIdx = 0;

			if (abcs.length > 1) {
				if (entry.theSessionSettingId != null) {
					const found = abcs.findIndex((a) =>
						a.includes(`#setting${entry.theSessionSettingId}`)
					);
					if (found >= 0) settingIdx = found;
				} else if (entry.x != null) {
					const found = abcs.findIndex((a) =>
						new RegExp(String.raw`(?:^|\n)X:\s?${entry.x}\n`).test(a)
					);
					if (found >= 0) settingIdx = found;
				}
			}

			const incipitId = `ts-builder-incipit-s${setIdx}-t${tuneIdx}`;

			if (abcs.length > 1) {
				const labelEl = document.createElement("div");
				labelEl.className = "ts-setting-label";
				labelEl.textContent = buildSettingLabel(abcs[settingIdx], settingIdx);
				info.appendChild(labelEl);

				const incipitWrap = document.createElement("div");
				incipitWrap.className = "ts-setting-wrap";

				const incipitEl = document.createElement("div");
				incipitEl.id = incipitId;
				incipitEl.className = "ts-tune-incipit";
				incipitWrap.appendChild(incipitEl);

				const btnPrev = document.createElement("button");
				btnPrev.className = "btn-icon ts-setting-prev";
				btnPrev.title = "Previous setting";
				btnPrev.textContent = "▲";

				const btnNext = document.createElement("button");
				btnNext.className = "btn-icon ts-setting-next";
				btnNext.title = "Next setting";
				btnNext.textContent = "▼";

				const navCol = document.createElement("div");
				navCol.className = "ts-setting-nav";
				navCol.appendChild(btnPrev);
				navCol.appendChild(btnNext);
				incipitWrap.appendChild(navCol);
				info.appendChild(incipitWrap);

				const stepSetting = (delta) => {
					settingIdx = (settingIdx + delta + abcs.length) % abcs.length;
					const abc = abcs[settingIdx];

					const settingMatch = abc.match(/tunes\/\d+#setting(\d+)/);
					if (settingMatch) {
						entry.theSessionSettingId = parseInt(settingMatch[1], 10);
						delete entry.x;
					} else {
						const xMatch = abc.match(/(?:^|\n)X:\s?(\d+)\n/m);
						entry.x = xMatch ? parseInt(xMatch[1], 10) : undefined;
						delete entry.theSessionSettingId;
					}

					labelEl.textContent = buildSettingLabel(abc, settingIdx);
					AbcJs.renderAbc(incipitId, getIncipit({ abc }), {
						scale: 0.7,
						staffwidth: 220,
						paddingtop: 1,
						paddingbottom: 1,
						paddingright: 1,
						paddingleft: 1
					});
					this._markDirty();
				};

				btnPrev.addEventListener("click", (e) => {
					e.stopPropagation();
					stepSetting(-1);
				});
				btnNext.addEventListener("click", (e) => {
					e.stopPropagation();
					stepSetting(+1);
				});
			} else if (tune.incipit) {
				const incipitEl = document.createElement("div");
				incipitEl.id = incipitId;
				incipitEl.className = "ts-tune-incipit";
				info.appendChild(incipitEl);
			}

			requestAnimationFrame(() => {
				const source =
					abcs.length > 1
						? getIncipit({ abc: abcs[settingIdx] })
						: tune.incipit;
				if (source) {
					AbcJs.renderAbc(incipitId, source, {
						scale: 0.7,
						staffwidth: 220,
						paddingtop: 1,
						paddingbottom: 1,
						paddingright: 1,
						paddingleft: 1
					});
				}
			});
		} else {
			const unknownEl = document.createElement("div");
			unknownEl.className = "ts-tune-name ts-tune-unknown";
			unknownEl.textContent = `(tune not found: ${JSON.stringify(entry)})`;
			info.appendChild(unknownEl);
		}

		const notes = document.createElement("input");
		notes.type = "text";
		notes.className = "ts-tune-notes";
		notes.placeholder = "Notes…";
		notes.value = entry.notes ?? "";
		notes.addEventListener("input", (e) => {
			entry.notes = e.target.value;
			this._markDirty();
		});
		info.appendChild(notes);

		el.appendChild(info);

		// ── Reorder buttons (▲/▼) — visible on touch, hover-revealed on desktop ──
		const reorderWrap = document.createElement("div");
		reorderWrap.className = "ts-reorder-btns ts-tune-reorder";
		reorderWrap.setAttribute("aria-label", "Reorder tune");

		const upBtn = document.createElement("button");
		upBtn.className = "btn-icon ts-reorder-btn";
		upBtn.textContent = "▲";
		upBtn.title = "Move up";
		upBtn.setAttribute("aria-label", "Move tune up");
		upBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			const set = this._current.sets[setIdx];
			if (!set.tunes || tuneIdx === 0) return;
			[set.tunes[tuneIdx - 1], set.tunes[tuneIdx]] = [
				set.tunes[tuneIdx],
				set.tunes[tuneIdx - 1]
			];
			this._renderBuilder();
			this._markDirty();
		});

		const downBtn = document.createElement("button");
		downBtn.className = "btn-icon ts-reorder-btn";
		downBtn.textContent = "▼";
		downBtn.title = "Move down";
		downBtn.setAttribute("aria-label", "Move tune down");
		downBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			const set = this._current.sets[setIdx];
			if (!set.tunes || tuneIdx >= set.tunes.length - 1) return;
			[set.tunes[tuneIdx + 1], set.tunes[tuneIdx]] = [
				set.tunes[tuneIdx],
				set.tunes[tuneIdx + 1]
			];
			this._renderBuilder();
			this._markDirty();
		});

		reorderWrap.appendChild(upBtn);
		reorderWrap.appendChild(downBtn);
		el.appendChild(reorderWrap);

		const removeBtn = document.createElement("button");
		removeBtn.className = "btn-icon btn-danger ts-remove-tune-btn";
		removeBtn.title = "Remove from set";
		removeBtn.setAttribute("aria-label", "Remove tune from set");
		removeBtn.textContent = "×";
		removeBtn.addEventListener("click", () => {
			this._current.sets[setIdx].tunes?.splice(tuneIdx, 1);
			this._renderBuilder();
			this._markDirty();
		});
		el.appendChild(removeBtn);

		// Mouse drag-and-drop (desktop)
		el.addEventListener("dragstart", (e) => {
			this._dragItem = { type: "tune", setIdx, tuneIdx };
			e.dataTransfer.effectAllowed = "move";
			el.classList.add("dragging");
			e.stopPropagation();
		});
		el.addEventListener("dragend", () => {
			el.classList.remove("dragging");
			this._dragItem = null;
		});

		// Keyboard ↑/↓ reordering (complements the visible buttons)
		el.tabIndex = 0;
		el.addEventListener("keydown", (e) => {
			const set = this._current.sets[setIdx];
			if (!set.tunes) return;
			if (e.key === "ArrowUp" && tuneIdx > 0) {
				[set.tunes[tuneIdx - 1], set.tunes[tuneIdx]] = [
					set.tunes[tuneIdx],
					set.tunes[tuneIdx - 1]
				];
				this._renderBuilder();
				this._markDirty();
			} else if (e.key === "ArrowDown" && tuneIdx < set.tunes.length - 1) {
				[set.tunes[tuneIdx + 1], set.tunes[tuneIdx]] = [
					set.tunes[tuneIdx],
					set.tunes[tuneIdx + 1]
				];
				this._renderBuilder();
				this._markDirty();
			}
		});

		return el;
	}

	/** Build an available-tune card (left pane), with a "+" add button. */
	_buildTuneCard(tune) {
		const card = document.createElement("div");
		card.className = "ts-tune-card";

		// Header row: name + add button
		const nameRow = document.createElement("div");
		nameRow.className = "ts-tune-card-header";

		const name = document.createElement("div");
		name.className = "ts-tune-name";
		name.textContent = tune.name;
		nameRow.appendChild(name);

		// "+" button — always visible on touch; revealed on hover on desktop.
		// Adds the tune to the currently selected set.
		const addBtn = document.createElement("button");
		addBtn.className = "btn-icon ts-add-tune-btn";
		addBtn.textContent = "+";
		addBtn.title = `Add "${tune.name}" to current set`;
		addBtn.setAttribute("aria-label", `Add ${tune.name} to current set`);
		addBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			this._addTuneToCurrentSet(tune);
		});
		nameRow.appendChild(addBtn);
		card.appendChild(nameRow);

		const abcs = Array.isArray(tune.abc)
			? tune.abc
			: tune.abc
				? [tune.abc]
				: [];

		if (abcs.length > 1) {
			const labelEl = document.createElement("div");
			labelEl.className = "ts-setting-label";
			let settingIdx = 0;
			labelEl.textContent = buildSettingLabel(abcs[0], 0);
			card.appendChild(labelEl);

			const uid =
				tune.ttId ??
				tune.theSessionId ??
				tune.name.replace(/\s+/g, "-").slice(0, 20);
			const incipitId = `ts-avail-incipit-${uid}`;

			const incipitWrap = document.createElement("div");
			incipitWrap.className = "ts-setting-wrap";

			const incipitEl = document.createElement("div");
			incipitEl.id = incipitId;
			incipitEl.dataset.incipitId = incipitId;
			incipitEl.className = "ts-tune-incipit";
			incipitWrap.appendChild(incipitEl);

			const btnPrev = document.createElement("button");
			btnPrev.className = "btn-icon ts-setting-prev";
			btnPrev.title = "Previous setting";
			btnPrev.textContent = "▲";

			const btnNext = document.createElement("button");
			btnNext.className = "btn-icon ts-setting-next";
			btnNext.title = "Next setting";
			btnNext.textContent = "▼";

			const navCol = document.createElement("div");
			navCol.className = "ts-setting-nav";
			navCol.appendChild(btnPrev);
			navCol.appendChild(btnNext);
			incipitWrap.appendChild(navCol);
			card.appendChild(incipitWrap);

			const stepSetting = (delta) => {
				settingIdx = (settingIdx + delta + abcs.length) % abcs.length;
				const abc = abcs[settingIdx];
				labelEl.textContent = buildSettingLabel(abc, settingIdx);
				AbcJs.renderAbc(incipitId, getIncipit({ abc }), {
					scale: 0.7,
					staffwidth: 200,
					paddingtop: 1,
					paddingbottom: 1,
					paddingright: 1,
					paddingleft: 1
				});
			};

			btnPrev.addEventListener("click", (e) => {
				e.stopPropagation();
				stepSetting(-1);
			});
			btnNext.addEventListener("click", (e) => {
				e.stopPropagation();
				stepSetting(+1);
			});

			requestAnimationFrame(() => {
				AbcJs.renderAbc(incipitId, getIncipit({ abc: abcs[0] }), {
					scale: 0.7,
					staffwidth: 200,
					paddingtop: 1,
					paddingbottom: 1,
					paddingright: 1,
					paddingleft: 1
				});
			});
		} else if (tune.incipit) {
			const uid =
				tune.ttId ??
				tune.theSessionId ??
				tune.name.replace(/\s+/g, "-").slice(0, 20);
			const id = `ts-avail-incipit-${uid}`;
			const incipitEl = document.createElement("div");
			incipitEl.id = id;
			incipitEl.dataset.incipitId = id;
			card.appendChild(incipitEl);
		}

		if (tune.rhythm) {
			const rhythm = document.createElement("div");
			rhythm.className = "ts-tune-rhythm badge";
			rhythm.textContent = tune.rhythm;
			card.appendChild(rhythm);
		}

		return card;
	}

	// ─── Drag & drop ────────────────────────────────────────────────────────────

	_focusSetHeader(idx) {
		requestAnimationFrame(() => {
			const headers = this.element.querySelectorAll(
				".ts-set-header[tabindex='0']"
			);
			headers[idx]?.focus();
		});
	}

	_attachHeaderDropZone(header, setIdx) {
		header.addEventListener("dragover", (e) => {
			if (this._dragItem?.type !== "available") return;
			e.preventDefault();
			e.dataTransfer.dropEffect = "copy";
			header.classList.add("ts-drop-target");
		});
		header.addEventListener("dragleave", (e) => {
			if (!header.contains(e.relatedTarget))
				header.classList.remove("ts-drop-target");
		});
		header.addEventListener("drop", (e) => {
			header.classList.remove("ts-drop-target");
			if (this._dragItem?.type !== "available") return;
			e.preventDefault();
			e.stopPropagation();
			this._addTuneToSet(this._dragItem.tune, setIdx);
		});
	}

	_attachDropZone(setBlock, setIdx) {
		setBlock.addEventListener("dragover", (e) => {
			e.preventDefault();
			e.dataTransfer.dropEffect =
				this._dragItem?.type === "available" ? "copy" : "move";
			setBlock.classList.add("ts-drop-target");
		});
		setBlock.addEventListener("dragleave", (e) => {
			if (!setBlock.contains(e.relatedTarget))
				setBlock.classList.remove("ts-drop-target");
		});
		setBlock.addEventListener("drop", (e) => {
			e.preventDefault();
			setBlock.classList.remove("ts-drop-target");
			if (!this._dragItem) return;

			if (this._dragItem.type === "available") {
				this._addTuneToSet(this._dragItem.tune, setIdx);
			} else if (this._dragItem.type === "tune") {
				const { setIdx: fromSet, tuneIdx: fromTune } = this._dragItem;
				const [moved] = this._current.sets[fromSet].tunes.splice(fromTune, 1);
				this._current.sets[setIdx].tunes.push(moved);
				this._renderBuilder();
				this._markDirty();
			}
		});
	}

	// ─── Actions ────────────────────────────────────────────────────────────────

	_addTuneToCurrentSet(tune) {
		const setIdx = Math.min(
			this._selectedSetIdx,
			this._current.sets.length - 1
		);
		this._addTuneToSetObject(tune, this._current.sets[setIdx]);
		this._renderBuilder();
	}

	_addTuneToSet(tune, setIdx) {
		this._addTuneToSetObject(tune, this._current.sets[setIdx]);
		this._renderBuilder();
	}

	_addTuneToSetObject(tune, setObj) {
		const idObj = resolveTuneId(tune, (msg) => alert(msg));
		if (!idObj) return;
		if (!setObj.tunes) setObj.tunes = [];
		setObj.tunes.push({ ...idObj, notes: "" });
		this._markDirty();
	}

	_addSet() {
		const n = this._current.sets.length + 1;
		this._current.sets.push({
			name: `Set ${n}`,
			comments: "",
			tunes: [],
			collapsed: false
		});
		this._renderBuilder();
		this._markDirty();
	}

	_markDirty() {
		this._current.dateModified = new Date().toISOString();
		this._recomputeDirty();
	}

	_recomputeDirty() {
		this._isDirty = this._computeIsDirty();
		this._updateDirtyIndicator();
	}

	_computeIsDirty() {
		if (!this._current) return false;
		const saved = this._setLists.find((sl) => sl.id === this._current.id);
		if (!saved) return true;
		return !this._contentEqual(this._current, saved);
	}

	_contentEqual(a, b) {
		if (a.name !== b.name) return false;
		if (a.sets.length !== b.sets.length) return false;
		for (let i = 0; i < a.sets.length; i++) {
			const sa = a.sets[i],
				sb = b.sets[i];
			if (sa.name !== sb.name) return false;
			if (sa.comments !== sb.comments) return false;
			if (sa.tunes?.length !== sb.tunes?.length) return false;
			for (let j = 0; j < sa.tunes?.length; j++) {
				if (JSON.stringify(sa.tunes[j]) !== JSON.stringify(sb.tunes[j]))
					return false;
			}
		}
		return true;
	}

	_clearDirty() {
		this._isDirty = false;
		this._updateDirtyIndicator();
	}

	_updateDirtyIndicator() {
		const btn = this.element?.querySelector(".ts-save-btn");
		if (!btn) return;
		btn.classList.toggle("ts-btn-dirty", this._isDirty);
	}

	_uniqueSetListName() {
		const existingNames = new Set(this._setLists.map((sl) => sl.name));
		let n = 1,
			name;
		do {
			name = `Tune selection ${n++}`;
		} while (existingNames.has(name));
		return name;
	}

	_newSetList() {
		if (
			this._isDirty &&
			!confirm(
				"You have unsaved changes. Discard them and create a new set list?"
			)
		)
			return;
		this._current = createSetList(this._uniqueSetListName());
		this._renderContents();
		this._recomputeDirty();
	}

	_save() {
		if (!this._current) return;
		const existing = this._setLists.findIndex(
			(sl) => sl.id === this._current.id
		);
		if (existing >= 0) {
			this._setLists[existing] = this._current;
		} else {
			this._setLists.push(this._current);
		}
		this._renderSavedList();
		this._callbacks.saveSetListsToStorage(this._setLists);
		this._recomputeDirty();
		const btn = this.element.querySelector(".ts-save-btn");
		const orig = btn.textContent;
		btn.textContent = "✓ Saved";
		setTimeout(() => {
			btn.textContent = orig;
		}, 1500);
	}

	_duplicate() {
		if (!this._current) return;
		const copy = JSON.parse(JSON.stringify(this._current));
		copy.id = generateId();
		copy.name = this._uniqueSetListName();
		copy.dateCreated = new Date().toISOString();
		copy.dateModified = copy.dateCreated;
		this._setLists.push(copy);
		this._current = copy;
		this._renderContents();
	}

	_copyToClipboard() {
		if (!this._current) return;
		const btn = this.element.querySelector(".ts-copy-btn");
		const orig = btn.textContent;
		navigator.clipboard.writeText(javascriptify(this._current)).then(
			() => {
				btn.textContent = "✓ Copied!";
				setTimeout(() => {
					btn.textContent = orig;
				}, 2000);
			},
			() => {
				btn.textContent = "✗ Failed";
				setTimeout(() => {
					btn.textContent = orig;
				}, 2000);
			}
		);
	}

	_delete() {
		if (!this._current) return;
		const idx = this._setLists.findIndex((sl) => sl.id === this._current.id);
		if (idx < 0) {
			this._current = createSetList(this._uniqueSetListName());
			this._renderContents();
			return;
		}
		if (
			!confirm(
				`Delete set list "${this._current.name}"? This cannot be undone.`
			)
		)
			return;
		this._setLists.splice(idx, 1);
		this._current =
			this._setLists[0] ?? createSetList(this._uniqueSetListName());
		this._renderContents();
	}

	loadSetLists(setLists) {
		this._setLists = setLists;
		if (this.element) this._renderSavedList();
	}

	getSetLists() {
		return this._setLists;
	}

	_openPreview() {
		if (!this._current) return;
		new PrintPreviewModal(this._current).open();
	}
}
