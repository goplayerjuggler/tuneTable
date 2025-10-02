import tunesDataRaw from './tunes.json';

        let tunesData = [];
        let filteredData = [];
        let currentSort = { column: null, direction: 'asc' };
        let currentViewMode = 'rendered';
let currentTranspose = 0;
let currentTuneABC = "";

        function parseABC(abc) {
            const lines = abc.split('\n');
            const metadata = {};

            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed.startsWith('T:') && !metadata.title //prevent the primary title being overwritten by secondary title
                ) {
                    metadata.title = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('R:')) {
                    metadata.rhythm = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('K:')) {
                    metadata.key = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('S:')) {
                    metadata.source = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('F:')) {
                    metadata.url = trimmed.substring(2).trim();
                } else if (trimmed.startsWith('D:')) {
                    metadata.recording = trimmed.substring(2).trim();
                }
            }

            return metadata;
        }

        function processTuneData(tune) {
            const processed = { ...tune };

            if (tune.abc) {
                const abcMeta = parseABC(tune.abc);

                if (!processed.name && abcMeta.title) {
                    processed.name = abcMeta.title;
                }
                if (!processed.rhythm && abcMeta.rhythm) {
                    processed.rhythm = abcMeta.rhythm;
                }
                if (!processed.key && abcMeta.key) {
                    processed.key = abcMeta.key;
                }

                if (!processed.references) {
                    processed.references = [];
                }

                if (abcMeta.source || abcMeta.url || abcMeta.recording) {
                    const abcRef = {
                        artists: abcMeta.source || '',
                        url: abcMeta.url || '',
                        notes: abcMeta.recording || ''
                    };
                    processed.references.push(abcRef);
                }
            }

            if (!processed.name) processed.name = 'Untitled';
            if (!processed.key) processed.key = '';
            if (!processed.rhythm) processed.rhythm = '';
            if (!processed.references) processed.references = [];
            if (!processed.scores) processed.scores = [];

            return processed;
        }

        function initialiseData() {
            tunesData = tunesDataRaw.tunes.map(processTuneData);
            document.getElementById('spLastUpdated').innerHTML = tunesDataRaw.lastUpdate
            filteredData = [...tunesData];
            populateFilters();
            renderTable();
            sortData('rhythm')
            sortData('rhythm')//default sort
        }

        function populateFilters() {
            const rhythms = [...new Set(tunesData.map(tune => tune.rhythm).filter(r => r))].sort();
            const keys = [...new Set(tunesData.map(tune => tune.key).filter(k => k))].sort();

            const rhythmFilter = document.getElementById('rhythmFilter');
            const keyFilter = document.getElementById('keyFilter');

            rhythmFilter.innerHTML = '<option value="">All rhythms</option>';
            rhythms.forEach(rhythm => {
                rhythmFilter.innerHTML += `<option value="${rhythm}">${rhythm}</option>`;
            });

            keyFilter.innerHTML = '<option value="">All keys</option>';
            keys.forEach(key => {
                keyFilter.innerHTML += `<option value="${key}">${key}</option>`;
            });
        }

        function openABCModal(tune) {
            if (!tune.abc) return;

            const modal = document.getElementById('abcModal');
            const modalTitle = document.getElementById('modalTitle');
            const abcRendered = document.getElementById('abcRendered');
            const abcText = document.getElementById('abcText');

            modalTitle.textContent = tune.name;
            currentTuneABC = tune.abc;
            currentTranspose = 0;
            updateABCDisplay();


            currentViewMode = 'rendered';
            abcRendered.style.display = 'block';
            abcText.classList.remove('active');
            document.getElementById('toggleViewBtn').textContent = 'Show ABC Text';

            modal.classList.add('active');
        }

        function closeABCModal() {
            const modal = document.getElementById('abcModal');
            modal.classList.remove('active');
            currentTranspose = 0;
        }

        function toggleView() {
            const abcRendered = document.getElementById('abcRendered');
            const abcText = document.getElementById('abcText');
            const toggleBtn = document.getElementById('toggleViewBtn');

            if (currentViewMode === 'rendered') {
                currentViewMode = 'text';
                abcRendered.style.display = 'none';
                abcText.classList.add('active');
                toggleBtn.textContent = 'Show Rendered';
            } else {
                currentViewMode = 'rendered';
                abcRendered.style.display = 'block';
                abcText.classList.remove('active');
                toggleBtn.textContent = 'Show ABC Text';
            }
        }

function transposeABC(semitones) {
  currentTranspose += semitones;
  updateABCDisplay();
}

