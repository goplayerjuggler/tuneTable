import processTuneData from "./processTuneData.js";
import { addLineBreaks } from "./utils.js";
// thesession-import.js
// Module for importing tunebooks from thesession.org

/**
 * Creates and shows the import modal
 */
function showTheSessionImportModal() {
  const modal = document.createElement("div");
  modal.id = "thesession-import-modal";
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
    <div class="modal-header">
    <h2>Import tunebook from thesession.org</h2>
    <span class="close-button" onclick="closeTheSessionImportModal()">&times;</span>
    </div>
    
      <p>Enter the username of a thesession.org member to import their tunebook.</p>
      <div class="form-group">
        <label for="thesession-username">Username:</label>
        <input type="text" id="thesession-username" placeholder="e.g. goplayer" />
      </div>
      <div class="form-group">
        <label for="thesession-tune-id">Tune ID (optional):</label>
        <input type="text" id="thesession-tune-id" placeholder="e.g. 23320 (ID of The First Draft, a mazurka by S. Peoples)" />
      </div>
      <div class="form-group">
        <label for="import-limit">Number of tunes (max 100):</label>
        <input type="number" id="import-limit" min="1" max="100" value="10" />
      </div>
      <div id="import-status" class="import-status"></div>
      <div class="button-group">
        <button onclick="importFromTheSession()" class="btn-primary">Import tunes</button>
        <button onclick="closeTheSessionImportModal()" class="btn-secondary">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = "block";
  document.getElementById("thesession-username").focus();
}

/**
 * Closes the import modal
 */
function closeTheSessionImportModal() {
  const modal = document.getElementById("thesession-import-modal");
  if (modal) {
    modal.remove();
  }
}

/**
 * Updates the status message in the modal
 */
function updateImportStatus(message, type = "info") {
  const statusDiv = document.getElementById("import-status");
  if (statusDiv) {
    statusDiv.textContent = message;
    statusDiv.className = `import-status ${type}`;
  }
}

/**
 * Main import function
 */
