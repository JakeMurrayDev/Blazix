const BLAZIX_SLIDER_STATE_KEY = Symbol.for("Blazix.Slider.State");

if (!window[BLAZIX_SLIDER_STATE_KEY]) {
    window[BLAZIX_SLIDER_STATE_KEY] = new Map();
}
const sliders = window[BLAZIX_SLIDER_STATE_KEY];

export function initialize(sliderElement, dotNetHelper, orientation, isInverted, direction, min, max, values) {
    if (!sliderElement || !dotNetHelper) return;

    const state = {
        isSliding: false,
        orientation,
        isInverted,
        direction,
        min,
        max,
        values: [...values],
        rectCache: null
    };

    const isHorizontal = orientation === "horizontal";
    const isLTR = direction === "ltr";

    // Determine slide direction for back keys
    let backKeys;
    if (isHorizontal) {
        const isSlidingFromLeft = (isLTR && !isInverted) || (!isLTR && isInverted);
        backKeys = isSlidingFromLeft
            ? ["Home", "PageDown", "ArrowDown", "ArrowLeft"]
            : ["Home", "PageDown", "ArrowDown", "ArrowRight"];
    } else {
        const isSlidingFromBottom = !isInverted;
        backKeys = isSlidingFromBottom
            ? ["Home", "PageDown", "ArrowDown", "ArrowLeft"]
            : ["Home", "PageDown", "ArrowUp", "ArrowLeft"];
    }

    function linearScale(input, output) {
        return (value) => {
            if (input[0] === input[1] || output[0] === output[1]) return output[0];
            const ratio = (output[1] - output[0]) / (input[1] - input[0]);
            return output[0] + ratio * (value - input[0]);
        };
    }

    function getValueFromPointer(pointerPosition, rect) {
        if (isHorizontal) {
            const isSlidingFromLeft = (isLTR && !isInverted) || (!isLTR && isInverted);
            const input = [0, rect.width];
            const output = isSlidingFromLeft ? [state.min, state.max] : [state.max, state.min];
            const scale = linearScale(input, output);
            return scale(pointerPosition - rect.left);
        } else {
            const isSlidingFromBottom = !isInverted;
            const input = [0, rect.height];
            const output = isSlidingFromBottom ? [state.max, state.min] : [state.min, state.max];
            const scale = linearScale(input, output);
            return scale(pointerPosition - rect.top);
        }
    }

    function getClosestValueIndex(values, nextValue) {
        if (values.length === 1) return 0;
        const distances = values.map((value) => Math.abs(value - nextValue));
        const closestDistance = Math.min(...distances);
        return distances.indexOf(closestDistance);
    }

    const handlePointerDown = (e) => {
        const target = e.target;
        if (target.hasAttribute("data-disabled")) return;

        target.setPointerCapture(e.pointerId);
        e.preventDefault();

        const isThumb = target.getAttribute("role") === "slider";

        if (isThumb) {
            target.focus();
            const thumbs = Array.from(sliderElement.querySelectorAll('[role="slider"]'));
            const index = thumbs.indexOf(target);
            dotNetHelper.invokeMethodAsync("SetValueIndexToChange", index);
            dotNetHelper.invokeMethodAsync("HandleSlideStart", index);
        } else {
            // Clicked on track - calculate value and find closest thumb
            const rect = sliderElement.getBoundingClientRect();
            state.rectCache = rect;

            const pointerPos = isHorizontal ? e.clientX : e.clientY;
            const value = getValueFromPointer(pointerPos, rect);
            const closestIndex = getClosestValueIndex(state.values, value);

            dotNetHelper.invokeMethodAsync("HandleSlideStart", closestIndex);
            dotNetHelper.invokeMethodAsync("HandleSlideMove", value);

            // Focus the closest thumb
            const thumbs = Array.from(sliderElement.querySelectorAll('[role="slider"]'));
            if (thumbs[closestIndex]) {
                thumbs[closestIndex].focus();
            }
        }

        state.isSliding = true;
    };

    const handlePointerMove = (e) => {
        if (!state.isSliding) return;

        const target = e.target;
        if (target.hasPointerCapture(e.pointerId)) {
            const rect = state.rectCache || sliderElement.getBoundingClientRect();
            state.rectCache = rect;

            const pointerPos = isHorizontal ? e.clientX : e.clientY;
            const value = getValueFromPointer(pointerPos, rect);

            dotNetHelper.invokeMethodAsync("HandleSlideMove", value);
        }
    };

    const handlePointerUp = (e) => {
        const target = e.target;
        if (target.hasPointerCapture(e.pointerId)) {
            target.releasePointerCapture(e.pointerId);
            if (state.isSliding) {
                state.rectCache = null;
                dotNetHelper.invokeMethodAsync("HandleSlideEnd");
                state.isSliding = false;
            }
        }
    };

    const handleKeyDown = (e) => {
        const target = e.target;
        if (target.getAttribute("role") !== "slider" || target.hasAttribute("data-disabled")) {
            return;
        }

        const PAGE_KEYS = ["PageUp", "PageDown"];
        const ARROW_KEYS = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

        if (e.key === "Home") {
            e.preventDefault();
            dotNetHelper.invokeMethodAsync("HandleHomeKey");
        } else if (e.key === "End") {
            e.preventDefault();
            dotNetHelper.invokeMethodAsync("HandleEndKey");
        } else if (PAGE_KEYS.concat(ARROW_KEYS).includes(e.key)) {
            e.preventDefault();
            const isBackKey = backKeys.includes(e.key);
            const isPageKey = PAGE_KEYS.includes(e.key);
            dotNetHelper.invokeMethodAsync("HandleStepKey", isBackKey, isPageKey, e.shiftKey);
        }
    };

    sliderElement.addEventListener("pointerdown", handlePointerDown);
    sliderElement.addEventListener("pointermove", handlePointerMove);
    sliderElement.addEventListener("pointerup", handlePointerUp);
    sliderElement.addEventListener("keydown", handleKeyDown);

    sliders.set(sliderElement, {
        state,
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handleKeyDown
    });
}

export function updateValues(sliderElement, values) {
    if (!sliderElement) return;

    const slider = sliders.get(sliderElement);
    if (slider) {
        slider.state.values = [...values];
    }
}

export function dispose(sliderElement) {
    if (!sliderElement) return;

    const slider = sliders.get(sliderElement);
    if (slider) {
        sliderElement.removeEventListener("pointerdown", slider.handlePointerDown);
        sliderElement.removeEventListener("pointermove", slider.handlePointerMove);
        sliderElement.removeEventListener("pointerup", slider.handlePointerUp);
        sliderElement.removeEventListener("keydown", slider.handleKeyDown);
        sliders.delete(sliderElement);
    }
}