function updateABCDisplay() {
  const abcTextContent = document.getElementById("abcTextContent");
  const abcRendered = document.getElementById("abcRendered");

  let transposedABC = currentTuneABC;

  if (currentTranspose !== 0) {
    transposedABC = transposeABCNotation(currentTuneABC, currentTranspose);
  }

  abcTextContent.textContent = transposedABC;

  abcRendered.innerHTML = "";
  ABCJS.renderAbc("abcRendered", transposedABC, {
    scale: 1.0,
    staffwidth: 800,
    paddingtop: 10,
    paddingbottom: 10,
    paddingright: 20,
    paddingleft: 20,
  });
}

function transposeABCNotation(abc, transposeAmount) {
  var visualObj = ABCJS.renderAbc("*", abc);
  return ABCJS.strTranspose(abc, visualObj, transposeAmount);
}


        function renderTable() {
            const tbody = document.getElementById('tunesTableBody');

            if (filteredData.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="no-results">No tunes found matching your criteria.</td></tr>';
                return;
            }

            tbody.innerHTML = '';

            filteredData.forEach((tune, index) => {
                const row = document.createElement('tr');

                let referencesHtml = '';
                tune.references.forEach(ref => {
                    referencesHtml += `
                        <div class="reference-item">
                            ${ref.artists ? `<div class="artists">${ref.artists}</div>` : ''}
                            ${ref.url ? `<div class="url"><a href="${ref.url}" target="_blank">${ref.url}</a></div>` : ''}
                            ${ref.notes ? `<div class="notes">${ref.notes.replace(/\n/g, '<br />')}</div>` : ''}
                        </div>
                    `;
                });

                const hasAbc = !!tune.abc;
                const tuneNameClass = hasAbc ? 'tune-name has-abc' : 'tune-name';

                row.innerHTML = `
                    <td><div class="${tuneNameClass}" data-tune-index="${index}">${tune.name}</div></td>
                    <td><span class="badge">${tune.key}</span></td>
                    <td><span class="badge">${tune.rhythm}</span></td>
                    <td class="references">${referencesHtml}</td>
                    <td class="scores">
                        ${tune.scores && tune.scores.length > 0 ? `<a href="${tune.scores[0].url}" target="_blank">${tune.scores[0].name}</a>` : ''}
                    </td>
                `;

                const tuneNameEl = row.querySelector('.tune-name');
                if (hasAbc) {
                    tuneNameEl.addEventListener('click', () => {
                        openABCModal(tune);
                    });
                }

                tbody.appendChild(row);
            });
        }

        function applyFilters() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const rhythmFilter = document.getElementById('rhythmFilter').value;
            const keyFilter = document.getElementById('keyFilter').value;

            filteredData = tunesData.filter(tune => {
                const matchesSearch = searchTerm === '' ||
                    tune.name.toLowerCase().includes(searchTerm) ||
                    tune.rhythm.toLowerCase().includes(searchTerm) ||
                    tune.key.toLowerCase().includes(searchTerm) ||
                    tune.references.some(ref =>
                        ref.artists?.toLowerCase().includes(searchTerm) ||
                        ref.notes.toLowerCase().includes(searchTerm)
                    );

                const matchesRhythm = rhythmFilter === '' || tune.rhythm === rhythmFilter;
                const matchesKey = keyFilter === '' || tune.key === keyFilter;

                return matchesSearch && matchesRhythm && matchesKey;
            });

            renderTable();
        }

        function sortData(column) {
            if (currentSort.column === column) {
                currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
            } else {
                currentSort.column = column;
                currentSort.direction = 'asc';
            }

            filteredData.sort((a, b) => {
                let aVal = a[column];
                let bVal = b[column];

                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }

                if (aVal < bVal) return currentSort.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return currentSort.direction === 'asc' ? 1 : -1;
                return 0;
            });

            document.querySelectorAll('th').forEach(th => {
                th.classList.remove('sort-asc', 'sort-desc');
            });

            const currentTh = document.querySelector(`th[data-column="${column}"]`);
            currentTh.classList.add(currentSort.direction === 'asc' ? 'sort-asc' : 'sort-desc');

            renderTable();
        }

        document.addEventListener('DOMContentLoaded', function () {
            initialiseData();

            document.getElementById('searchInput').addEventListener('input', applyFilters);
            document.getElementById('rhythmFilter').addEventListener('change', applyFilters);
            document.getElementById('keyFilter').addEventListener('change', applyFilters);

            document.querySelectorAll('th.sortable').forEach(th => {
                th.addEventListener('click', function () {
                    sortData(this.dataset.column);
                });
            });

            document.getElementById('closeModalBtn').addEventListener('click', closeABCModal);
            document.getElementById('toggleViewBtn').addEventListener('click', toggleView);
            
  document
    .getElementById("transposeUpBtn")
    .addEventListener("click", () => transposeABC(1));
  document
    .getElementById("transposeDownBtn")
    .addEventListener("click", () => transposeABC(-1));

            document.getElementById('abcModal').addEventListener('click', function (e) {
                if (e.target === this) {
                    closeABCModal();
                }
            });

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape') {
                    closeABCModal();
                }
            });
        });