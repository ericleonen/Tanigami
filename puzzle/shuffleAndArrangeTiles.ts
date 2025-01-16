import { getPolygonDimensions } from "@/geometry/polygon";
import { uniform } from "./random";

/**
 * Returns copies of the given tiles that lie inside the given bounding box. Attempts to arrange
 * all tiles so they are at least tileMargin apart, but this is not guarenteed.
 */
export default function shuffleAndArrangeTiles(
    tiles: Polygon[],
    boundingBox: Box,
    tileMargin: number
): Polygon[] {
    tiles = shuffleTiles(tiles, boundingBox);

    return tiles;
}

/**
 * Copies and moves each of the given tiles to somewhere inside the bounding box uniformly
 * randomly.
 */
function shuffleTiles(tiles: Polygon[], boundingBox: Box): Polygon[] {
    return tiles.map((tile) => {
        const tileDimensions = getPolygonDimensions(tile);

        const minX = boundingBox.origin[0];
        const maxX = minX + boundingBox.columns - tileDimensions.columns;

        const minY = boundingBox.origin[1];
        const maxY = minY + boundingBox.rows - tileDimensions.rows;

        const origin: Point = [
            uniform(minX, maxX),
            uniform(minY, maxY)
        ];

        return {
            ...tile,
            origin
        };
    });
}