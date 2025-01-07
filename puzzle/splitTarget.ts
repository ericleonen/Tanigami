import { getGridPointsOnPolygonEdges, getPolygonArea, getPolygonEdges, isPointInsidePolygon, isPointOnPolygonEdges, standardizePolygon } from "@/geometry/polygon";
import { randomlyChoose, uniformlyChoose } from "./random";
import { createTileFromPolygon } from "./tiles";
import { arePointsEqual, pointDifference, pointSum } from "@/geometry/point";
import { getLineSegmentMidpoint, getLineSegmentsFromPoints, isPointOnLineSegment } from "@/geometry/lineSegment";
import * as Crypto from 'expo-crypto';

/**
 * Splits the given target shape into several tile polygons. Any polygon that makes up the target
 * shape with an area smaller than minArea becomes a tile. The other polygons are randomly split
 * into tiles with areas that are at least minArea. Tries to make the number of tiles be exactly
 * numTiles, but will return more or fewer if the random splits make that impossible.
 * 
 * Use larger gamma (default 1) to increase the likelihoods of larger polygons gettings split.
 */
export default function splitTarget(
    target: Shape,
    minArea: number,
    numTiles: number,
    gamma = 1
): Polygon[] {
    if (target.length >= numTiles) {
        return target.map(targetPolygon => createTileFromPolygon(targetPolygon));
    }

    const tiles: Polygon[] = [];
    const polygons: Polygon[] = [];

    target.forEach(targetPolygon => {
        if (getPolygonArea(targetPolygon) < 2 * minArea) {
            tiles.push(createTileFromPolygon(targetPolygon));
        } else {
            polygons.push(targetPolygon);
        }
    });

    if (polygons.length === 0) return tiles;

    const polygonLikelihoods = polygons.map(polygon => getPolygonArea(polygon) ** gamma);
    const polygonToBisect = polygons.splice(randomlyChoose(polygonLikelihoods), 1)[0];

    const bisectionResult = randomlyBisectPolygon(polygonToBisect, minArea);

    if (bisectionResult) {
        polygons.push(...bisectionResult);
    } else {
        tiles.push(createTileFromPolygon(polygonToBisect));
    }

    tiles.push(...splitTarget(polygons, minArea, numTiles - tiles.length, gamma));

    return tiles;
}

/**
 * Randomly bisects the given polygon. If no bisection can give each split polygon an area of
 * minArea, returns null. If there is, returns a 2-tuple of polygons.
 */
function randomlyBisectPolygon(
    polygon: Polygon,
    minArea: number
): [Polygon, Polygon] | null {
    const walkOriginCandidates = getGridPointsOnPolygonEdges(polygon);

    for (const walkOrigin of walkOriginCandidates) {
        const result = randomlyBisectPolygonHelper(polygon, minArea, [walkOrigin]);

        if (result) return result;
    }

    return null;
}

const walkDeltas: Point[] = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1]
]

function randomlyBisectPolygonHelper(
    polygon: Polygon,
    minArea: number,
    path: Point[]
): [Polygon, Polygon] | null {
    if (path.length >= 2 && isPointOnPolygonEdges(path[path.length - 1], polygon)) {
        const [polygon1, polygon2] = bisectPolygonOnPath(polygon, path);

        if (Math.min(getPolygonArea(polygon1), getPolygonArea(polygon2)) >= minArea) {
            return [polygon1, polygon2];
        } else {
            return null;
        }
    }

    const possibleWalkDeltas = [...walkDeltas];
    const currentPoint = path[path.length - 1];

    while (possibleWalkDeltas.length > 0) {
        const walkDelta = possibleWalkDeltas.splice(uniformlyChoose(possibleWalkDeltas.length), 1)[0];
        const nextPoint = pointSum(currentPoint, walkDelta);
        const pathDelta: LineSegment = [currentPoint, nextPoint];
        const midpoint = getLineSegmentMidpoint(pathDelta);

        // do not allow path to self-intersect
        if (
            path.some(pathPoint => arePointsEqual(pathPoint, nextPoint)) || 
            getLineSegmentsFromPoints(path).some(
                pathLineSegment => isPointOnLineSegment(midpoint, pathLineSegment)
            )
        ) {
            continue;
        }

        if (isPointInsidePolygon(midpoint, polygon, false)) {
            path.push(nextPoint);
            const bisectedPolygons = randomlyBisectPolygonHelper(
                polygon,
                minArea,
                simplifyPath(path)
            );

            if (bisectedPolygons) return bisectedPolygons;
            
            path.pop()
        }
    }

    return null;
}

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

function simplifyPath(path: Point[]): Point[] {
    const simplePath = [...path];

    for (let i = simplePath.length - 2; i >= 1; i--) {
        if (isPointOnLineSegment(simplePath[i], [simplePath[i - 1], simplePath[i + 1]])) {
            simplePath.splice(i, 1);
        }
    }

    return simplePath;
}