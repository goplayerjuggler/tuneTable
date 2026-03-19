import Modal from "./Modal.js";
import { processTuneData } from "../../processTuneData.js";
import { addLineBreaks } from "../../utils.js";
import { eventBus } from "../events/EventBus.js";
import {
	canDoubleBarLength,
	convertStandardHornpipe,
	convertStandardJig,
	convertStandardPolka,
	convertStandardReel
} from "@goplayerjuggler/abc-tools";

/**
 * Import behaviour settings.
 *
 * skipLevel:
 *   'ifTuneExists'    — skip if a tune with the same theSessionId already exists.
 *   'ifSettingExists' — skip only if the chosen setting's URL is already present in
 *                       an ABC string. When the tune exists but not the setting, the
 *                       new ABC is appended to tune.abc instead.
 *
 * doubleBarLengthWherePossible:
 *   When true, each imported ABC is passed through canDoubleBarLength(); if eligible,
 *   the appropriate convert* function is applied.
 *
 * importAllSettingsForSpecifiedUser:
 *   When true and a userId is entered in the UI, all settings entered by that user
 *   for each tune are imported (abc becomes an array). When false, the normal
 *   single-setting selection applies even for an explicit userId.
 *
 * settingChoiceCriteria:
 *   Ranked filter applied when no single setting is identified by UI inputs.
 *   Each criterion narrows the candidate list; a criterion is skipped when it
 *   would leave no candidates.
 *
 *   Supported criterion values:
 *   - { preferredUserIds: [[id, name], ...] } — narrows to the first user (in priority
 *     order) that has any matching settings; remaining criteria continue from there.
 *   - 'withChords' / 'withoutChords'
 *   - 'preferShorter' / 'preferLonger' / 'newestFirst' / 'oldestFirst'
 */
const theSessionImportSettings = {
	skipLevel: "ifSettingExists",
	doubleBarLengthWherePossible: true,
	importAllSettingsForSpecifiedUser: true,
	settingChoiceCriteria: [
		{
			preferredUserIds: [
				[40345, "GoPlayerJuggler"],
				[13094, "birlibirdie"],
				[1, "Jeremy"],
				[11705, "ceolachan"],
				[6451, "jackb"],
				[116353, "John E Roche"],
				[4763, "Dr. Dow"],
				[3150, "slainte"],
				[8648, "erik-fiddler"],
				[60897, "Fernando Durbán Galnares"],
				[119445, "piperDave"]
			]
		},
		"withChords",
		"preferShorter"
	]
};

/**
 * Modal for importing tunes from TheSession.org
 */
export default class TheSessionImportModal extends Modal {
	/**
	 * @param {object[]} tunesData - Reference to the app's live tunes array.
	 * @param {object}   [options]
	 * @param {function} [options.copyToClipboard] - copyTuneDataToClipboard(tunes, btn);
	 *   displayed as a button after a successful import.
	 */
	constructor(tunesData, copyToClipboard) {
		super({
			id: "thesession-import-modal",
			title: "Import tunebook or tune from thesession.org",
			content: TheSessionImportModal.buildContent(),
			size: "medium",
			onClose: () => eventBus.emit("refreshTable")
		});

		this.isLoading = false;
		this.tunesData = tunesData;
		this.copyToClipboard = copyToClipboard;
		/** Tunes imported in the most recent run, for clipboard export. */
		this.lastImportedTunes = [];
	}

	/**
	 * Builds the modal's HTML content.
	 * @returns {string} HTML string
	 */
	static buildContent() {
		return `
	  <div class="import-form">

		<div class="form-group">
		  <label for="thesession-user">User ID (optional):</label>
		  <input type="text" id="thesession-user" placeholder="e.g. 1 - ID of Jeremy" />
		</div>
		<div class="form-group">
		  <label for="thesession-tune-id">Tune ID(s) (optional):</label>
		  <input type="text" id="thesession-tune-id" placeholder="e.g. 23320 or 23320 456 789 (space- or comma-separated)" />
		</div>
		<div class="form-group">
		  <label for="thesession-setting-id">Setting ID (optional, single tune ID only):</label>
		  <input type="text" id="thesession-setting-id" placeholder="e.g. 12345" />
		</div>
		<div class="form-group">
		  <label for="import-limit">Maximum number of tunes:</label>
		  <input type="number" id="import-limit" min="1" max="100" value="100" />
		</div>

		<div class="form-actions">
		  <button id="import-btn" class="btn btn--primary" type="button">
			Import
		  </button>
		  <button id="copy-btn" class="btn btn--secondary" type="button" style="display:none">
			Copy imported tunes to clipboard
		  </button>
		</div>

		<div id="import-status" class="import-status" role="status" aria-live="polite"></div>
	  </div>
	`;
	}

