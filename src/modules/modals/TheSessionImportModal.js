import Modal from "./Modal.js";
import { processTuneData } from "../../processTuneData.js";
import { addLineBreaks } from "../../utils.js";
import { eventBus } from "../events/EventBus.js";

/**
 * Modal for importing tunes from TheSession.org
 */
export default class TheSessionImportModal extends Modal {
	constructor(tunesData) {
		super({
			id: "thesession-import-modal",
			title: "Import tunebook or tune from thesession.org",
			content: TheSessionImportModal.buildContent(),
			size: "medium",
			onClose: () => eventBus.emit("refreshTable")
		});

		this.isLoading = false;
		this.tunesData = tunesData;
	}

	/**
	 * Builds the modal's HTML content
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
          <label for="thesession-tune-id">Tune ID (optional):</label>
          <input type="text" id="thesession-tune-id" placeholder="e.g. 23320 (ID of The First Draft, a mazurka by S. Peoples)" />
        </div>
        <div class="form-group">
          <label for="import-limit">Maximum number of tunes:</label>
          <input type="number" id="import-limit" min="1" max="100" value="100" />
        </div>

        
        <div class="form-actions">
          <button 
            id="import-btn" 
            class="btn btn--primary"
            type="button">
            Import
          </button>
        </div>
        
        <div id="import-status" class="import-status" role="status" aria-live="polite"></div>
      </div>
    `;
	}

	/**
	 * Set up event listeners - extends base class
	 */
	setupEventListeners() {
		// Call parent to set up close handlers and ESC key
		super.setupEventListeners();

		const importBtn = this.element.querySelector("#import-btn");
		const userInput = this.element.querySelector("#thesession-user");
		const limitEl = this.element.querySelector("#import-limit");
		//todo: add user ID - one fewer API call
		const tuneIdInput = this.element.querySelector("#thesession-tune-id");
		const statusDiv = this.element.querySelector("#import-status");

		// Import button click
		importBtn.addEventListener("click", () => this.handleImport());

		const enterKeyImport = (e) => {
			if (e.key === "Enter" && !this.isLoading) {
				this.handleImport();
			}
		};
		// Enter key to import
		tuneIdInput.addEventListener("keypress", enterKeyImport);
		userInput.addEventListener("keypress", enterKeyImport);
		limitEl.addEventListener("keypress", enterKeyImport);

		const clearStatus = () => {
			statusDiv.textContent = "";
			statusDiv.className = "import-status";
		};
		// Clear status on input change
		userInput.addEventListener("input", clearStatus);
		tuneIdInput.addEventListener("input", clearStatus);
	}

	// /**
	//  * Extracts tune ID from various input formats
	//  * @param {string} input - URL or tune ID
	//  * @returns {string|null} Tune ID or null if invalid
	//  */
	// extractTuneId(input) {
	//   // Direct numeric ID
	//   if (/^\d+$/.test(input)) {
	//     return input;
	//   }

	//   // URL format: https://thesession.org/tunes/12345
	//   const urlMatch = input.match(/thesession\.org\/tunes\/(\d+)/);
	//   if (urlMatch) {
	//     return urlMatch[1];
	//   }

	//   return null;
	// }

	/**
	 * Shows status message
	 * @param {string} message - Status message
	 * @param {string} type - Status type: 'success', 'error', 'loading'
	 */
	showStatus(message, type = "info") {
		const statusDiv = this.element.querySelector("#import-status");
		statusDiv.textContent = message;
		statusDiv.className = `import-status import-status--${type}`;
	}

	/**
	 * Sets loading state
	 * @param {boolean} loading - Loading state
	 */
	setLoading(loading) {
		this.isLoading = loading;
		const overlay = this.element.querySelector(".modal__overlay");
		if (loading) {
			overlay.style.cursor = "wait";
		} else {
			overlay.style.cursor = "pointer";
		}
	}

