/**
 * Creates a new Point that is the sum of the two given points. Returns that new Point.
 */
export function pointSum(point1: Point, point2: Point): Point {
    return [point1[0] + point2[0], point1[1] + point2[1]];
}