	/**
	 * Set up event listeners — extends base class.
	 */
	setupEventListeners() {
		super.setupEventListeners();

		const importBtn = this.element.querySelector("#import-btn");
		const copyBtn = this.element.querySelector("#copy-btn");
		const userInput = this.element.querySelector("#thesession-user");
		const tuneIdInput = this.element.querySelector("#thesession-tune-id");
		const settingIdInput = this.element.querySelector("#thesession-setting-id");
		const limitEl = this.element.querySelector("#import-limit");
		const statusDiv = this.element.querySelector("#import-status");

		importBtn.addEventListener("click", () => this.handleImport());

		copyBtn.addEventListener("click", () => {
			this.copyToClipboard(this.lastImportedTunes, copyBtn);
		});

		const enterKeyImport = (e) => {
			if (e.key === "Enter" && !this.isLoading) this.handleImport();
		};
		userInput.addEventListener("keypress", enterKeyImport);
		tuneIdInput.addEventListener("keypress", enterKeyImport);
		settingIdInput.addEventListener("keypress", enterKeyImport);
		limitEl.addEventListener("keypress", enterKeyImport);

		const clearStatus = () => {
			statusDiv.textContent = "";
			statusDiv.className = "import-status";
		};
		userInput.addEventListener("input", clearStatus);
		tuneIdInput.addEventListener("input", clearStatus);
		settingIdInput.addEventListener("input", clearStatus);
	}

	/**
	 * Shows a status message.
	 * @param {string} message
	 * @param {'info'|'success'|'error'} [type='info']
	 */
	showStatus(message, type = "info") {
		const statusDiv = this.element.querySelector("#import-status");
		statusDiv.textContent = message;
		statusDiv.className = `import-status import-status--${type}`;
	}

	/**
	 * Sets loading state (cursor and flag).
	 * @param {boolean} loading
	 */
	setLoading(loading) {
		this.isLoading = loading;
		const overlay = this.element.querySelector(".modal__overlay");
		overlay.style.cursor = loading ? "wait" : "pointer";
	}

	static delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	// --- Setting-selection helpers --------------------------------------------

	/**
	 * Returns true if a setting (identified by its URL in the ABC notes) is
	 * already present in tunesData.
	 * @param {number} tuneId
	 * @param {number} settingId
	 */
	isSettingPresent(tuneId, settingId) {
		const regex = new RegExp(
			`https://thesession\\.org/tunes/${tuneId}#setting${settingId}`
		);
		return this.tunesData.some((t) => {
			if (t.theSessionId !== tuneId) return false;
			const abcs = Array.isArray(t.abc) ? t.abc : t.abc ? [t.abc] : [];
			return abcs.some((abc) => regex.test(abc));
		});
	}

