import { isApproximatelyEqual, isApproximatelyEqualWorklet } from "./number";

/**
 * Creates a new Point that is the sum of the two given points. Returns that new Point.
 */
export function pointSum(point1: Point, point2: Point): Point {
    return [point1[0] + point2[0], point1[1] + point2[1]];
}

export function pointSumWorklet(point1: Point, point2: Point): Point {
    "worklet"
    return [point1[0] + point2[0], point1[1] + point2[1]];
}

export function pointDifference(point1: Point, point2: Point): Point {
    return [point1[0] - point2[0], point1[1] - point2[1]];
}

export function pointDifferenceWorklet(point1: Point, point2: Point): Point {
    "worklet";
    return [point1[0] - point2[0], point1[1] - point2[1]];
}

export function pointScale(point: Point, scalar: number): Point {
    return [point[0] * scalar, point[1] * scalar];
}

export function pointScaleWorklet(point: Point, scalar: number): Point {
    "worklet";
    return [point[0] * scalar, point[1] * scalar];
}

export function distanceBetweenPoints(point1: Point, point2: Point): number {
    return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2);
}

export function distanceBetweenPointsWorklet(point1: Point, point2: Point): number {
    "worklet";
    return ((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2) ** 0.5;
}

export function isPointOnLineSegment(point: Point, lineSegment: [Point, Point]): boolean {
    const d = distanceBetweenPoints(...lineSegment);
    const d1 = distanceBetweenPoints(point, lineSegment[0]);
    const d2 = distanceBetweenPoints(point, lineSegment[1]);

    return isApproximatelyEqual(d, d1 + d2);
}

export function isPointOnLineSegmentWorklet(point: Point, lineSegment: [Point, Point]): boolean {
    "worklet";

    const d = distanceBetweenPointsWorklet(...lineSegment);
    const d1 = distanceBetweenPointsWorklet(point, lineSegment[0]);
    const d2 = distanceBetweenPointsWorklet(point, lineSegment[1]);

    return isApproximatelyEqualWorklet(d, d1 + d2);
}

export function isPointInsidePolygon(point: Point, polygon: Polygon): boolean {
    point = pointDifference(point, polygon.origin);
    let intersections = 0;

    for (let i = 0; i < polygon.vertices.length; i++) {
        const currentVertex = polygon.vertices[i];
        const nextVertex = polygon.vertices[(i + 1) % polygon.vertices.length];

        if (isPointOnLineSegment(point, [currentVertex, nextVertex])) return true;

        const [lowerVertex, upperVertex] = currentVertex[1] <= nextVertex[1] ?
            [currentVertex, nextVertex] : [nextVertex, currentVertex];

        if (point[1] < lowerVertex[1] || point[1] >= upperVertex[1]) continue;

        const intersectX = lowerVertex[0] + ((point[1] - lowerVertex[1]) * (upperVertex[0] - lowerVertex[0]) / (upperVertex[1] - lowerVertex[1]));

        if (intersectX > point[0]) intersections++;
    }

    return intersections % 2 !== 0;
}

export function isPointInsidePolygonWorklet(point: Point, polygon: Polygon): boolean {
    "worklet";
    point = pointDifferenceWorklet(point, polygon.origin);
    let intersections = 0;

    console.log(point);

    for (let i = 0; i < polygon.vertices.length; i++) {
        const currentVertex = polygon.vertices[i];
        const nextVertex = polygon.vertices[(i + 1) % polygon.vertices.length];

        if (isPointOnLineSegmentWorklet(point, [currentVertex, nextVertex])) return true;

        const [lowerVertex, upperVertex] = currentVertex[1] <= nextVertex[1] ?
            [currentVertex, nextVertex] : [nextVertex, currentVertex];

        if (point[1] < lowerVertex[1] || point[1] >= upperVertex[1]) continue;

        const intersectX = lowerVertex[0] + ((point[1] - lowerVertex[1]) * (upperVertex[0] - lowerVertex[0]) / (upperVertex[1] - lowerVertex[1]));

        if (intersectX > point[0]) intersections++;
    }

    return intersections % 2 !== 0;
}

export function nearestGridPoint(point: Point): Point {
    return [Math.round(point[0]), Math.round(point[1])];
}

export function nearestGridPointWorklet(point: Point): Point {
    "worklet";
    return [Math.round(point[0]), Math.round(point[1])];
}