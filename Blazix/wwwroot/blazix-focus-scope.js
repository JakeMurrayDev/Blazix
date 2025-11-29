const BLAZIX_STATE_KEY = Symbol.for('Blazix.FocusScope.State');
if (!window[BLAZIX_STATE_KEY]) {
    window[BLAZIX_STATE_KEY] = {
        scopeData: new Map(),
        stack: []
    };
}
const state = window[BLAZIX_STATE_KEY];

const AUTOFOCUS_ON_MOUNT = 'focusScope.autoFocusOnMount';
const AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount';
const EVENT_OPTIONS = { bubbles: false, cancelable: true };

const TABBABLE_SELECTOR = [
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"]):not([disabled])',
    'audio[controls]',
    'video[controls]',
    '[contenteditable]:not([contenteditable="false"])',
].join(',');

function getTabbableCandidates(container) {
    const candidates = Array.from(container.querySelectorAll(TABBABLE_SELECTOR));
    return candidates.filter(el => !isHidden(el, container));
}

function getTabbableEdges(container) {
    const candidates = getTabbableCandidates(container);
    const first = candidates[0] ?? null;
    const last = candidates[candidates.length - 1] ?? null;
    return [first, last];
}

function isHidden(node, upTo) {
    if (getComputedStyle(node).visibility === 'hidden') return true;
    while (node) {
        if (upTo !== undefined && node === upTo) return false;
        if (getComputedStyle(node).display === 'none') return true;
        node = node.parentElement;
    }
    return false;
}

function isSelectableInput(element) {
    return element instanceof HTMLInputElement && 'select' in element;
}

function focusElement(element, { select = false } = {}) {
    if (element && element.focus) {
        const prev = document.activeElement;
        element.focus({ preventScroll: true });
        if (element !== prev && isSelectableInput(element) && select) {
            element.select();
        }
    }
}

function focusFirst(candidates, { select = false } = {}) {
    const prev = document.activeElement;
    for (const candidate of candidates) {
        focusElement(candidate, { select });
        if (document.activeElement !== prev) return true;
    }
    return false;
}

function removeLinks(items) {
    return items.filter(item => item.tagName !== 'A');
}

/**
 * Initialize a focus scope on an element.
 * @param {HTMLElement} element
 * @param {boolean} loop
 * @param {boolean} trapped
 * @param {object} dotNetRef
 */
export function initializeFocusScope(element, loop, trapped, dotNetRef) {
    if (!element) return;

    const scopeApi = {
        paused: false,
        pause() { this.paused = true; },
        resume() { this.paused = false; }
    };

    let lastFocusedElement = null;
    let mutationObserver = null;

    // Add to stack, pausing the previous top scope
    const activeScope = state.stack[0];
    if (scopeApi !== activeScope) {
        activeScope?.pause();
    }
    state.stack = state.stack.filter(s => s !== scopeApi);
    state.stack.unshift(scopeApi);

    // Focus trapping handlers
    const handleFocusIn = (event) => {
        if (scopeApi.paused || !trapped) return;
        const target = event.target;
        if (element.contains(target)) {
            lastFocusedElement = target;
        } else {
            focusElement(lastFocusedElement, { select: true });
        }
    };

    const handleFocusOut = (event) => {
        if (scopeApi.paused || !trapped) return;
        const relatedTarget = event.relatedTarget;
        if (relatedTarget === null) return;
        if (!element.contains(relatedTarget)) {
            focusElement(lastFocusedElement, { select: true });
        }
    };

    const handleMutations = (mutations) => {
        const focusedElement = document.activeElement;
        if (focusedElement !== document.body) return;
        for (const mutation of mutations) {
            if (mutation.removedNodes.length > 0) {
                focusElement(element);
            }
        }
    };

    // Keydown handler for loop/trap
    const handleKeyDown = (event) => {
        if (!loop && !trapped) return;
        if (scopeApi.paused) return;

        const isTabKey = event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey;
        const focusedElement = document.activeElement;

        if (isTabKey && focusedElement) {
            const [first, last] = getTabbableEdges(element);
            const hasTabbableElements = first && last;

            if (!hasTabbableElements) {
                if (focusedElement === element) {
                    event.preventDefault();
                }
            } else {
                if (!event.shiftKey && focusedElement === last) {
                    event.preventDefault();
                    if (loop) focusElement(first, { select: true });
                } else if (event.shiftKey && focusedElement === first) {
                    event.preventDefault();
                    if (loop) focusElement(last, { select: true });
                }
            }
        }
    };

    // Set up event listeners
    if (trapped) {
        document.addEventListener('focusin', handleFocusIn);
        document.addEventListener('focusout', handleFocusOut);
        mutationObserver = new MutationObserver(handleMutations);
        mutationObserver.observe(element, { childList: true, subtree: true });
    }

    element.addEventListener('keydown', handleKeyDown);

    // Store data for cleanup
    state.scopeData.set(element, {
        scopeApi,
        handleFocusIn,
        handleFocusOut,
        handleKeyDown,
        mutationObserver,
        trapped,
        dotNetRef
    });

    // Auto-focus on mount
    const previouslyFocusedElement = document.activeElement;
    const hasFocusedCandidate = element.contains(previouslyFocusedElement);

    if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);
        element.dispatchEvent(mountEvent);

        if (!mountEvent.defaultPrevented) {
            const candidates = removeLinks(getTabbableCandidates(element));
            if (!focusFirst(candidates, { select: true })) {
                if (document.activeElement === previouslyFocusedElement) {
                    focusElement(element);
                }
            }
        }
    }

    return previouslyFocusedElement;
}

