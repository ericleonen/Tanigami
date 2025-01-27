import { scalePoint, scalePointWorklet } from "../point";
import { addPoints, addPointsWorklet } from "../point/andPoint";

/**
 * Returns a list of all points with integer coordinates on the given line segment. 
 */
export function getIntegerPointsOnLineSegment(lineSegment: LineSegment): Point[] {
    const points: Point[] = [];
    const isVertical = lineSegment[0][0] === lineSegment[1][0];

    if (isVertical) {
        const x = lineSegment[0][0];
        const minY = Math.ceil(Math.min(lineSegment[0][1], lineSegment[1][1]));
        const maxY = Math.floor(Math.max(lineSegment[0][1], lineSegment[1][1]));

        for (let y = minY; y <= maxY; y++) {
            points.push([x, y]);
        }
    } else {
        const minX = Math.ceil(Math.min(lineSegment[0][0], lineSegment[1][0]));
        const maxX = Math.floor(Math.max(lineSegment[0][0], lineSegment[1][0]));
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
    return scalePoint(0.5, addPoints(...lineSegment));
}

/**
 * Returns the midpoint of the given line segment.
 */
export function getLineSegmentMidpointWorklet(lineSegment: LineSegment): Point {
    "worklet";
    return scalePointWorklet(0.5, addPointsWorklet(...lineSegment));
}