import Modal from "./Modal.js";

const relativeTime = (iso) => {
	if (!iso) return "unknown";
	const diff = Date.now() - new Date(iso).getTime();
	const days = Math.floor(diff / (1000 * 60 * 60 * 24));

	if (days < 1) return "today";
	if (days < 30) return `${days}d ago`;

	const months = Math.floor(days / 30);
	if (months < 12) return `${months}mo ago`;

	const years = Math.floor(days / 365);
	return `${years}y ago`;
};

function formatNoteLinks(text) {
	return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, target) => {
		return `<a href="${target}" target="_blank" rel="noopener noreferrer">${label}</a>`;
	});
}

/**
 * Tune List Selector Modal
 *
 * ### TuneListSelectorModal
 * **Purpose**: Select, manage and load tune list slots
 *
 * **Features**:
 * - Browse local slots and server-compiled lists
 * - Slot CRUD: create, rename, duplicate, delete
 * - Save server lists to a local slot
 * - Import/export JSON backups
 * - Load from URL (external lists)
 * - Session-group lists from manifest
 *
 * **Key Methods**:
 * - `openWithContext(manifest, currentListState)`: Open with latest manifest data
 * - `onSelect` callback: called with `{ source, sourceId, displayName, tunes, setLists }`
 */
class TuneListSelectorModal extends Modal {
	constructor({ slotManager, onSelect }) {
		super({
			id: "tuneListSelectorModal",
			size: "large",
			title: "Select tune list",
			content: `<div id="tls-content" class="modal-body tls-modal-body">Loading…</div>`
		});
		this.slotManager = slotManager;
		this.onSelect = onSelect;
		this.manifest = null;
		this.currentListState = null;
	}

	openWithContext(manifest, currentListState) {
		this.manifest = manifest;
		this.currentListState = currentListState;
		this.open();
	}

	onOpen() {
		this._render();
	}

	async _render() {
		const container = document.getElementById("tls-content");
		if (!container) return;
		container.innerHTML = await this._buildHTML();
		this._attachHandlers(container);
	}

	async _buildHTML() {
		const { slots } = await this.slotManager.loadSlots();
		const activeId = this.currentListState?.sourceId;
		const activeSource = this.currentListState?.source;
		const lists = this.manifest?.lists ?? [];

		const serverLists = lists
			// .filter((l) => !l.category)
			.sort((a, b) => (b.default ? 1 : 0) - (a.default ? 1 : 0));
		// const groupLists = lists.filter((l) => l.category === "groups");

		const localSection = this._sectionHTML(
			"📁 My local lists",
			slots.length
				? slots
						.map((s) =>
							this._slotItemHTML(
								s,
								activeSource === "local" && s.id === activeId
							)
						)
						.join("")
				: `<p class="tls-empty">No saved lists.</p>`
		);

		const serverSection = serverLists.length
			? this._sectionHTML(
					"🎵 Server lists",
					serverLists
						.map((l) =>
							this._serverItemHTML(
								l,
								activeSource === "server" && l.id === activeId
							)
						)
						.join("")
				)
			: "";

		// const groupsSection = groupLists.length
		// 	? this._sectionHTML(
		// 			"👥 Session groups",
		// 			groupLists
		// 				.map((l) =>
		// 					this._serverItemHTML(
		// 						l,
		// 						activeSource === "server" && l.id === activeId
		// 					)
		// 				)
		// 				.join("")
		// 		)
		// 	: "";

		const storageSize = await this.slotManager.getStorageSize();

		return (
			localSection +
			serverSection + //+ groupsSection
			`
			<div class="tls-section tls-actions">
				<button class="tls-action-btn" id="tls-create">➕ Create a new tune list</button>
				<button class="tls-action-btn" id="tls-export">📦 Export all local lists</button>
				<button class="tls-action-btn" id="tls-load-url">🔗 Load from URL… </button>
				<button class="tls-action-btn" id="tls-import">💾 Import JSON file… </button>
				<input type="file" id="tls-file-input" accept=".json" style="display:none">
			</div>
			<div class="tls-storage-info">
				Local storage: ${storageSize} MB / ~50 MB used &bull; ${slots.length} tune list${slots.length !== 1 ? "s" : ""} saved
			</div>
		`
		);
	}

