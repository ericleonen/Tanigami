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

        const isEveryTileInsideShape = tiles.every(tile => isPolygonInsideShape(tile, target));
        // const areAnyTilesOverlapping = tiles.some(
        //     tile1 => tiles.some(tile2 => arePolygonsOverlapping(tile1, tile2))
        // );

        const isSolved = isEveryTileInsideShape;
        setSolved(isSolved);
    }, [tiles, target, solved, setSolved]);

    return solved;
}