	/**
	 * Selects the single best setting from the list returned by the API, using a
	 * ranked-filter strategy:
	 *
	 * 1. Explicit UI settingId — if found, use it directly.
	 * 2. Explicit UI userId — narrow to that member's settings, then continue.
	 * 3. settingChoiceCriteria — applied as a ranked filter: each criterion narrows
	 *    the candidate list; a criterion is skipped when it would leave no candidates.
	 *    { preferredUserIds } narrows to the first matching user's settings, then
	 *    continues filtering. String criteria further narrow or select a single setting.
	 * 4. Fall back to the first remaining candidate.
	 *
	 * Always returns a single setting object (or null).
	 *
	 * @param {object[]} settings
	 * @param {number|null} uiUserId
	 * @param {number|null} uiSettingId
	 * @param {Array} criteria
	 * @returns {object|null}
	 */
	selectBestSetting(
		settings,
		uiUserId = null,
		uiSettingId = null,
		criteria = []
	) {
		if (!settings?.length) return null;

		// 1. Explicit setting ID from the UI
		if (uiSettingId) {
			const byId = settings.find((s) => s.id === uiSettingId);
			if (byId) return byId;
		}

		let candidates = [...settings];

		// 2. Explicit user ID from the UI — narrow, then continue filtering
		if (uiUserId) {
			const byUser = candidates.filter((s) => s.member?.id === uiUserId);
			if (byUser.length) candidates = byUser;
		}

		// 3. Apply settingChoiceCriteria as a ranked filter
		for (const criterion of criteria) {
			if (candidates.length <= 1) break;

			if (typeof criterion === "object" && criterion.preferredUserIds) {
				// Narrow to the first preferred user that has any settings, then continue
				for (const [userId] of criterion.preferredUserIds) {
					const matches = candidates.filter((s) => s.member?.id === userId);
					if (matches.length) {
						candidates = matches;
						break;
					}
				}
				continue;
			}

			const narrowed = TheSessionImportModal.applySimpleCriterion(
				candidates,
				criterion
			);
			if (narrowed.length) candidates = narrowed;
		}

		// 4. Fallback to first remaining candidate
		return candidates[0];
	}

	/**
	 * Applies a simple string criterion to a candidate list.
	 * Returns a filtered/sorted subset, or an empty array if unrecognised or
	 * if the criterion produces no results (caller then keeps current candidates).
	 * @param {object[]} candidates
	 * @param {string} criterion
	 * @returns {object[]}
	 */
	static applySimpleCriterion(candidates, criterion) {
		switch (criterion) {
			case "withChords": {
				const matched = candidates.filter((s) => /"[^"]*"/.test(s.abc));
				return matched.length ? matched : [];
			}
			case "withoutChords": {
				const matched = candidates.filter((s) => !/"[^"]*"/.test(s.abc));
				return matched.length ? matched : [];
			}
			case "preferShorter": {
				const shortest = candidates.reduce((a, b) =>
					a.abc.length <= b.abc.length ? a : b
				);
				return [shortest];
			}
			case "preferLonger": {
				const longest = candidates.reduce((a, b) =>
					a.abc.length >= b.abc.length ? a : b
				);
				return [longest];
			}
			case "newestFirst": {
				return [candidates.reduce((a, b) => (a.date >= b.date ? a : b))];
			}
			case "oldestFirst": {
				return [candidates.reduce((a, b) => (a.date <= b.date ? a : b))];
			}
			default:
				return [];
		}
	}

	// --- ABC generation -------------------------------------------------------

	/**
	 * Doubles the bar length of an ABC string when the settings allow it and the
	 * ABC is eligible (as determined by canDoubleBarLength()).
	 * @param {string} abc
	 * @param {string} rhythm
	 * @returns {string}
	 */
	static maybeDoubleBarLength(abc, rhythm) {
		if (
			!theSessionImportSettings.doubleBarLengthWherePossible ||
			!canDoubleBarLength(abc)
		)
			return abc;
		switch (rhythm) {
			case "reel":
				return convertStandardReel(abc);
			case "jig":
				return convertStandardJig(abc);
			case "polka":
				return convertStandardPolka(abc);
			case "hornpipe":
				return convertStandardHornpipe(abc);
			default:
				return abc;
		}
	}

	// --- API calls ------------------------------------------------------------

