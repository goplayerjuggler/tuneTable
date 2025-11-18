/**
 * Base Modal class providing consistent behaviour and styling
 * All modals should extend this class
 */
export default class Modal {
	/**
	 * @param {Object} options - Modal configuration
	 * @param {string} options.id - Unique modal identifier
	 * @param {string} options.title - Modal title text
	 * @param {string} options.content - HTML content for modal body
	 * @param {Function} options.onClose - Callback when modal closes
	 * @param {string} options.size - Modal size: 'small', 'medium', 'large'
	 * @param {boolean} options.autoHideHeader - Whether to auto-hide header after delay (default: false)
	 * @param {number} options.autoHideDelay - Delay in ms before hiding header (default: 2000)
	 */
	constructor(options = {}) {
		this.id = options.id || `modal-${Date.now()}`;
		this.title = options.title || "";
		this.content = options.content || "";
		this.onClose = options.onClose || null;
		this.size = options.size || "medium";
		this.autoHideHeader = options.autoHideHeader || false;
		this.autoHideDelay =
			options.autoHideDelay === null || options.autoHideDelay === undefined
				? 2000
				: options.autoHideDelay;
		this.element = null;
		this.escHandler = null;
		this.hideHeaderTimeout = null;
	}

	/**
	 * Creates and returns the modal DOM element
	 * @returns {HTMLElement} The modal element
	 */
	render() {
		this.element = document.createElement("div");
		this.element.className = `modall modall--${this.size}`;
		this.element.id = this.id;
		this.element.setAttribute("role", "dialog");
		this.element.setAttribute("aria-modal", "true");
		this.element.setAttribute("aria-labelledby", `${this.id}-title`);

		this.element.innerHTML = `
      <div class="modal__overlay" data-close="true"></div>
      <div class="modal__container">
        <div class="modal__header">
          <h2 id="${this.id}-title" class="modal__title">${this.title}</h2>
          <button 
            class="modal__close" 
            aria-label="Close modal"
            type="button">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal__body">
          ${this.content}
        </div>
      </div>
    `;

		this.setupEventListeners();
		return this.element;
	}

	/**
	 * Sets up all event listeners for modal interaction
	 */
	setupEventListeners() {
		// Close button
		const closeBtn = this.element.querySelector(".modal__close");
		closeBtn.addEventListener("click", () => this.close());

		// Overlay click
		const overlay = this.element.querySelector(".modal__overlay");
		overlay.addEventListener("click", () => this.close());

		// ESC key binding
		this.escHandler = (e) => {
			if (e.key === "Escape" && this.isTopModal()) {
				this.close();
			}
		};
		document.addEventListener("keydown", this.escHandler);
	}

	/**
	 * Checks if this is the topmost modal (for nested modals)
	 * @returns {boolean} True if this is the top modal
	 */
	isTopModal() {
		const modals = document.querySelectorAll(".modall--active");
		return modals[modals.length - 1] === this.element;
	}

	/**
	 * Checks if the modal is currently open
	 * @returns {boolean} True if modal is open
	 */
	isOpen() {
		return this.element && this.element.classList.contains("modall--active");
	}

	/**
	 * Starts the auto-hide timer for the header
	 */
	startAutoHideTimer() {
		if (!this.autoHideHeader) return;

		this.clearAutoHideTimer();
		this.hideHeaderTimeout = setTimeout(() => {
			const header = this.element.querySelector(".modal__header");
			if (header) {
				header.style.display = "none";
			}
		}, this.autoHideDelay);
	}

	/**
	 * Clears the auto-hide timer
	 */
	clearAutoHideTimer() {
		if (this.hideHeaderTimeout) {
			clearTimeout(this.hideHeaderTimeout);
			this.hideHeaderTimeout = null;
		}
	}

	/**
	 * Opens the modal
	 */
	open() {
		if (!this.element) {
			this.render();
			document.body.appendChild(this.element);
		}

		// Small delay for CSS transition
		requestAnimationFrame(() => {
			this.element.classList.add("modall--active");

			if (this.onOpen) this.onOpen();
			this.trapFocus();

			// Focus first focusable element or close button
			const firstFocusable = this.element.querySelector(
				'input, button, select, textarea, [tabindex]:not([tabindex="-1"])',
			);
			if (firstFocusable) {
				firstFocusable.focus();
			} else {
				this.element.querySelector(".modal__close").focus();
			}

			// Start auto-hide timer if enabled
			this.startAutoHideTimer();
		});
	}

	/**
	 * Closes the modal with animation
	 */
	close() {
		if (this.element) {
			this.element.classList.remove("modall--active");
			this.clearAutoHideTimer();

			// Clean up event listeners
			if (this.escHandler) {
				document.removeEventListener("keydown", this.escHandler);
				this.escHandler = null;
			}

			// Wait for CSS animation to complete
			setTimeout(() => {
				if (this.element && this.element.parentNode) {
					this.element.remove();
				}
				this.element = null;
			}, 300);
		}

		if (this.onClose) {
			this.onClose();
		}
	}

	/**
	 * Traps focus within the modal for accessibility
	 */
	trapFocus() {
		const focusableElements = this.element.querySelectorAll(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
		);

		if (focusableElements.length === 0) return;

		const firstElement = focusableElements[0];
		const lastElement = focusableElements[focusableElements.length - 1];

		this.element.addEventListener("keydown", (e) => {
			if (e.key !== "Tab") return;

			if (e.shiftKey) {
				if (document.activeElement === firstElement) {
					lastElement.focus();
					e.preventDefault();
				}
			} else {
				if (document.activeElement === lastElement) {
					firstElement.focus();
					e.preventDefault();
				}
			}
		});
	}
}
