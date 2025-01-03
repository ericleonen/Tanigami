/**
 * Returns a SVG points string used to draw the given polygon.
 */
export function polygonToSvgPoints(polygon: Polygon, cellSize: number): string {
    const origin = polygon.origin || [0, 0];

    return polygon.vertices.map(vertex => (
        `${(origin[0] + vertex[0]) * cellSize},${(origin[1] + vertex[1]) * cellSize}`
    )).join(" ");
};