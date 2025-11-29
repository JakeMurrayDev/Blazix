const BLAZIX_STATE_KEY = Symbol.for('Blazix.DismissableLayer.State');
if (!window[BLAZIX_STATE_KEY]) {
    window[BLAZIX_STATE_KEY] = {
        layers: new Set(),
        layersWithOutsidePointerEventsDisabled: new Set(),
        branches: new Set(),
        layerData: new Map(),
        originalBodyPointerEvents: ''
    };
}
const state = window[BLAZIX_STATE_KEY];

const POINTER_DOWN_OUTSIDE = 'dismissableLayer.pointerDownOutside';
const FOCUS_OUTSIDE = 'dismissableLayer.focusOutside';
const CONTEXT_UPDATE = 'dismissableLayer.update';
const EVENT_OPTIONS = { bubbles: false, cancelable: true };

function dispatchUpdate() {
    document.dispatchEvent(new CustomEvent(CONTEXT_UPDATE));
}

/**
 * Initialize a dismissable layer.
 * @param {HTMLElement} element
 * @param {boolean} disableOutsidePointerEvents
 * @param {object} dotNetRef
 */
export function initializeDismissableLayer(element, disableOutsidePointerEvents, dotNetRef) {
    if (!element) return;

    const ownerDocument = element.ownerDocument ?? document;
    let pointerDownTarget = null;
    let isPointerInsideReactTree = false;

    // Pointer down outside detection
    const handlePointerDown = (event) => {
        const target = event.target;

        // Check if this layer can receive pointer events
        const layers = Array.from(state.layers);
        const [highestDisabledLayer] = [...state.layersWithOutsidePointerEventsDisabled].slice(-1);
        const highestDisabledIndex = layers.indexOf(highestDisabledLayer);
        const index = layers.indexOf(element);
        const isPointerEventsEnabled = index >= highestDisabledIndex;

        pointerDownTarget = isPointerEventsEnabled ? target : null;
        isPointerInsideReactTree = false;
    };

    const handlePointerDownCapture = () => {
        isPointerInsideReactTree = true;
    };

    const handleClick = async (event) => {
        const target = pointerDownTarget;
        if (!target) return;

        // Check if click is in a branch
        const isInBranch = [...state.branches].some(branch => branch.contains(target));
        if (isInBranch) return;

        // Check if click is inside this layer
        if (element.contains(target)) return;

        // Check layer ordering
        const layers = Array.from(state.layers);
        const [highestDisabledLayer] = [...state.layersWithOutsidePointerEventsDisabled].slice(-1);
        const highestDisabledIndex = layers.indexOf(highestDisabledLayer);
        const index = layers.indexOf(element);
        const isPointerEventsEnabled = index >= highestDisabledIndex;

        if (!isPointerEventsEnabled) return;

        // Dispatch custom event
        const pointerDownOutsideEvent = new CustomEvent(POINTER_DOWN_OUTSIDE, {
            ...EVENT_OPTIONS,
            detail: {
                originalEvent: event,
                targetId: target.id || null,
                button: event.button,
                ctrlKey: event.ctrlKey
            }
        });
        element.dispatchEvent(pointerDownOutsideEvent);

        if (!pointerDownOutsideEvent.defaultPrevented) {
            try {
                const result = await dotNetRef.invokeMethodAsync('HandlePointerDownOutside', {
                    targetId: target.id || '',
                    button: event.button,
                    ctrlKey: event.ctrlKey
                });
                if (!result) {
                    // Not prevented, call dismiss
                    await dotNetRef.invokeMethodAsync('HandleDismiss');
                }
            } catch { }
        }

        pointerDownTarget = null;
    };

    // Focus outside detection
    let isFocusInsideReactTree = false;

    const handleFocusCapture = () => {
        isFocusInsideReactTree = true;
    };

    const handleBlurCapture = () => {
        isFocusInsideReactTree = false;
    };

    const handleFocusIn = async (event) => {
        const target = event.target;

        // Check if focus is in a branch
        const isInBranch = [...state.branches].some(branch => branch.contains(target));
        if (isInBranch) return;

        // Check if focus is inside this layer
        if (element.contains(target)) return;

        // Don't trigger if focus was triggered internally
        if (isFocusInsideReactTree) return;

        // Dispatch custom event
        const focusOutsideEvent = new CustomEvent(FOCUS_OUTSIDE, {
            ...EVENT_OPTIONS,
            detail: {
                originalEvent: event,
                targetId: target.id || null
            }
        });
        element.dispatchEvent(focusOutsideEvent);

        if (!focusOutsideEvent.defaultPrevented) {
            try {
                const result = await dotNetRef.invokeMethodAsync('HandleFocusOutside', {
                    targetId: target.id || ''
                });
                if (!result) {
                    // Not prevented, call dismiss
                    await dotNetRef.invokeMethodAsync('HandleDismiss');
                }
            } catch { }
        }
    };

    // Escape key detection
    const handleKeyDown = async (event) => {
        if (event.key !== 'Escape') return;

        // Only the highest layer handles escape
        const layers = Array.from(state.layers);
        const isHighestLayer = layers.indexOf(element) === layers.length - 1;
        if (!isHighestLayer) return;

        try {
            const result = await dotNetRef.invokeMethodAsync('HandleEscapeKeyDown');
            if (!result) {
                // Not prevented, call dismiss
                event.preventDefault();
                await dotNetRef.invokeMethodAsync('HandleDismiss');
            }
        } catch { }
    };

    // Context update handler
    const handleUpdate = () => {
        // Force re-evaluation of pointer events state
    };

    // Set up event listeners
    ownerDocument.addEventListener('pointerdown', handlePointerDown, true);
    ownerDocument.addEventListener('click', handleClick);
    ownerDocument.addEventListener('focusin', handleFocusIn);
    ownerDocument.addEventListener('keydown', handleKeyDown);
    document.addEventListener(CONTEXT_UPDATE, handleUpdate);

    element.addEventListener('pointerdown', handlePointerDownCapture, true);
    element.addEventListener('focusin', handleFocusCapture, true);
    element.addEventListener('blur', handleBlurCapture, true);

    // Manage outside pointer events
    if (disableOutsidePointerEvents) {
        if (state.layersWithOutsidePointerEventsDisabled.size === 0) {
            state.originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
            ownerDocument.body.style.pointerEvents = 'none';
        }
        state.layersWithOutsidePointerEventsDisabled.add(element);
    }

    state.layers.add(element);
    dispatchUpdate();

    // Store data for cleanup
    state.layerData.set(element, {
        handlePointerDown,
        handlePointerDownCapture,
        handleClick,
        handleFocusCapture,
        handleBlurCapture,
        handleFocusIn,
        handleKeyDown,
        handleUpdate,
        disableOutsidePointerEvents,
        dotNetRef
    });

    // Return pointer events state
    return getPointerEventsState(element);
}

