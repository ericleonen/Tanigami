/**
 * Clamps x inside the given interval [a, b] and returns the clamped value. Throws an error if the
 * a >= b. 
 */
export function clamp(x: number, interval: [number, number]): number {
    const [a, b] = interval;

    if (a >= b) {
        throw new Error("The given interval is invalid. For [a, b], a must be less than b.");
    } else {
        return Math.min(Math.max(x, a), b);
    }
}

/**
 * Clamps x inside the given interval [a, b] and returns the clamped value. Throws an error if the
 * a >= b. 
 */
export function clampWorklet(x: number, interval: [number, number]): number {
    "worklet";
    const [a, b] = interval;

    if (a >= b) {
        throw new Error("The given interval is invalid. For [a, b], a must be less than b.");
    } else {
        return Math.min(Math.max(x, a), b);
    }
}

/**
 * Returns true if the given numbers are strictly within tolerance (default 0.01) of eachother. 
 */
export function areApproximatelyEqual(x1: number, x2: number, tolerance = 0.01) {
    return Math.abs(x1 - x2) < tolerance;
}

/**
 * Returns true if the given numbers are strictly within tolerance (default 0.01) of eachother. 
 */
export function areApproximatelyEqualWorklet(x1: number, x2: number, tolerance = 0.01) {
    "worklet";
    return Math.abs(x1 - x2) < tolerance;
}