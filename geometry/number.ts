/**
 * Returns true if x is within the given interval (endpoints inclusive), false otheriwse. Can
 * handle improper intervals (the larger value is the first value).
 */
export function isBetween(x: number, interval: [number, number]): boolean {
    if (interval[0] <= interval[1]) {
        return interval[0] <= x && x <= interval[1];
    } else {
        return isBetween(x, [interval[1], interval[0]]);
    }
}

export function clamp(x: number, interval: [number, number]): number {
    if (interval[0] <= interval[1]) {
        return Math.max(Math.min(x, interval[1]), interval[0]);
    } else {
        return clamp(x, [interval[1], interval[0]]);
    }
}