const BLAZIX_STATE_KEY = Symbol.for("Blazix.Collapsible.State");

if (!window[BLAZIX_STATE_KEY]) {
    window[BLAZIX_STATE_KEY] = {
        originalStyles: new Map(),
    };
}

const state = window[BLAZIX_STATE_KEY];

/**
 * Processes the animation rendering and size of an element
 * @param {string} id - The id of the element
 * @param {HTMLElement} element - The element to process
 * @param {Boolean} firstRender - Whether this is the first render of the element
 * @returns
 */
export function processAnimationAndSize(id, element, firstRender) {

    if (!element) return { width: 0, height: 0 };

    if (!state.originalStyles.has(id)) {
        state.originalStyles.set(id, {
            transitionDuration: element.style.transitionDuration,
            animationName: element.style.animationName,
        });
    }

    element.style.transitionDuration = '0s';
    element.style.animationName = 'none';

    const rect = element.getBoundingClientRect();
    const height = rect.height;
    const width = rect.width;

    element.style.setProperty('--blazix-collapsible-content-height', `${height}px`);
    element.style.setProperty('--blazix-collapsible-content-width', `${width}px`);

    void element.offsetWidth;

    if (state.originalStyles.has(id) && !firstRender) {
        var { transitionDuration, animationName } = state.originalStyles.get(id);
        element.style.transitionDuration = transitionDuration;
        element.style.animationName = animationName;
    }
}

export function dispose(id) {
    if (state.originalStyles.has(id)) {
        state.originalStyles.delete(id);
    }
}