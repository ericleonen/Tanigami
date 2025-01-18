import { Dispatch, SetStateAction, useState } from "react"
import Tile from "./Tile"
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import Svg, { G } from "react-native-svg"
import { StyleSheet, View } from "react-native"
import { distanceBetweenPointsWorklet, nearestGridPointWorklet, pointScaleWorklet, pointSumWorklet } from "@/geometry/point"
import { PUZZLE } from "@/constants/puzzle"
import { clampWorklet } from "@/geometry/number"
import { getPolygonDimensionsWorklet, isPointInsidePolygonWorklet } from "@/geometry/polygon"
import { runOnJS, useSharedValue } from "react-native-reanimated"
import { isPolygonInsideShapeWorklet } from "@/geometry/shape"
import useTileDrag from "./hooks/useTileDrag"

type Props = {
    cellSize: number,
    svgSize: {
        height: number,
        width: number
    },
    svgMargin: number,
    tiles: Polygon[],
    setTiles: Dispatch<SetStateAction<Polygon[]>>,
    target: Shape,
    setTargetHighlight: Dispatch<SetStateAction<Polygon | null>>
}

export default function Tiles({ cellSize, svgSize, svgMargin, tiles, setTiles, target, setTargetHighlight }: Props) {
    const offset = PUZZLE.screenPadding + svgMargin;

    const { animatedTranslation, drag, draggedTileId } = useTileDrag({
        cellSize,
        boundingDimensions: {
            columns: PUZZLE.columns,
            rows: (svgSize.height - 2 * svgMargin) / cellSize
        },
        offset,
        tiles,
        setTiles,
        target,
        setTargetHighlight
    });

    const svgTiles = tiles.map(tile => {
        return (
            <Tile 
                key={tile.id}
                cellSize={cellSize}
                tile={tile}
                animatedTranslation={tile.id === draggedTileId ? animatedTranslation : undefined}
            />
        )
    });

    return (
        <GestureHandlerRootView style={styles.container}>
            <GestureDetector gesture={drag}>
                <View style={styles.activeArea}> 
                    <Svg>
                        <G transform={`translate(${offset},${offset})`}>
                            {svgTiles}
                        </G>
                    </Svg>
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        height: "100%",
        width: "100%"
    },
    activeArea: {
        height: "100%",
        width: "100%"
    }
});