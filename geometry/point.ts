import { isApproximatelyEqual, isApproximatelyEqualWorklet } from "./number";

/**
 * Creates a new Point that is the sum of the two given points. Returns that new Point.
 */
export function pointSum(point1: Point, point2: Point): Point {
    return [point1[0] + point2[0], point1[1] + point2[1]];
}

/**
 * Creates a new Point that is the sum of the two given points. Returns that new Point.
 */
export function pointSumWorklet(point1: Point, point2: Point): Point {
    "worklet"
    return [point1[0] + point2[0], point1[1] + point2[1]];
}

/**
 * Creates a new Point that is the difference (point1 - point2) of the two given points. Returns
 * that new Point.
 */
export function pointDifference(point1: Point, point2: Point): Point {
    return [point1[0] - point2[0], point1[1] - point2[1]];
}

/**
 * Creates a new Point that is the difference (point1 - point2) of the two given points. Returns
 * that new Point.
 */
export function pointDifferenceWorklet(point1: Point, point2: Point): Point {
    "worklet";
    return [point1[0] - point2[0], point1[1] - point2[1]];
}

/**
 * Creates a new Point that the scaled version of the given point. Returns that new Point.
 */
export function pointScale(point: Point, scalar: number): Point {
    return [point[0] * scalar, point[1] * scalar];
}

/**
 * Creates a new Point that the scaled version of the given point. Returns that new Point.
 */
export function pointScaleWorklet(point: Point, scalar: number): Point {
    "worklet";
    return [point[0] * scalar, point[1] * scalar];
}

/**
 * Returns the distance between the two given points.
 */
export function distanceBetweenPoints(point1: Point, point2: Point): number {
    return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2);
}

/**
 * Returns the distance between the two given points.
 */
export function distanceBetweenPointsWorklet(point1: Point, point2: Point): number {
    "worklet";
    return ((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2) ** 0.5;
}

/**
 * Returns true if the given point lies on the given line segment, false otherwise.
 */
export function isPointOnLineSegment(point: Point, lineSegment: LineSegment): boolean {
    const d = distanceBetweenPoints(...lineSegment);
    const d1 = distanceBetweenPoints(point, lineSegment[0]);
    const d2 = distanceBetweenPoints(point, lineSegment[1]);

    return isApproximatelyEqual(d, d1 + d2);
}

/**
 * Returns true if the given point lies on the given line segment, false otherwise.
 */
export function isPointOnLineSegmentWorklet(point: Point, lineSegment: LineSegment): boolean {
    "worklet";
    const d = distanceBetweenPointsWorklet(...lineSegment);
    const d1 = distanceBetweenPointsWorklet(point, lineSegment[0]);
    const d2 = distanceBetweenPointsWorklet(point, lineSegment[1]);

    return isApproximatelyEqualWorklet(d, d1 + d2);
}

/**
 * Returns the given point's (in grid cell units) nearest grid point.
 */
export function nearestGridPoint(point: Point): Point {
    return [Math.round(point[0]), Math.round(point[1])];
}

/**
 * Returns the given point's (in grid cell units) nearest grid point.
 */
export function nearestGridPointWorklet(point: Point): Point {
    "worklet";
    return [Math.round(point[0]), Math.round(point[1])];
}