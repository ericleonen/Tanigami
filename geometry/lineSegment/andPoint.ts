import { areApproximatelyEqual, areApproximatelyEqualWorklet } from "../number";
import { scalePoint } from "../point";
import { addPoints, getDistanceBetweenPoints, getDistanceBetweenPointsWorklet, subtractPoints } from "../point/andPoint";
import { getVectorMagnitude } from "../vector";
import { dot } from "../vector/andVector";

/**
 * Returns true if the given point lies in the given line segment, false otherwise. If
 * includeEndpoints is true (default), points lying exactly on the line segment's endpoints are
 * considered to be in the line segment, otherwise they are not.
 */
export function isPointInLineSegment(point: Point, lineSegment: LineSegment, includeEndpoints = true): boolean {
    const d = getDistanceBetweenPoints(...lineSegment);
    const d1 = getDistanceBetweenPoints(point, lineSegment[0]);
    const d2 = getDistanceBetweenPoints(point, lineSegment[1]);

    if (d1 === 0 || d2 === 0) {
        return includeEndpoints;
    }

    return areApproximatelyEqual(d, d1 + d2);
}

/**
 * Returns true if the given point lies in the given line segment, false otherwise. If
 * includeEndpoints is true (default), points lying exactly on the line segment's endpoints are
 * considered to be in the line segment, otherwise they are not.
 */
export function isPointInLineSegmentWorklet(point: Point, lineSegment: LineSegment, includeEndpoints = true): boolean {
    "worklet";
    const d = getDistanceBetweenPointsWorklet(...lineSegment);
    const d1 = getDistanceBetweenPointsWorklet(point, lineSegment[0]);
    const d2 = getDistanceBetweenPointsWorklet(point, lineSegment[1]);

    if (d1 === 0 || d2 === 0) {
        return includeEndpoints;
    }

    return areApproximatelyEqualWorklet(d, d1 + d2);
}

/**
 * Returns the point on the given line segment closest to the given point.
 */
export function getNearestPointOnLineSegmentToPoint(point: Point, lineSegment: LineSegment): Point {
    const p = subtractPoints(point, lineSegment[0]) as Vector;
    const l = subtractPoints(lineSegment[1], lineSegment[0]) as Vector;

    const t = dot(p, l) / getVectorMagnitude(l)**2;

    if (t <= 0) {
        return lineSegment[0];
    } else if (t >= 1) {
        return lineSegment[1];
    } else {
        return addPoints(lineSegment[0], scalePoint(t, l));
    }
}

/**
 * Returns the shortest distance between the given point and line segment.
 */
export function getDistanceBetweenPointAndLineSegment(point: Point, lineSegment: LineSegment): number {
    const nearestPoint = getNearestPointOnLineSegmentToPoint(point, lineSegment);

    return getDistanceBetweenPoints(point, nearestPoint);
}