/**
 * Get the current pointer events state for a layer.
 * @param {HTMLElement} element
 * @returns {{ isBodyPointerEventsDisabled: boolean, isPointerEventsEnabled: boolean }}
 */
export function getPointerEventsState(element) {
    const layers = Array.from(state.layers);
    const [highestDisabledLayer] = [...state.layersWithOutsidePointerEventsDisabled].slice(-1);
    const highestDisabledIndex = layers.indexOf(highestDisabledLayer);
    const index = layers.indexOf(element);
    const isBodyPointerEventsDisabled = state.layersWithOutsidePointerEventsDisabled.size > 0;
    const isPointerEventsEnabled = index >= highestDisabledIndex;

    return { isBodyPointerEventsDisabled, isPointerEventsEnabled };
}

/**
 * Dispose of a dismissable layer.
 * @param {HTMLElement} element
 */
export function disposeDismissableLayer(element) {
    if (!element) return;

    const data = state.layerData.get(element);
    if (!data) return;

    const ownerDocument = element.ownerDocument ?? document;

    // Clean up event listeners
    ownerDocument.removeEventListener('pointerdown', data.handlePointerDown, true);
    ownerDocument.removeEventListener('click', data.handleClick);
    ownerDocument.removeEventListener('focusin', data.handleFocusIn);
    ownerDocument.removeEventListener('keydown', data.handleKeyDown);
    document.removeEventListener(CONTEXT_UPDATE, data.handleUpdate);

    element.removeEventListener('pointerdown', data.handlePointerDownCapture, true);
    element.removeEventListener('focusin', data.handleFocusCapture, true);
    element.removeEventListener('blur', data.handleBlurCapture, true);

    // Restore body pointer events
    if (data.disableOutsidePointerEvents) {
        state.layersWithOutsidePointerEventsDisabled.delete(element);
        if (state.layersWithOutsidePointerEventsDisabled.size === 0) {
            ownerDocument.body.style.pointerEvents = state.originalBodyPointerEvents;
        }
    }

    state.layers.delete(element);
    state.layerData.delete(element);
    dispatchUpdate();
}

/**
 * Register a branch element (an area that won't trigger dismiss).
 * @param {HTMLElement} element
 */
export function registerBranch(element) {
    if (!element) return;
    state.branches.add(element);
}

/**
 * Unregister a branch element.
 * @param {HTMLElement} element
 */
export function unregisterBranch(element) {
    if (!element) return;
    state.branches.delete(element);
}