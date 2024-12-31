import { Dispatch, SetStateAction, useState } from "react"
import Tile from "./Tile"
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import Svg, { G } from "react-native-svg"
import { StyleSheet, View } from "react-native"
import { distanceBetweenPoints, isPointInsidePolygon, nearestGridPoint, pointScale, pointSum } from "@/geometry/point"
import { PUZZLE } from "@/constants/puzzle"
import { clamp } from "@/geometry/number"
import { getPolygonDimensions } from "@/geometry/polygon"

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
    const [lastSafeOrigin, setLastSafeOrigin] = useState<Point | null>(null);

    const drag = Gesture.Pan()
        .runOnJS(true)
        .onStart((event) => {
            // adjust the touch point for the svgMargin and convert into grid cell units
            const touchPoint: Point = pointScale(
                [event.x - svgMargin, event.y - svgMargin], 
                1 / cellSize
            );

            // find touched tile, place it on top, and capture its last safe origin
            for (let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
                const tile = tiles[tileIndex];

                if (isPointInsidePolygon(touchPoint, tile)) {
                    setTiles(prevTiles => [
                        ...prevTiles.filter(prevTile => prevTile !== tile),
                        tile,
                    ]);
                    setLastSafeOrigin(tile.origin || [0, 0]);
                    break;
                }
            }
        })
        .onChange((event) => {
            // don't do anything if no tile has been touched
            if (lastSafeOrigin === null) return;

            const draggedTile = tiles[tiles.length - 1];
            const translate: Point = pointScale([event.translationX, event.translationY], 1 / cellSize);
            const newOrigin = pointSum(lastSafeOrigin!, translate);

            // keep tile on screen
            const polygonDimensions = getPolygonDimensions(draggedTile);
            newOrigin[0] = clamp(newOrigin[0], [
                0, 
                (svgSize.width - 2 * svgMargin) / cellSize - polygonDimensions.columns
            ])
            newOrigin[1] = clamp(newOrigin[1], [
                0, 
                (svgSize.height - 2 * svgMargin) / cellSize - polygonDimensions.rows
            ])

            setTiles(prevTiles => [...prevTiles.slice(0, -1), {
                ...draggedTile,
                origin: newOrigin
            }]);
        })
        .onEnd(() => {
            if (!lastSafeOrigin) return;

            // snap to the nearest grid point
            const draggedTile = tiles[tiles.length - 1];
            const nearestGridOrigin = nearestGridPoint(draggedTile.origin || [0, 0]);

            setTiles(prevTiles => [...prevTiles.slice(0, -1), {
                ...draggedTile,
                origin: nearestGridOrigin
            }]);

            setLastSafeOrigin(null);
        })

    const svgTiles = tiles.map((tile, i) => {
        return (
            <Tile 
                key={`tile_${i}`}
                {...{cellSize, tile}} 
            />
        )
    });

    return (
        <GestureHandlerRootView style={{
            ...styles.container,
            top: PUZZLE.screenPadding - svgMargin,
            left: PUZZLE.screenPadding - svgMargin,
        }}>
            <GestureDetector gesture={drag}>
                <View style={styles.activeArea}> 
                    <Svg>
                        <G transform={`translate(${svgMargin},${svgMargin})`}>
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