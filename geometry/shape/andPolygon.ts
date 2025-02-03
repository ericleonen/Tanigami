import { isPolygonInPolygon, isPolygonInPolygonWorklet } from "../polygon/andPolygon";

/**
 * Returns true if the given polygon lies in the given shape.
 */
export function isPolygonInShape(polygon: Polygon, shape: Shape): boolean {
    return shape.some(shapePolygon => 
        isPolygonInPolygon(polygon, shapePolygon)
    );
}

/**
 * Returns true if the given polygon lies in the given shape.
 */
export function isPolygonInShapeWorklet(polygon: Polygon, shape: Shape): boolean {
    "worklet";
    return shape.some(shapePolygon => 
        isPolygonInPolygonWorklet(polygon, shapePolygon)
    );
}