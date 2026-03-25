import Modal from "./Modal.js";
import { processTuneData } from "../../processTuneData.js";
import { addLineBreaks } from "../../utils.js";
import { eventBus } from "../events/EventBus.js";
import { maybeConvertStandardTune } from "@goplayerjuggler/abc-tools";
/** Conservative defaults suitable for the public demo. */
const defaultTheSessionImportConfig = {
	skipLevel: "ifTuneExists",
	doubleBarLengthWherePossible: false,
	importAllSettingsForSpecifiedUser: false,
	settingChoiceCriteria: ["newestFirst"]
};

/**
 * Merge default settings with any overrides stored in localStorage.
 * Called once per import run (not per-tune) to avoid repeated parsing.
 * @returns {object} Import behaviour config
 *
 * Import behaviour config.
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
function getImportConfig() {
	try {
		const stored = localStorage.getItem("theSessionImportConfig");
		if (stored) {
			return JSON.parse(stored);
		}
	} catch {
		// Ignore malformed JSON
	}
	return defaultTheSessionImportConfig;
}

/**
 * Modal for importing tunes from TheSession.org
 */
export default class TheSessionImportModal extends Modal {
	/**
	 * @param {object[]} tunesData - Reference to the app's live tunes array.
	 * @param {function} copyToClipboard - copyTuneDataToClipboard(tunes, btn)
	 *   displayed as a button after a successful import.*
	 * @param {function} onImportSets        - onImportSets(setLists): called after a successful sets import
	 */
	constructor(tunesData, copyToClipboard, onImportSets) {
		super({
			id: "thesession-import-modal",
			title: "Import tunebook, tunes, or tune sets from thesession.org",
			content: TheSessionImportModal.buildContent(),
			size: "medium",
			onClose: () => eventBus.emit("refreshTable")
		});
		this.onImportSets = onImportSets;

		this.isLoading = false;
		this.tunesData = tunesData;
		this.copyToClipboard = copyToClipboard;
		/** Tunes imported in the most recent run, for clipboard export. */
		this.lastImportedTunes = [];
		this.activeTab = 0;
	}

