import Modal from './Modal.js';
import AbcJs from 'abcjs';

/**
 * ABC Notation Display Modal
 * Shows rendered sheet music with transposition controls
### AbcModal
**Purpose**: Display sheet music with interactive controls

**Features**:
- Render ABC notation as sheet music
- Toggle between rendered and text views
- Transpose music up/down by semitones
- Navigate between multiple tune settings
- Keyboard navigation support

**Key Methods**:
- `openWithTune(tune)`: Initialize and show modal with tune data
- `transpose(semitones)`: Transpose the displayed music
- `navigate(direction)`: Move between tune settings
- `toggleView()`: Switch between rendered and text views

 */
export default class AbcModal extends Modal {
  constructor() {
    super({id:'abcModal',size:'large',title:'score viewer',
content: `<div class="modal-controls">
      <div class="control-row">
        <button id="transposeDownBtn" class="transpose-btn">
          ♭ (down)
        </button>
        <button id="transposeUpBtn" class="transpose-btn">♯ (up)</button>
        <button class="toggle-view-btn" id="toggleViewBtn">
          Show Abc Text
        </button>
        
      </div>
      <div class="control-row">
        <button id="prevAbcBtn" class="nav-btn">← Previous</button>
        <span id="abcCounter"></span>
        <button id="nextAbcBtn" class="nav-btn">Next →</button>
      </div>
    </div>
    <div id="abcRendered" class="abc-rendered"></div>
  <div id="abcText" class="abc-text">
    <pre id="abcTextContent"></pre>
  </div>`

    });
    
  }

  onOpen() {
    
    this.elements = {
      rendered: document.getElementById('abcRendered'),
      text: document.getElementById('abcText'),
      textContent: document.getElementById('abcTextContent'),
      toggleBtn: document.getElementById('toggleViewBtn'),
      closeBtn: document.getElementById('closeModalBtn'),
      transposeUpBtn: document.getElementById('transposeUpBtn'),
      transposeDownBtn: document.getElementById('transposeDownBtn'),
      prevBtn: document.getElementById('prevAbcBtn'),
      nextBtn: document.getElementById('nextAbcBtn'),
      counter: document.getElementById('abcCounter')
    };
    
    this.setupControls();
    // Ensure rendered view is shown
    this.elements.rendered.style.display = 'block';
    this.elements.text.classList.remove('active');
    this.elements.toggleBtn.textContent = 'Show ABC text';
    
    this.updateDisplay();
    this.updateNavigationButtons();
    
    
  }

  setupControls() {
    
    this.elements.toggleBtn?.addEventListener('click', () => this.toggleView());
    this.elements.transposeUpBtn?.addEventListener('click', () => this.transpose(1));
    this.elements.transposeDownBtn?.addEventListener('click', () => this.transpose(-1));
    this.elements.prevBtn?.addEventListener('click', () => this.navigate(-1));
    this.elements.nextBtn?.addEventListener('click', () => this.navigate(1));
  }

  openWithTune(tune) {
    
    if (!tune.abc) return;
    this.currentAbcArray = Array.isArray(tune.abc) ? tune.abc : [tune.abc];
    this.currentAbcIndex = 0;
    this.currentTuneAbc = this.currentAbcArray[0];
    this.currentTranspose = 0;
    this.currentViewMode = 'rendered';
    
    this.open()
    
    
    // this.open();
  }

  toggleView() {
    if (this.currentViewMode === 'rendered') {
      this.currentViewMode = 'text';
      this.elements.rendered.style.display = 'none';
      this.elements.text.classList.add('active');
      this.elements.toggleBtn.textContent = 'Show Rendered';
    } else {
      this.currentViewMode = 'rendered';
      this.elements.rendered.style.display = 'block';
      this.elements.text.classList.remove('active');
      this.elements.toggleBtn.textContent = 'Show ABC Text';
    }
  }

  navigate(direction) {
    this.currentAbcIndex += direction;
    if (this.currentAbcIndex < 0) {
      this.currentAbcIndex = this.currentAbcArray.length - 1;
    }
    if (this.currentAbcIndex >= this.currentAbcArray.length) {
      this.currentAbcIndex = 0;
    }
    
    this.currentTuneAbc = this.currentAbcArray[this.currentAbcIndex];
    this.currentTranspose = 0;
    this.updateDisplay();
    this.updateNavigationButtons();
  }

  transpose(semitones) {
    this.currentTranspose += semitones;
    this.updateDisplay();
  }

  updateNavigationButtons() {
    if (this.currentAbcArray.length > 1) {
      this.elements.prevBtn.style.display = 'inline-block';
      this.elements.nextBtn.style.display = 'inline-block';
      this.elements.counter.style.display = 'inline-block';
      this.elements.counter.textContent = `${this.currentAbcIndex + 1} / ${this.currentAbcArray.length}`;
    } else {
      this.elements.prevBtn.style.display = 'none';
      this.elements.nextBtn.style.display = 'none';
      this.elements.counter.style.display = 'none';
    }
  }

  updateDisplay() {
    let transposedAbc = this.currentTuneAbc;
    
    if (this.currentTranspose !== 0) {
      transposedAbc = this.transposeAbcNotation(this.currentTuneAbc, this.currentTranspose);
    }
    
    // Update text view
    this.elements.textContent.textContent = transposedAbc;
    
    // Update rendered view
    this.elements.rendered.innerHTML = '';
    AbcJs.renderAbc('abcRendered', transposedAbc, {
      scale: 1.0,
      staffwidth: 900,
      paddingtop: 10,
      paddingbottom: 10,
      paddingright: 20,
      paddingleft: 20,
      responsive: 'resize'
    });
  }

  transposeAbcNotation(abc, transposeAmount) {
    const visualObj = AbcJs.renderAbc('*', abc);
    return AbcJs.strTranspose(abc, visualObj, transposeAmount);
  }

  handleKeydown(e) {
    if (!this.isOpen()) return false;
    
    if (e.key === 'ArrowLeft') {
      this.navigate(-1);
      return true;
    } else if (e.key === 'ArrowRight') {
      this.navigate(1);
      return true;
    }
    
    return false;
  }

  onClose() {
    this.currentTranspose = 0;
    this.currentAbcIndex = 0;
  }
}
