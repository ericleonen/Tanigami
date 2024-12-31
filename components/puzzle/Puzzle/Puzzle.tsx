import { StyleSheet, View } from "react-native";
import { PUZZLE } from "@/constants/puzzle";
import TargetShape from "./TargetShape";
import bunny from "@/assets/targets/bunny.json";
import Tiles from "./Tiles";
import useLayoutSize from "@/hooks/useLayoutSize";
import { useState } from "react";

const testTarget = bunny as Shape;
const testTiles: Polygon[] = [
    { origin: [0, 0], vertices: [[0, 0], [3, 0], [3, 3]] },
    { origin: [1, 1], vertices: [[0, 0], [3, 3], [0, 3]] }
];

const svgMargin = Math.max(
    PUZZLE.target.border.thickness,
    PUZZLE.tile.border.thickness
);

export default function Puzzle() {
    const { layoutSize, handleLayout } = useLayoutSize(PUZZLE.screenPadding - svgMargin);
    const [tiles, setTiles] = useState<Polygon[]>(testTiles);
    const cellSize = (layoutSize.width - 2 * svgMargin) / PUZZLE.columns;

    return (
        <View
            style={styles.container}
            onLayout={handleLayout}
        >
            <TargetShape 
                cellSize={cellSize}
                svgWidth={layoutSize.width} 
                svgMargin={svgMargin}
                target={testTarget}
            />
            <Tiles 
                cellSize={cellSize}
                svgSize={layoutSize}
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
        alignItems: "center",
        padding: PUZZLE.screenPadding - svgMargin
    },
});