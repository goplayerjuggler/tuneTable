/**
 * Base Modal Class
 * Provides common functionality for all modals
 */
export default class BaseModal {
  constructor(modalId) {
    this.modalId = modalId;
    this.modal = document.getElementById(modalId);
    
    if (!this.modal) {
      console.error(`Modal with id "${modalId}" not found`);
      return;
    }
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Close on background click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Close on Escape key (handled globally in main file)
  }

  open() {
    if (this.modal) {
      this.modal.classList.add('active');
      this.onOpen();
    }
  }

  close() {
    if (this.modal) {
      this.modal.classList.remove('active');
      this.onClose();
    }
  }

  isOpen() {
    return this.modal?.classList.contains('active') || false;
  }

  // Override in subclasses
  onOpen() {}
  onClose() {}
}