	/**
	 * Builds the modal's HTML content.
	 * @returns {string} HTML string
	 */
	static buildContent() {
		return `
		
    <div class="tsim-tabs">
      <button class="tsim-tab tsim-tab--active" data-tab="tunes">Import tunes</button>
      <button class="tsim-tab" data-tab="sets">Import sets</button>
    </div>
    <div class="tsim-panel" data-panel="tunes">
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

		
	  </div>
    </div>
	<div class="tsim-panel tsim-panel--hidden" data-panel="sets">
      <div class="form-group">
        <label for="ts-sets-member">Member ID (optional if Set IDs are provided):</label>
        <input type="number" id="ts-sets-member" min="1" placeholder="e.g. 1" />
      </div>
      <div class="form-group">
        <label for="ts-sets-ids">Set IDs (optional, comma-separated):</label>
        <input type="text" id="ts-sets-ids" placeholder="e.g. 132118, 132039" />
      </div>
      <div class="form-group">
        <label for="ts-sets-max">Max sets (when using Member ID):</label>
        <input type="number" id="ts-sets-max" min="1" max="10" value="3" />
      </div>
      
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

		const setsMemberInput = this.element.querySelector("#ts-sets-member");
		const setsIdsInput = this.element.querySelector("#ts-sets-ids");
		const setslimitEl = this.element.querySelector("#ts-sets-max");

		const runImport = () => {
			if (!this.isLoading) {
				if (this.activeTab === 0) this.handleImport();
				if (this.activeTab === 1) this.handleSetsImport();
			}
		};

		importBtn.addEventListener("click", () => runImport());

		copyBtn.addEventListener("click", () => {
			this.copyToClipboard(this.lastImportedTunes, copyBtn);
		});

		const clearStatus = () => {
			statusDiv.textContent = "";
			statusDiv.className = "import-status";
		};
		const enterKeyImport = (e) => {
			if (e.key === "Enter") {
				runImport();
			}
		};
		[
			userInput,
			tuneIdInput,
			settingIdInput,
			limitEl,
			setsIdsInput,
			setsMemberInput,
			setslimitEl
		].forEach((el) => {
			el.addEventListener("keypress", enterKeyImport);
			el.addEventListener("input", clearStatus);
		});

		this.element.querySelectorAll(".tsim-tab").forEach((tab) => {
			tab.addEventListener("click", () => {
				this.activeTab = (this.activeTab + 1) % 2;
				this.element
					.querySelectorAll(".tsim-tab")
					.forEach((t) => t.classList.toggle("tsim-tab--active", t === tab));
				const panelId = tab.dataset.tab;
				this.element
					.querySelectorAll(".tsim-panel")
					.forEach((p) =>
						p.classList.toggle(
							"tsim-panel--hidden",
							p.dataset.panel !== panelId
						)
					);
			});
		});
	}

	openInSetsMode() {
		this.open();
		const setsTab = this.element?.querySelector('[data-tab="sets"]');
		setsTab?.click();
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
		const config = getImportConfig();
		const tuneUrl = `https://thesession.org/tunes/${tuneId}?format=json`;
		const tuneResponse = await fetch(tuneUrl);
		if (!tuneResponse.ok) {
			throw new Error(`Failed to fetch tune ${tuneId}: ${tuneResponse.status}`);
		}

		const tuneData = await tuneResponse.json();
		const allUserSettings =
			config.importAllSettingsForSpecifiedUser && preferredMemberId
				? tuneData.settings.filter((s) => s.member?.id === preferredMemberId)
				: null;

		const setting = allUserSettings?.length
			? allUserSettings[0]
			: this.selectBestSetting(
					tuneData.settings,
					preferredMemberId,
					uiSettingId,
					config.settingChoiceCriteria
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
			const comments = tuneData.comments.find(
				(c) =>
					config.withComments &&
					c.date === setting.date &&
					c.member?.id === setting.member?.id
			);
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

			if (config.doubleBarLengthWherePossible)
				return maybeConvertStandardTune(raw, tuneData.type);
			else return raw;
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
			const { skipLevel } = getImportConfig();

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

	// --- handling of sets

	/**
	 * Fetch all pages of a member's sets, up to maxSets results.
	 * thesession.org paginates at 10 items per page.
	 */
	async fetchMemberSets(memberId, maxSets) {
		const sets = [];
		let page = 1;
		while (sets.length < maxSets) {
			const data = await this.fetchApi(
				`https://thesession.org/members/${memberId}/sets?page=${page}`
			);
			const items = data.sets ?? [];
			if (!items.length) break;
			const filteredItems = items.filter(
				(tsItem) =>
					!window._setLists?.some((sl) =>
						sl.sets.some((set) => set.theSessionSetId === tsItem.id)
					)
			);

			sets.push(...filteredItems);
			const total = data.total ?? 0;
			if (sets.length >= total) break;
			if (items.length < 10) break; // last page
			page++;
		}
		return sets.slice(0, maxSets);
	}

	/**
	 * Fetch a single set by ID.
	 */
	async fetchSet(setId) {
		return this.fetchApi(`https://thesession.org/sets/${setId}`);
	}

	/**
	 * Parse a comma-separated string of set IDs into an array of trimmed numeric strings.
	 * Returns an empty array for blank input.
	 */
	parseSetIds(str) {
		return str
			.split(",")
			.map((s) => s.trim())
			.filter((s) => /^\d+$/.test(s));
	}

	/** Generate a simple unique ID (timestamp + random suffix). */
	generateId() {
		return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
	}

	/**
	 * Convert a thesession.org set object into our set-list shape.
	 * Matches tunes against window.tunesData by theSessionId.
	 * Returns { setList, skipped } where skipped is an array of tune names not found locally.
	 */
	convertSetToBeDeleted(tsSet) {
		// The API returns tunes under different keys depending on the endpoint
		const tunes = tsSet.settings;
		const entries = [];
		const skipped = [];

		for (const tsTune of tunes) {
			// tsTune.id is the setting ID; parse the tune ID from the URL
			const tuneIdMatch = tsTune.url?.match(/\/tunes\/(\d+)/);
			const tuneId = tuneIdMatch ? parseInt(tuneIdMatch[1], 10) : null;
			const settingId = tsTune.id;

			if (!tuneId) {
				skipped.push(tsTune.name ?? String(settingId));
				continue;
			}

			entries.push({ theSessionId: tuneId, theSessionSettingId: settingId });
		}

		const setList = {
			id: this.generateId(),
			name: `thesession - ${tsSet.member?.name} - ${tsSet.date}`,
			dateCreated: new Date().toISOString(),
			dateModified: new Date().toISOString(),
			sets: [
				{
					name: tsSet.name ?? `Imported set ${tsSet.id}`,
					comments: "",
					tunes: entries,
					collapsed: false,
					theSessionSetId: tsSet.id
				}
			]
		};

		return { setList, skipped };
	}

	/**
	 * Fetch JSON from thesession.org, appending ?format=json.
	 * Throws on HTTP error.
	 */
	async fetchApi(url) {
		const sep = url.includes("?") ? "&" : "?";
		const res = await fetch(`${url}${sep}format=json`);
		if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
		return res.json();
	}

	// ─── Import logic ─────────────────────────────────────────────────────────────
	async handleSetsImport() {
		const setsMemberInput = this.element.querySelector("#ts-sets-member");
		const setsIdsInput = this.element.querySelector("#ts-sets-ids");
		const setslimitEl = this.element.querySelector("#ts-sets-max");
		const importBtn = this.element.querySelector("#import-btn");

		const config = getImportConfig();
		const memberId = setsMemberInput.value.trim();
		const setIdsRaw = setsIdsInput.value.trim();
		const maxSets = Math.min(5, Math.max(1, parseInt(setslimitEl.value) || 3));

		// Validation — one of member ID or set IDs required
		if (!memberId && !setIdsRaw) {
			this.showStatus(
				"Please provide a Member ID or at least one Set ID.",
				true
			);
			return;
		}

		importBtn.disabled = true;
		importBtn.textContent = "Importing…";
		this.showStatus("Fetching from thesession.org…");

		try {
			// ── Fetch raw set data ─────────────────────────────────────────────
			let rawSets = [];

			if (setIdsRaw) {
				// Explicit set IDs take priority over member ID
				const ids = this.parseSetIds(setIdsRaw);
				if (!ids.length) {
					this.showStatus(
						"No valid set IDs found. Use comma-separated numbers.",
						true
					);
					importBtn.disabled = false;
					importBtn.textContent = "Import";
					return;
				}
				rawSets = await Promise.all(ids.map(this.fetchSet));
			} else {
				rawSets = await this.fetchMemberSets(memberId, maxSets);
			}

			if (!rawSets.length) {
				this.showStatus("No sets found for the given ID(s).", true);
				importBtn.disabled = false;
				importBtn.textContent = "Import";
				return;
			}

			// ── Convert to set-list format ─────────────────────────────────────
			let totalTunes = 0;
			let tsMemberName = "";
			let firstTuneNameOfSetList = "";
			const importedSetLists = [];
			const newlyImported = [];
			const allSkipped = [];

			const sets = [];

			for (const tsSet of rawSets) {
				if (!tsMemberName) tsMemberName = tsSet.member?.name;
				const tunes = [];
				const tsTunes = tsSet.settings ?? [];
				let firstTuneName = tsTunes.length > 0 ? tsTunes[0].name : "";
				if (!firstTuneNameOfSetList) firstTuneNameOfSetList = firstTuneName;

				for (const tsTune of tsTunes) {
					const tuneIdMatch = tsTune.url?.match(/\/tunes\/(\d+)/);
					const tuneId = tuneIdMatch ? parseInt(tuneIdMatch[1], 10) : null;
					const settingId = tsTune.id;

					if (!tuneId) {
						allSkipped.push(tsTune.name ?? String(settingId));
						continue;
					}

					++totalTunes;

					const existingTune = this.tunesData.find(
						(t) => t.theSessionId === tuneId
					);

					if (!existingTune) {
						// Tune absent — fetch and import it in full
						try {
							const tuneData = await this.getTuneWithAbc(
								tuneId,
								null,
								settingId,
								config
							);
							const processed = processTuneData(tuneData);
							eventBus.emit("tuneImported", processed);
							newlyImported.push(processed.name);
						} catch {
							allSkipped.push(tsTune.name ?? `tune ${tuneId}`);
						}
					} else if (!this.isSettingPresent(tuneId, settingId)) {
						// Tune present but setting absent — fetch and append the ABC
						try {
							const fetched = await this.getTuneWithAbc(
								tuneId,
								null,
								settingId,
								config
							);
							if (!Array.isArray(existingTune.abc)) {
								existingTune.abc = existingTune.abc ? [existingTune.abc] : [];
							}
							existingTune.abc.push(fetched.abc);
						} catch {
							// Non-fatal: entry still added referencing the setting
						}
					}

					tunes.push({
						theSessionId: tuneId,
						theSessionSettingId: settingId
					});
				}

				if (tunes.length > 0) {
					sets.push({
						name: firstTuneName,
						comments: "",
						tunes,
						collapsed: false,
						theSessionSetId: tsSet.id
					});
				}
			}

			const listDescriptor =
				sets.length === 0
					? ""
					: `“${firstTuneNameOfSetList}” set${`${sets.length === 1 ? "" : ` + ${sets.length - 1} other set${sets.length > 2 ? "s" : ""}`}`}`;

			importedSetLists.push({
				id: this.generateId(),
				name: `thesession / ${tsMemberName} / ${listDescriptor}`,
				dateCreated: new Date().toISOString(),
				dateModified: new Date().toISOString(),
				sets
			});

			// ── Hand off imported set lists to caller ──────────────────────────
			this.onImportSets(importedSetLists);

			// ── Show summary ───────────────────────────────────────────────────
			const s = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
			let summary =
				`✓ ${s(importedSetLists.length, "set")} imported ` +
				`(${s(totalTunes, "tune")} total).`;
			if (allSkipped.length) {
				summary +=
					`<br><span class="tssi-skipped">Tunes not found locally and skipped: ` +
					`${allSkipped.map((n) => `<em>${n}</em>`).join(", ")}.</span>`;
			}
			this.showStatus(summary, false);
			importBtn.disabled = false;
			importBtn.textContent = "Import more";
		} catch (err) {
			console.error("[TheSessionSetsImport]", err);
			this.showStatus(
				`Import failed: ${err.message}.<br>Check the IDs and try again.`,
				true
			);
			importBtn.disabled = false;
			importBtn.textContent = "Import";
		}
	}
}
