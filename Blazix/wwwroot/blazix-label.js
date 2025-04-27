const labelListeners = new Map();

export function addLabelMouseDownListener(element) {
    if (!element) return;

    const listener = (event) => {
        // only prevent text selection if clicking inside the label itself
        const target = event.target;
        if (target.closest("button, input, select, textarea")) {
            return;
        }

        // prevent text selection when double clicking label
        if (!event.defaultPrevented && event.detail > 1) {
            event.preventDefault();
        }
    };

    element.addEventListener("mousedown", listener);
    labelListeners.set(element, listener); // Store the listener
}

export function removeLabelMouseDownListener(element) {
    if (!element) return;

    const listener = labelListeners.get(element);
    if (listener) {
        element.removeEventListener("mousedown", listener);
        labelListeners.delete(element); // Clean up
    }
}
