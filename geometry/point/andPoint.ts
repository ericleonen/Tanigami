/**
 * Returns a new point that is the sum of the given points.
 */
export function addPoints(point1: Point, point2: Point): Point {
    return [point1[0] + point2[0], point1[1] + point2[1]];
}

/**
 * Returns a new point that is the sum of the given points.
 */
export function addPointsWorklet(point1: Point, point2: Point): Point {
    "worklet"
    return [point1[0] + point2[0], point1[1] + point2[1]];
}

/**
 * Returns a new point that is the difference (point1 - point2) of the given points.
 */
export function subtractPoints(point1: Point, point2: Point): Point {
    return [point1[0] - point2[0], point1[1] - point2[1]];
}

/**
 * Returns a new point that is the difference (point1 - point2) of the given points.
 */
export function subtractPointsWorklet(point1: Point, point2: Point): Point {
    "worklet";
    return [point1[0] - point2[0], point1[1] - point2[1]];
}

/**
 * Returns the distance between the two given points.
 */
export function getDistanceBetweenPoints(point1: Point, point2: Point): number {
    return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2);
}

/**
 * Returns the distance between the two given points.
 */
export function getDistanceBetweenPointsWorklet(point1: Point, point2: Point): number {
    "worklet";
    return ((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2) ** 0.5;
}

/**
 * Returns true if the two given points are exactly equal.
 */
export function arePointsEqual(point1: Point, point2: Point): boolean {
    return point1[0] === point2[0] && point1[1] === point2[1];
} 

/**
 * Returns true if the two given points are exactly equal.
 */
export function arePointsEqualWorklet(point1: Point, point2: Point): boolean {
    "worklet";
    return point1[0] === point2[0] && point1[1] === point2[1];
} 