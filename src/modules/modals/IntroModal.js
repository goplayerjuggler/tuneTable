import Modal from "./Modal.js";
import htmlContent from "./IntroModal.html";

/**
 * IntroModal
 *
 * Shown automatically on a user's first visit.
 * When closed, calls the onDismiss callback as
 * if the modal is shown as part of the page load,
 * another modal may need to be shown afterwards.
 *
 * At any other time it can be opened with `new IntroModal().open()` (no
 * onDismiss needed — it just closes cleanly).
 *
 * First-visit detection uses localStorage key "introSeen_v1". Bump the
 * suffix if the content changes enough to warrant showing it again.
 */

const INTRO_SEEN_KEY = "introSeen_v2";

export default class IntroModal extends Modal {
	/**
	 * @param {Object}   [options]
	 * @param {Function} [options.onDismiss]  Called when the modal closes.
	 *   On first-visit flow, use this to open the tune-list selector.
	 */
	constructor({ onDismiss } = {}) {
		super({
			id: "introModal",
			size: "large",
			title: "Welcome to Tune table",
			content: IntroModal._buildContent(),
			onClose: () => {
				IntroModal.markSeen();
				if (onDismiss) onDismiss();
			}
		});
	}

	/** Returns true if the user has dismissed the intro at least once. */
	static hasBeenSeen() {
		try {
			return !!localStorage.getItem(INTRO_SEEN_KEY);
		} catch {
			return false;
		}
	}

	/** Persist the "seen" flag so the intro doesn't auto-show again. */
	static markSeen() {
		try {
			localStorage.setItem(INTRO_SEEN_KEY, "1");
		} catch {
			// localStorage unavailable — silently ignore
		}
	}

	/** Mark as seen on close, not on open, so a page-refresh will re-show it. */
	open() {
		super.open();
	}

	// ---------------------------------------------------------------------------
	// Content
	// ---------------------------------------------------------------------------

	static _buildContent() {
		return htmlContent;
	}
}
