import { isPointOnLineSegment, pointDifference, pointDifferenceWorklet } from "./point";

/**
 * Returns true if the inner line segment lies inside the outer line segment.
 */
export function isLineSegmentInsideLineSegment(
    innerLineSegment: LineSegment, 
    outerLineSegment: LineSegment
): boolean {
    return isPointOnLineSegment(innerLineSegment[0], outerLineSegment) && 
        isPointOnLineSegment(innerLineSegment[1], outerLineSegment);
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
            points.push([x, y]);
        }
    }

    return points;
}