import { doLineSegmentsIntersect, doLineSegmentsIntersectWorklet, getGridPointsOnLineSegment, isLineSegmentInsideLineSegment } from "./lineSegment";
import { isPointOnLineSegment, isPointOnLineSegmentWorklet, pointDifference, pointDifferenceWorklet, pointSum, pointSumWorklet } from "./point";

/**
 * Returns the dimensions (rows and columns) of the given polygon. 
 */
export function getPolygonDimensions(polygon: Polygon): Dimensions {
    if (polygon.dimensions) return polygon.dimensions;

    let maxX = 0;
    let maxY = 0;

    polygon.vertices.forEach(vertex => {
        maxX = Math.max(maxX, vertex[0]);
        maxY = Math.max(maxY, vertex[1]);
    });

    polygon.dimensions = {
        rows: maxY,
        columns: maxX
    };

    return polygon.dimensions;
}

/**
 * Returns the dimensions (rows and columns) of the given polygon. 
 */
export function getPolygonDimensionsWorklet(polygon: Polygon): Dimensions {
    "worklet";
    if (polygon.dimensions) return polygon.dimensions;

    let maxX = 0;
    let maxY = 0;

    polygon.vertices.forEach(vertex => {
        maxX = Math.max(maxX, vertex[0]);
        maxY = Math.max(maxY, vertex[1]);
    });

    polygon.dimensions = {
        rows: maxY,
        columns: maxX
    };

    return polygon.dimensions;
}

/**
 * Returns a list of absolute vertices of the given polygon.
 */
export function getAbsolutePolygonVertices(polygon: Polygon): Point[] {
    return polygon.vertices.map(vertex => pointSum(polygon.origin, vertex));
}

/**
 * Returns a list of absolute vertices of the given polygon.
 */
export function getAbsolutePolygonVerticesWorklet(polygon: Polygon): Point[] {
    "worklet";
    return polygon.vertices.map(vertex => pointSumWorklet(polygon.origin, vertex));
}

/**
 * Returns a list of absolute edges of the given polygon.
 */
export function getPolygonEdges(polygon: Polygon): LineSegment[] {
    const vertices = getAbsolutePolygonVertices(polygon);

    return vertices.map((vertex, i) => {
        const nextVertex = vertices[(i + 1) % vertices.length];

        return [vertex, nextVertex];
    });
}

/**
 * Returns a list of absolute edges of the given polygon.
 */
export function getPolygonEdgesWorklet(polygon: Polygon): LineSegment[] {
    "worklet"
    const vertices = getAbsolutePolygonVerticesWorklet(polygon);

    return vertices.map((vertex, i) => {
        const nextVertex = vertices[(i + 1) % vertices.length];

        return [vertex, nextVertex];
    });
}

/**
 * Returns true if the given point (absolute) lies on an edge of the given polygon, false
 * otherwise.
 */
export function isPointOnPolygonEdges(point: Point, polygon: Polygon): boolean {
    const edges = getPolygonEdges(polygon);

    return edges.some(edge => isPointOnLineSegment(point, edge));
}

/**
 * Returns true if the given point (absolute) lies inside the given polygon, false otherwise. If
 * and only if includeEdges = true (default), points lying on the polygon's edges are inside the
 * polygon.
 */
export function isPointInsidePolygon(point: Point, polygon: Polygon, includeEdges = true): boolean {
    let intersections = 0;

    for (const edge of getPolygonEdges(polygon)) {
        if (isPointOnLineSegment(point, edge)) return includeEdges;

        const [lowerVertex, upperVertex] = edge[0][1] <= edge[1][1] ?
            edge : [edge[1], edge[0]];

        if (point[1] < lowerVertex[1] || point[1] >= upperVertex[1]) continue;

        const intersectX = lowerVertex[0] + 
            (point[1] - lowerVertex[1]) * (upperVertex[0] - lowerVertex[0]) / (upperVertex[1] - lowerVertex[1]);

        if (intersectX > point[0]) intersections++
    }

    return intersections % 2 !== 0;
}

