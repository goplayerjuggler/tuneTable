import processTuneData from "./processTuneData.js";
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
      <span class="close" onclick="closeTheSessionImportModal()">&times;</span>
      <h2>Import tunebook from thesession.org</h2>
      <p>Enter the username of a thesession.org member to import their tunebook.</p>
      <div class="form-group">
        <label for="thesession-username">Username:</label>
        <input type="text" id="thesession-username" placeholder="e.g. adactio" />
      </div>
      <div class="form-group">
        <label for="import-limit">Number of tunes (max 10):</label>
        <input type="number" id="import-limit" min="1" max="10" value="10" />
      </div>
      <div id="import-status" class="import-status"></div>
      <div class="button-group">
        <button onclick="importFromTheSession()" class="btn-primary">Import tunes</button>
        <button onclick="closeTheSessionImportModal()" class="btn-secondary">Cancel</button>
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
    const tuneIds = await getMemberTunebook(memberId, window.tunesData.length + limit);

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
        const existingTune = window.tunesData?.find(
          (t) =>
            t.name &&
            tuneData.name &&
            (
				t.name.toLowerCase() === tuneData.name.toLowerCase()
				|| tuneData.aliases?.find(a=>a?.toLowerCase() === t.name.toLowerCase())
			)
        );

        if (existingTune) {
          skippedTunes.push(tuneData.name);
          continue;
        }

        // Add to tunesData
        if (window.tunesData) {
          const processedTune = processTuneData(tuneData);
          window.tunesData.push(processedTune);
          importedTunes.push(processedTune.name);

          if (importedTunes.length >= limit) {
            break;
          }
        }
      } catch (error) {
        console.error(`Failed to import tune ${tuneId}:`, error);
      }

      // Add small delay to avoid overwhelming the API
      await delay(200);
    }

    // Update the display
    if (typeof window.applyFilters === "function") {
		window.applyFilters()
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

  // Select the best setting
  const selectedSetting = selectBestSetting(settingsData, preferredMemberId);
  if (!selectedSetting) {
    throw new Error(`No settings found for tune ${tuneId}`);
  }
  let lHeader, mHeader
  switch (tuneData.type) {
	case 'jig':
		lHeader='1/8'
		mHeader='6/8'
		break;
	case 'slide':
		lHeader='1/8'
		mHeader='12/8'
		break;
	case 'polka':
		lHeader='1/8'
		mHeader='2/4'
		break;
	case 'reel':
		lHeader='1/8'
		mHeader='4/4'
		break;
  
	default:
		lHeader='1/8'
		break;
  }

  const abc = `X:1
T:${tuneData.name}
R:${tuneData.type}
L:${lHeader}
M:${mHeader}
N:Imported from https://thesession.org/tunes/${tuneId}#setting${selectedSetting.id}
N:Setting by ${selectedSetting.member?.name}
K:${selectedSetting.key}
${selectedSetting.abc}`


  // Build the tune object in tuneTable format
  const tune = {
    abc,
    scores: [
      {
        source: `https://thesession.org/tunes/${tuneId}#setting${selectedSetting.id}`,
        sourceType: "thesession.org",
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
    const memberSetting = settings.find(
      (s) => s.member && s.member.id === preferredMemberId
    );
    if (memberSetting) {
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
	.modal {
	  display: none;
	  position: fixed;
	  z-index: 1000;
	  left: 0;
	  top: 0;
	  width: 100%;
	  height: 100%;
	  overflow: auto;
	  background-color: rgba(0, 0, 0, 0.4);
	}
	
	.modal-content {
	  background-color: var(--bg-color, #fefefe);
	  color: var(--text-color, #333);
	  margin: 5% auto;
	  padding: 20px;
	  border: 1px solid #888;
	  border-radius: 8px;
	  width: 90%;
	  max-width: 500px;
	  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	
	.modal-content h2 {
	  margin-top: 0;
	  color: var(--text-color, #333);
	}
	
	.close {
	  color: #aaa;
	  float: right;
	  font-size: 28px;
	  font-weight: bold;
	  cursor: pointer;
	}
	
	.close:hover,
	.close:focus {
	  color: #000;
	}
	
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
