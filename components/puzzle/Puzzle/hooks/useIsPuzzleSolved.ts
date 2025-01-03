import { pointSum } from "@/geometry/point";
import { doesPolygonContainEdge } from "@/geometry/polygon";
import { isPolygonInsideShape } from "@/geometry/shape";
import { useEffect, useState } from "react";

export default function useIsPuzzleSolved(tiles: Polygon[], target: Shape): boolean {
    const [solved, setSolved] = useState(false);
    
    useEffect(() => {
        const isSolved = target.every(targetPolygon => {
            const targetVertices = targetPolygon.vertices.map(vertex => pointSum(vertex, targetPolygon.origin));

            return targetVertices.every((vertex, i) => {
                const nextVertex = targetVertices[(i + 1) % targetVertices.length];
                const edge: [Point, Point] = [vertex, nextVertex];

                return tiles.some(tile => doesPolygonContainEdge(tile, edge));
            });
        }) && tiles.every(tile => isPolygonInsideShape(tile, target));

        setSolved(isSolved);
    }, [tiles, target, setSolved]);

    return solved;
}