export function initializeIcon(markerElement) {
    if (!markerElement) return;

    // Find the next SVG sibling after the marker
    let nextNode = markerElement.nextElementSibling;
    while (nextNode) {
        if (nextNode.tagName === 'svg') {
            nextNode.setAttribute('focusable', 'false');
            nextNode.setAttribute('aria-hidden', 'true');
            markerElement.remove();
            return;
        }
        // Check if the next element contains an SVG
        const svg = nextNode.querySelector('svg');
        if (svg) {
            svg.setAttribute('focusable', 'false');
            svg.setAttribute('aria-hidden', 'true');
            markerElement.remove();
            return;
        }
        nextNode = nextNode.nextElementSibling;
    }
}