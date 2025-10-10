const sliders = new Map();

export function initialize(sliderElement, dotNetHelper, orientation, isInverted, direction) {
    if (!sliderElement || !dotNetHelper) return;

    let isSliding = false;

    const isHorizontal = orientation === "horizontal";
    const isLTR = direction === "ltr";

    // Determine slide direction
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

    const handlePointerDown = (e) => {
        const target = e.target;

        if (target.hasAttribute("data-disabled")) return;

        target.setPointerCapture(e.pointerId);
        e.preventDefault();

        const isThumb = target.getAttribute("role") === "slider";
        if (isThumb) {
            target.focus();
            const thumbs = Array.from(
                sliderElement.querySelectorAll('[role="slider"]')
            );
            const index = thumbs.indexOf(target);
            dotNetHelper.invokeMethodAsync("SetValueIndexToChange", index);
        }

        dotNetHelper.invokeMethodAsync("HandleSlideStart", e.clientX, e.clientY);

        if (!isThumb) {
            const rect = sliderElement.getBoundingClientRect();
            dotNetHelper.invokeMethodAsync(
                "HandleSlideMove",
                e.clientX,
                e.clientY,
                rect.width,
                rect.height,
                rect.left,
                rect.top
            );
        }

        isSliding = true;
    };

    const handlePointerMove = (e) => {
        if (!isSliding) return;

        const target = e.target;
        if (target.hasPointerCapture(e.pointerId)) {
            const rect = sliderElement.getBoundingClientRect();
            dotNetHelper.invokeMethodAsync(
                "HandleSlideMove",
                e.clientX,
                e.clientY,
                rect.width,
                rect.height,
                rect.left,
                rect.top
            );
        }
    };

    const handlePointerUp = (e) => {
        const target = e.target;
        if (target.hasPointerCapture(e.pointerId)) {
            target.releasePointerCapture(e.pointerId);
            if (isSliding) {
                dotNetHelper.invokeMethodAsync("HandleSlideEnd");
                isSliding = false;
            }
        }
    };

    const handleKeyDown = (e) => {
        const target = e.target;
        if (
            target.getAttribute("role") !== "slider" ||
            target.hasAttribute("data-disabled")
        )
            return;

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
            dotNetHelper.invokeMethodAsync(
                "HandleStepKey",
                isBackKey,
                isPageKey,
                e.shiftKey
            );
        }
    };

    sliderElement.addEventListener("pointerdown", handlePointerDown);
    sliderElement.addEventListener("pointermove", handlePointerMove);
    sliderElement.addEventListener("pointerup", handlePointerUp);
    sliderElement.addEventListener("keydown", handleKeyDown);

    sliders.set(sliderElement, {
        handlePointerDown,
        handlePointerMove,
        handlePointerUp,
        handleKeyDown,
    });
}

export function dispose(sliderElement) {
    if (!sliderElement) return;

    const handlers = sliders.get(sliderElement);
    if (handlers) {
        sliderElement.removeEventListener("pointerdown", handlers.handlePointerDown);
        sliderElement.removeEventListener("pointermove", handlers.handlePointerMove);
        sliderElement.removeEventListener("pointerup", handlers.handlePointerUp);
        sliderElement.removeEventListener("keydown", handlers.handleKeyDown);
        sliders.delete(sliderElement);
    }
}