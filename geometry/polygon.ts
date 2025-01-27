/**
 * Returns true if the given line segment lies inside the given polygon, that is if every point on
 * the line segment lies on the polygon's interior or boundary, false otherwise.
 */
export function isLineSegmentInsidePolygon(lineSegment: LineSegment, polygon: Polygon): boolean {
    const areLineSegmentEndpointsInsidePolygon = 
        isPointInsidePolygon(lineSegment[0], polygon) &&
        isPointInsidePolygon(lineSegment[1], polygon);
    if (!areLineSegmentEndpointsInsidePolygon) {
        return false;
    }

    const isLineSegmentMidpointInsidePolygon =
        isPointInsidePolygon(getLineSegmentMidpoint(lineSegment), polygon);
    if (!isLineSegmentInsideLineSegment) {
        return false;
    }

    const doesLineSegmentCrossPolygonBoundary =
        getPolygonEdges(polygon).some(edge => {
            
        })
}

/**
 * Returns true if the inside polygon lies inside the outer polygon, false otherwise. The inside
 * polygon can share (part) of an edge of the outer polygon and still be considered inside.
 */
export function isPolygonInsidePolygon(insidePolygon: Polygon, outsidePolygon: Polygon): boolean {
    const insideVertices = getAbsolutePolygonVertices(insidePolygon);
    const 
}

/**
 * Returns true if the inside polygon lies inside the outer polygon, false otherwise. The inside
 * polygon can share (part) of an edge of the outer polygon and still be considered inside.
 */
export function isPolygonInsidePolygonWorklet(insidePolygon: Polygon, outsidePolygon: Polygon): boolean {
    "worklet";
    const insideVertices = getAbsolutePolygonVerticesWorklet(insidePolygon);
    const insideEdges = getPolygonEdgesWorklet(insidePolygon);
    const insideEdgeMidpoints = insideEdges.map(getLineSegmentMidpointWorklet);

    // all vertices and edge midpoints of the inside polygon are inside the outside polygon
    if (
        insideVertices
            .concat(insideEdgeMidpoints)
            .some(point => !isPointInsidePolygonWorklet(point, outsidePolygon))
    ) {
        return false;
    }

    const outsideEdges = getPolygonEdgesWorklet(outsidePolygon);

    // all inside edges are completely inside the outside polygon
    if (insideEdges.some(insideEdge => 
        outsideEdges.some(outsideEdge => isLineSegmentInsideLineSegmentWorklet(outsideEdge, insideEdge, false))
    )) {
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
 * Returns true if the given line segment intersects an edge of the given polygon at a finite number
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
 * Clamps the given polygon's position to be inside the given bounding box. Mutates the given
 * polygon.
 */
export function clampPolygonToBoundingBox(polygon: Polygon, boundingBox: Box): void {
    const polygonDimensions = getPolygonDimensions(polygon);

    const clampedOrigin: Point = [
        clamp(
            polygon.origin[0], [
                boundingBox.origin[0], 
                boundingBox.origin[0] + boundingBox.columns - polygonDimensions.columns
            ]
        ),
        clamp(
            polygon.origin[1], [
                boundingBox.origin[1],
                boundingBox.origin[1] + boundingBox.rows - polygonDimensions.rows
            ]
        )
    ];

    polygon.origin = clampedOrigin;
}

/**
 * Clamps the given polygon's position to be inside the given bounding box. Mutates the given
 * polygon.
 */
export function clampPolygonToBoundingBoxWorklet(polygon: Polygon, boundingBox: Box): void {
    "worklet";
    const polygonDimensions = getPolygonDimensionsWorklet(polygon);

    const clampedOrigin: Point = [
        clampWorklet(
            polygon.origin[0], [
                boundingBox.origin[0], 
                boundingBox.origin[0] + boundingBox.columns - polygonDimensions.columns
            ]
        ),
        clampWorklet(
            polygon.origin[1], [
                boundingBox.origin[1],
                boundingBox.origin[1] + boundingBox.rows - polygonDimensions.rows
            ]
        )
    ];

    polygon.origin = clampedOrigin;
}

/**
 * Returns true if the given edge is part of the given polygon's edges.
 */
export function doesPolygonContainEdge(edge: LineSegment, polygon: Polygon): boolean {
    return getPolygonEdges(polygon).some(
        polygonEdge => isLineSegmentInsideLineSegment(edge, polygonEdge)
    );
}