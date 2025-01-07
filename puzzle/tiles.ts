/**
 * Returns the the polygon as a tile, the same polygon with a tile prefix in the id.
 */
export function createTileFromPolygon(polygon: Polygon): Polygon {
    let id: string;

    if (polygon.id.startsWith("target")) {
        id = polygon.id.replace("target", "tile");
    } else if (polygon.id.startsWith("tile")) {
        id = polygon.id;
    } else {
        id = "tile_" + polygon.id;
    }

    return {
        ...polygon,
        id
    };
}