// Re-export utilities used by Dialog
export { hideOthers, restoreOthers } from './blazix-aria-hidden.js';
export { lockScroll, unlockScroll } from './blazix-scroll-lock.js';
export { addFocusGuards, removeFocusGuards } from './blazix-focus-guards.js';

const BLAZIX_STATE_KEY = Symbol.for('Blazix.Dialog.State');
if (!window[BLAZIX_STATE_KEY]) {
    window[BLAZIX_STATE_KEY] = new Map();
}
const dialogData = window[BLAZIX_STATE_KEY];

/**
 * Initialize dialog-specific functionality.
 * @param {string} dialogId
 * @param {HTMLElement} contentElement
 * @param {boolean} modal
 */
export function initializeDialog(dialogId, contentElement, modal) {
    if (!contentElement) return;

    const data = {
        ariaHiddenId: null,
        contentElement
    };

    if (modal) {
        // Import and use aria-hidden
        import('./blazix-aria-hidden.js').then(({ hideOthers }) => {
            data.ariaHiddenId = hideOthers(contentElement);
        });

        // Import and use focus guards
        import('./blazix-focus-guards.js').then(({ addFocusGuards }) => {
            addFocusGuards();
        });

        // Import and use scroll lock
        import('./blazix-scroll-lock.js').then(({ lockScroll }) => {
            lockScroll([contentElement]);
        });
    }

    dialogData.set(dialogId, data);
}

/**
 * Clean up dialog functionality.
 * @param {string} dialogId
 * @param {boolean} modal
 */
export function disposeDialog(dialogId, modal) {
    const data = dialogData.get(dialogId);
    if (!data) return;

    if (modal) {
        // Restore aria-hidden
        if (data.ariaHiddenId) {
            import('./blazix-aria-hidden.js').then(({ restoreOthers }) => {
                restoreOthers(data.ariaHiddenId);
            });
        }

        // Remove focus guards
        import('./blazix-focus-guards.js').then(({ removeFocusGuards }) => {
            removeFocusGuards();
        });

        // Unlock scroll
        import('./blazix-scroll-lock.js').then(({ unlockScroll }) => {
            unlockScroll();
        });
    }

    dialogData.delete(dialogId);
}

/**
 * Focus an element programmatically.
 * @param {HTMLElement} element
 */
export function focusElement(element) {
    if (element && element.focus) {
        element.focus({ preventScroll: true });
    }
}