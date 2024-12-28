export function getPolygonOrigin(polygon: Polygon): Point {
    let minX = Infinity;
    let minY = Infinity;

    polygon.vertices.forEach(vertex => {
        minX = Math.min(minX, vertex[0]);
        minY = Math.min(minY, vertex[1]);
    });

    return [minX, minY];
}

export function getPolygonDimensions(polygon: Polygon): {
    rows: number,
    columns: number
} {
    const [minX, minY] = getPolygonOrigin(polygon);

    let maxX = 0;
    let maxY = 0;

    polygon.vertices.forEach(vertex => {
        maxX = Math.max(maxX, vertex[0]);
        maxY = Math.max(maxY, vertex[1]);
    });

    return {
        rows: maxY - minY,
        columns: maxX - minX
    };
}