	static delay(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * Main import function
	 */
	async handleImport() {
		const importBtn = this.element.querySelector("#import-btn");

		this.setLoading(true);
		importBtn.disabled = true;
		const tuneId = this.element
			.querySelector("#thesession-tune-id")
			.value?.trim();
		//todo - possible improvement: allow the tune URL as an alternative

		const user = this.element.querySelector("#thesession-user").value?.trim();
		const limit = parseInt(document.getElementById("import-limit").value) || 10;

		if (!user && !tuneId) {
			this.showStatus("Please enter a username and/or a tune ID", "error");
			return;
		}

		// Disable the import button during processing
		// const importBtn = event.target;
		// importBtn.disabled = true;
		// importBtn.textContent = "Importing…";
		this.setLoading(true);

		try {
			let memberId, tuneIds;
			if (user) {
				if (user.match(/^\d+$/)) {
					memberId = +user; //unary plus operator (+) can be used to convert a string to a number.
				} else {
					this.showStatus("Fetching member information…", "info");

					// Step 1: Get member ID from username
					memberId = await this.getMemberIdByUsername(user);
					if (!memberId) {
						throw new Error(`Member '${user}' not found`);
					}

					this.showStatus(`Found member ${user}.`, "info");
				}
			}
			// Step 2: Get tunebook for this member
			tuneIds = tuneId
				? [tuneId]
				: await this.getMemberTunebook(memberId, this.tunesData.length + limit);

			if (tuneIds.length === 0) {
				throw new Error("No tunes found");
			}

			this.showStatus(
				`Found ${tuneIds.length} tunes. Fetching ABC settings…`,
				"info"
			);

			// Step 3: Fetch ABC for each tune
			const importedTunes = [];
			const skippedTunes = [];

			for (let i = 0; i < tuneIds.length; i++) {
				const tuneId = tuneIds[i];
				this.showStatus(
					`Processing tune ${i + 1} of ${tuneIds.length}…`,
					"info"
				);

				const tuneData = await this.getTuneWithAbc(tuneId, memberId);

				// Check if tune already exists in tunesData
				const existingTune = this.tunesData.find(
					(t) =>
						t.name &&
						tuneData.name &&
						(t.name.trim().toLowerCase() ===
							tuneData.name.trim().toLowerCase() ||
							tuneData.aliases?.find(
								(a) => a?.trim().toLowerCase() === t.name.trim().toLowerCase()
							))
				);

				if (existingTune) {
					skippedTunes.push(tuneData.name);
					continue;
				}
				try {
					const processedTune = processTuneData(tuneData);
					eventBus.emit("tuneImported", processedTune);
					// this.tunesData.push(processedTune);
					importedTunes.push(processedTune.name);

					if (importedTunes.length >= limit) {
						break;
					}
				} catch {
					this.showStatus(
						`failed to import tune: ${tuneData.name} - continuing`,
						"error"
					);
					continue;
				}

				// Add small delay to avoid overwhelming the API
				await TheSessionImportModal.delay(200);
			}

			// Show results
			if (importedTunes.length > 0) {
				let message = `Successfully imported ${importedTunes.length} tunes.`;
				if (skippedTunes.length > 0) {
					message += ` Skipped ${skippedTunes.length} tunes already in list.`;
				}
				this.showStatus(message, "success");
			}
			// Show results
			let message = `Successfully imported ${importedTunes.length} tunes.`;
			if (skippedTunes.length > 0) {
				message += ` Skipped ${skippedTunes.length} tunes already in list.`;
			}
			this.showStatus(message, "success");

			//   // Re-enable button
			//   importBtn.disabled = false;
			//   importBtn.textContent = "Import tunes";
			// } catch (error) {
			//   console.error("Import error:", error);
			//   this.showStatus(`Error: ${error.message}`, "error");
			//   importBtn.disabled = false;
			//   importBtn.textContent = "Import tunes";
			// }
		} catch (error) {
			console.error("Import error:", error);
			this.showStatus(error.message || "import error", "error");
		} finally {
			this.setLoading(false);
			importBtn.disabled = false;
		}
	}

	/**
	 * Get member ID by username using the search API
	 */
	async getMemberIdByUsername(username) {
		const searchUrl = `https://thesession.org/members/search?q=${encodeURIComponent(
			username
		)}&format=json`;

		const response = await fetch(searchUrl);
		if (!response.ok) {
			throw new Error(`Failed to search for member: ${response.status}`);
		}

		const data = await response.json();

		// Find exact match (case-insensitive)
		const member = data.members?.find(
			(m) => m.name.toLowerCase() === username.toLowerCase()
		);

		return member?.id || null;
	}

	/**
	 * Get tunebook for a member
	 */
	async getMemberTunebook(memberId, limit = 500) {
		const tuneIds = [];
		let page = 1;
		const perPage = Math.min([20, limit]);

		while (tuneIds.length < limit) {
			const url = `https://thesession.org/members/${memberId}/tunebook?format=json&page=${page}&orderby=newest&perpage=${perPage}`;

			this.showStatus(
				`loading tunebook items ${page * perPage + 1} to ${
					(page + 1) * perPage
				}`,
				"info"
			);
			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`Failed to fetch tunebook: ${response.status}`);
			}

			const data = await response.json();

			if (!data.tunes || data.tunes.length === 0) {
				break;
			}

			for (const item of data.tunes) {
				if (item.id && tuneIds.length < limit) {
					tuneIds.push(item.id);
				}
			}

			// Check if there are more pages
			if (data.tunes.length < perPage) {
				break;
			}

			page++;
		}

