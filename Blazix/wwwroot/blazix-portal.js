const BLAZIX_STATE_KEY = Symbol.for('Blazix.Portal.State');
if (!window[BLAZIX_STATE_KEY]) {
    window[BLAZIX_STATE_KEY] = new Map();
}

/**
 * A map to store the original parent of each portal.
 * @type {Map<string, HTMLElement>}
 */
const portalMap = window[BLAZIX_STATE_KEY];

/**
 * Moves an element to a target container and remembers its original parent.
 * @param {string} id - The id of the element to be moved.
 * @param {string} target - The target container selector.
 */
export function createPortal(id, target = "body") {
    const content = document.getElementById(id);
    const container = document.querySelector(target);

    if (content && container) {
        // Store the original parent before moving the element.
        portalMap.set(id, content.parentNode);
        container.appendChild(content);
    }
}

/**
 * Returns a portal element to its original location so Blazor can clean it up.
 * @param {string} id - The id of the portal element to restore.
 */
export function restorePortal(id) {
    const content = document.getElementById(id);
    const originalParent = portalMap.get(id);

    if (content && originalParent) {
        // Move the element back to its original parent.
        originalParent.appendChild(content);
        // Clean up the map entry.
        portalMap.delete(id);
    } else if (content) {
        // Fallback for safety: if the original parent isn't found for some reason,
        // just remove the element to prevent memory leaks. This would still cause
        // a Blazor error, but it's better than a memory leak.
        content.remove();
        portalMap.delete(id);
    }
}