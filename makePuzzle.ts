import { getPolygonArea } from "./geometry/polygon";

/**
 * Split the given target into a list of tiles. Each tile will have an area of at least minTileArea
 * and there will be exactly numTiles tiles. If the split is impossible, throws an Error.
 */
export default function splitTargetIntoTiles(target: Shape, minTileArea: number, numTiles: number): Polygon[] {
    const tiles: Polygon[] = [];
    let polygons: Shape = [...target];
    
    // check if any polygon is too small to be a tile (if so throw Error) or too small to split
    const doNotSplitPolygonIds = new Set<string>();
    
    polygons.forEach(polygon => {
        const area = getPolygonArea(polygon);

        if (area < minTileArea) {
            throw new Error("A polygon of the target shape has area smaller than minTileArea.");
        } else if (area < minTileArea * 2) {
            doNotSplitPolygonIds.add(polygon.id);
        }
    });

    // remove any polygon that is too small to split and turn it into a tile
    polygons = polygons.filter(polygon => {
        if(!doNotSplitPolygonIds.has(polygon.id)) {
            tiles.push({
                ...polygon,
                id: crypto.randomUUID()
            })
            return true;
        } else {
            return false;
        }
    });

    if (polygons.length === 0) return tiles;

    return []
}