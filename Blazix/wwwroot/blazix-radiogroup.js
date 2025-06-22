import { syncInputSize } from './blazix-utilities.js';


const BLAZIX_RADIO_GROUP_STATE_KEY = Symbol.for("Blazix.RadioGroup.State");

if (!window[BLAZIX_RADIO_GROUP_STATE_KEY]) {
    window[BLAZIX_RADIO_GROUP_STATE_KEY] = {
        isArrowKeyPressed: false,
        listenerReferenceCount: 0,
    };
}

const state = window[BLAZIX_RADIO_GROUP_STATE_KEY];
const ARROW_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

const handleGlobalKeyDown = (event) => {
    if (ARROW_KEYS.includes(event.key)) {
        state.isArrowKeyPressed = true;
    }
};

const handleGlobalKeyUp = (event) => {
    if (ARROW_KEYS.includes(event.key)) {
        state.isArrowKeyPressed = false;
    }
};

/**
 * Adds global listeners if they don't already exist and increments the reference count.
 */
export function addArrowKeyListeners() {
    if (state.listenerReferenceCount === 0) {
        document.addEventListener('keydown', handleGlobalKeyDown);
        document.addEventListener('keyup', handleGlobalKeyUp);
    }
    state.listenerReferenceCount++;
}

/**
 * Decrements the reference count and removes global listeners if the count reaches zero.
 */
export function removeArrowKeyListeners() {
    state.listenerReferenceCount--;
    if (state.listenerReferenceCount === 0) {
        document.removeEventListener('keydown', handleGlobalKeyDown);
        document.removeEventListener('keyup', handleGlobalKeyUp);
    }
}

/**
 * Allows Blazor to check the current state of the arrow key flag.
 * @returns {boolean}
 */
export function isArrowKeyPressed() {
    return state.isArrowKeyPressed;
}

/**
 * Programmatically updates the state of a radio input and dispatches
 * necessary events for form integration.
 * @param {HTMLInputElement} inputElement - The radio input element.
 */
export function triggerClick(inputElement) {
    if (inputElement) {
        const event = new Event('click', { bubbles: true });
        inputElement.checked = true;
        inputElement.dispatchEvent(event);
    }
}

export { syncInputSize };