async function importFromTheSession() {
  const username = document.getElementById("thesession-username").value.trim();
  const tuneId = document.getElementById("thesession-tune-id").value.trim();
  const limit = parseInt(document.getElementById("import-limit").value) || 10;

  if (!username) {
    updateImportStatus("Please enter a username", "error");
    return;
  }

  // Disable the import button during processing
  const importBtn = event.target;
  importBtn.disabled = true;
  importBtn.textContent = "Importing...";

  try {
    updateImportStatus("Fetching member information...", "info");

    // Step 1: Get member ID from username
    const memberId = await getMemberIdByUsername(username);
    if (!memberId) {
      throw new Error(`Member '${username}' not found`);
    }

    updateImportStatus(
      `Found member ${username}. Fetching tunebook...`,
      "info"
    );

    // Step 2: Get tunebook for this member
    const tuneIds = tuneId
      ? [tuneId]
      : await getMemberTunebook(memberId, window.tunesData.length + limit);

    if (tuneIds.length === 0) {
      throw new Error("No tunes found in tunebook");
    }

    updateImportStatus(
      `Found ${tuneIds.length} tunes. Fetching ABC settings...`,
      "info"
    );

    // Step 3: Fetch ABC for each tune
    const importedTunes = [];
    const skippedTunes = [];

    for (let i = 0; i < tuneIds.length; i++) {
      const tuneId = tuneIds[i];
      updateImportStatus(
        `Processing tune ${i + 1} of ${tuneIds.length}...`,
        "info"
      );

      try {
        const tuneData = await getTuneWithAbc(tuneId, memberId);

        // Check if tune already exists in tunesData
        const existingTune = window.tunesData.find(
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

        const processedTune = processTuneData(tuneData);
        window.tunesData.push(processedTune);
        importedTunes.push(processedTune.name);

        if (importedTunes.length >= limit) {
          break;
        }
      } catch (error) {
        console.error(`Failed to import tune ${tuneId}:`, error);
      }

      // Add small delay to avoid overwhelming the API
      await delay(200);
    }

    // Show results
    if (importedTunes.length > 0) {
      let message = `Successfully imported ${importedTunes.length} tunes.`;
      if (skippedTunes.length > 0) {
        message += ` Skipped ${skippedTunes.length} tunes already in list.`;
      }
      updateImportStatus(message, "success");

      // Update the display
      // if (importedTunes.length > 1 &&
      //   importedTunes.length === window.tunesData.length) {
      //   window.applyDefaultSort()
      // }
      window.sortWithDefaultSort();
      window.populateFilters();
      window.applyFilters();

      window.saveTunesToStorage();
    }
    // Show results
    let message = `Successfully imported ${importedTunes.length} tunes.`;
    if (skippedTunes.length > 0) {
      message += ` Skipped ${skippedTunes.length} tunes already in list.`;
    }
    updateImportStatus(message, "success");

    // Re-enable button
    importBtn.disabled = false;
    importBtn.textContent = "Import tunes";
  } catch (error) {
    console.error("Import error:", error);
    updateImportStatus(`Error: ${error.message}`, "error");
    importBtn.disabled = false;
    importBtn.textContent = "Import tunes";
  }
}

/**
 * Get member ID by username using the search API
 */
async function getMemberIdByUsername(username) {
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
async function getMemberTunebook(memberId, limit = 500) {
  const tuneIds = [];
  let page = 1;
  const perPage = 50;

  while (tuneIds.length < limit) {
    const url = `https://thesession.org/members/${memberId}/tunebook?format=json&page=${page}&perpage=${perPage}`;

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
async function getTuneWithAbc(tuneId, preferredMemberId = null) {
  // Get tune details
  const tuneUrl = `https://thesession.org/tunes/${tuneId}?format=json`;
  const tuneResponse = await fetch(tuneUrl);

  if (!tuneResponse.ok) {
    throw new Error(`Failed to fetch tune ${tuneId}: ${tuneResponse.status}`);
  }

  const tuneData = await tuneResponse.json();

  const settingsData = tuneData.settings;

  // Select the best setting(s)
  let selectedSetting = selectBestSetting(settingsData, preferredMemberId);
  if (!selectedSetting) {
    throw new Error(`No settings found for tune ${tuneId}`);
  }
  let selectedSettings;
  if (Array.isArray(selectedSetting)) {
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
      ? "\n" + comments.content.replace(/    /gm, "\n").split('\n').map(l=>addLineBreaks(l,80)).join('\n') + "\nN:---"
      : "";
    return `X:1
T:${tuneData.name + cHeader}
R:${tuneData.type}
L:${lHeader}
M:${mHeader + nHeaders}
N:Imported from https://thesession.org/tunes/${tuneId}#setting${setting.id}${
      setting.member?.name
        ? `
N:Setting entered in thesession by user ${setting.member.name}`
        : ""
    } on ${setting.date}
K:${setting.key}
${
  setting.abc
    .replace(/!(\w+)!/gm, "__$1__")
    .replace(/\!/gm, "\n")
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
    scores: [
      {
        url: `https://thesession.org/tunes/${tuneId}#setting${selectedSetting.id}`,
        name: "thesession.org",
      },
    ],
  };

  return tune;
}

/**
 * Select the best ABC setting from available settings
 * Prefers settings by the specified member, then most popular
 */
function selectBestSetting(settings, preferredMemberId = null) {
  if (!settings || settings.length === 0) {
    return null;
  }

  // First try to find a setting by the preferred member
  if (preferredMemberId) {
    const memberSetting = settings.filter(
      (s) => s.member && s.member.id === preferredMemberId
    );
    if (memberSetting.length > 0) {
      return memberSetting;
    }
  }

  // Otherwise, sort by popularity (number of recordings + discussions)
  const sortedSettings = [...settings].sort((a, b) => {
    const popularityA = (a.recordings || 0) + (a.discussions || 0);
    const popularityB = (b.recordings || 0) + (b.discussions || 0);
    return popularityB - popularityA;
  });

  return sortedSettings[0];
}

/**
 * Utility function to add delay
 */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const setupTheSessionImportModal = () => {
  // Add CSS for the modal
  const modalStyles = `
	<style>
	
	
	.form-group {
	  margin-bottom: 15px;
	}
	
	.form-group label {
	  display: block;
	  margin-bottom: 5px;
	  font-weight: bold;
	}
	
	.form-group input {
	  width: 100%;
	  padding: 8px;
	  border: 1px solid #ddd;
	  border-radius: 4px;
	  box-sizing: border-box;
	  font-size: 14px;
	}
	
	.import-status {
	  padding: 10px;
	  margin: 15px 0;
	  border-radius: 4px;
	  min-height: 20px;
	}
	
	.import-status.info {
	  background-color: #e3f2fd;
	  color: #1976d2;
	  border: 1px solid #90caf9;
	}
	
	.import-status.success {
	  background-color: #e8f5e9;
	  color: #388e3c;
	  border: 1px solid #81c784;
	}
	
	.import-status.error {
	  background-color: #ffebee;
	  color: #c62828;
	  border: 1px solid #ef9a9a;
	}
	
	.button-group {
	  display: flex;
	  gap: 10px;
	  justify-content: flex-end;
	  margin-top: 20px;
	}
	
	.btn-primary,
	.btn-secondary {
	  padding: 10px 20px;
	  border: none;
	  border-radius: 4px;
	  cursor: pointer;
	  font-size: 14px;
	  font-weight: bold;
	  transition: background-color 0.2s;
	}
	
	.btn-primary {
	  background-color: #1976d2;
	  color: white;
	}
	
	.btn-primary:hover:not(:disabled) {
	  background-color: #1565c0;
	}
	
	.btn-primary:disabled {
	  background-color: #90caf9;
	  cursor: not-allowed;
	}
	
	.btn-secondary {
	  background-color: #757575;
	  color: white;
	}
	
	.btn-secondary:hover {
	  background-color: #616161;
	}
	</style>
	`;

  // Inject styles into the page
  if (typeof document !== "undefined") {
    document.head.insertAdjacentHTML("beforeend", modalStyles);
  }
};

export default {
  showTheSessionImportModal,
  closeTheSessionImportModal,
  importFromTheSession,
  setupTheSessionImportModal,
};
