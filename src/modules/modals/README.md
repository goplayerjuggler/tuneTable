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
└── README.md          # This file
```

## Design Patterns

### 1. Base Modal Class
All modals inherit from `Modal.js`, which provides:
- Common functionality
- Background click detection
- Lifecycle hooks (`onOpen()`, `onClose()`)

### 2. Separation of Concerns
Each modal class is responsible for:
- Its own DOM elements
- User interaction handling
- Data validation and processing
- Communication with main application via callbacks

## Usage


### Keyboard Shortcuts
- **Escape**: Close any open modal

## Modal Classes

### Modal
**Purpose**: Abstract base class providing common modal functionality

**Key Methods**:
- `open()`: Show the modal
- `close()`: Hide the modal
- `onOpen()`: Override in subclasses for custom initialization
- `onClose()`: Override in subclasses for cleanup
