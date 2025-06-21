/**
 * A Map to store event listeners for each element, ensuring instance isolation.
 */
const elementListeners = new Map();

function handleAnimationEnd(dotnetHelper) {
    if (dotnetHelper) {
        dotnetHelper.invokeMethodAsync('OnAnimationEnd');
    }
}

export function addPresenceEventListeners(element, dotnetHelper) {
    if (!element || !dotnetHelper) return;

    if (elementListeners.has(element)) {
        removePresenceEventListeners(element);
    }

    const handler = () => handleAnimationEnd(dotnetHelper);

    element.addEventListener('animationend', handler);
    element.addEventListener('transitionend', handler);

    elementListeners.set(element, { handler, dotnetHelper });
}

export function removePresenceEventListeners(element) {
    if (!element || !elementListeners.has(element)) return;

    const { handler } = elementListeners.get(element);
    element.removeEventListener('animationend', handler);
    element.removeEventListener('transitionend', handler);

    elementListeners.delete(element);
}