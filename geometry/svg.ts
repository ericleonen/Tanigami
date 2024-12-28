export function polygonToSvgPoints(polygon: Polygon, cellSize: number): string {
    const origin = polygon.origin || [0, 0];

    return polygon.vertices.map(vertex => (
        `${origin[0] + vertex[0]*cellSize},${origin[1] + vertex[1]*cellSize}`
    )).join(" ");
};

export function shapeToSvgPoints(shape: Shape, cellSize: number): string[] {
    const origin = shape.origin || [0, 0];

    return shape.polygons.map(polygon => (
        polygonToSvgPoints({
            ...polygon,
            origin
        }, cellSize)
    ));
}