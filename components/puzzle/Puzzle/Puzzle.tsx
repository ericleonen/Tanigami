import { StyleSheet, View } from "react-native";
import { PUZZLE } from "@/constants/puzzle";
import TargetShape from "./TargetShape";
import bunny from "@/assets/targets/bunny.json";
import Tiles from "./Tiles";
import useLayoutSize from "@/hooks/useLayoutSize";
import { useState } from "react";

const testTarget = bunny.shape as Shape;
const testTiles: Polygon[] = [
    { id: "triangle", origin: [3, 3], vertices: [[0, 0], [3, 3], [0, 3]] },
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
    const [targetHighlight, setTargetHighlight] = useState<Polygon | null>(null);

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
                targetHighlight={targetHighlight}
            />
            <Tiles 
                cellSize={cellSize}
                svgSize={svgSize}
                svgMargin={svgMargin}
                tiles={tiles} 
                setTiles={setTiles}
                target={target}
                setTargetHighlight={setTargetHighlight}
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