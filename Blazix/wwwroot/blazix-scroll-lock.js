const BLAZIX_STATE_KEY = Symbol.for('Blazix.ScrollLock.State');
if (!window[BLAZIX_STATE_KEY]) {
    window[BLAZIX_STATE_KEY] = {
        lockCount: 0,
        originalStyles: null
    };
}
const state = window[BLAZIX_STATE_KEY];

/**
 * Locks body scroll by preventing overflow.
 * Supports multiple consumers via reference counting.
 * @param {HTMLElement[]} shards - Elements that should still be scrollable
 */
export function lockScroll(shards = []) {
    if (state.lockCount === 0) {
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        
        state.originalStyles = {
            overflow: document.body.style.overflow,
            paddingRight: document.body.style.paddingRight,
            position: document.body.style.position,
            top: document.body.style.top,
            left: document.body.style.left,
            right: document.body.style.right
        };

        const scrollY = window.scrollY;

        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        
        // For iOS Safari, we need to use position fixed
        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
        }

        document.body.setAttribute('data-blazix-scroll-locked', '');
    }

    state.lockCount++;
}

/**
 * Unlocks body scroll when all consumers have released.
 */
export function unlockScroll() {
    state.lockCount--;

    if (state.lockCount === 0 && state.originalStyles) {
        const scrollY = document.body.style.top;

        document.body.style.overflow = state.originalStyles.overflow;
        document.body.style.paddingRight = state.originalStyles.paddingRight;
        document.body.style.position = state.originalStyles.position;
        document.body.style.top = state.originalStyles.top;
        document.body.style.left = state.originalStyles.left;
        document.body.style.right = state.originalStyles.right;

        document.body.removeAttribute('data-blazix-scroll-locked');

        // Restore scroll position for iOS Safari
        if (scrollY) {
            window.scrollTo(0, parseInt(scrollY || '0', 10) * -1);
        }

        state.originalStyles = null;
    }
}

/**
 * Check if scroll is currently locked.
 * @returns {boolean}
 */
export function isScrollLocked() {
    return state.lockCount > 0;
}