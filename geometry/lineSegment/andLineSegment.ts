import { arePointsEqual, arePointsEqualWorklet, subtractPoints, subtractPointsWorklet } from "../point/andPoint";

/**
 * Returns true if the given line segments are exactly equal to eachother.
 */
export function areLineSegmentsEqual(
    lineSegment1: LineSegment, 
    lineSegment2: LineSegment
): boolean {
    return arePointsEqual(lineSegment1[0], lineSegment2[0]) && 
        arePointsEqual(lineSegment1[1], lineSegment2[1]);
}

/**
 * Returns true if the given line segments are exactly equal to eachother.
 */
export function areLineSegmentsEqualWorklet(
    lineSegment1: LineSegment, 
    lineSegment2: LineSegment
): boolean {
    "worklet";
    return arePointsEqualWorklet(lineSegment1[0], lineSegment2[0]) && 
        arePointsEqualWorklet(lineSegment1[1], lineSegment2[1]);
}

/**
 * Returns true if the given line segments intersect at a single point, false otherwise. Note that
 * parallel line segments never intersect. If includeInteriorEndpoint is true (default),
 * intersections that occur between one line segment's interior and another line segment's
 * endpoints are valid, otherwise they are not. If includeEndpointEndpoint is true (default),
 * intersections that occur between line segments' endpoints are valid, otherwise they are not. 
 */
export function doLineSegmentsIntersect(
    lineSegment1: LineSegment, 
    lineSegment2: LineSegment,
    includeInteriorEndpoint = true,
    includeEndpointEndpoint = true
): boolean {
    const vector1 = subtractPoints(lineSegment1[1], lineSegment1[0]);
    const vector2 = subtractPoints(lineSegment2[1], lineSegment2[0]);

    const determinant = vector1[0] * vector2[1] - vector1[1] * vector2[0];

    if (determinant != 0) {
        const dx = lineSegment1[0][0] - lineSegment2[0][0];
        const dy = lineSegment1[0][1] - lineSegment2[0][1];

        const s = (vector2[0] * dy - vector2[1] * dx) / determinant;
        const t = (vector1[0] * dy - vector1[1] * dx) / determinant;
    
        if (0 < s && s < 1 && 0 < t && t < 1) {
            return true;
        } else if ([0, 1].includes(s) && [0, 1].includes(t)) {
            return includeEndpointEndpoint;
        } else if (0 <= s && s <= 1 && 0 <= t && t <= 1) {
            return includeInteriorEndpoint;
        }
    }

    return false;
}

/**
 * Returns true if the given line segments intersect at a single point, false otherwise. Note that
 * parallel line segments never intersect. If includeInteriorEndpoint is true (default),
 * intersections that occur between one line segment's interior and another line segment's
 * endpoints are valid, otherwise they are not. If includeEndpointEndpoint is true (default),
 * intersections that occur between line segments' endpoints are valid, otherwise they are not. 
 */
export function doLineSegmentsIntersectWorklet(
    lineSegment1: LineSegment, 
    lineSegment2: LineSegment,
    includeInteriorEndpoint = true,
    includeEndpointEndpoint = true
): boolean {
    "worklet";
    const vector1 = subtractPointsWorklet(lineSegment1[1], lineSegment1[0]);
    const vector2 = subtractPointsWorklet(lineSegment2[1], lineSegment2[0]);

    const determinant = vector1[0] * vector2[1] - vector1[1] * vector2[0];

    if (determinant != 0) {
        const dx = lineSegment1[0][0] - lineSegment2[0][0];
        const dy = lineSegment1[0][1] - lineSegment2[0][1];

        const s = (vector2[0] * dy - vector2[1] * dx) / determinant;
        const t = (vector1[0] * dy - vector1[1] * dx) / determinant;
    
        if (0 < s && s < 1 && 0 < t && t < 1) {
            return true;
        } else if ([0, 1].includes(s) && [0, 1].includes(t)) {
            return includeEndpointEndpoint;
        } else if (0 <= s && s <= 1 && 0 <= t && t <= 1) {
            return includeInteriorEndpoint;
        }
    }

    return false;
}