/**
 * Dispose of a focus scope, restoring focus to the previously focused element.
 * @param {HTMLElement} element
 * @param {HTMLElement} previouslyFocusedElement
 */
export function disposeFocusScope(element, previouslyFocusedElement) {
    if (!element) return;

    const data = state.scopeData.get(element);
    if (!data) return;

    const { scopeApi, handleFocusIn, handleFocusOut, handleKeyDown, mutationObserver, trapped } = data;

    // Clean up event listeners
    if (trapped) {
        document.removeEventListener('focusin', handleFocusIn);
        document.removeEventListener('focusout', handleFocusOut);
        mutationObserver?.disconnect();
    }
    element.removeEventListener('keydown', handleKeyDown);

    // Auto-focus on unmount
    const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS);
    element.dispatchEvent(unmountEvent);

    if (!unmountEvent.defaultPrevented) {
        focusElement(previouslyFocusedElement ?? document.body, { select: true });
    }

    // Remove from stack and resume the next scope
    state.stack = state.stack.filter(s => s !== scopeApi);
    state.stack[0]?.resume();

    state.scopeData.delete(element);
}

/**
 * Prevent auto-focus on mount by calling preventDefault on the event.
 * @param {HTMLElement} element
 * @param {Function} callback
 */
export function addMountAutoFocusListener(element, callback) {
    if (!element) return;
    const handler = (event) => {
        callback(event.defaultPrevented);
    };
    element.addEventListener(AUTOFOCUS_ON_MOUNT, handler, { once: true });
}

/**
 * Prevent auto-focus on unmount by calling preventDefault on the event.
 * @param {HTMLElement} element
 * @param {Function} callback
 */
export function addUnmountAutoFocusListener(element, callback) {
    if (!element) return;
    const handler = (event) => {
        callback(event.defaultPrevented);
    };
    element.addEventListener(AUTOFOCUS_ON_UNMOUNT, handler, { once: true });
}

/**
 * Prevent the default auto-focus behavior on mount.
 * @param {HTMLElement} element
 */
export function preventMountAutoFocus(element) {
    if (!element) return;
    element.addEventListener(AUTOFOCUS_ON_MOUNT, (e) => e.preventDefault(), { once: true });
}

/**
 * Prevent the default auto-focus behavior on unmount.
 * @param {HTMLElement} element
 */
export function preventUnmountAutoFocus(element) {
    if (!element) return;
    element.addEventListener(AUTOFOCUS_ON_UNMOUNT, (e) => e.preventDefault(), { once: true });
}