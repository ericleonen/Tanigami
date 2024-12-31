import { isBetween } from "./number";

/**
 * Creates a new Point that is the sum of the two given points. Returns that new Point.
 */
export function pointSum(point1: Point, point2: Point): Point {
    return [point1[0] + point2[0], point1[1] + point2[1]];
}

export function pointDifference(point1: Point, point2: Point): Point {
    return [point1[0] - point2[0], point1[1] - point2[1]];
}

export function pointScale(point: Point, scalar: number): Point {
    return [point[0] * scalar, point[1] * scalar];
}

export function isPointRightOfLine(point: Point, line: [Point, Point]): boolean {
    if (line[0][1] === line[1][1]) return false;
    
    return (
        point[0] - line[0][0] <
        (line[1][1] - line[0][1]) * (point[1] - line[0][1]) / (line[1][1] - line[0][1])
    );
}

export function isPointInsidePolygon(point: Point, polygon: Polygon): boolean {
    point = pointDifference(point, polygon.origin || [0, 0]);
    const numVertices = polygon.vertices.length;
    let inside = false;

    for (let i = 0; i < numVertices; i++) {
        const j = (i + 1) % numVertices;

        const point1 = polygon.vertices[i];
        const point2 = polygon.vertices[j];

        const intersect = 
            isBetween(point[1], [point1[1], point2[1]]) &&
            isPointRightOfLine(point, [point1, point2]);

        if (intersect) inside = !inside;
    }

    return inside;
}

export function distanceBetweenPoints(point1: Point, point2: Point): number {
    return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2);
}

export function nearestGridPoint(point: Point): Point {
    return [Math.round(point[0]), Math.round(point[1])];
}