/**
 * Sets the size of the target input element to match the source button element.
 * @param {HTMLElement} buttonElement - The source button element.
 * @param {HTMLElement} inputElement - The target input element to resize.
 */
export function syncInputSize(buttonElement, inputElement) {
    if (buttonElement && inputElement) {
        try {
            const width = buttonElement.offsetWidth;
            const height = buttonElement.offsetHeight;
            inputElement.style.width = `${width}px`;
            inputElement.style.height = `${height}px`;
        } catch (e) {
            console.error("Blazix Checkbox: Error getting button size:", e);
        }
    } else {
        if (!buttonElement) console.warn("Blazix Checkbox: syncInputSize called without buttonElement.");
        if (!inputElement) console.warn("Blazix Checkbox: syncInputSize called without inputElement.");
    }
}