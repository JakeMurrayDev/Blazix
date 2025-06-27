export function loadImage(dotnetHelper, src) {
    if (!src) {
        console.warn('[Blazix.Avatar] loadImage called with null or empty src.');
        dotnetHelper.invokeMethodAsync('HandleLoadingStatusChange', 'error');
        return;
    }

    const image = new Image();

    const handleLoad = () => {
        dotnetHelper.invokeMethodAsync('HandleLoadingStatusChange', 'loaded');
        cleanup();
    };

    const handleError = () => {
        console.error(`[Blazix.Avatar] Image failed to load: ${src}`);
        dotnetHelper.invokeMethodAsync('HandleLoadingStatusChange', 'error');
        cleanup();
    };

    const cleanup = () => {
        image.removeEventListener('load', handleLoad);
        image.removeEventListener('error', handleError);
    };

    image.addEventListener('load', handleLoad);
    image.addEventListener('error', handleError);

    dotnetHelper.invokeMethodAsync('HandleLoadingStatusChange', 'loading');
    image.src = src;

    if (image.complete) {
        // Use a minimal timeout to ensure the 'loading' state from Blazor
        // has a chance to be processed before we immediately send 'loaded' or 'error'.
        setTimeout(() => {
            if (image.naturalWidth > 0) {
                handleLoad();
            } else {
                handleError();
            }
        }, 0);
    }
}