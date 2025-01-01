import { StyleSheet, View } from "react-native";
import { PUZZLE } from "@/constants/puzzle";
import TargetShape from "./TargetShape";
import bunny from "@/assets/targets/bunny.json";
import Tiles from "./Tiles";
import useLayoutSize from "@/hooks/useLayoutSize";
import { useEffect, useState } from "react";
import { distanceBetweenPoints, nearestGridPoint } from "@/geometry/point";
import { isPolygonInsideShape } from "@/geometry/polygon";

const testTarget = bunny.shape as Shape;
const testTiles: Polygon[] = [
    // { id: "triangle", origin: [3, 3], vertices: [[0, 0], [3, 3], [0, 3]] }
    { id: "small_triangle", origin: [0, 0], vertices: [[0, 0], [1, 1], [0, 1]] }
];

const svgMargin = Math.max(
    PUZZLE.target.border.thickness,
    PUZZLE.tile.border.thickness
);

export default function Puzzle() {
    const { layoutSize: svgSize, handleLayout } = useLayoutSize(PUZZLE.screenPadding);
    const [tiles, setTiles] = useState<Polygon[]>(testTiles);
    const [target, setTarget] = useState<Shape>(testTarget);
    const cellSize = Math.max(svgSize.width - 2 * svgMargin, 0) / PUZZLE.columns;

    useEffect(() => {
        for (const tile of tiles) {
            const snappedTileOrigin = nearestGridPoint(tile.origin);
            if (distanceBetweenPoints(snappedTileOrigin, tile.origin) === 0) continue;

            const snappedTile = { ...tile, origin: snappedTileOrigin };

            if (isPolygonInsideShape(snappedTile, target)) {
                setTiles(prevTiles => prevTiles.map(prevTile => {
                    if (prevTile.id === snappedTile.id) {
                        return snappedTile;
                    } else {
                        return prevTile;
                    }
                }));
            }
        }
    }, [tiles, setTiles]);

    return (
        <View
            style={styles.container}
            onLayout={handleLayout}
        >
            <TargetShape 
                cellSize={cellSize}
                svgWidth={svgSize.width} 
                svgMargin={svgMargin}
                target={target}
            />
            <Tiles 
                cellSize={cellSize}
                svgSize={svgSize}
                svgMargin={svgMargin}
                tiles={tiles} 
                setTiles={setTiles}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center"
    },
});