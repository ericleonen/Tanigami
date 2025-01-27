import { getPolygonEdges } from ".";
import { getLineSegmentMidpoint } from "../lineSegment";
import { doLineSegmentsIntersect } from "../lineSegment/andLineSegment";
import { isPointInPolygon } from "./andPoint";

export function isLineSegmentInPolygon(lineSegment: LineSegment, polygon: Polygon): boolean {
    const areEndpointsInPolygon =
        isPointInPolygon(lineSegment[0], polygon) &&
        isPointInPolygon(lineSegment[1], polygon);
    if (!areEndpointsInPolygon) {
        return false;
    }

    const isMidpointInPolygon =
        isPointInPolygon(getLineSegmentMidpoint(lineSegment), polygon);
    if (!isMidpointInPolygon) {
        return false;
    }

    const doesLineSegmentCrossPolygonBoundary =
        getPolygonEdges(polygon).some(edge => {
            doLineSegmentsIntersect(edge, lineSegment, true, false)
        });
}