	_sectionHTML(title, content) {
		return `
			<div class="tls-section">
				<h3 class="tls-section-title">${title}</h3>
				<div class="tls-list">${content}</div>
			</div>
		`;
	}

	_slotItemHTML(slot, isActive) {
		const tuneCount = slot.tunes?.length ?? 0;
		const setCount = slot.setLists?.length ?? 0;
		const meta = `${tuneCount} tune${tuneCount !== 1 ? "s" : ""}${setCount > 0 ? `, ${setCount} set list${setCount !== 1 ? "s" : ""}` : ""} &bull; Modified ${relativeTime(slot.lastUpdate)}`;
		const desc = slot.description
			? `<span class="tls-item-desc">${formatNoteLinks(slot.description)}</span>`
			: "";
		return `
		<div class="tls-item tls-slot${isActive ? " tls-item--active" : ""}" data-slot-id="${slot.id}">
			<div class="tls-item-info">
				<button class="tls-item-name tls-item-load">${slot.name}${isActive ? ' <span class="tls-badge">Active</span>' : ""}</button>
				${desc}
				<span class="tls-item-meta">${meta}</span>
			</div>
			<div class="tls-item-actions">
				<button class="btn btn-sm tls-btn-duplicate" data-slot-id="${slot.id}">Duplicate</button>
				<button class="btn btn-sm tls-btn-rename" data-slot-id="${slot.id}">Rename</button>
				<button class="btn btn-sm tls-btn-delete" data-slot-id="${slot.id}">Delete</button>
			</div>
		</div>
	`;
	}

	_serverItemHTML(list, isActive) {
		const setLists =
			list.setListCount > 0
				? `; ${list.setListCount} set list${list.setListCount > 1 ? "s" : ""}`
				: "";
		const desc = list.description
			? `<span class="tls-item-desc">${formatNoteLinks(list.description)}</span>`
			: "";
		const lastUpdated = list.lastUpdate
			? ` &bull; Updated ${relativeTime(list.lastUpdate)}`
			: "";
		return `
		<div class="tls-item tls-server-item${isActive ? " tls-item--active" : ""}"
				data-list-id="${list.id}" data-list-file="${list.file}" data-list-last-update="${list.lastUpdate}">
			<div class="tls-item-info">
				<button class="tls-item-name tls-item-load">${list.category ? `(${list.category}) ` : ""}${list.name}${isActive ? ' <span class="tls-badge">Active</span>' : ""}${list.default ? ' <span class="tls-badge tls-badge--recommended">Recommended</span>' : ""}</button>
				${desc}
				<span class="tls-item-meta">${list.count ?? "?"} tunes${setLists}${lastUpdated}</span>
			</div>
			<div class="tls-item-actions">
				<button class="btn btn-sm tls-btn-save-local" data-list-id="${list.id}" data-list-file="${list.file}" data-list-last-update="${list.lastUpdate ?? ""}">Save locally</button>
			</div>
		</div>
	`;
	}