		return tuneIds;
	}

	/**
	 * Get tune details and ABC notation
	 */
	async getTuneWithAbc(tuneId, preferredMemberId = null) {
		// Get tune details
		const tuneUrl = `https://thesession.org/tunes/${tuneId}?format=json`;
		const tuneResponse = await fetch(tuneUrl);

		if (!tuneResponse.ok) {
			throw new Error(`Failed to fetch tune ${tuneId}: ${tuneResponse.status}`);
		}

		const tuneData = await tuneResponse.json();

		const settingsData = tuneData.settings;

		// Select the best setting(s)

		let [selectedSetting, isFromPreferredMember] = this.selectBestSetting(
			settingsData,
			preferredMemberId
		);
		if (!selectedSetting) {
			throw new Error(`No settings found for tune ${tuneId}`);
		}
		let selectedSettings;
		if (isFromPreferredMember) {
			selectedSettings = selectedSetting;
			selectedSetting = selectedSettings[0];
		}
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
				// lHeader="1/4"
				break;
			case "three-two":
				mHeader = "3/2";
				break;
		}

		const cHeader = tuneData.composer ? "\nC:" + tuneData.composer : "";

		const getAbc = (setting) => {
			const comments = tuneData.comments.find((c) => c.date === setting.date);
			let nHeaders = comments
				? "\n" +
					comments.content
						.replace(/ {4}/gm, "\n")
						.split("\n")
						.map((l) => addLineBreaks(l, 80))
						.join("\n") +
					"\nN:---"
				: "";
			return `X:1
T:${tuneData.name + cHeader}
R:${tuneData.type}
L:${lHeader}
M:${mHeader + nHeaders}
N:Imported into *tuneTable* on ${new Date().toISOString().split("T")[0]},
N:from https://thesession.org/tunes/${tuneId}#setting${setting.id}${
				setting.member?.name
					? `
N:Setting entered in thesession by user “${setting.member.name}”`
					: ""
			} on ${
				setting.date.substr(0, 10) //just get the date, not the time
			}
K:${setting.key}
${
	setting.abc
		.replace(/!(\w+)!/gm, "__$1__")
		.replace(/!/gm, "\n")
		.replace(/__(\w+)__/gm, "!$1!")
	/*
  bit of work to escape out abc ornaments like !tenuto!, then replace `!` with line return
  , then restore the abc ornaments!
Because thesession encodes line returns with `!`. 
  */
}`;
		};

		// Build the tune object in tuneTable format
		const tune = {
			name: tuneData.name,
			nameIsFromAbc: true,
			abc: selectedSettings
				? selectedSettings.map(getAbc)
				: getAbc(selectedSetting),
			theSessionId: tuneId

			// scores: [
			// 	{
			// 		url: `https://thesession.org/tunes/${tuneId}#setting${selectedSetting.id}`,
			// 		name: "thesession.org"
			// 	}
			// ]
		};
		if (isFromPreferredMember) {
			tune.theSessionSettingId = selectedSetting.id;
		}

		return tune;
	}

	/**
	 * Select the best ABC setting from available settings
	 * Prefers settings by the specified member, then takes the first
	 */
	selectBestSetting(settings, preferredMemberId = null) {
		if (!settings || settings.length === 0) {
			return null;
		}

		// First try to find a setting by the preferred member
		if (preferredMemberId) {
			const memberSettings = settings.filter(
				(s) => s.member && s.member.id === preferredMemberId
			);
			if (memberSettings.length > 0) {
				return [memberSettings, true];
			}
		}

		// Otherwise, take the first setting

		return [settings[0], false];
	}
}
