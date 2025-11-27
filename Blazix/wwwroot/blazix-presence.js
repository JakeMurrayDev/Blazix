const BLAZIX_STATE_KEY = Symbol.for('Blazix.Presence.State');
if (!window[BLAZIX_STATE_KEY]) {
    window[BLAZIX_STATE_KEY] = { elementData: new Map() };
}
const state = window[BLAZIX_STATE_KEY];

function getAnimationName(styles) {
    return styles?.animationName || 'none';
}

function handleAnimationEnd(element, dotnetHelper, event) {
    const listenerInfo = state.elementData.get(element);
    if (!listenerInfo || listenerInfo.cancelled) return;

    const currentAnimationName = getAnimationName(window.getComputedStyle(element));
    const isCurrentAnimation = currentAnimationName.includes(event.animationName);

    if (event.target === element && isCurrentAnimation) {
        const currentFillMode = element.style.animationFillMode;
        element.style.animationFillMode = 'forwards';

        removeEventListeners(element);

        // Reset fill mode after unmount has time to process
        setTimeout(() => {
            if (element.style.animationFillMode === 'forwards') {
                element.style.animationFillMode = currentFillMode;
            }
        });

        if (dotnetHelper) {
            dotnetHelper.invokeMethodAsync('OnAnimationEnd');
        }
    }
}

function removeEventListeners(element) {
    if (!element || !state.elementData.has(element)) return;
    const info = state.elementData.get(element);
    if (info.startHandler) element.removeEventListener('animationstart', info.startHandler);
    if (info.endHandler) {
        element.removeEventListener('animationend', info.endHandler);
        element.removeEventListener('animationcancel', info.endHandler);
        element.removeEventListener('transitionend', info.endHandler);
    }
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

    // Clean up any existing listeners first
    removeEventListeners(element);

    const styles = window.getComputedStyle(element);
    const hasAnimation = styles.animationName !== 'none' || styles.transitionDuration !== '0s';

    if (hasAnimation) {
        const endHandler = (event) => handleAnimationEnd(element, dotnetHelper, event);
        const startHandler = (event) => {
            if (event.target === element) {
                const listenerInfo = state.elementData.get(element);
                if (listenerInfo) {
                    listenerInfo.currentAnimationName = getAnimationName(window.getComputedStyle(element));
                }
            }
        };

        element.addEventListener('animationstart', startHandler);
        element.addEventListener('animationend', endHandler);
        element.addEventListener('animationcancel', endHandler);

        state.elementData.set(element, {
            startHandler,
            endHandler,
            dotnetHelper,
            cancelled: false
        });
    } else {
        dotnetHelper.invokeMethodAsync('UnmountImmediately');
    }
}

/**
 * Called when an exit animation is interrupted by a re-mount.
 * Cancels the pending animation end callback and resets styles.
 * @param {HTMLElement} element The element being re-mounted.
 */
export function cancelExitAnimation(element) {
    if (!element) return;

    const info = state.elementData.get(element);
    if (info) {
        info.cancelled = true;
    }

    // Reset animation fill mode if it was set to forwards
    if (element.style.animationFillMode === 'forwards') {
        element.style.animationFillMode = '';
    }

    removeEventListeners(element);
}

export function removePresenceEventListeners(element) {
    removeEventListeners(element);
}