	_attachHandlers(container) {
		container.querySelectorAll(".tls-slot .tls-item-load").forEach((btn) => {
			btn.addEventListener("click", () =>
				this._loadLocal(btn.closest(".tls-slot").dataset.slotId)
			);
		});

		container
			.querySelectorAll(".tls-server-item .tls-item-load")
			.forEach((btn) => {
				const el = btn.closest(".tls-server-item");
				btn.addEventListener("click", () =>
					this._loadServer(
						el.dataset.listId,
						el.dataset.listFile,
						el.dataset.listLastUpdate
					)
				);
			});

		container.querySelectorAll(".tls-btn-duplicate").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				this._duplicateSlot(btn.dataset.slotId);
			});
		});
		container.querySelectorAll(".tls-btn-rename").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				this._renameSlot(btn.dataset.slotId);
			});
		});
		container.querySelectorAll(".tls-btn-delete").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				this._deleteSlot(btn.dataset.slotId);
			});
		});
		container.querySelectorAll(".tls-btn-save-local").forEach((btn) => {
			btn.addEventListener("click", (e) => {
				this._saveServerToLocal(btn.dataset.listId, btn.dataset.listFile);
			});
		});

		document
			.getElementById("tls-create")
			?.addEventListener("click", () => this._createNewList());
		document
			.getElementById("tls-load-url")
			?.addEventListener("click", () => this._loadFromUrl());
		document.getElementById("tls-import")?.addEventListener("click", () => {
			document.getElementById("tls-file-input").click();
		});
		document
			.getElementById("tls-file-input")
			?.addEventListener("change", (e) => this._importJson(e.target.files[0]));
		document
			.getElementById("tls-export")
			?.addEventListener(
				"click",
				async () => await this.slotManager.exportAllSlots()
			);
	}

	async _loadLocal(slotId) {
		const slot = await this.slotManager.getSlot(slotId);
		if (!slot) return;
		await this.onSelect({
			source: "local",
			sourceId: slotId,
			displayName: slot.name,
			lastUpdate: slot.lastUpdate,
			tunes: slot.tunes ?? [],
			setLists: slot.setLists ?? [],
			defaultSort: slot.defaultSort
		});
		this.close();
	}

	async _loadServer(listId, listFile, lastUpdate) {
		this._setStatus("Loading…");
		try {
			const res = await fetch(`./tune-lists/${listFile}`);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			const { tunes, setLists } = data;
			const listInfo = this.manifest?.lists.find((l) => l.id === listId);
			await this.onSelect({
				source: "server",
				sourceId: listId,
				displayName: listInfo?.name ?? listId,
				tunes,
				setLists,
				lastUpdate,
				...(listInfo.defaultSort ? { defaultSort: listInfo.defaultSort } : {})
			});
			this.close();
		} catch (e) {
			this._setStatus(`Failed to load: ${e.message}`, "error");
		}
	}

	async _saveServerToLocal(listId, listFile) {
		this._setStatus("Loading…");
		try {
			const res = await fetch(`./tune-lists/${listFile}`);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			const listInfo = this.manifest?.lists.find((l) => l.id === listId);
			const baseName = listInfo?.name ?? listId;
			const name = prompt("Save as:", baseName);
			if (!name?.trim()) {
				this._setStatus("");
				return;
			}
			if (await this.slotManager.slotNameExists(name.trim())) {
				alert("A list with that name already exists.");
				this._setStatus("");
				return;
			}
			const id = await this.slotManager.generateSlotId();
			await this.slotManager.saveSlot(
				id,
				name.trim(),
				data.tunes ?? [],
				data.setLists ?? [],
				data.defaultSort ?? ""
			);
			this._setStatus(`Saved as "${name.trim()}"`, "success");
			this._render();
		} catch (e) {
			this._setStatus(`Failed: ${e.message}`, "error");
		}
	}

	async _loadFromUrl() {
		const url = prompt("Enter URL of tune list JSON:");
		if (!url?.trim()) return;
		this._setStatus("Loading…");
		try {
			const res = await fetch(url.trim());
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = await res.json();
			const tunes = Array.isArray(data) ? data : data.tunes;
			if (!Array.isArray(tunes))
				throw new Error("Invalid format: expected an array of tunes");
			await this.onSelect({
				source: "external",
				sourceId: url.trim(),
				displayName: url.trim().split("/").pop() || "External list",
				tunes,
				setLists: []
			});
			this.close();
		} catch (e) {
			this._setStatus(`Failed to load: ${e.message}`, "error");
		}
	}

	async _importJson(file) {
		if (!file) return;
		try {
			const text = await file.text();
			const data = JSON.parse(text);
			if (data.slots) {
				// Full backup file
				const mode = confirm(
					"Merge with existing lists?\nOK = merge, Cancel = replace all"
				)
					? "merge"
					: "replace";
				const { imported } = await this.slotManager.importSlots(data, mode);
				alert(`Imported ${imported} list${imported !== 1 ? "s" : ""}.`);
				this._render();
			} else {
				// Single tune list JSON
				const name =
					prompt("Name for this list:", file.name.replace(/\.json$/i, "")) ||
					file.name;
				const tunes = Array.isArray(data) ? data : (data.tunes ?? []);
				const id = await this.slotManager.generateSlotId();
				await this.slotManager.saveSlot(id, name.trim(), tunes, []);
				await this.onSelect({
					source: "local",
					sourceId: id,
					displayName: name.trim(),
					tunes,
					setLists: []
				});
				this.close();
			}
		} catch (e) {
			alert(`Import failed: ${e.message}`);
		}
	}

	async _createNewList() {
		const name = prompt("Name for the new list:");
		if (!name?.trim()) return;
		if (await this.slotManager.slotNameExists(name)) {
			alert("A list with that name already exists.");
			return;
		}
		const copyData =
			this.currentListState &&
			confirm(
				`Copy data from current list (${this.currentListState.displayName})?`
			);
		const tunes = copyData ? (window.tunesData ?? []) : [],
			setLists = copyData ? (window._setLists ?? []) : [],
			defaultSort = copyData ? window.currentSortType : "";
		const id = await this.slotManager.generateSlotId();
		await this.slotManager.saveSlot(
			id,
			name.trim(),
			tunes,
			setLists,
			defaultSort
		);
		await this.onSelect({
			source: "local",
			sourceId: id,
			displayName: name.trim(),
			tunes,
			setLists,
			defaultSort
		});
		this.close();
	}

	async _duplicateSlot(slotId) {
		const copy = await this.slotManager.duplicateSlot(slotId);
		if (copy) this._render();
	}

	async _renameSlot(slotId) {
		const slot = await this.slotManager.getSlot(slotId);
		if (!slot) return;
		const name = prompt("New name:", slot.name);
		if (!name?.trim() || name.trim() === slot.name) return;
		if (
			(await this.slotManager.slotNameExists(name)) &&
			name.trim().toLowerCase() !== slot.name.toLowerCase()
		) {
			alert("A list with that name already exists.");
			return;
		}
		await this.slotManager.renameSlot(slotId, name);
		this._render();
	}

	async _deleteSlot(slotId) {
		const slot = await this.slotManager.getSlot(slotId);
		if (!slot) return;
		const isActive =
			this.currentListState?.source === "local" &&
			this.currentListState?.sourceId === slotId;
		if (isActive && (await this.slotManager.loadSlots()).slots.length === 1) {
			alert("Can't delete the only active list.");
			return;
		}
		if (!confirm(`Delete "${slot.name}"? This cannot be undone.`)) return;
		await this.slotManager.deleteSlot(slotId);
		this._render();
	}

	_setStatus(message, type = "info") {
		const container = document.getElementById("tls-content");
		if (!container) return;
		let el = document.getElementById("tls-status");
		if (!el) {
			el = document.createElement("div");
			el.id = "tls-status";
			container.prepend(el);
		}
		el.textContent = message;
		const bg = type === "error" ? "#fee" : type === "success" ? "#efe" : "#eef";
		const color =
			type === "error" ? "#c33" : type === "success" ? "#2a7a2a" : "#339";
		el.style.cssText = `padding:8px 12px; margin-bottom:12px; border-radius:4px; background:${bg}; color:${color}`;
	}

	onClose() {}
}

export { relativeTime, TuneListSelectorModal };
