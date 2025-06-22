// wwwroot/js/presence.js

const elementListeners = new Map();

function handleAnimationEnd(element, dotnetHelper) {
    const listenerInfo = elementListeners.get(element);
    if (!listenerInfo) return;

    // Before we tell Blazor to unmount, we force the
    // element to keep its final animation styles. This prevents the flicker.
    element.style.animationFillMode = 'forwards';

    clearTimeout(listenerInfo.timeoutId);
    removeEventListeners(element);

    if (dotnetHelper) {
        dotnetHelper.invokeMethodAsync('OnAnimationEnd');
    }
}

function addEventListeners(element, dotnetHelper) {
    if (!element || !dotnetHelper) return;

    if (elementListeners.has(element)) {
        removeEventListeners(element);
    }

    const handler = () => handleAnimationEnd(element, dotnetHelper);

    // Set a fallback timeout in case the animation event never fires.
    const timeoutId = setTimeout(handler, 1500);

    element.addEventListener('animationend', handler);
    element.addEventListener('transitionend', handler);

    elementListeners.set(element, { handler, dotnetHelper, timeoutId });
}

function removeEventListeners(element) {
    if (!element || !elementListeners.has(element)) return;

    const { handler, timeoutId } = elementListeners.get(element);
    clearTimeout(timeoutId);
    element.removeEventListener('animationend', handler);
    element.removeEventListener('transitionend', handler);
    elementListeners.delete(element);
}

export {
    addEventListeners as addPresenceEventListeners,
    removeEventListeners as removePresenceEventListeners,
};