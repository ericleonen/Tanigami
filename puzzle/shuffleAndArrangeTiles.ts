import { clampPolygonToBoundingBox, getPolygonCentroid, getPolygonDimensions } from "@/geometry/polygon";
import { uniform } from "./random";
import { pointDifference, pointScale, pointSum } from "@/geometry/point";
import { getVectorMagnitude } from "@/geometry/vector";

type ArrangeTilesConfig = {
    /**
     * The fixed step magnitude of a tile.
     */
    alpha: number,
    /**
     * The maximum number of steps a tile can take.
     */
    maxSteps: number
}

/**
 * Returns copies of the given tiles that lie inside the given bounding box.
 */
export default function shuffleAndArrangeTiles(
    tiles: Polygon[],
    boundingBox: Box,
    config: ArrangeTilesConfig
): Polygon[] {
    tiles = shuffleTiles(tiles, boundingBox);

    for (let i = 0; i < config.maxSteps; i++) {
        const tookStep = arrangeTilesStep(tiles, config);

        if (!tookStep) break;

        tiles.forEach(tile => clampPolygonToBoundingBox(tile, boundingBox))
    }

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

/**
 * Mutates the given tiles to take an arrangement step.
 */
function arrangeTilesStep(tiles: Polygon[], config: ArrangeTilesConfig): boolean {
    const deltas: Vector[] = tiles.map(() => [0, 0]);
    let tookStep = false;

    tiles.forEach((tile1, tile1Index) => {
        const centroid1 = getPolygonCentroid(tile1);

        tiles.forEach((tile2, tile2Index) => {
            if (tile1.id === tile2.id) return;

            const centroid2 = getPolygonCentroid(tile2);

            let vector1: Vector = pointDifference(centroid1, centroid2);
            const r = getVectorMagnitude(vector1);
            vector1 = pointScale(vector1, Math.exp(-r) / r)
            // const vector2: Vector = pointScale(vector1, -1);

            deltas[tile1Index] = pointSum(deltas[tile1Index], vector1);
            deltas[tile2Index] = pointDifference(deltas[tile2Index], vector1);
        });
    });

    tiles.forEach((tile, tileIndex) => {
        const delta: Vector = deltas[tileIndex];
        const deltaMagnitude = getVectorMagnitude(delta);

        if (deltaMagnitude < config.alpha) return;

        const step: Vector = pointScale(delta, config.alpha / deltaMagnitude);

        tile.origin = pointSum(tile.origin, step);

        tookStep = true;
    });

    return tookStep;
}