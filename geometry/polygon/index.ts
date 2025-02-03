import { getIntegerPointsOnLineSegment } from "../lineSegment";
import { getDistanceBetweenPointAndLineSegment } from "../lineSegment/andPoint";
import { clamp } from "../number";
import { scalePoint } from "../point";
import { addPoints, addPointsWorklet, arePointsEqual, subtractPoints } from "../point/andPoint";
import { getAngleBetweenVectors } from "../vector/andVector";

/**
 * Returns the dimensions of the given polygon. 
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
        height: maxY,
        width: maxX
    };

    return polygon.dimensions;
}

/**
 * Returns the dimensions of the given polygon. 
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
        height: maxY,
        width: maxX
    };

    return polygon.dimensions;
}

/**
 * Returns a list of absolute vertices of the given polygon.
 */
export function getAbsolutePolygonVertices(polygon: Polygon): Point[] {
    return polygon.vertices.map(vertex => addPoints(polygon.origin, vertex));
}

/**
 * Returns a list of absolute vertices of the given polygon.
 */
export function getAbsolutePolygonVerticesWorklet(polygon: Polygon): Point[] {
    "worklet";
    return polygon.vertices.map(vertex => addPointsWorklet(polygon.origin, vertex));
}

/**
 * Returns a list of edges of the given polygon. Returns absolutely-positioned edges if absolute is
 * true (default) or relatively-positioned edges otherwise.
 */
export function getPolygonEdges(polygon: Polygon, absolute = true): LineSegment[] {
    const vertices = !absolute ? polygon.vertices : getAbsolutePolygonVertices(polygon);

    return vertices.map((vertex, i) => {
        const nextVertex = vertices[(i + 1) % vertices.length];

        return [vertex, nextVertex];
    });
}

/**
 * Returns a list of edges of the given polygon. Returns absolutely-positioned edges if absolute is
 * true (default) or relatively-positioned edges otherwise.
 */
export function getPolygonEdgesWorklet(polygon: Polygon, absolute = true): LineSegment[] {
    "worklet";
    const vertices = !absolute ? polygon.vertices : getAbsolutePolygonVertices(polygon);

    return vertices.map((vertex, i) => {
        const nextVertex = vertices[(i + 1) % vertices.length];

        return [vertex, nextVertex];
    });
}

/**
 * Returns the area of the given polygon.
 */
export function getPolygonArea(polygon: Polygon): number {
    if (polygon.signedArea) return Math.abs(polygon.signedArea);

    polygon.signedArea = 0;

    getPolygonEdges(polygon).forEach(([vertex1, vertex2]) => {
        polygon.signedArea! += vertex1[0]*vertex2[1] - vertex2[0]*vertex1[1];
    });

    polygon.signedArea /= 2;

    return Math.abs(polygon.signedArea);
}

/**
 * Returns true if the vertices of the given polygon are in a clockwise orientation.
 */
export function arePolygonVerticesClockwise(polygon: Polygon): boolean {
    getPolygonArea(polygon);

    return polygon.signedArea! > 0;
}

/**
 * Returns a list of all absolute grid points that lie on the given polygon's edges. These points
 * are in the same orientation as the polygon's vertices
 */
export function getIntegerPointsOnPolygonBoundary(polygon: Polygon): Point[] {
    return getPolygonEdges(polygon).reduce((points, edge) => {
        points.push(...getIntegerPointsOnLineSegment(edge));
        points.pop();

        return points;
    }, [] as Point[]);
}

/**
 * Returns the given polygon with its vertices and origin standardized.
 */
export function standardizePolygon(polygon: Polygon): Polygon {
    const absoluteVertices = getAbsolutePolygonVertices(polygon);
    const origin = absoluteVertices.reduce((originCandidate, vertex) => {
        originCandidate[0] = Math.min(originCandidate[0], vertex[0]);
        originCandidate[1] = Math.min(originCandidate[1], vertex[1]);

        return originCandidate;
    }, [Infinity, Infinity] as Point);
    const relativeVertices = absoluteVertices.map(vertex => subtractPoints(vertex, origin));
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

    if (!arePolygonVerticesClockwise(standardizedPolygon)) {
        standardizedPolygon.vertices.reverse();
        standardizedPolygon.vertices.unshift(standardizedPolygon.vertices.pop()!);
        standardizedPolygon.signedArea = -standardizedPolygon.signedArea!;
    }

    return standardizedPolygon;
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

        const vector1 = subtractPoints(nextVertex, vertex) as Vector;
        const vector2 = subtractPoints(prevVertex, vertex) as Vector;

        const angle = getAngleBetweenVectors(vector1, vector2);

        smallestAngle = Math.min(smallestAngle, angle, 360 - angle);
    });

    return smallestAngle;
}

/**
 * Returns the smallest interior width of the given polygon.
 */
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
            return addPoints(polygon.origin, polygon.centroid);
        } else {
            return polygon.centroid;
        }
    } else {
        const centroid: Point = scalePoint(
            1 / polygon.vertices.length, 
            polygon.vertices.reduce((prevVertex, currentVertex) =>
                addPoints(prevVertex, currentVertex)
            )
        );

        polygon.centroid = centroid;

        return getPolygonCentroid(polygon, absolute);
    }
}

/**
 * Returns the given polygon clamped to fit inside the given bounding box.
 */
export function clampPolygonToBoundingBox(polygon: Polygon, boundingBox: Box): Polygon {
    const polygonDimensions = getPolygonDimensions(polygon);

    const clampedOrigin: Point = [
        clamp(
            polygon.origin[0], [
                boundingBox.origin[0], 
                boundingBox.origin[0] + boundingBox.width - polygonDimensions.width
            ]
        ),
        clamp(
            polygon.origin[1], [
                boundingBox.origin[1],
                boundingBox.origin[1] + boundingBox.height - polygonDimensions.height
            ]
        )
    ];

    return {
        ...polygon,
        origin: clampedOrigin
    };
}