/**
 * Returns a new point that is the scaled version of the given point.
 */
export function scalePoint(scalar: number, point: Point): Point {
    return [point[0] * scalar, point[1] * scalar];
}

/**
 * Returns a new point that is the scaled version of the given point.
 */
export function scalePointWorklet(scalar: number, point: Point): Point {
    "worklet";
    return [point[0] * scalar, point[1] * scalar];
}

/**
 * Returns a new point whose coordinates are the rounded coordinates of the given point.
 */
export function roundPoint(point: Point): Point {
    return [Math.round(point[0]), Math.round(point[1])];
}

/**
 * Returns a new point whose coordinates are the rounded coordinates of the given point.
 */
export function roundPointWorklet(point: Point): Point {
    "worklet";
    return [Math.round(point[0]), Math.round(point[1])];
}