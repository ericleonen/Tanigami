import { Dispatch, SetStateAction, useState } from "react"
import Tile from "./Tile"
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler"
import Svg, { G } from "react-native-svg"
import { View } from "react-native"
import { isPointInsidePolygon, pointScale, pointSum } from "@/geometry/point"
import { PUZZLE } from "@/constants/puzzle"
import { clamp } from "@/geometry/number"
import { getPolygonDimensions } from "@/geometry/box"

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
    const [draggedTileIndex, setDraggedTileIndex] = useState<number | null>(null);

    const drag = Gesture.Pan()
        .runOnJS(true)
        .onStart((event) => {
            const touchPoint: Point = pointScale(
                [event.x - svgMargin, event.y - svgMargin], 
                1 / cellSize
            );

            for (let tileIndex = 0; tileIndex < tiles.length; tileIndex++) {
                const tile = tiles[tileIndex];

                if (isPointInsidePolygon(touchPoint, tile)) {
                    setDraggedTileIndex(tileIndex);
                    setLastSafeOrigin(tile.origin || [0, 0]);
                    break;
                }
            }
        })
        .onChange((event) => {
            if (draggedTileIndex === null) return;

            const translate: Point = pointScale([event.translationX, event.translationY], 1 / cellSize);

            setTiles((prevTiles) => prevTiles.map((prevTile, tileIndex) => {
                if (draggedTileIndex === tileIndex) {
                    const newOrigin = pointSum(lastSafeOrigin!, translate);

                    // keep tile on screen
                    const polygonDimensions = getPolygonDimensions(tiles[draggedTileIndex]);
                    newOrigin[0] = clamp(newOrigin[0], [
                        0, 
                        (svgSize.width - 2 * svgMargin) / cellSize - polygonDimensions.columns
                    ])
                    newOrigin[1] = clamp(newOrigin[1], [
                        0, 
                        (svgSize.height - 2 * svgMargin) / cellSize - polygonDimensions.rows
                    ])

                    return {
                        ...prevTile,
                        origin: newOrigin
                    };
                } else {
                    return prevTile;
                }
            }))
        })
        .onEnd(() => {
            setDraggedTileIndex(null);
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

    return cellSize ? (
        <GestureHandlerRootView style={{
            position: "absolute",
            top: PUZZLE.screenPadding - svgMargin,
            left: PUZZLE.screenPadding - svgMargin,
            height: "100%",
            width: "100%",
        }}>
            <GestureDetector gesture={drag}>
                <View style={{
                    height: "100%",
                    width: "100%"
                }}> 
                    <Svg>
                        <G transform={`translate(${svgMargin},${svgMargin})`}>
                            {svgTiles}
                        </G>
                    </Svg>
                </View>
            </GestureDetector>
        </GestureHandlerRootView>
    ) : null;
}