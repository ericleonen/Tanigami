import { PUZZLE } from "@/constants/puzzle";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Polygon as SvgPolygon } from "react-native-svg";
import { useSharedValue } from "react-native-reanimated";
import { polygonToSvgPoints } from "@/geometry/svg";
import { isPointInsidePolygon } from "@/geometry/point";
import { useState } from "react";

type Props = {
    cellSize: number,
    tile: Polygon,
    setTile: (newTile: Polygon) => void,
    shiftTiles: () => void
};

export default function Tile({ cellSize, tile, setTile, shiftTiles }: Props) {
    const [lastSafeOrigin, setLastSafeOrigin] = useState<Point | null>(null);

    const setTileOrigin = (newOrigin: Point) => {
        setTile({
            ...tile,
            origin: newOrigin
        });
    };

    const drag = Gesture.Pan()
        .runOnJS(true)
        .onStart((event) => {
            if (isPointInsidePolygon(
                [event.x / cellSize, event.y / cellSize],
                tile
            )) {
                setLastSafeOrigin(tile.origin || [0, 0]);
            } else {
                setLastSafeOrigin(null);
                shiftTiles()
            };
        })
        .onChange((event) => {
            if (!lastSafeOrigin) return;

            setTileOrigin([
                lastSafeOrigin[0] + event.translationX / cellSize,
                lastSafeOrigin[1] + event.translationY / cellSize
            ]);
        })
        .onEnd(() => {
            setLastSafeOrigin(null);
        })

    return (
        <GestureDetector gesture={drag}>
            <SvgPolygon
                points={polygonToSvgPoints(tile, cellSize)}
                stroke={PUZZLE.tile.border.color}
                strokeWidth={PUZZLE.tile.border.thickness}
                strokeLinejoin="round"
                fill={PUZZLE.tile.color}
            />
        </GestureDetector>
    );
}