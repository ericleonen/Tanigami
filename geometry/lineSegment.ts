import { isApproximatelyEqual, isApproximatelyEqualWorklet } from "./number";
import { arePointsEqual, arePointsEqualWorklet, distanceBetweenPoints, distanceBetweenPointsWorklet, pointDifference, pointDifferenceWorklet, pointScale, pointScaleWorklet, pointSum, pointSumWorklet } from "./point";
import { dot, getVectorMagnitude } from "./vector";

/**
 * Returns true if the given point lies on the given line segment, false otherwise.
 */
export function isPointOnLineSegment(point: Point, lineSegment: LineSegment, includeEndpoints = true): boolean {
    const d = distanceBetweenPoints(...lineSegment);
    const d1 = distanceBetweenPoints(point, lineSegment[0]);
    const d2 = distanceBetweenPoints(point, lineSegment[1]);

    if (d1 === 0 || d2 === 0) {
        return includeEndpoints;
    }

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

export function areLineSegmentsEqual(lineSegment1: LineSegment, lineSegment2: LineSegment): boolean {
    return arePointsEqual(lineSegment1[0], lineSegment2[0]) && 
        arePointsEqual(lineSegment1[1], lineSegment2[1]);
}

export function areLineSegmentsEqualWorklet(lineSegment1: LineSegment, lineSegment2: LineSegment): boolean {
    "worklet";
    return arePointsEqualWorklet(lineSegment1[0], lineSegment2[0]) && 
        arePointsEqualWorklet(lineSegment1[1], lineSegment2[1]);
}

/**
 * Returns true if the inner line segment lies inside the outer line segment.
 */
export function isLineSegmentInsideLineSegment(
    innerLineSegment: LineSegment, 
    outerLineSegment: LineSegment,
    allowEquals = true
): boolean {
    if (areLineSegmentsEqual(innerLineSegment, outerLineSegment)) {
        return allowEquals;
    } else {
        return isPointOnLineSegment(innerLineSegment[0], outerLineSegment) && 
            isPointOnLineSegment(innerLineSegment[1], outerLineSegment);
    }
}

/**
 * Returns true if the inner line segment lies inside the outer line segment.
 */
export function isLineSegmentInsideLineSegmentWorklet(
    innerLineSegment: LineSegment, 
    outerLineSegment: LineSegment,
    allowEquals = true
): boolean {
    "worklet";
    if (areLineSegmentsEqualWorklet(innerLineSegment, outerLineSegment)) {
        return allowEquals;
    } else {
        return isPointOnLineSegmentWorklet(innerLineSegment[0], outerLineSegment) && 
            isPointOnLineSegmentWorklet(innerLineSegment[1], outerLineSegment);
    }
}

/**
 * Returns true if the given line segments intersect, false otherwise. Intersections at endpoints
 * do not count. Parallel line segments (even overlapping ones) can never intersect.
 */
export function doLineSegmentsIntersect(lineSegment1: LineSegment, lineSegment2: LineSegment): boolean {
    const vector1 = pointDifference(lineSegment1[1], lineSegment1[0]);
    const vector2 = pointDifference(lineSegment2[1], lineSegment2[0]);

    const determinant = vector1[0] * vector2[1] - vector1[1] * vector2[0];

    if (determinant != 0) {
        const dx = lineSegment1[0][0] - lineSegment2[0][0];
        const dy = lineSegment1[0][1] - lineSegment2[0][1];

        const s = (vector2[0] * dy - vector2[1] * dx) / determinant;
        const t = (vector1[0] * dy - vector1[1] * dx) / determinant;
    
        if (0 < s && s < 1 && 0 < t && t < 1) {
            return true;
        }
    }

    return false;
}

/**
 * Returns true if the given line segments intersect, false otherwise. Intersections at endpoints
 * do not count. Parallel line segments (even overlapping ones) can never intersect.
 */
export function doLineSegmentsIntersectWorklet(lineSegment1: LineSegment, lineSegment2: LineSegment): boolean {
    "worklet"
    const vector1 = pointDifferenceWorklet(lineSegment1[1], lineSegment1[0]);
    const vector2 = pointDifferenceWorklet(lineSegment2[1], lineSegment2[0]);

    const determinant = vector1[0] * vector2[1] - vector1[1] * vector2[0];

    if (determinant != 0) {
        const dx = lineSegment1[0][0] - lineSegment2[0][0];
        const dy = lineSegment1[0][1] - lineSegment2[0][1];

        const s = (vector2[0] * dy - vector2[1] * dx) / determinant;
        const t = (vector1[0] * dy - vector1[1] * dx) / determinant;
    
        if (0 < s && s < 1 && 0 < t && t < 1) {
            return true;
        }
    }

    return false;
}

/**
 * Returns a list of grid points on the given line segment. 
 */
export function getGridPointsOnLineSegment(lineSegment: LineSegment): Point[] {
    const points: Point[] = [];
    const isVertical = lineSegment[0][0] === lineSegment[1][0];

    if (isVertical) {
        const x = lineSegment[0][0];
        const minY = Math.min(lineSegment[0][1], lineSegment[1][1]);
        const maxY = Math.max(lineSegment[0][1], lineSegment[1][1]);

        for (let y = minY; y <= maxY; y++) {
            points.push([x, y]);
        }
    } else {
        const minX = Math.min(lineSegment[0][0], lineSegment[1][0]);
        const maxX = Math.max(lineSegment[0][0], lineSegment[1][0]);
        const slope = (lineSegment[0][1] - lineSegment[1][1]) / 
            (lineSegment[0][0] - lineSegment[1][0]);
        const equation = (x: number) => slope * (x - lineSegment[0][0]) + lineSegment[0][1];

        for (let x = minX; x <= maxX; x++) {
            const y = equation(x);

            if (y % 1 !== 0) continue

            points.push([x, y]);
        }
    }

    return points;
}

/**
 * Returns the midpoint of the given line segment.
 */
export function getLineSegmentMidpoint(lineSegment: LineSegment): Point {
    return pointScale(pointSum(...lineSegment), 0.5);
}

/**
 * Returns the midpoint of the given line segment.
 */
export function getLineSegmentMidpointWorklet(lineSegment: LineSegment): Point {
    "worklet";
    return pointScaleWorklet(pointSumWorklet(...lineSegment), 0.5);
}

/**
 * Returns the point on the given line segment closest to the given point.
 */
export function getNearestPointOnLineSegmentToPoint(point: Point, lineSegment: LineSegment): Point {
    const p = pointDifference(point, lineSegment[0]) as Vector;
    const l = pointDifference(lineSegment[1], lineSegment[0]) as Vector;

    const t = dot(p, l) / getVectorMagnitude(l)**2;

    if (t <= 0) {
        return lineSegment[0];
    } else if (t >= 1) {
        return lineSegment[1];
    } else {
        return pointSum(lineSegment[0], pointScale(l, t));
    }
}

export function getDistanceBetweenPointAndLineSegment(point: Point, lineSegment: LineSegment): number {
    const nearestPoint = getNearestPointOnLineSegmentToPoint(point, lineSegment);

    return distanceBetweenPoints(point, nearestPoint);
}