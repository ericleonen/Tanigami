export function getPolygonId(polygon: Polygon): string {
    if (polygon.id) return polygon.id;

    polygon.id = crypto.randomUUID();

    return polygon.id;
}

export function getPolygonOrigin(polygon: Polygon): Point {
    let minX = Infinity;
    let minY = Infinity;

    polygon.vertices.forEach(vertex => {
        minX = Math.min(minX, vertex[0]);
        minY = Math.min(minY, vertex[1]);
    });

    return [minX, minY];
}

export function getPolygonOriginWorklet(polygon: Polygon): Point {
    "worklet"
    let minX = Infinity;
    let minY = Infinity;

    polygon.vertices.forEach(vertex => {
        minX = Math.min(minX, vertex[0]);
        minY = Math.min(minY, vertex[1]);
    });

    return [minX, minY];
}

export function getPolygonDimensions(polygon: Polygon): Dimensions {
    if (polygon.dimensions) return polygon.dimensions;

    const [minX, minY] = getPolygonOrigin(polygon);

    let maxX = 0;
    let maxY = 0;

    polygon.vertices.forEach(vertex => {
        maxX = Math.max(maxX, vertex[0]);
        maxY = Math.max(maxY, vertex[1]);
    });

    polygon.dimensions = {
        rows: maxY - minY,
        columns: maxX - minX
    };

    return polygon.dimensions;
}

export function getPolygonDimensionsWorklet(polygon: Polygon): Dimensions {
    "worklet";
    if (polygon.dimensions) return polygon.dimensions;

    const [minX, minY] = getPolygonOriginWorklet(polygon);

    let maxX = 0;
    let maxY = 0;

    polygon.vertices.forEach(vertex => {
        maxX = Math.max(maxX, vertex[0]);
        maxY = Math.max(maxY, vertex[1]);
    });

    polygon.dimensions = {
        rows: maxY - minY,
        columns: maxX - minX
    };

    return polygon.dimensions;
}