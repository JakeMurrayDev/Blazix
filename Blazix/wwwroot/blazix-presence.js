const BLAZIX_DOM_STATE_KEY = Symbol.for('Blazix.DOM.State');
if (!window[BLAZIX_DOM_STATE_KEY]) {
    window[BLAZIX_DOM_STATE_KEY] = { elementData: new Map() };
}
const state = window[BLAZIX_DOM_STATE_KEY];

function getAnimationName(styles) {
    return styles?.animationName || 'none';
}

function handleAnimationEnd(element, dotnetHelper, event) {
    const listenerInfo = state.elementData.get(element);
    if (!listenerInfo) return;

    const currentAnimationName = getAnimationName(window.getComputedStyle(element));

    const isCurrentAnimation = currentAnimationName.includes(event.animationName);

    if (event.target === element && isCurrentAnimation) {
        element.style.animationFillMode = 'forwards';

        removeEventListeners(element);

        if (dotnetHelper) {
            dotnetHelper.invokeMethodAsync('OnAnimationEnd');
        }
    }
}

function removeEventListeners(element) {
    if (!element || !state.elementData.has(element)) return;
    const { startHandler, endHandler } = state.elementData.get(element);
    element.removeEventListener('animationstart', startHandler);
    element.removeEventListener('animationend', endHandler);
    element.removeEventListener('animationcancel', endHandler);
    element.removeEventListener('transitionend', endHandler);
    state.elementData.delete(element);
}

/**
 * The high-fidelity port of the Radix UI presence logic. It checks for
 * animations and handles start, end, and cancel events correctly.
 * @param {HTMLElement} element The element to check.
 * @param {object} dotnetHelper The Blazor component instance.
 */
export function checkForExitAnimationAndListen(element, dotnetHelper) {
    if (!element || !dotnetHelper) return;

    const styles = window.getComputedStyle(element);
    const hasAnimation =
        styles.animationName !== 'none' || styles.transitionDuration !== '0s';

    if (hasAnimation) {
        const endHandler = (event) => handleAnimationEnd(element, dotnetHelper, event);
        const startHandler = (event) => {
            if (event.target === element) {
                const listenerInfo = state.elementData.get(element) || {};
                listenerInfo.currentAnimationName = getAnimationName(
                    window.getComputedStyle(element),
                );
                state.elementData.set(element, listenerInfo);
            }
        };

        element.addEventListener('animationstart', startHandler);
        element.addEventListener('animationend', endHandler);
        element.addEventListener('animationcancel', endHandler);

        state.elementData.set(element, {
            handler: endHandler,
            startHandler,
            endHandler,
            dotnetHelper,
        });
    } else {
        // If there's no animation, unmount immediately.
        dotnetHelper.invokeMethodAsync('UnmountImmediately');
    }
}

export function removePresenceEventListeners(element) {
    removeEventListeners(element);
}