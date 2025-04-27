// Simple cache to prevent redundant loads for the same src if called rapidly,
// though the it would be mostly prevented in Blazor.
// We don't store the image itself here, just manage the loading process.
const imageLoaders = {};

export function loadImage(dotnetHelper, src) {
    // Immediately invoke error if src is invalid
    if (!src) {
        console.warn('[Blazix.Avatar] loadImage called with null or empty src.');
        dotnetHelper.invokeMethodAsync('HandleLoadingStatusChange', 'error');
        return;
    }

    // If there's an existing loader for this src (e.g., rapid calls),
    // maybe just let the first one finish? Or cancel previous?
    // For simplicity, we'll just create a new Image object each time.
    // The Blazor component should manage the src changes.

    const image = new Image();

    const handleLoad = () => {
        dotnetHelper.invokeMethodAsync('HandleLoadingStatusChange', 'loaded');
        cleanup();
    };

    const handleError = () => {
        console.error(`Image failed to load: ${src}`);
        dotnetHelper.invokeMethodAsync('HandleLoadingStatusChange', 'error');
        cleanup();
    };

    const cleanup = () => {
        image.removeEventListener('load', handleLoad);
        image.removeEventListener('error', handleError);
    };

    image.addEventListener('load', handleLoad);
    image.addEventListener('error', handleError);

    // Report 'loading' status immediately
    dotnetHelper.invokeMethodAsync('HandleLoadingStatusChange', 'loading');

    // Start the actual loading
    image.src = src;

    // Check if already complete (cached by browser)
    // This needs to be after setting src and adding listeners
    if (image.complete) {
        // If already complete and has width, it's loaded.
        // If complete but no width, it's likely an error (e.g., 404 treated as complete).
        if (image.naturalWidth > 0) {
            // Use a minimal timeout to ensure the 'loading' state is processed
            // before the 'loaded' state, mimicking async behavior slightly better.
            setTimeout(handleLoad, 0);
        } else {
            setTimeout(handleError, 0);
        }
    }
}
