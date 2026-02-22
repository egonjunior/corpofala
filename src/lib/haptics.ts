/**
 * Haptic feedback utility — Apple-style tactile responses.
 * Falls back gracefully on devices without vibration support.
 */

type HapticStyle = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'selection';

const patterns: Record<HapticStyle, number[]> = {
    light: [10],
    medium: [20],
    heavy: [40],
    success: [10, 50, 20],
    warning: [20, 40, 20, 40],
    selection: [5],
};

export function haptic(style: HapticStyle = 'light') {
    if ('vibrate' in navigator) {
        navigator.vibrate(patterns[style]);
    }
}
