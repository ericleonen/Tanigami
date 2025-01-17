import { doLineSegmentsIntersect, doLineSegmentsIntersectWorklet, getDistanceBetweenPointAndLineSegment, getGridPointsOnLineSegment, getLineSegmentMidpoint, isLineSegmentInsideLineSegment } from "./lineSegment";
import { arePointsEqual, pointDifference, pointScale, pointSum, pointSumWorklet } from "./point";
import { isPointOnLineSegment, isPointOnLineSegmentWorklet } from "./lineSegment"
import { getAngleBetweenVectors } from "./vector";

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
 * Returns a list of absolute (or relative) edges of the given polygon.
 */
export function getPolygonEdges(polygon: Polygon, relative = false): LineSegment[] {
    const vertices = relative ? polygon.vertices : getAbsolutePolygonVertices(polygon);

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
 * Returns the area of the given polygon. If signed is true (default false), the returned area is
 * negative if the polygon is oriented counter clockwise, and positive if it is oriented clockwise.
 */
export function getPolygonArea(polygon: Polygon, signed = false): number {
    if (polygon.signedArea) return polygon.signedArea;

    polygon.signedArea = 0;

    polygon.vertices.forEach((currentVertex, i) => {
        const prevVertex = polygon.vertices[(i - 1 + polygon.vertices.length) % polygon.vertices.length];
        const nextVertex = polygon.vertices[(i + 1) % polygon.vertices.length];

        polygon.signedArea! += currentVertex[1] * (prevVertex[0] - nextVertex[0]);
    });

    polygon.signedArea /= 2;

    return signed ? polygon.signedArea : Math.abs(polygon.signedArea);
}

/**
 * Returns a list of all absolute grid points that lie on the given polygon.
 */
export function getGridPointsOnPolygonEdges(polygon: Polygon): Point[] {
    return getPolygonEdges(polygon).reduce((points, edge) => {
        points.push(...getGridPointsOnLineSegment(edge));
        points.pop();

        return points;
    }, [] as Point[]);
}

/**
 * Returns the given polygon with its vertices and origin standardized. The first vertex will have
 * the least y value (and least x value if there are ties). All points are relative to this
 * polygon's origin. The polygon's vertices are ordered in a clockwise fashion. The origin is the
 * top left point of the polygon's box.
 */
export function standardizePolygon(polygon: Polygon): Polygon {
    if (polygon.vertices.length <= 2) {
        console.log(polygon.vertices);
        throw Error();
    }

    const absoluteVertices = getAbsolutePolygonVertices(polygon);
    const origin = absoluteVertices.reduce((originCandidate, vertex) => {
        originCandidate[0] = Math.min(originCandidate[0], vertex[0]);
        originCandidate[1] = Math.min(originCandidate[1], vertex[1]);

        return originCandidate;
    }, [Infinity, Infinity] as Point);
    const relativeVertices = absoluteVertices.map(vertex => pointDifference(vertex, origin));
    const firstVertex = relativeVertices.reduce((firstVertexCandidate, vertex) => {
        if (vertex[1] < firstVertexCandidate[1]) {
            return vertex;
        } else if (vertex[1] === firstVertexCandidate[1] && vertex[0] < firstVertexCandidate[0]) {
            return vertex;
        } else {
            return firstVertexCandidate;
        }
    }, [Infinity, Infinity] as Point);

    while (firstVertex !== relativeVertices[0]) {
        relativeVertices.push(relativeVertices.shift()!);
    }

    const standardizedPolygon: Polygon = {
        id: polygon.id,
        origin,
        vertices: relativeVertices
    };

    if (getPolygonArea(standardizedPolygon, true) < 0) {
        standardizedPolygon.vertices.reverse();
        standardizedPolygon.vertices.unshift(standardizedPolygon.vertices.pop()!);
        standardizedPolygon.signedArea = -standardizedPolygon.signedArea!;
    }

    return standardizedPolygon;
}

/**
 * Returns true if the given line segment intersect an edge of the given polygon at a finite number
 * of points on the line segment's interior.
 */
function doesLineSegmentIntersectPolygonEdges(lineSegment: LineSegment, polygon: Polygon): boolean {
    return getPolygonEdges(polygon).some(edge =>
        doLineSegmentsIntersect(lineSegment, edge)
    ) || getAbsolutePolygonVertices(polygon).some(vertex =>
        isPointOnLineSegment(vertex, lineSegment, false)
    );
}

/**
 * Returns true if the given line segment lies on the interior of the given polygon.
 */
export function isLineSegmentInsidePolygon(lineSegment: LineSegment, polygon: Polygon) {
    return !doesLineSegmentIntersectPolygonEdges(lineSegment, polygon) &&
        isPointInsidePolygon(getLineSegmentMidpoint(lineSegment), polygon) &&
        !getPolygonEdges(polygon).some(edge => 
            isLineSegmentInsideLineSegment(lineSegment, edge) ||
            isLineSegmentInsideLineSegment(edge, lineSegment)
        );
}

/**
 * Returns the smallest interior or exterior angle of the given polygon in degrees.
 */
export function getSmallestAngleOfPolygon(polygon: Polygon): number {
    let smallestAngle = Infinity;
    const numVertices = polygon.vertices.length;

    polygon.vertices.forEach((vertex, vertexIndex) => {
        const nextVertex = polygon.vertices[(vertexIndex + 1) % numVertices];
        const prevVertex = polygon.vertices[(vertexIndex - 1 + numVertices) % numVertices];

        const vector1 = pointDifference(nextVertex, vertex) as Vector;
        const vector2 = pointDifference(prevVertex, vertex) as Vector;

        const angle = getAngleBetweenVectors(vector1, vector2);

        smallestAngle = Math.min(smallestAngle, angle, 360 - angle);
    });

    return smallestAngle;
}

export function getSmallestWidthOfPolygon(polygon: Polygon): number {
    let smallestWidth = Infinity;

    getPolygonEdges(polygon, true).forEach(edge => {
        polygon.vertices.forEach(vertex => {
            if (arePointsEqual(vertex, edge[0]) || arePointsEqual(vertex, edge[1])) return;

            const vertexEdgeDistance = getDistanceBetweenPointAndLineSegment(vertex, edge);

            smallestWidth = Math.min(
                smallestWidth,
                vertexEdgeDistance
            );
        })
    });

    return smallestWidth;
}

/**
 * Returns the (default) absolute or relative centroid of the given polygon.
 */
export function getPolygonCentroid(polygon: Polygon, absolute = true): Point {
    if (polygon.centroid) {
        if (absolute) {
            return pointSum(polygon.origin, polygon.centroid);
        } else {
            return polygon.centroid;
        }
    } else {
        const centroid: Point = pointScale(polygon.vertices.reduce((prevVertex, currentVertex) =>
            pointSum(prevVertex, currentVertex)
        ), 1 / polygon.vertices.length);

        polygon.centroid = centroid;

        return getPolygonCentroid(polygon, absolute);
    }
}