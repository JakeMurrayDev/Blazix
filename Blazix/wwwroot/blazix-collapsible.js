export function scheduleAnimationFrame(dotnetHelper) {
    const rAF = requestAnimationFrame(() => {
        dotnetHelper.invokeMethodAsync('SetMountAnimationPrevented');
    });
    return rAF;
}

export function cancelScheduledAnimationFrame(rAF) {
    cancelAnimationFrame(rAF);
}

export function updateCollapsibleContentSize(element, isMountAnimationPrevented) {
    if (!element) return { Height: 0, Width: 0 };

    const originalStyles = {
        transitionDuration: element.style.transitionDuration,
        animationName: element.style.animationName,
    };

    element.style.transitionDuration = '0s';
    element.style.animationName = 'none';

    const rect = element.getBoundingClientRect();
    const height = rect.height;
    const width = rect.width;

    if (!isMountAnimationPrevented) {
        element.style.transitionDuration = originalStyles.transitionDuration;
        element.style.animationName = originalStyles.animationName;
    }

    return { Width: width, Height: height };
}