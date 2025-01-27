import { getPolygonEdges, getPolygonEdgesWorklet } from ".";
import { isPointInLineSegment, isPointInLineSegmentWorklet } from "../lineSegment/andPoint";

/**
 * Returns true if the given absolute point lies in the given polygon, false otherwise. If
 * includeEdges is true (default), points lying on a polygon's edges are in the polygon, otherwise
 * they are outside.
 */
export function isPointInPolygon(point: Point, polygon: Polygon, includeEdges = true): boolean {
    let intersections = 0;

    for (const edge of getPolygonEdges(polygon)) {
        if (isPointInLineSegment(point, edge)) return includeEdges;

        const [lowerVertex, upperVertex] = edge[0][1] <= edge[1][1] ?
            edge : [edge[1], edge[0]];

        if (point[1] < lowerVertex[1] || point[1] >= upperVertex[1]) continue;

        const intersectX = lowerVertex[0] + 
            (point[1] - lowerVertex[1]) * (upperVertex[0] - lowerVertex[0]) / 
            (upperVertex[1] - lowerVertex[1]);

        if (intersectX > point[0]) intersections++
    }

    return intersections % 2 !== 0;
}

/**
 * Returns true if the given absolute point lies in the given polygon, false otherwise. If
 * includeEdges is true (default), points lying on a polygon's edges are in the polygon, otherwise
 * they are outside.
 */
export function isPointInPolygonWorklet(point: Point, polygon: Polygon, includeEdges = true): boolean {
    "worklet";
    let intersections = 0;

    for (const edge of getPolygonEdgesWorklet(polygon)) {
        if (isPointInLineSegmentWorklet(point, edge)) return includeEdges;

        const [lowerVertex, upperVertex] = edge[0][1] <= edge[1][1] ?
            edge : [edge[1], edge[0]];

        if (point[1] < lowerVertex[1] || point[1] >= upperVertex[1]) continue;

        const intersectX = lowerVertex[0] + 
            (point[1] - lowerVertex[1]) * (upperVertex[0] - lowerVertex[0]) / 
            (upperVertex[1] - lowerVertex[1]);

        if (intersectX > point[0]) intersections++
    }

    return intersections % 2 !== 0;
}