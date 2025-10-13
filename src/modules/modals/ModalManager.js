import AddTunesModal from "./AddTunesModal.js";
import LoadJsonModal from "./LoadJsonModal.js";

/**
 * Modal Manager
 * Centralizes modal creation and keyboard event handling
 * Works with BaseModal
 * Deprecated - moving towards phasing this out and using Modal as a base class instead.
 */
export default class ModalManager {
  constructor(callbacks) {
    this.callbacks = callbacks;

    // Initialize all modals
    this.modals = {
      // abc: new AbcModal(),
      addTunes: new AddTunesModal(callbacks),
      loadJson: new LoadJsonModal(callbacks),
      // edit: new EditModal(callbacks),
    };

    this.setupGlobalKeyboardHandler();
  }

  setupGlobalKeyboardHandler() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        // Close any open modal
        Object.values(this.modals).forEach((modal) => {
          if (modal.isOpen()) {
            modal.close();
          }
        });
      } 
      // else if (this.modals.abc.isOpen()) {
      //   // Let ABC modal handle arrow keys
      //   this.modals.abc.handleKeydown(e);
      // }
    });
  }

  // Convenience methods for opening modals
  // openAbc(tune) {
  //   this.modals.abc.openWithTune(tune);
  // }

  openAddTunes() {
    this.modals.addTunes.open();
  }

  openLoadJson() {
    this.modals.loadJson.open();
  }

  // openEdit(tune, tuneIndex) {
  //   this.modals.edit.openWithTune(tune, tuneIndex);
  // }

  closeAll() {
    Object.values(this.modals).forEach((modal) => modal.close());
  }

  // // Expose to global scope for inline onclick handlers
  // exposeGlobalFunctions() {
  //   window.openEditModal = (tune, tuneIndex) => this.openEdit(tune, tuneIndex);
  //   window.closeEditModal = () => this.modals.edit.close();
  // }
}
