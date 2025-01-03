import { isPolygonInsidePolygon, isPolygonInsidePolygonWorklet } from "./polygon";

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