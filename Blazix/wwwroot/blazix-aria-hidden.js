const BLAZIX_STATE_KEY = Symbol.for('Blazix.AriaHidden.State');
if (!window[BLAZIX_STATE_KEY]) {
    window[BLAZIX_STATE_KEY] = new Map();
}
const undoMap = window[BLAZIX_STATE_KEY];

/**
 * Check if an element should be excluded from hiding.
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function shouldExclude(element) {
    // Exclude script and style elements
    if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return true;
    
    // Exclude focus guards
    if (element.hasAttribute('data-blazix-focus-guard') || 
        element.hasAttribute('data-radix-focus-guard')) return true;
    
    // Exclude elements already hidden (not by us)
    if (element.getAttribute('aria-hidden') === 'true' && 
        !element.hasAttribute('data-blazix-aria-hidden')) return true;
    
    return false;
}

/**
 * Hides all elements from screen readers except the specified element and its ancestors.
 * This is the equivalent of aria-hidden polyfill (hideOthers from aria-hidden package).
 * @param {HTMLElement} element - The element to keep visible
 * @returns {string} - A unique ID to use for cleanup
 */
export function hideOthers(element) {
    if (!element) return null;

    const id = Math.random().toString(36).substring(2, 9);
    const hiddenElements = [];

    // Walk up to find all siblings that need to be hidden
    let current = element;
    while (current && current !== document.body) {
        const parent = current.parentElement;
        if (parent) {
            Array.from(parent.children).forEach(sibling => {
                if (sibling === current) return;
                if (shouldExclude(sibling)) return;

                // Store original value
                const originalValue = sibling.getAttribute('aria-hidden');
                sibling.setAttribute('aria-hidden', 'true');
                sibling.setAttribute('data-blazix-aria-hidden', id);

                hiddenElements.push({
                    element: sibling,
                    originalValue
                });
            });
        }
        current = parent;
    }

    // Also hide siblings of body
    Array.from(document.body.children).forEach(child => {
        if (child.contains(element)) return;
        if (shouldExclude(child)) return;

        const originalValue = child.getAttribute('aria-hidden');
        child.setAttribute('aria-hidden', 'true');
        child.setAttribute('data-blazix-aria-hidden', id);

        hiddenElements.push({
            element: child,
            originalValue
        });
    });

    undoMap.set(id, hiddenElements);
    return id;
}

/**
 * Restores aria-hidden state for elements hidden by hideOthers.
 * @param {string} id - The ID returned by hideOthers
 */
export function restoreOthers(id) {
    if (!id) return;

    const hiddenElements = undoMap.get(id);
    if (!hiddenElements) return;

    hiddenElements.forEach(({ element, originalValue }) => {
        if (originalValue === null) {
            element.removeAttribute('aria-hidden');
        } else {
            element.setAttribute('aria-hidden', originalValue);
        }
        element.removeAttribute('data-blazix-aria-hidden');
    });

    undoMap.delete(id);
}