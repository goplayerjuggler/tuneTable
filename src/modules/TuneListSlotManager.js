const SLOTS_KEY = "tuneListSlots";

export default class TuneListSlotManager {
	loadSlots() {
		try {
			const stored = localStorage.getItem(SLOTS_KEY);
			return stored
				? JSON.parse(stored)
				: { version: "1.0", slots: [], lastActiveSlot: null };
		} catch {
			return { version: "1.0", slots: [], lastActiveSlot: null };
		}
	}

	_save(data) {
		try {
			localStorage.setItem(SLOTS_KEY, JSON.stringify(data));
		} catch (e) {
			throw new Error("Failed to save to local storage: " + e.message);
		}
	}

	getSlot(id) {
		return this.loadSlots().slots.find((s) => s.id === id) ?? null;
	}

	saveSlot(id, name, tunes, setLists = []) {
		const data = this.loadSlots();
		const now = new Date().toISOString();
		const idx = data.slots.findIndex((s) => s.id === id);
		if (idx >= 0) {
			Object.assign(data.slots[idx], { name, tunes, setLists, modified: now });
			data.slots[idx].metadata.lastOpened = now;
		} else {
			data.slots.push({
				id,
				name,
				created: now,
				modified: now,
				tunes,
				setLists,
				metadata: { lastOpened: now },
			});
		}
		data.lastActiveSlot = id;
		this._save(data);
	}

	touchSlot(id) {
		const data = this.loadSlots();
		const slot = data.slots.find((s) => s.id === id);
		if (!slot) return;
		slot.metadata.lastOpened = new Date().toISOString();
		data.lastActiveSlot = id;
		this._save(data);
	}

	deleteSlot(id) {
		const data = this.loadSlots();
		data.slots = data.slots.filter((s) => s.id !== id);
		if (data.lastActiveSlot === id)
			data.lastActiveSlot = data.slots[0]?.id ?? null;
		this._save(data);
	}

	duplicateSlot(id) {
		const data = this.loadSlots();
		const original = data.slots.find((s) => s.id === id);
		if (!original) return null;
		const now = new Date().toISOString();
		const copy = {
			...JSON.parse(JSON.stringify(original)),
			id: this.generateSlotId(),
			name: `${original.name} (copy)`,
			created: now,
			modified: now,
			metadata: { lastOpened: now },
		};
		data.slots.push(copy);
		this._save(data);
		return copy;
	}

	renameSlot(id, newName) {
		const data = this.loadSlots();
		const slot = data.slots.find((s) => s.id === id);
		if (!slot) return false;
		slot.name = newName.trim();
		slot.modified = new Date().toISOString();
		this._save(data);
		return true;
	}

	slotNameExists(name) {
		return this.loadSlots().slots.some(
			(s) => s.name.toLowerCase() === name.trim().toLowerCase()
		);
	}

	generateSlotId() {
		return (
			"slot-" +
			Date.now().toString(36) +
			"-" +
			Math.random().toString(36).slice(2, 7)
		);
	}

	getStorageSize() {
		let total = 0;
		for (const key in localStorage) {
			if (Object.prototype.hasOwnProperty.call(localStorage, key))
				total += (localStorage[key].length + key.length) * 2;
		}
		return (total / 1024 / 1024).toFixed(2);
	}

	exportAllSlots() {
		const { slots } = this.loadSlots();
		const exportData = {
			exportVersion: "1.0",
			exportDate: new Date().toISOString(),
			application: "tuneTable",
			slots,
		};
		const blob = new Blob([JSON.stringify(exportData, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		Object.assign(document.createElement("a"), {
			href: url,
			download: `tuneTable-backup-${new Date().toISOString().split("T")[0]}.json`,
		}).click();
		URL.revokeObjectURL(url);
	}

	/**
	 * Import slots from a backup JSON.
	 * @param {object} jsonData - Parsed export object (must have .slots array)
	 * @param {'merge'|'replace'} mode
	 * @returns {{ imported: number, skipped: number }}
	 */
	importSlots(jsonData, mode = "merge") {
		const data = this.loadSlots();
		if (mode === "replace") {
			data.slots = jsonData.slots ?? [];
			this._save(data);
			return { imported: data.slots.length, skipped: 0 };
		}
		let imported = 0;
		for (const slot of jsonData.slots ?? []) {
			let name = slot.name;
			let n = 2;
			while (data.slots.some((s) => s.name === name))
				name = `${slot.name} (${n++})`;
			data.slots.push({ ...slot, id: this.generateSlotId(), name });
			imported++;
		}
		this._save(data);
		return { imported, skipped: 0 };
	}
}
