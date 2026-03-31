const DB_NAME = "tuneTable";
const DB_VERSION = 1;
const STORE_SLOTS = "slots";
const STORE_META = "meta";

/** localStorage key used by the previous storage implementation; retained for one-time migration. */
const LEGACY_LS_KEY = "tuneListSlots";

export default class TuneListSlotManager {
	/** @type {IDBDatabase|null} */
	#db = null;

	// -- Initialisation -------------------------------------------------------

	/**
	 * Opens (and if necessary creates) the IndexedDB database, then migrates any
	 * data found in localStorage from the previous storage implementation.
	 * Must be called once before any other method.
	 * @returns {Promise<void>}
	 */
	async init() {
		this.#db = await this.#openDB();
		await this.#migrateLegacyData();
	}

	/** @returns {Promise<IDBDatabase>} */
	#openDB() {
		return new Promise((resolve, reject) => {
			const req = indexedDB.open(DB_NAME, DB_VERSION);
			req.onupgradeneeded = ({ target: { result: db } }) => {
				if (!db.objectStoreNames.contains(STORE_SLOTS))
					db.createObjectStore(STORE_SLOTS, { keyPath: "id" });
				if (!db.objectStoreNames.contains(STORE_META))
					db.createObjectStore(STORE_META);
			};
			req.onsuccess = ({ target: { result } }) => resolve(result);
			req.onerror = ({ target: { error } }) => reject(error);
		});
	}

	/**
	 * One-time migration: reads slots from localStorage (previous format) and
	 * writes them to IndexedDB, then removes the legacy localStorage key.
	 * @returns {Promise<void>}
	 */
	async #migrateLegacyData() {
		const raw = localStorage.getItem(LEGACY_LS_KEY);
		if (!raw) return;
		try {
			const { slots = [], lastActiveSlot = null } = JSON.parse(raw);
			const tx = this.#db.transaction([STORE_SLOTS, STORE_META], "readwrite");
			for (const slot of slots) tx.objectStore(STORE_SLOTS).put(slot);
			if (lastActiveSlot)
				tx.objectStore(STORE_META).put(lastActiveSlot, "lastActiveSlot");
			await this.#txComplete(tx);
			localStorage.removeItem(LEGACY_LS_KEY);
			console.info(
				`Migrated ${slots.length} slot(s) from localStorage to IndexedDB.`
			);
		} catch (e) {
			console.error("Failed to migrate legacy slot data:", e);
		}
	}

	// -- IDB helpers ----------------------------------------------------------

	/** @returns {Promise<void>} */
	#txComplete(tx) {
		return new Promise((resolve, reject) => {
			tx.oncomplete = resolve;
			tx.onerror = () => reject(tx.error);
			tx.onabort = () => reject(tx.error);
		});
	}

	/**
	 * @param {string} store
	 * @param {IDBValidKey} key
	 * @returns {Promise<any>}
	 */
	#get(store, key) {
		return new Promise((resolve, reject) => {
			const req = this.#db.transaction(store).objectStore(store).get(key);
			req.onsuccess = () => resolve(req.result ?? null);
			req.onerror = () => reject(req.error);
		});
	}

	/**
	 * @param {string} store
	 * @returns {Promise<any[]>}
	 */
	#getAll(store) {
		return new Promise((resolve, reject) => {
			const req = this.#db.transaction(store).objectStore(store).getAll();
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => reject(req.error);
		});
	}

	// -- Public API -----------------------------------------------------------

	/**
	 * Returns all slots and associated metadata.
	 * @returns {Promise<{ version: string, slots: object[], lastActiveSlot: string|null }>}
	 */
	async loadSlots() {
		const [slots, lastActiveSlot] = await Promise.all([
			this.#getAll(STORE_SLOTS),
			this.#get(STORE_META, "lastActiveSlot")
		]);
		return { version: "1.0", slots, lastActiveSlot };
	}

	/**
	 * @param {string} id
	 * @returns {Promise<object|null>}
	 */
	async getSlot(id) {
		return this.#get(STORE_SLOTS, id);
	}

	/**
	 * Creates or updates a slot with the supplied tune and set-list data.
	 * @param {string}   id
	 * @param {string}   name
	 * @param {object[]} tunes
	 * @param {object[]} [setLists=[]]
	 * @returns {Promise<void>}
	 */
	async saveSlot(id, name, tunes, setLists = []) {
		const now = new Date().toISOString();
		const existing = await this.getSlot(id);
		const slot = existing
			? {
					...existing,
					name,
					tunes,
					setLists,
					lastUpdate: now,
					metadata: { ...existing.metadata, lastOpened: now }
				}
			: {
					id,
					name,
					created: now,
					lastUpdate: now,
					tunes,
					setLists,
					metadata: { lastOpened: now }
				};

		const tx = this.#db.transaction([STORE_SLOTS, STORE_META], "readwrite");
		tx.objectStore(STORE_SLOTS).put(slot);
		tx.objectStore(STORE_META).put(id, "lastActiveSlot");
		await this.#txComplete(tx);
	}

	/**
	 * Updates a slot's lastOpened timestamp without rewriting tune data.
	 * @param {string} id
	 * @returns {Promise<void>}
	 */
	async touchSlot(id) {
		const slot = await this.getSlot(id);
		if (!slot) return;
		slot.metadata.lastOpened = new Date().toISOString();

		const tx = this.#db.transaction([STORE_SLOTS, STORE_META], "readwrite");
		tx.objectStore(STORE_SLOTS).put(slot);
		tx.objectStore(STORE_META).put(id, "lastActiveSlot");
		await this.#txComplete(tx);
	}

	/**
	 * @param {string} id
	 * @returns {Promise<void>}
	 */
	async deleteSlot(id) {
		const { slots, lastActiveSlot } = await this.loadSlots();
		const tx = this.#db.transaction([STORE_SLOTS, STORE_META], "readwrite");
		tx.objectStore(STORE_SLOTS).delete(id);
		if (lastActiveSlot === id) {
			const next = slots.find((s) => s.id !== id)?.id ?? null;
			tx.objectStore(STORE_META).put(next, "lastActiveSlot");
		}
		await this.#txComplete(tx);
	}

	/**
	 * Creates a copy of a slot with a new ID and "(copy)" appended to its name.
	 * @param {string} id
	 * @returns {Promise<object|null>} The new slot, or null if the original was not found.
	 */
	async duplicateSlot(id) {
		const original = await this.getSlot(id);
		if (!original) return null;
		const now = new Date().toISOString();
		const copy = {
			...JSON.parse(JSON.stringify(original)),
			id: this.generateSlotId(),
			name: `${original.name} (copy)`,
			created: now,
			lastUpdate: now,
			metadata: { lastOpened: now }
		};
		const tx = this.#db.transaction(STORE_SLOTS, "readwrite");
		tx.objectStore(STORE_SLOTS).put(copy);
		await this.#txComplete(tx);
		return copy;
	}

	/**
	 * @param {string} id
	 * @param {string} newName
	 * @returns {Promise<boolean>} False if the slot was not found.
	 */
	async renameSlot(id, newName) {
		const slot = await this.getSlot(id);
		if (!slot) return false;
		slot.name = newName.trim();
		slot.lastUpdate = new Date().toISOString();
		const tx = this.#db.transaction(STORE_SLOTS, "readwrite");
		tx.objectStore(STORE_SLOTS).put(slot);
		await this.#txComplete(tx);
		return true;
	}

	/**
	 * @param {string} name
	 * @returns {Promise<boolean>}
	 */
	async slotNameExists(name) {
		const { slots } = await this.loadSlots();
		return slots.some(
			(s) => s.name.toLowerCase() === name.trim().toLowerCase()
		);
	}

	/**
	 * @returns {string} A unique slot ID.
	 */
	generateSlotId() {
		return (
			"slot-" +
			Date.now().toString(36) +
			"-" +
			Math.random().toString(36).slice(2, 7)
		);
	}

	/**
	 * Returns the estimated storage usage for this origin in MB, using the
	 * Storage API. Falls back to "unknown" if the API is unavailable.
	 * @returns {Promise<string>}
	 */
	async getStorageSize() {
		if (navigator.storage?.estimate) {
			const { usage = 0 } = await navigator.storage.estimate();
			return (usage / 1024 / 1024).toFixed(2);
		}
		return "unknown";
	}

	/**
	 * Exports all slots as a downloadable JSON backup file.
	 * @returns {Promise<void>}
	 */
	async exportAllSlots() {
		const { slots } = await this.loadSlots();
		const exportData = {
			exportVersion: "1.0",
			exportDate: new Date().toISOString(),
			application: "tuneTable",
			slots
		};
		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: "application/json"
		});
		const url = URL.createObjectURL(blob);
		Object.assign(document.createElement("a"), {
			href: url,
			download: `tuneTable-backup-${new Date().toISOString().split("T")[0]}.json`
		}).click();
		URL.revokeObjectURL(url);
	}

	/**
	 * Imports slots from a backup JSON object.
	 * @param {object}            jsonData - Parsed export object (must have a .slots array).
	 * @param {'merge'|'replace'} [mode='merge']
	 * @returns {Promise<{ imported: number, skipped: number }>}
	 */
	async importSlots(jsonData, mode = "merge") {
		const incoming = jsonData.slots ?? [];

		if (mode === "replace") {
			const tx = this.#db.transaction(STORE_SLOTS, "readwrite");
			tx.objectStore(STORE_SLOTS).clear();
			for (const slot of incoming) tx.objectStore(STORE_SLOTS).put(slot);
			await this.#txComplete(tx);
			return { imported: incoming.length, skipped: 0 };
		}

		// Merge: avoid name collisions by appending a counter suffix.
		const { slots: existing } = await this.loadSlots();
		const tx = this.#db.transaction(STORE_SLOTS, "readwrite");
		let imported = 0;
		for (const slot of incoming) {
			let name = slot.name,
				n = 2;
			while (existing.some((s) => s.name === name))
				name = `${slot.name} (${n++})`;
			tx.objectStore(STORE_SLOTS).put({
				...slot,
				id: this.generateSlotId(),
				name
			});
			imported++;
		}
		await this.#txComplete(tx);
		return { imported, skipped: 0 };
	}
}
