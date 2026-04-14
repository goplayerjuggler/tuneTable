/**
 * Shared utilities for matching tunes to set-list entries and resolving
 * the correct ABC setting for a given entry.
 *
 * Used by AbcModal and TuneSelectionsModal (replace the local `findTuneByEntry`
 * there with the exported version once this module is in place).
 */

/**
 * Returns true if the tune matches the given set-list entry, using the
 * same ID-priority ordering as the set-list data structure.
 * For hard- to guess Ids, they are:
 * itiId: irishtune.info
 * fwId: www.folkwiki.se
 * ttId: tuneTable (this repo)
 * @param {object} tune
 * @param {object} entry - set-list tune entry
 * @returns {boolean}
 */
export function tuneMatchesEntry(tune, entry) {
	if (entry.theSessionId) return tune.theSessionId === entry.theSessionId;
	if (entry.norbeckId)
		return (
			tune.norbeckId === entry.norbeckId &&
			(tune.norbeckR === entry.norbeckR || tune.rhythm === entry.norbeckR)
		);
	if (entry.itiId) return tune.itiId === entry.itiId;
	if (entry.fwId) return tune.fwId === entry.fwId;
	if (entry.ttId) return tune.ttId === entry.ttId;
	return false;
}

/**
 * Look up a tune in tunesData by a set-list entry.
 * @param {object} entry - set-list tune entry
 * @param {object[]} tunesData
 * @returns {object|undefined}
 */
export function findTuneByEntry(entry, tunesData) {
	return tunesData.find((t) => tuneMatchesEntry(t, entry));
}

/**
 * Resolve the correct ABC string for a set-list entry/tune pair.
 * When the tune has multiple settings, picks the one indicated by
 * `entry.theSessionSettingId` or `entry.x`, falling back to the first setting.
 * @param {object} entry - set-list tune entry
 * @param {object|undefined} tune - matched tune from tunesData
 * @returns {string|null}
 */
export function resolveAbcForEntry(entry, tune) {
	if (!tune?.abc) return null;
	const abcs = Array.isArray(tune.abc) ? tune.abc : [tune.abc];
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
	return abcs[settingIdx] ?? null;
}