	/**
	 * Get member ID by username using the search API.
	 * @param {string} username
	 * @returns {Promise<number|null>}
	 */
	async getMemberIdByUsername(username) {
		const url = `https://thesession.org/members/search?q=${encodeURIComponent(username)}&format=json`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to search for member: ${response.status}`);
		}
		const data = await response.json();
		const member = data.members?.find(
			(m) => m.name.toLowerCase() === username.toLowerCase()
		);
		return member?.id ?? null;
	}

	/**
	 * Pages through a member's tunebook and returns up to `limit` tune IDs.
	 * @param {number} memberId
	 * @param {number} [limit=500]
	 * @returns {Promise<number[]>}
	 */
	async getMemberTunebook(memberId, limit = 500) {
		const tuneIds = [];
		let page = 1;
		const perPage = Math.min(100, limit);

		while (tuneIds.length < limit) {
			this.showStatus(
				`Loading tunebook items ${(page - 1) * perPage + 1} to ${page * perPage}...`,
				"info"
			);
			const url = `https://thesession.org/members/${memberId}/tunebook?format=json&page=${page}&orderby=newest&perpage=${perPage}`;
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Failed to fetch tunebook: ${response.status}`);
			}
			const data = await response.json();
			if (!data.tunes?.length) break;

			for (const item of data.tunes) {
				if (item.id && tuneIds.length < limit) tuneIds.push(item.id);
			}

			if (data.tunes.length < perPage) break;
			page++;
		}

		return tuneIds;
	}

	/**
	 * Fetches tune details and builds a tuneTable-format tune object.
	 * Always selects a single best setting; abc is a single string.
	 *
	 * @param {number}      tuneId
	 * @param {number|null} preferredMemberId
	 * @param {number|null} uiSettingId - Explicit setting ID from the UI, if any.
	 */
	async getTuneWithAbc(tuneId, preferredMemberId = null, uiSettingId = null) {
		const tuneUrl = `https://thesession.org/tunes/${tuneId}?format=json`;
		const tuneResponse = await fetch(tuneUrl);
		if (!tuneResponse.ok) {
			throw new Error(`Failed to fetch tune ${tuneId}: ${tuneResponse.status}`);
		}

		const tuneData = await tuneResponse.json();
		const allUserSettings =
			theSessionImportSettings.importAllSettingsForSpecifiedUser &&
			preferredMemberId
				? tuneData.settings.filter((s) => s.member?.id === preferredMemberId)
				: null;

		const setting = allUserSettings?.length
			? allUserSettings[0]
			: this.selectBestSetting(
					tuneData.settings,
					preferredMemberId,
					uiSettingId,
					theSessionImportSettings.settingChoiceCriteria
				);
		if (!setting) throw new Error(`No settings found for tune ${tuneId}`);

		let lHeader = "1/8",
			mHeader;
		switch (tuneData.type) {
			case "jig":
				mHeader = "6/8";
				break;
			case "slip jig":
				mHeader = "9/8";
				break;
			case "slide":
				mHeader = "12/8";
				break;
			case "polka":
				mHeader = "2/4";
				break;
			case "barndance":
			case "reel":
			case "hornpipe":
			case "strathspey":
			case "march":
				mHeader = "4/4";
				break;
			case "mazurka":
			case "waltz":
				mHeader = "3/4";
				break;
			case "three-two":
				mHeader = "3/2";
				break;
		}

		const cHeader = tuneData.composer ? "\nC:" + tuneData.composer : "";

		const buildAbc = (setting) => {
			const comments = tuneData.comments.find((c) => c.date === setting.date);
			const nHeaders = comments
				? "\n" +
					comments.content
						.replace(/ {4}/gm, "\n")
						.split("\n")
						.map((l) => addLineBreaks(l, 80))
						.join("\n") +
					"\nN:---"
				: "";
			const raw = `X:1
T:${tuneData.name + cHeader}
R:${tuneData.type}
L:${lHeader}
M:${mHeader + nHeaders}
N:Imported into *tuneTable* on ${new Date().toISOString().split("T")[0]},
N:from https://thesession.org/tunes/${tuneId}#setting${setting.id}${
				setting.member?.name
					? `\nN:Setting entered in thesession by user “${setting.member.name}”`
					: ""
			} on ${setting.date.slice(0, 10)}
K:${setting.key}
${setting.abc
	.replace(/!(\w+)!/gm, "__$1__")
	.replace(/!/gm, "\n")
	.replace(/__(\w+)__/gm, "!$1!")}`;
			/*
			 * The ABC ornament escaping above protects tokens like !tenuto! from being
			 * split when '!' (TheSession's line-break encoding) is replaced with '\n'.
			 */
			return TheSessionImportModal.maybeDoubleBarLength(raw, tuneData.type);
		};

		return {
			name: tuneData.name,
			nameIsFromAbc: true,
			abc:
				allUserSettings?.length > 1
					? allUserSettings.map(buildAbc)
					: buildAbc(setting),
			theSessionId: tuneId,
			theSessionSettingId: setting.id
		};
	}

	// --- Main import handler --------------------------------------------------

