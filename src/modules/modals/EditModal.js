import BaseModal from './BaseModal.js';
import processTuneData from '../processTuneData.js';

/**
 * Edit Tune Modal
 * Comprehensive tune editor with metadata, ABC, references, and scores
 */
export default class EditModal extends BaseModal {
  constructor(callbacks) {
	super('editModal');
	
	this.callbacks = callbacks;
	this.currentEditTuneIndex = null;
	
	this.elements = {
	  closeBtn: document.getElementById('closeEditModalBtn'),
	  saveBtn: document.getElementById('saveEditBtn'),
	  name: document.getElementById('editName'),
	  key: document.getElementById('editKey'),
	  rhythm: document.getElementById('editRhythm'),
	  abc: document.getElementById('editAbc'),
	  referencesEditor: document.getElementById('referencesEditor'),
	  scoresEditor: document.getElementById('scoresEditor'),
	  addReferenceBtn: document.getElementById('addReferenceBtn'),
	  addScoreBtn: document.getElementById('addScoreBtn')
	};
	
	this.setupControls();
	this.exposeGlobalFunctions();
  }

  setupControls() {
	this.elements.closeBtn?.addEventListener('click', () => this.close());
	this.elements.saveBtn?.addEventListener('click', () => this.save());
	this.elements.addReferenceBtn?.addEventListener('click', () => this.addReference());
	this.elements.addScoreBtn?.addEventListener('click', () => this.addScore());
  }

  exposeGlobalFunctions() {
	// These are called from inline onclick handlers in the HTML
	window.removeReference = (index) => this.removeReference(index);
	window.removeScore = (index) => this.removeScore(index);
  }

  openWithTune(tune, tuneIndex) {
	this.currentEditTuneIndex = tuneIndex;

	// Populate basic fields
	this.elements.name.value = tune.nameIsFromAbc ? '' : (tune.name || '');
	this.elements.key.value = tune.keyIsFromAbc ? '' : (tune.key || '');
	this.elements.rhythm.value = tune.rhythmIsFromAbc ? '' : (tune.rhythm || '');

	// Populate ABC
	const abcArray = Array.isArray(tune.abc) ? tune.abc : tune.abc ? [tune.abc] : [];
	this.elements.abc.value = abcArray.join('\n\n---\n\n');

	// Populate references and scores
	this.renderReferences(tune.references?.filter(r => !r.fromAbc) || []);
	this.renderScores(tune.scores || []);

	this.open();
  }

  renderReferences(references) {
	if (references.length === 0) {
	  this.elements.referencesEditor.innerHTML = 
		'<p class="empty-message">No references yet. Click &#8220;Add Reference&#8221; to create one.</p>';
	  return;
	}

	this.elements.referencesEditor.innerHTML = references
	  .map((ref, index) => `
		<div class="editor-item" data-index="${index}">
		  <div class="editor-item-header">
			<strong>Reference ${index + 1}</strong>
			<button type="button" class="btn-icon btn-danger" onclick="removeReference(${index})" title="Remove reference">
			  <span>&#215;</span>
			</button>
		  </div>
		  <div class="editor-item-content">
			<div class="form-group">
			  <label>Artists/Source:</label>
			  <input type="text" class="form-control" value="${this.escapeHtml(ref.artists || '')}" 
					 data-ref-index="${index}" data-field="artists">
			</div>
			<div class="form-group">
			  <label>URL:</label>
			  <input type="text" class="form-control" value="${this.escapeHtml(ref.url || '')}" 
					 data-ref-index="${index}" data-field="url" placeholder="https://...">
			</div>
			<div class="form-group">
			  <label>Notes:</label>
			  <textarea class="form-control" rows="3" data-ref-index="${index}" data-field="notes">${this.escapeHtml(ref.notes || '')}</textarea>
			</div>
		  </div>
		</div>
	  `)
	  .join('');
  }

  renderScores(scores) {
	if (scores.length === 0) {
	  this.elements.scoresEditor.innerHTML = 
		'<p class="empty-message">No scores yet. Click &#8220;Add Score&#8221; to create one.</p>';
	  return;
	}

	this.elements.scoresEditor.innerHTML = scores
	  .map((score, index) => `
		<div class="editor-item" data-index="${index}">
		  <div class="editor-item-header">
			<strong>Score ${index + 1}</strong>
			<button type="button" class="btn-icon btn-danger" onclick="removeScore(${index})" title="Remove score">
			  <span>&#215;</span>
			</button>
		  </div>
		  <div class="editor-item-content">
			<div class="form-group">
			  <label>Name:</label>
			  <input type="text" class="form-control" value="${this.escapeHtml(score.name || '')}" 
					 data-score-index="${index}" data-field="name">
			</div>
			<div class="form-group">
			  <label>URL:</label>
			  <input type="text" class="form-control" value="${this.escapeHtml(score.url || '')}" 
					 data-score-index="${index}" data-field="url" placeholder="https://...">
			</div>
		  </div>
		</div>
	  `)
	  .join('');
  }

