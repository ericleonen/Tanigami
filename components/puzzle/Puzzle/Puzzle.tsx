import { StyleSheet } from "react-native";
import Svg, { G } from "react-native-svg";
import { PUZZLE } from "@/constants/puzzle";
import TargetShape from "./TargetShape";
import bunny from "@/assets/targets/bunny.json";
import Tiles from "./Tiles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import useLayoutSize from "@/hooks/useLayoutSize";
import { useState } from "react";

const testTarget = bunny as Shape;
const testTiles: Polygon[] = [
    { origin: [1, 1], vertices: [[0, 0], [3, 0], [3, 3]] },
    { origin: [1, 1], vertices: [[0, 0], [3, 3], [0, 3]] }
];

export default function Puzzle() {
    const { layoutSize, handleLayout } = useLayoutSize();
    const [tiles, setTiles] = useState<Polygon[]>(testTiles);

    const svgMargin = Math.max(
        PUZZLE.target.border.thickness,
        PUZZLE.tile.border.thickness
    );
    const cellSize = layoutSize.width / PUZZLE.columns;

    return (
        <GestureHandlerRootView style={styles.container} onLayout={handleLayout}>
            <Svg
                height={layoutSize.height + 2 * svgMargin} 
                width={layoutSize.width + 2 * svgMargin}
            >
                <G transform={`translate(${svgMargin}, ${svgMargin})`}>
                    <TargetShape cellSize={cellSize} target={testTarget} />
                    <Tiles {...{cellSize, tiles, setTiles}} />
                </G>
            </Svg>
        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    }
});