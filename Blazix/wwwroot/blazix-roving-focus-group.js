const ENTRY_FOCUS = 'rovingFocusGroup.onEntryFocus';
const EVENT_OPTIONS = { bubbles: false, cancelable: true };

const groupHandlers = new Map();
const itemHandlers = new Map();

export function initializeRovingFocusGroup(element, dotNetRef) {
    let isClickFocus = false;

    const handleMouseDown = () => {
        isClickFocus = true;
    };

    const handleFocus = async (event) => {
        const isKeyboardFocus = !isClickFocus;

        if (
            event.target === event.currentTarget &&
            isKeyboardFocus &&
            element.tabIndex !== -1
        ) {
            const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
            event.currentTarget.dispatchEvent(entryFocusEvent);

            if (!entryFocusEvent.defaultPrevented) {
                try {
                    await dotNetRef.invokeMethodAsync('HandleEntryFocusEvent');
                } catch {
                    // Ignore if .NET is disconnected
                }
            }
        }

        isClickFocus = false;
    };

    const handleBlur = () => {
        try {
            dotNetRef.invokeMethodAsync('HandleBlur');
        } catch {
            // Ignore if .NET is disconnected
        }
    };

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    groupHandlers.set(element, {
        handleMouseDown,
        handleFocus,
        handleBlur,
        dotNetRef,
    });
}

export function disposeRovingFocusGroup(element) {
    const handlers = groupHandlers.get(element);
    if (handlers) {
        element.removeEventListener('mousedown', handlers.handleMouseDown);
        element.removeEventListener('focus', handlers.handleFocus);
        element.removeEventListener('blur', handlers.handleBlur);
        groupHandlers.delete(element);
    }
}

export function initializeRovingFocusGroupItem(
    element,
    focusable,
    dotNetRef
) {
    const handleMouseDown = (event) => {
        if (!focusable) {
            event.preventDefault();
        } else {
            try {
                dotNetRef.invokeMethodAsync('HandleMouseDown');
            } catch {
                // Ignore if .NET is disconnected
            }
        }
    };

    const handleFocus = () => {
        try {
            dotNetRef.invokeMethodAsync('HandleFocus');
        } catch {
            // Ignore if .NET is disconnected
        }
    };

    const handleKeyDown = async (event) => {
        if (event.target !== event.currentTarget) {
            return;
        }

        const keysThatTriggerFocusIntent = [
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'ArrowDown',
            'Home',
            'End',
            'PageUp',
            'PageDown',
        ];

        if (
            event.key === 'Tab' ||
            keysThatTriggerFocusIntent.includes(event.key)
        ) {
            try {
                await dotNetRef.invokeMethodAsync(
                    'HandleKeyDown',
                    event.key,
                    event.shiftKey,
                    event.ctrlKey,
                    event.altKey,
                    event.metaKey
                );

                if (keysThatTriggerFocusIntent.includes(event.key)) {
                    if (
                        !event.metaKey &&
                        !event.ctrlKey &&
                        !event.altKey &&
                        !event.shiftKey
                    ) {
                        event.preventDefault();
                    }
                }
            } catch {
                // Ignore if .NET is disconnected
            }
        }
    };

    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('focus', handleFocus);
    element.addEventListener('keydown', handleKeyDown);

    itemHandlers.set(element, {
        handleMouseDown,
        handleFocus,
        handleKeyDown,
        dotNetRef,
    });
}

export function focusFirst(candidates, preventScroll = false) {
    const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;

    for (const candidate of candidates) {
        if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) {
            return;
        }

        candidate.focus({ preventScroll });

        if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) {
            return;
        }
    }
}