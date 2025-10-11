# Modal Architecture

This directory contains the refactored modal system for the Tune Table application.

## Structure

```
src/modules/modals/
├── BaseModal.js       # Abstract base class for all modals
├── AbcModal.js        # Sheet music display with transposition
├── AddTunesModal.js   # Import tunes via ABC notation
├── LoadJsonModal.js   # Load complete tune data from JSON/JS
├── EditModal.js       # Comprehensive tune editor
├── ModalManager.js    # Centralized modal orchestration
└── README.md          # This file
```

## Design Patterns

### 1. Base Modal Class
All modals inherit from `BaseModal.js`, which provides:
- Common open/close functionality
- Background click detection
- Modal state management
- Lifecycle hooks (`onOpen()`, `onClose()`)

### 2. Modal Manager
`ModalManager.js` serves as a centralized controller:
- Creates and manages all modal instances
- Handles global keyboard events (Escape, arrow keys)
- Provides convenience methods for opening modals
- Exposes necessary functions to global scope for inline handlers

### 3. Separation of Concerns
Each modal class is responsible for:
- Its own DOM element references
- User interaction handling
- Data validation and processing
- Communication with main application via callbacks

## Usage

### Initialization
```javascript
import ModalManager from './src/modules/modals/ModalManager.js';

const modalManager = new ModalManager({
  saveTunesToStorage,
  populateFilters,
  applyFilters,
  renderTable,
  sortWithDefaultSort
});

// Expose global functions for inline onclick handlers
modalManager.exposeGlobalFunctions();
```

### Opening Modals
```javascript
// Open ABC notation viewer
modalManager.openAbc(tune);

// Open tune editor
modalManager.openEdit(tune, tuneIndex);

// Open import modals
modalManager.openAddTunes();
modalManager.openLoadJson();
```

### Keyboard Shortcuts
- **Escape**: Close any open modal
- **Arrow Left/Right**: Navigate between ABC settings (when ABC modal is open)

## Modal Classes

### BaseModal
**Purpose**: Abstract base class providing common modal functionality

**Key Methods**:
- `open()`: Show the modal
- `close()`: Hide the modal
- `isOpen()`: Check if modal is currently visible
- `onOpen()`: Override in subclasses for custom initialization
- `onClose()`: Override in subclasses for cleanup

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

### AddTunesModal
**Purpose**: Import new tunes via ABC notation

**Features**:
- Parse single or multiple ABC tunes
- Automatic tune splitting by X: headers
- Status feedback for import operations
- Integration with main tune database

**Key Methods**:
- `addTunes()`: Process and import ABC notation
- `splitAbcTunes(abcText)`: Parse ABC text into individual tunes
- `showStatus(message, type)`: Display success/error messages

### LoadJsonModal
**Purpose**: Import complete tune database from JSON or JavaScript

**Features**:
- Support for JSON and JavaScript literal formats
- Data validation and error handling
- Replace entire tune collection
- Confirmation before destructive operations

**Key Methods**:
- `loadData()`: Parse and import tune data
- `showStatus(message, type)`: Display feedback

### EditModal
**Purpose**: Comprehensive tune editing interface

**Features**:
- Edit basic metadata (name, key, rhythm)
- Edit ABC notation with multi-version support
- Manage references (artists, URLs, notes)
- Manage score links
- Automatic ABC parsing and metadata extraction
- Smart field override detection

**Key Methods**:
- `openWithTune(tune, tuneIndex)`: Initialize editor with tune
- `save()`: Process and save edited tune
- `addReference()`: Add new reference entry
- `addScore()`: Add new score entry
- `renderReferences(refs)`: Update references UI
- `renderScores(scores)`: Update scores UI

### ModalManager
**Purpose**: Centralized modal orchestration

**Features**:
- Single source of truth for all modals
- Global keyboard event handling
- Convenient access to all modal functions
- Callback management for modal-to-app communication

**Key Methods**:
- `openAbc(tune)`: Open ABC viewer
- `openEdit(tune, index)`: Open tune editor
- `openAddTunes()`: Open ABC import
- `openLoadJson()`: Open JSON import
- `closeAll()`: Close all open modals
- `exposeGlobalFunctions()`: Make functions available globally

## Callbacks

The modal system requires these callbacks from the main application:

- `saveTunesToStorage()`: Persist tune data to localStorage
- `populateFilters()`: Update filter dropdowns
- `applyFilters()`: Re-filter and display tunes
- `renderTable()`: Re-render the tune table
- `sortWithDefaultSort()`: Sort tunes by default criteria

## Global Functions

Some functions are exposed globally for inline onclick handlers:

- `window.openEditModal(tune, tuneIndex)`
- `window.closeEditModal()`
- `window.removeReference(index)`
- `window.removeScore(index)`

## Future Improvements

### Potential Enhancements
1. **Remove inline onclick handlers**: Replace with proper event delegation
2. **TypeScript conversion**: Add type safety and better IDE support
3. **Custom events**: Use CustomEvent API instead of callbacks
4. **Modal stacking**: Support multiple simultaneous modals
5. **Animation system**: Add enter/exit transitions
6. **Focus management**: Trap focus within modals for accessibility
7. **ARIA attributes**: Improve screen reader support

### Refactoring Opportunities
- Replace `window.filteredData` access with getters/setters
- Implement observer pattern for data changes
- Add unit tests for each modal class
- Create modal configuration objects instead of direct DOM manipulation

## Notes

- All modals use the existing HTML structure in `index.html`
- CSS styles remain in `styles.css`
- The refactoring maintains backward compatibility with existing code
- Global function exposure is a temporary bridge; consider moving to event delegation
