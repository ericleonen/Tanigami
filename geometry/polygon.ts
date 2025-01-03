import { isPointInsidePolygon, isPointInsidePolygonWorklet, isPointOnLineSegment, pointDifference, pointDifferenceWorklet, pointSum, pointSumWorklet } from "./point";

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
 * Returns true if the given edges intersect, false otherwise. Intersections at endpoints do not
 * count. Parallel edges (even overlapping ones) can never intersect.
 */
export function doEdgesIntersect(edge1: LineSegment, edge2: LineSegment): boolean {
    const vector1 = pointDifference(edge1[1], edge1[0]);
    const vector2 = pointDifference(edge2[1], edge2[0]);

    const determinant = vector1[0] * vector2[1] - vector1[1] * vector2[0];

    if (determinant != 0) {
        const dx = edge1[0][0] - edge2[0][0];
        const dy = edge1[0][1] - edge2[0][1];

        const s = (vector2[0] * dy - vector2[1] * dx) / determinant;
        const t = (vector1[0] * dy - vector1[1] * dx) / determinant;
    
        if (0 < s && s < 1 && 0 < t && t < 1) {
            return true;
        }
    }

    return false;
}

/**
 * Returns true if the given edges intersect, false otherwise. Intersections at endpoints do not
 * count. Parallel edges (even overlapping ones) can never intersect.
 */
export function doEdgesIntersectWorklet(edge1: LineSegment, edge2: LineSegment): boolean {
    "worklet";
    const vector1 = pointDifferenceWorklet(edge1[1], edge1[0]);
    const vector2 = pointDifferenceWorklet(edge2[1], edge2[0]);

    const determinant = vector1[0] * vector2[1] - vector1[1] * vector2[0];

    if (determinant != 0) {
        const dx = edge1[0][0] - edge2[0][0];
        const dy = edge1[0][1] - edge2[0][1];

        const s = (vector2[0] * dy - vector2[1] * dx) / determinant;
        const t = (vector1[0] * dy - vector1[1] * dx) / determinant;
    
        if (0 < s && s < 1 && 0 < t && t < 1) {
            return true;
        }
    }

    return false;
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
            doEdgesIntersect(insideEdge, outsideEdge)
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
            doEdgesIntersectWorklet(insideEdge, outsideEdge)
        ));
    });
}

/**
 * Returns true if the given polygon lies inside the given shape. The polygon can share (part)
 * of an edge of the shape and still be considered inside.
 */
export function isPolygonInsideShape(polygon: Polygon, shape: Shape): boolean {
    return shape.some(shapePolygon => isPolygonInsidePolygon(polygon, shapePolygon));
}

/**
 * Returns true if the given polygon lies inside the given shape. The polygon can share (part)
 * of an edge of the shape and still be considered inside.
 */
export function isPolygonInsideShapeWorklet(polygon: Polygon, shape: Shape): boolean {
    "worklet";
    return shape.some(shapePolygon => isPolygonInsidePolygonWorklet(polygon, shapePolygon));
}

/**
 * Returns true if the given edge lies on an edge (abslute) of the given polygon.
 */
export function doesPolygonContainEdge(polygon: Polygon, edge: LineSegment): boolean {
    return getPolygonEdges(polygon).some(
        polygonEdge => doesEdgeContainEdge(edge, polygonEdge)
    );
}

/**
 * Returns true if the inner edge lies on the outer edge.
 */
export function doesEdgeContainEdge(innerEdge: LineSegment, outerEdge: LineSegment): boolean {
    return isPointOnLineSegment(innerEdge[0], outerEdge) && 
        isPointOnLineSegment(innerEdge[1], outerEdge);
}