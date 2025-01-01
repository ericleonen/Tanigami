import { Dispatch, SetStateAction, useState } from "react"
import Tile from "./Tile"
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import Svg, { G } from "react-native-svg"
import { StyleSheet, View } from "react-native"
import { isPointInsidePolygonWorklet, nearestGridPointWorklet, pointScaleWorklet, pointSumWorklet } from "@/geometry/point"
import { PUZZLE } from "@/constants/puzzle"
import { clampWorklet } from "@/geometry/number"
import { getPolygonDimensionsWorklet } from "@/geometry/polygon"
import { runOnJS, useSharedValue } from "react-native-reanimated"

type Props = {
    cellSize: number,
    svgSize: {
        height: number,
        width: number
    },
    svgMargin: number,
    tiles: Polygon[],
    setTiles: Dispatch<SetStateAction<Polygon[]>>
}

export default function Tiles({ cellSize, svgSize, svgMargin, tiles, setTiles }: Props) {
    const animatedTranslation = useSharedValue<Point>([0, 0])
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
            for (let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
                const tile = tiles[tileIndex];

                if (isPointInsidePolygonWorklet(touchPoint, tile)) {
                    runOnJS(setDraggedTile)(tile);
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
        // .onChange((event) => {
        //     // don't do anything if no tile has been touched
        //     if (lastSafeOrigin === null) return;

        //     const draggedTile = tiles[tiles.length - 1];
        //     const translate: Point = pointScale([event.translationX, event.translationY], 1 / cellSize);
        //     const newOrigin = pointSum(lastSafeOrigin!, translate);

        //     // keep tile on screen
        //     const polygonDimensions = getPolygonDimensions(draggedTile);
        //     newOrigin[0] = clamp(newOrigin[0], [
        //         0, 
        //         (svgSize.width - 2 * svgMargin) / cellSize - polygonDimensions.columns
        //     ])
        //     newOrigin[1] = clamp(newOrigin[1], [
        //         0, 
        //         (svgSize.height - 2 * svgMargin) / cellSize - polygonDimensions.rows
        //     ])

        //     setTiles(prevTiles => [...prevTiles.slice(0, -1), {
        //         ...draggedTile,
        //         origin: newOrigin
        //     }]);
        // })
        // .onEnd(() => {
        //     if (!lastSafeOrigin) return;

        //     // snap to the nearest grid point
        //     const draggedTile = tiles[tiles.length - 1];
        //     const nearestGridOrigin = nearestGridPoint(draggedTile.origin);

        //     setTiles(prevTiles => [...prevTiles.slice(0, -1), {
        //         ...draggedTile,
        //         origin: nearestGridOrigin
        //     }]);

        //     setLastSafeOrigin(null);
        // })

    const svgTiles = tiles.reduce((list, tile) => {
        if (tile.id === draggedTile?.id) {
            list.push(tile);
        } else {
            list.unshift(tile);
        }

        return list;
    }, [] as Polygon[]).map(tile => {
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