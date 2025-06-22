import { syncInputSize } from './blazix-utilities.js';

export { syncInputSize };

/**
 * Programmatically updates the state of a checkbox input and dispatches
 * necessary events for form integration.
 * @param {HTMLInputElement} inputElement - The checkbox input element.
 * @param {boolean | null} checkedValue - The desired state (true, false, or null for indeterminate).
 * @param {boolean} bubbles - Whether the dispatched events should bubble.
 */
export function triggerInputEvents(inputElement, checkedValue, bubbles) {
    if (inputElement) {
        const isIndeterminate = checkedValue === null;
        const isChecked = checkedValue === true;

        // Store previous checked value to determine if 'change' event is needed
        const prevChecked = inputElement.checked;

        // Update properties *before* dispatching events
        inputElement.indeterminate = isIndeterminate;
        inputElement.checked = isIndeterminate ? false : isChecked;

        // Dispatch 'click' event to mimic user interaction
        const clickEvent = new Event('click', { bubbles: bubbles });
        inputElement.dispatchEvent(clickEvent);

        // Dispatch 'change' event only if the checked state *actually* changed.
        if (inputElement.checked !== prevChecked) {
            const changeEvent = new Event('change', { bubbles: bubbles });
            inputElement.dispatchEvent(changeEvent);
        }

    } else {
        console.warn("Blazix Checkbox: triggerInputEvents called without inputElement.");
    }
}