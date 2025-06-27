const BLAZIX_LABEL_STATE_KEY = Symbol.for("Blazix.Label.State");

if (!window[BLAZIX_LABEL_STATE_KEY]) {
    window[BLAZIX_LABEL_STATE_KEY] = {
        labelListeners: new WeakMap(),
    };
}

const state = window[BLAZIX_LABEL_STATE_KEY];

export function addLabelMouseDownListener(element) {
    if (!element || state.labelListeners.has(element)) return;

    const listener = (event) => {
        const target = event.target;
        if (target.closest("button, input, select, textarea")) {
            return;
        }
        if (!event.defaultPrevented && event.detail > 1) {
            event.preventDefault();
        }
    };

    element.addEventListener("mousedown", listener);
    state.labelListeners.set(element, listener);
}

export function removeLabelMouseDownListener(element) {
    if (!element) return;

    const listener = state.labelListeners.get(element);
    if (listener) {
        element.removeEventListener("mousedown", listener);
        state.labelListeners.delete(element);
    }
}
