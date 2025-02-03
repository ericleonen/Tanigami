import { getAbsolutePolygonVertices, getPolygonEdges, getPolygonEdgesWorklet } from ".";
import { getLineSegmentMidpoint, getLineSegmentMidpointWorklet } from "../lineSegment";
import { doLineSegmentsIntersect, doLineSegmentsIntersectWorklet } from "../lineSegment/andLineSegment";
import { isPointInLineSegment, isPointInLineSegmentWorklet } from "../lineSegment/andPoint";
import { isPointInPolygon, isPointInPolygonWorklet } from "./andPoint";

/**
 * Returns true if the given line segment lies in the given polygon.
 */
export function isLineSegmentInPolygon(lineSegment: LineSegment, polygon: Polygon): boolean {
    const subsegmentEndpoints = getAbsolutePolygonVertices(polygon).filter(vertex =>
        isPointInLineSegment(vertex, lineSegment, false)
    );
    subsegmentEndpoints.push(...lineSegment);

    // sort subsegment endpoints horizontally or vertically
    subsegmentEndpoints.sort((point1, point2) => {
        const xDiff = point1[0] - point2[0];

        if (xDiff === 0) {
            return point1[1] - point2[1];
        } else {
            return xDiff;
        }
    });

    // check if all subsegment midpoints are inside the polygon
    for (let i = 0; i < subsegmentEndpoints.length - 1; i++) {
        const subsegment: LineSegment = [subsegmentEndpoints[i], subsegmentEndpoints[i + 1]];

        if (!isPointInPolygon(getLineSegmentMidpoint(subsegment), polygon)) {
            return false;
        }
    }

    if (
        !isPointInPolygon(lineSegment[0], polygon) ||
        !isPointInPolygon(lineSegment[1], polygon)
    ) {
        return false;
    }

    const doesLineSegmentIntersectPolygonEdge =
        getPolygonEdges(polygon).some(edge =>
            doLineSegmentsIntersect(edge, lineSegment, false, false)
        );

    return !doesLineSegmentIntersectPolygonEdge;
}

/**
 * Returns true if the given line segment lies in the given polygon.
 */
export function isLineSegmentInPolygonWorklet(lineSegment: LineSegment, polygon: Polygon): boolean {
    const subsegmentEndpoints = getAbsolutePolygonVertices(polygon).filter(vertex =>
        isPointInLineSegmentWorklet(vertex, lineSegment, false)
    );
    subsegmentEndpoints.push(...lineSegment);

    // sort subsegment endpoints horizontally or vertically
    subsegmentEndpoints.sort((point1, point2) => {
        const xDiff = point1[0] - point2[0];

        if (xDiff === 0) {
            return point1[1] - point2[1];
        } else {
            return xDiff;
        }
    });

    // check if all subsegment midpoints are inside the polygon
    for (let i = 0; i < subsegmentEndpoints.length - 1; i++) {
        const subsegment: LineSegment = [subsegmentEndpoints[i], subsegmentEndpoints[i + 1]];

        if (!isPointInPolygonWorklet(getLineSegmentMidpointWorklet(subsegment), polygon)) {
            return false;
        }
    }

    if (
        !isPointInPolygonWorklet(lineSegment[0], polygon) ||
        !isPointInPolygonWorklet(lineSegment[1], polygon)
    ) {
        return false;
    }

    const doesLineSegmentIntersectPolygonEdge =
        getPolygonEdgesWorklet(polygon).some(edge =>
            doLineSegmentsIntersectWorklet(edge, lineSegment, false, false)
        );

    return !doesLineSegmentIntersectPolygonEdge;
}