const BLAZIX_TOOLBAR_STATE_KEY = Symbol.for("Blazix.Toolbar.State");

if (!window[BLAZIX_TOOLBAR_STATE_KEY]) {
    window[BLAZIX_TOOLBAR_STATE_KEY] = new Map();
}

const linkHandlers = window[BLAZIX_TOOLBAR_STATE_KEY];

/**
 * Initializes a toolbar link to handle Space key as click.
 * This is needed because <a> elements don't natively trigger on Space.
 * @param {HTMLElement} element - The link element
 */
export function initializeToolbarLink(element) {
    const handleKeyDown = (event) => {
        if (event.key === ' ') {
            event.preventDefault();
            element.click();
        }
    };

    element.addEventListener('keydown', handleKeyDown);

    linkHandlers.set(element, { handleKeyDown });
}

/**
 * Disposes of the toolbar link event handlers.
 * @param {HTMLElement} element - The link element
 */
export function disposeToolbarLink(element) {
    const handlers = linkHandlers.get(element);
    if (handlers) {
        element.removeEventListener('keydown', handlers.handleKeyDown);
        linkHandlers.delete(element);
    }
}