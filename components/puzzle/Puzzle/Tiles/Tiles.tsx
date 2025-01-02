import { Dispatch, SetStateAction, useState } from "react"
import Tile from "./Tile"
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import Svg, { G } from "react-native-svg"
import { StyleSheet, View } from "react-native"
import { distanceBetweenPointsWorklet, isPointInsidePolygonWorklet, nearestGridPointWorklet, pointScaleWorklet, pointSumWorklet } from "@/geometry/point"
import { PUZZLE } from "@/constants/puzzle"
import { clampWorklet } from "@/geometry/number"
import { getPolygonDimensionsWorklet, isPolygonInsideShapeWorklet } from "@/geometry/polygon"
import { runOnJS, useSharedValue } from "react-native-reanimated"

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
    const animatedTranslation = useSharedValue<Point>([0, 0]);
    const snappedTile = useSharedValue<Polygon | null>(null);
    const [draggedTile, setDraggedTile] = useState<Polygon | null>(null);

    const offset = PUZZLE.screenPadding + svgMargin;

    const drag = Gesture.Pan()
        .onStart(event => {
            // adjust the touch point for the svgMargin and convert into grid cell units
            const touchPoint: Point = pointScaleWorklet(
                [event.x - offset, event.y - offset], 
                1 / cellSize
            );

            // find touched tile and capture its id
            for (let tileIndex = tiles.length - 1; tileIndex >= 0; tileIndex--) {
                const tile = tiles[tileIndex];

                if (isPointInsidePolygonWorklet(touchPoint, tile)) {
                    runOnJS(setDraggedTile)(tile);
                    runOnJS(setTiles)([...tiles.filter(prevTile => prevTile.id !== tile.id), tile])
                    break;
                }
            }

            animatedTranslation.value = [0, 0];
        })
        .onChange(event => {
            if (!draggedTile) return;

            animatedTranslation.value = pointScaleWorklet(
                [event.translationX, event.translationY], 
                1 / cellSize
            );
            
            const newSnappedTileOrigin = nearestGridPointWorklet(
                pointSumWorklet(animatedTranslation.value, draggedTile.origin)
            );

            if (
                draggedTile.id !== snappedTile.value?.id || 
                snappedTile.value && distanceBetweenPointsWorklet(newSnappedTileOrigin, snappedTile.value.origin) > 0
            ) {
                snappedTile.value = {
                    ...draggedTile,
                    origin: newSnappedTileOrigin
                };
    
                if (isPolygonInsideShapeWorklet(snappedTile.value, target)) {
                    runOnJS(setTargetHighlight)({
                        id: snappedTile.value.id + "_highlight",
                        vertices: snappedTile.value.vertices,
                        origin: snappedTile.value.origin
                    });
                } else {
                    runOnJS(setTargetHighlight)(null);
                }
            }
        })
        .onEnd(() => {
            if (!draggedTile) return;

            // bounce dragged tile back onto screen if it leaves
            let newOrigin = pointSumWorklet(animatedTranslation.value, draggedTile.origin);
            const draggedTileDimensions = getPolygonDimensionsWorklet(draggedTile);
            newOrigin[0] = clampWorklet(
                newOrigin[0], 
                [0, PUZZLE.columns - draggedTileDimensions.columns]
            );
            newOrigin[1] = clampWorklet(
                newOrigin[1], 
                [0, (svgSize.height - 2 * svgMargin) / cellSize - draggedTileDimensions.rows]
            );

            // snap tile inside target if applicable
            if (
                snappedTile.value && 
                isPolygonInsideShapeWorklet(snappedTile.value, target)
            ) {
                newOrigin = snappedTile.value.origin;
            }

            runOnJS(setTiles)(tiles.map(tile => {
                if (tile.id === draggedTile.id) {
                    return {
                        ...tile,
                        origin: newOrigin
                    }
                } else {
                    return tile;
                }
            }))
            runOnJS(setDraggedTile)(null);
        })

    const svgTiles = tiles.map(tile => {
        return (
            <Tile 
                key={tile.id}
                cellSize={cellSize}
                tile={tile}
                animatedTranslation={tile.id === draggedTile?.id ? animatedTranslation : undefined}
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