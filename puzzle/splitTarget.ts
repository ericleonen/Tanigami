import { getGridPointsOnPolygonEdges, getPolygonArea, getPolygonEdges, getSmallestAngleOfPolygon, getSmallestWidthOfPolygon, isLineSegmentInsidePolygon, standardizePolygon } from "@/geometry/polygon";
import { createTileFromPolygon } from "./tiles"
import { randomlyChoose, uniformlyChoose } from "./random";
import * as Crypto from "expo-crypto";
import { isPointOnLineSegment } from "@/geometry/lineSegment";
import { arePointsEqual } from "@/geometry/point";

/**
 * Splits the given target shape into tiles. The resulting tiles will be positioned so that they
 * fill the target shape.
 */
export default function splitTarget(
    target: Shape,
    config: {
        /**
         * The desired number of tiles. There may end up being slightly more or less tiles
         * depending on the given target shape.
         */
        numTiles: number,
        /**
         * A parameter that, for larger values, makes it more likely larger polygons get split and,
         * for smaller values, makes all polygons more equally likely to get split.
         */
        gamma: number
    } & PolygonBisectionConfig
): Polygon[] {
    if (target.length >= config.numTiles) {
        return target.map(targetPolygon =>
            createTileFromPolygon(targetPolygon)
        );
    }

    const tiles: Polygon[] = [];
    const polygons: Polygon[] = [];

    target.forEach(targetPolygon => {
        if (getPolygonArea(targetPolygon) < 2 * config.minArea) {
            tiles.push(createTileFromPolygon(targetPolygon));
        } else {
            polygons.push(targetPolygon);
        }
    });

    if (polygons.length === 0) return tiles;

    const polygonLikelihoods = polygons.map(polygon => getPolygonArea(polygon) ** config.gamma);
    const polygonToBisect = polygons.splice(randomlyChoose(polygonLikelihoods), 1)[0];

    const bisectionResult = randomlyBisectPolygon(polygonToBisect, {
        minArea: config.minArea,
        minAngle: config.minAngle,
        minWidth: config.minWidth
    });

    if (bisectionResult) {
        polygons.push(...bisectionResult);
    } else {
        tiles.push(createTileFromPolygon(polygonToBisect));
    }

    tiles.push(...splitTarget(polygons, {
        ...config,
        numTiles: config.numTiles - tiles.length
    }));

    return tiles;
}

type PolygonBisectionConfig = {
    /**
     * The minimum desired area of a tile. If a polygon of a target shape has an area smaller than
     * this, that polygon becomes a tile.
     */
    minArea: number,
    /**
     * The minimum smallest angle in a tile's interior or exterior. If a polygon of a shape has an
     * interior or exterior angle smaller than this, that polygon becomes a tile.
     */
    minAngle: number,
    /**
     * The minimum smallest width (distance between two non-adjacent edges) in a tile. If a polygon
     * of a shape has a width smaller than this, that polygon becomes a tile.
     */
    minWidth: number
}

/**
 * Randomly bisects the given polygon along grid points on the polygon's edges. If, with the given 
 * config, this is impossible, returns null. Otherwise, returns the two resulting polygons.
 */
function randomlyBisectPolygon(
    polygon: Polygon,
    config: PolygonBisectionConfig
): [Polygon, Polygon] | null {
    const bisectionEndpoints = getGridPointsOnPolygonEdges(polygon);

    while (bisectionEndpoints.length > 0) {
        const bisectionOrigin = bisectionEndpoints.splice(uniformlyChoose(bisectionEndpoints.length), 1)[0];
        
        const result = randomlyBisectPolygonHelper(polygon, bisectionOrigin, [...bisectionEndpoints], config);
    
        if (result) return result;
    }

    return null;
}

/**
 * Randomly bisects the given polygon from the given bisection origin to one of the bisection
 * endpoints. If, with the given config, this is impossible, returns null. Otherwise, returns the
 * two resulting polygons.
 */
function randomlyBisectPolygonHelper(
    polygon: Polygon,
    bisectionOrigin: Point,
    bisectionEndpoints: Point[],
    config: PolygonBisectionConfig
): [Polygon, Polygon] | null {
    while (bisectionEndpoints.length > 0) {
        const bisectionEnd = bisectionEndpoints.splice(uniformlyChoose(bisectionEndpoints.length), 1)[0];
        const bisectionLineSegment: LineSegment = [bisectionOrigin, bisectionEnd];

        if (!isLineSegmentInsidePolygon(bisectionLineSegment, polygon)) continue;

        const [polygon1, polygon2] = bisectPolygonOnPath(polygon, bisectionLineSegment);

        if (
            Math.min(getPolygonArea(polygon1), getPolygonArea(polygon2)) >= config.minArea &&
            Math.min(getSmallestAngleOfPolygon(polygon1), getSmallestAngleOfPolygon(polygon2)) >= config.minAngle &&
            Math.min(getSmallestWidthOfPolygon(polygon1), getSmallestWidthOfPolygon(polygon2)) >= config.minWidth
        ) {
            return [polygon1, polygon2];
        }
    }

    return null;
}

/**
 * Bisects the given polygon on a bisecting path (assumes that such path is valid) and returns two
 * standardized polygons.
 */
export function bisectPolygonOnPath(polygon: Polygon, path: Point[]): [Polygon, Polygon] {
    const polygons: Polygon[] = [
        { id: Crypto.randomUUID(), origin: [0, 0], vertices: [] },
        { id: Crypto.randomUUID(), origin: [0, 0], vertices: [] }
    ];

    let currentPolygonIndex: 0 | 1 = 0;

    getPolygonEdges(polygon).forEach(edge => {
        const pathStartOnEdge = isPointOnLineSegment(path[0], edge);
        const pathEndOnEdge = isPointOnLineSegment(path[path.length - 1], edge);

        polygons[currentPolygonIndex].vertices.push(edge[0]); 

        if (pathStartOnEdge || pathEndOnEdge) {
            if (
                arePointsEqual(edge[0], path[0]) || 
                arePointsEqual(edge[0], path[path.length - 1])
            ) {
                polygons[currentPolygonIndex].vertices.pop();
                
                if (!pathStartOnEdge || !pathEndOnEdge) return;
            }

            const orientedPath = pathStartOnEdge ? path : path.toReversed();
    
            polygons[currentPolygonIndex].vertices.push(...orientedPath);
            currentPolygonIndex = 1 - currentPolygonIndex;
        }
    });

    return polygons.map(standardizePolygon) as [Polygon, Polygon];
}