  addReference() {
	const tune = window.filteredData[this.currentEditTuneIndex];
	if (!tune.references) tune.references = [];

	tune.references.push({
	  artists: '',
	  url: '',
	  notes: ''
	});

	this.renderReferences(tune.references.filter(r => !r.fromAbc));
  }

  removeReference(index) {
	const tune = window.filteredData[this.currentEditTuneIndex];
	const nonAbcRefs = tune.references.filter(r => !r.fromAbc);
	const actualIndex = tune.references.indexOf(nonAbcRefs[index]);
	tune.references.splice(actualIndex, 1);
	this.renderReferences(tune.references.filter(r => !r.fromAbc));
  }

  addScore() {
	const tune = window.filteredData[this.currentEditTuneIndex];
	if (!tune.scores) tune.scores = [];

	tune.scores.push({
	  name: '',
	  url: ''
	});

	this.renderScores(tune.scores);
  }

  removeScore(index) {
	const tune = window.filteredData[this.currentEditTuneIndex];
	tune.scores.splice(index, 1);
	this.renderScores(tune.scores);
  }

  save() {
	const tune = window.filteredData[this.currentEditTuneIndex];
	const originalTuneDataIndex = window.tunesData.findIndex((t) => t === tune);

	// Process ABC
	const abcText = this.elements.abc.value.trim();
	if (abcText) {
	  const abcParts = abcText.split(/\n\s*---\s*\n/).filter((part) => part.trim());
	  tune.abc = abcParts.length === 1 ? abcParts[0] : abcParts;
	} else {
	  tune.abc = null;
	}

	// Process references
	const referenceInputs = document.querySelectorAll('#referencesEditor .editor-item');
	const userRefs = Array.from(referenceInputs).map((item, index) => {
	  const artists = item.querySelector(`input[data-ref-index="${index}"][data-field="artists"]`)?.value || '';
	  const url = item.querySelector(`input[data-ref-index="${index}"][data-field="url"]`)?.value || '';
	  const notes = item.querySelector(`textarea[data-ref-index="${index}"][data-field="notes"]`)?.value || '';
	  return { artists, url, notes };
	});

	// Process scores
	const scoreInputs = document.querySelectorAll('#scoresEditor .editor-item');
	tune.scores = Array.from(scoreInputs).map((item, index) => {
	  const name = item.querySelector(`input[data-score-index="${index}"][data-field="name"]`)?.value || '';
	  const url = item.querySelector(`input[data-score-index="${index}"][data-field="url"]`)?.value || '';
	  return { name, url };
	});

	// Reprocess tune data
	let reprocessed = Object.assign({}, tune);
	delete reprocessed.name;
	delete reprocessed.nameIsFromAbc;
	delete reprocessed.key;
	delete reprocessed.keyIsFromAbc;
	delete reprocessed.rhythm;
	delete reprocessed.rhythmIsFromAbc;
	delete reprocessed.references;

	reprocessed = processTuneData(reprocessed);

	// Apply manual overrides
	const editedName = this.elements.name.value.trim();
	const editedKey = this.elements.key.value.trim();
	const editedRhythm = this.elements.rhythm.value.trim().toLowerCase();

	this.applyFieldOverride(reprocessed, tune, 'name', editedName, 'nameIsFromAbc');
	this.applyFieldOverride(reprocessed, tune, 'rhythm', editedRhythm, 'rhythmIsFromAbc');
	this.applyFieldOverride(reprocessed, tune, 'key', editedKey, 'keyIsFromAbc');

	Object.assign(tune, reprocessed);

	// Merge references (user refs + ABC refs)
	const abcRefs = tune.references.filter((r) => r.fromAbc);
	tune.references = [...userRefs, ...abcRefs];

	// Update main data array
	if (originalTuneDataIndex !== -1) {
	  window.tunesData[originalTuneDataIndex] = tune;
	}

	this.callbacks.saveTunesToStorage();
	this.callbacks.renderTable();
	this.close();
  }

  applyFieldOverride(reprocessed, tune, field, editedValue, fromAbcFlag) {
	if (editedValue) {
	  if (reprocessed[fromAbcFlag]) {
		if (editedValue !== reprocessed[field]) {
		  delete reprocessed[fromAbcFlag];
		  delete tune[fromAbcFlag];
		  reprocessed[field] = editedValue;
		}
	  } else {
		reprocessed[field] = editedValue;
	  }
	} else {
	  if (!reprocessed[fromAbcFlag]) {
		delete reprocessed[field];
		delete tune[field];
	  }
	}
  }

  escapeHtml(text) {
	const div = document.createElement('div');
	div.textContent = text;
	return div.innerHTML;
  }

  onClose() {
	this.currentEditTuneIndex = null;
  }
}
