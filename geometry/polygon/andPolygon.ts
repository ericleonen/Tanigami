import { getPolygonEdges, getPolygonEdgesWorklet } from ".";
import { isLineSegmentInPolygon, isLineSegmentInPolygonWorklet } from "./andLineSegment";

/**
 * Returns true if the inside polygon lies in the outer polygon, false otherwise.
 */
export function isPolygonInPolygon(insidePolygon: Polygon, outsidePolygon: Polygon): boolean {
    return getPolygonEdges(insidePolygon).every(edge =>
        isLineSegmentInPolygon(edge, outsidePolygon)
    );
}

/**
 * Returns true if the inside polygon lies in the outer polygon, false otherwise.
 */
export function isPolygonInPolygonWorklet(insidePolygon: Polygon, outsidePolygon: Polygon): boolean {
    "worklet";
    return getPolygonEdgesWorklet(insidePolygon).every(edge =>
        isLineSegmentInPolygonWorklet(edge, outsidePolygon)
    );
}