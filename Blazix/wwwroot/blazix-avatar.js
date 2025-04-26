export function loadImage(dotnetHelper, src) {
    if (!src) {
        dotnetHelper.invokeMethodAsync('HandleLoadingStatusChange', 'error');
        return;
    }

    var image = new Image();

    image.onload = function () {
        dotnetHelper.invokeMethodAsync('HandleLoadingStatusChange', 'loaded');
    };

    image.onerror = function () {
        dotnetHelper.invokeMethodAsync('HandleLoadingStatusChange', 'error');
    };

    // Start loading the image
    dotnetHelper.invokeMethodAsync('HandleLoadingStatusChange', 'loading');
    image.src = src;
}