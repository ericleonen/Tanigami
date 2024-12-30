export function isBetween(x: number, interval: [number, number]): boolean {
    if (interval[0] <= interval[1]) {
        return interval[0] <= x && x <= interval[1];
    } else {
        return isBetween(x, [interval[1], interval[0]]);
    }
}