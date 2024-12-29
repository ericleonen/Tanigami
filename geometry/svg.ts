import { pointSum } from "./point";

/**
 * Returns a SVG points string used to draw the given Polygon.
 */
export function polygonToSvgPoints(polygon: Polygon, cellSize: number): string {
    const origin = polygon.origin || [0, 0];

    const str =  polygon.vertices.map(vertex => (
        `${(origin[0] + vertex[0]) * cellSize},${(origin[1] + vertex[1]) * cellSize}`
    )).join(" ");

    return str;
};

/**
 * Returns a list of SVG points strings used to draw the Polygons of the given Shape. A Polygon's
 * origin (default [0, 0]) is treated relative to the Shape's origin (default [0, 0]).
 */
export function shapeToSvgPoints(shape: Shape, cellSize: number): string[] {
    const origin = shape.origin || [0, 0];

    return shape.polygons.map(polygon => (
        polygonToSvgPoints({
            ...polygon,
            origin: pointSum(origin, polygon.origin || [0, 0])
        }, cellSize)
    ));
}