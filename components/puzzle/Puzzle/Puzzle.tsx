import { Dimensions, LayoutChangeEvent, Platform, StatusBar, StyleSheet, useWindowDimensions } from "react-native";
import Svg, { G } from "react-native-svg";
import { PUZZLE } from "@/constants/puzzle";
import TargetShape from "./TargetShape";
import bunny from "@/assets/targets/bunny.json";
import Tiles from "./Tiles";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useState } from "react";
import useLayoutSize from "@/hooks/useLayoutSize";

const testTarget = bunny as Shape;
const testTiles: Polygon[] = [
    { vertices: [[0, 0], [1, 1], [0, 2]] }
];

export default function Puzzle() {
    const { layoutSize, handleLayout } = useLayoutSize();

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
                    <Tiles cellSize={cellSize} tiles={testTiles} />
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