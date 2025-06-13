const elementData = new WeakMap();

/**
 * Observes the size of a collapsible content element and updates CSS variables.
 * @param {HTMLElement} element - The element to be observed.
 * @param {object} dotNetObjectReference - The Blazor component instance.
 * @param {string} widthVariable - CSS variable name for width.
 * @param {string} heightVariable - CSS variable name for height.
 * @returns {{Width: number, Height: number}} Initial dimensions.
 */
export function observeCollapsibleContent(element, dotNetObjectReference, widthVariable, heightVariable) {
    if (!element) {
        console.warn('CollapsibleContent: Element to observe is null or undefined.');
        return { Width: 0, Height: 0 };
    }
    if (elementData.has(element)) {
        // Potentially unobserve and re-observe, or just return current state
        const existingData = elementData.get(element);
        if (existingData.observer) {
            existingData.observer.unobserve(element); // Stop old one
        }
    }

    const setDimensions = (width, height) => {
        if (widthVariable) {
            element.style.setProperty(widthVariable, `${width}px`);
        }
        if (heightVariable) {
            element.style.setProperty(heightVariable, `${height}px`);
        }
    };

    const initialWidth = element.offsetWidth;
    const initialHeight = element.offsetHeight;
    setDimensions(initialWidth, initialHeight);

    const observer = new ResizeObserver(entries => {
        for (const entry of entries) {
            if (entry.target === element) {
                const { width, height } = entry.contentRect;
                setDimensions(width, height);
                if (dotNetObjectReference) {
                    try {
                        dotNetObjectReference.invokeMethodAsync('OnResizeOccurred', width, height);
                    } catch (error) {
                        console.error('CollapsibleContent: Error invoking .NET method OnResizeOccurred.', error);
                        observer.unobserve(element);
                        elementData.delete(element);
                    }
                }
            }
        }
    });

    observer.observe(element);
    elementData.set(element, { observer, dotNetObjectReference, widthVariable, heightVariable });

    return { Width: initialWidth, Height: initialHeight };
}

/**
 * Stops observing the size of a specific collapsible content element.
 * @param {HTMLElement} element - The element to unobserve.
 */
export function unobserveCollapsibleContent(element) {
    if (element && elementData.has(element)) {
        const data = elementData.get(element);
        if (data.observer) {
            data.observer.unobserve(element);
            // data.observer.disconnect(); // Disconnect if observer is only for this one element
        }
        elementData.delete(element);
    } else {
        console.warn('CollapsibleContent: Element not found for unobserving or not observed.', element);
    }
}

/**
 * Called from Blazor component's DisposeAsync to clean up a specific observer.
 * @param {HTMLElement} element - The element whose observer should be disposed.
 */
export function disposeObserverForElement(element) {
    // This is essentially the same as unobserveCollapsibleContent for this model
    unobserveCollapsibleContent(element);
}