/**
 * Returns true if the given point (absolute) lies inside the given polygon, false otherwise. If
 * and only if includeEdges = true (default), points lying on the polygon's edges are inside the
 * polygon.
 */
export function isPointInsidePolygonWorklet(point: Point, polygon: Polygon, includeEdges = true): boolean {
    "worklet"
    let intersections = 0;

    for (const edge of getPolygonEdgesWorklet(polygon)) {
        if (isPointOnLineSegmentWorklet(point, edge)) return includeEdges;

        const [lowerVertex, upperVertex] = edge[0][1] <= edge[1][1] ?
            edge : [edge[1], edge[0]];

        if (point[1] < lowerVertex[1] || point[1] >= upperVertex[1]) continue;

        const intersectX = lowerVertex[0] + 
            (point[1] - lowerVertex[1]) * (upperVertex[0] - lowerVertex[0]) / (upperVertex[1] - lowerVertex[1]);

        if (intersectX > point[0]) intersections++
    }

    return intersections % 2 !== 0;
}

/**
 * Returns true if the inside polygon lies inside the outer polygon, false otherwise. The inside
 * polygon can share (part) of an edge of the outer polygon and still be considered inside.
 */
export function isPolygonInsidePolygon(insidePolygon: Polygon, outsidePolygon: Polygon): boolean {
    const insideVertices = getAbsolutePolygonVertices(insidePolygon);

    // all points of the inside polygon are inside the outside polygon
    if (insideVertices.some(vertex => !isPointInsidePolygon(vertex, outsidePolygon))) {
        return false;
    }

    // no edges between the inside and outside polygons intersect
    return !getPolygonEdges(insidePolygon).some(insideEdge => {
        return getPolygonEdges(outsidePolygon).some(outsideEdge => (
            doLineSegmentsIntersect(insideEdge, outsideEdge)
        ));
    });
}

/**
 * Returns true if the inside polygon lies inside the outer polygon, false otherwise. The inside
 * polygon can share (part) of an edge of the outer polygon and still be considered inside.
 */
export function isPolygonInsidePolygonWorklet(insidePolygon: Polygon, outsidePolygon: Polygon): boolean {
    "worklet";
    const insideVertices = getAbsolutePolygonVerticesWorklet(insidePolygon);

    // all points of the inside polygon are inside the outside polygon
    if (insideVertices.some(vertex => !isPointInsidePolygonWorklet(vertex, outsidePolygon))) {
        return false;
    }

    // no edges between the inside and outside polygons intersect
    return !getPolygonEdgesWorklet(insidePolygon).some(insideEdge => {
        return getPolygonEdgesWorklet(outsidePolygon).some(outsideEdge => (
            doLineSegmentsIntersectWorklet(insideEdge, outsideEdge)
        ));
    });
}

/**
 * Returns true if the given edge lies on an edge (abslute) of the given polygon.
 */
export function doesPolygonContainEdge(polygon: Polygon, edge: LineSegment): boolean {
    return getPolygonEdges(polygon).some(
        polygonEdge => isLineSegmentInsideLineSegment(edge, polygonEdge)
    );
}

/**
 * Returns the area of the given polygon. 
 */
export function getPolygonArea(polygon: Polygon): number {
    if (polygon.area) return polygon.area;

    polygon.area = 0;

    polygon.vertices.forEach((currentVertex, i) => {
        const prevVertex = polygon.vertices[(i - 1 + polygon.vertices.length) % polygon.vertices.length];
        const nextVertex = polygon.vertices[(i + 1) % polygon.vertices.length];

        polygon.area! += currentVertex[1] * (prevVertex[0] - nextVertex[0]);
    });

    return polygon.area /= 2;
}

/**
 * Returns a list of all grid points that lie on the given polygon
 */
export function getGridPointsOnPolygonEdges(polygon: Polygon): Point[] {
    return getPolygonEdges(polygon).reduce((points, edge) => {
        points.push(...getGridPointsOnLineSegment(edge));
        points.pop();

        return points;
    }, [] as Point[]);
}