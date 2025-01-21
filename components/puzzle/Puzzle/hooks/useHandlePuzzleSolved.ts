import { pointSum } from "@/geometry/point";
import { doesPolygonContainEdge, getAbsolutePolygonVertices } from "@/geometry/polygon";
import { isPolygonInsideShape } from "@/geometry/shape";
import { useEffect, useState } from "react";

export default function useHandlePuzzleSolved(
    tiles: Polygon[], 
    target: Shape,
    onSolved: () => void
): boolean {
    const [solved, setSolved] = useState(false);
    
    useEffect(() => {
        if (solved) {
            onSolved();
            return;
        }

        const isSolved = tiles.every(tile => isPolygonInsideShape(tile, target));

        setSolved(isSolved);
    }, [tiles, target, solved, setSolved]);

    return solved;
}