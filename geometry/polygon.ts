import { isPointInsidePolygon, isPointInsidePolygonWorklet, pointDifference, pointDifferenceWorklet, pointSum, pointSumWorklet } from "./point";

export function getPolygonOrigin(polygon: Polygon): Point {
    let minX = Infinity;
    let minY = Infinity;

    polygon.vertices.forEach(vertex => {
        minX = Math.min(minX, vertex[0]);
        minY = Math.min(minY, vertex[1]);
    });

    return [minX, minY];
}

export function getPolygonOriginWorklet(polygon: Polygon): Point {
    "worklet"
    let minX = Infinity;
    let minY = Infinity;

    polygon.vertices.forEach(vertex => {
        minX = Math.min(minX, vertex[0]);
        minY = Math.min(minY, vertex[1]);
    });

    return [minX, minY];
}

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

export function doEdgesIntersect(edge1: [Point, Point], edge2: [Point, Point]): boolean {
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

export function doEdgesIntersectWorklet(edge1: [Point, Point], edge2: [Point, Point]): boolean {
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

export function isPolygonInsidePolygon(insidePolygon: Polygon, outsidePolygon: Polygon): boolean {
    const insideVertices = insidePolygon.vertices.map(vertex => pointSum(vertex, insidePolygon.origin));
    const outsideVertices  = outsidePolygon.vertices.map(vertex => pointSum(vertex, outsidePolygon.origin));

    // all points of the inside polygon are inside the outside polygon
    for (const vertex of insideVertices) {
        if (!isPointInsidePolygon(vertex, outsidePolygon)) return false;
    }

    // no edges between the inside and outside polygons intersect
    for (let i = 0; i < insideVertices.length; i++) {
        const insideVertex1 = insideVertices[i];
        const insideVertex2 = insideVertices[(i + 1) % insideVertices.length];
        const insideEdge: [Point, Point] = [insideVertex1, insideVertex2];

        for (let j = 0; j < outsideVertices.length; j++) {
            const outsideVertex1 = outsideVertices[j];
            const outsideVertex2 = outsideVertices[(j + 1) % outsideVertices.length];

            if (doEdgesIntersect(insideEdge, [outsideVertex1, outsideVertex2])) return false;
        }
    }

    return true;
}

export function isPolygonInsidePolygonWorklet(insidePolygon: Polygon, outsidePolygon: Polygon): boolean {
    "worklet";
    const insideVertices = insidePolygon.vertices.map(vertex => pointSumWorklet(vertex, insidePolygon.origin));
    const outsideVertices  = outsidePolygon.vertices.map(vertex => pointSumWorklet(vertex, outsidePolygon.origin));

    // all points of the inside polygon are inside the outside polygon
    for (const vertex of insideVertices) {
        if (!isPointInsidePolygonWorklet(vertex, outsidePolygon)) return false;
    }

    // no edges between the inside and outside polygons intersect
    for (let i = 0; i < insideVertices.length; i++) {
        const insideVertex1 = insideVertices[i];
        const insideVertex2 = insideVertices[(i + 1) % insideVertices.length];
        const insideEdge: [Point, Point] = [insideVertex1, insideVertex2];

        for (let j = 0; j < outsideVertices.length; j++) {
            const outsideVertex1 = outsideVertices[j];
            const outsideVertex2 = outsideVertices[(j + 1) % outsideVertices.length];

            if (doEdgesIntersectWorklet(insideEdge, [outsideVertex1, outsideVertex2])) return false;
        }
    }

    return true;
}

export function isPolygonInsideShape(polygon: Polygon, shape: Shape): boolean {
    return shape.some(shapePolygon => isPolygonInsidePolygon(polygon, shapePolygon));
}

export function isPolygonInsideShapeWorklet(polygon: Polygon, shape: Shape): boolean {
    "worklet";
    return shape.some(shapePolygon => isPolygonInsidePolygonWorklet(polygon, shapePolygon));
}