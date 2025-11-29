const BLAZIX_STATE_KEY = Symbol.for('Blazix.FocusGuards.State');
if (!window[BLAZIX_STATE_KEY]) {
    window[BLAZIX_STATE_KEY] = { count: 0 };
}
const state = window[BLAZIX_STATE_KEY];

function createFocusGuard() {
    const element = document.createElement('span');
    element.setAttribute('data-blazix-focus-guard', '');
    element.tabIndex = 0;
    element.style.outline = 'none';
    element.style.opacity = '0';
    element.style.position = 'fixed';
    element.style.pointerEvents = 'none';
    return element;
}

/**
 * Injects focus guard elements at the edges of the body.
 * These ensure focusin/focusout events fire consistently.
 */
export function addFocusGuards() {
    const edgeGuards = document.querySelectorAll('[data-blazix-focus-guard]');
    document.body.insertAdjacentElement('afterbegin', edgeGuards[0] ?? createFocusGuard());
    document.body.insertAdjacentElement('beforeend', edgeGuards[1] ?? createFocusGuard());
    state.count++;
}

/**
 * Removes focus guard elements when no longer needed.
 */
export function removeFocusGuards() {
    state.count--;
    if (state.count === 0) {
        document.querySelectorAll('[data-blazix-focus-guard]').forEach(node => node.remove());
    }
}