	/**
	 * Orchestrates the full import flow:
	 * resolve user -> collect tune IDs -> fetch ABC -> skip/append/import -> report.
	 */
	async handleImport() {
		const tuneIdStr = this.element
			.querySelector("#thesession-tune-id")
			.value?.trim();
		const settingIdStr = this.element
			.querySelector("#thesession-setting-id")
			.value?.trim();
		const user = this.element.querySelector("#thesession-user").value?.trim();
		const limit =
			parseInt(this.element.querySelector("#import-limit").value) || 10;

		if (!user && !tuneIdStr) {
			this.showStatus("Please enter a username and/or a tune ID.", "error");
			return;
		}

		const importBtn = this.element.querySelector("#import-btn");
		const copyBtn = this.element.querySelector("#copy-btn");
		this.setLoading(true);
		importBtn.disabled = true;
		copyBtn.style.display = "none";
		this.lastImportedTunes = [];

		try {
			let memberId, tuneIds;

			if (user) {
				if (/^\d+$/.test(user)) {
					memberId = +user;
				} else {
					this.showStatus("Fetching member information...", "info");
					memberId = await this.getMemberIdByUsername(user);
					if (!memberId) throw new Error(`Member '${user}' not found`);
					this.showStatus(`Found member ${user}.`, "info");
				}
			}

			const parsedTuneIds = tuneIdStr
				? tuneIdStr.split(/[\s,]+/).filter(Boolean)
				: null;

			tuneIds = parsedTuneIds
				? [...new Set(parsedTuneIds)]
				: [
						...new Set(
							await this.getMemberTunebook(
								memberId,
								this.tunesData.length + limit
							)
						)
					];

			if (!tuneIds.length) throw new Error("No tunes found");

			this.showStatus(
				`Found ${tuneIds.length} tunes. Fetching ABC settings...`,
				"info"
			);

			const importedNames = [];
			const skippedNames = [];
			const { skipLevel } = theSessionImportSettings;
			// settingId from the UI is only meaningful when exactly one tune ID is specified
			const uiSettingId =
				parsedTuneIds?.length === 1 && settingIdStr ? +settingIdStr : null;

			for (let i = 0; i < tuneIds.length; i++) {
				const tuneId = +tuneIds[i];
				this.showStatus(
					`Processing tune ${i + 1} of ${tuneIds.length}...`,
					"info"
				);

				const tuneData = await this.getTuneWithAbc(
					tuneId,
					memberId ?? null,
					uiSettingId
				);
				const existingTune = this.tunesData.find(
					(t) => t.theSessionId === tuneId
				);

				if (skipLevel === "ifTuneExists" && existingTune) {
					skippedNames.push(tuneData.name);
					continue;
				}

				if (skipLevel === "ifSettingExists") {
					if (this.isSettingPresent(tuneId, tuneData.theSessionSettingId)) {
						skippedNames.push(tuneData.name);
						continue;
					}

					if (existingTune) {
						// Tune exists but not this setting — append the new ABC
						if (!Array.isArray(existingTune.abc)) {
							existingTune.abc = existingTune.abc ? [existingTune.abc] : [];
						}
						existingTune.abc.push(tuneData.abc);
						importedNames.push(tuneData.name);
						this.lastImportedTunes.push(existingTune);
						if (importedNames.length >= limit) break;
						await TheSessionImportModal.delay(200);
						continue;
					}
				}

				try {
					const processedTune = processTuneData(tuneData);
					eventBus.emit("tuneImported", processedTune);
					importedNames.push(processedTune.name);
					this.lastImportedTunes.push(processedTune);
					if (importedNames.length >= limit) break;
				} catch {
					this.showStatus(
						`Failed to import: ${tuneData.name} - continuing`,
						"error"
					);
					continue;
				}

				await TheSessionImportModal.delay(200);
			}

			let message = importedNames.length
				? `Successfully imported ${importedNames.length} tune${importedNames.length > 1 ? "s" : ""}: ${importedNames.join(", ")}.`
				: "No new tunes to import.";
			if (skippedNames.length) {
				message += ` Skipped ${skippedNames.length} already in list.`;
			}
			this.showStatus(message, "success");

			if (this.lastImportedTunes.length && this.copyToClipboard) {
				copyBtn.style.display = "";
			}
		} catch (error) {
			console.error("Import error:", error);
			this.showStatus(error.message || "Import error", "error");
		} finally {
			this.setLoading(false);
			importBtn.disabled = false;
		}
	}
}
