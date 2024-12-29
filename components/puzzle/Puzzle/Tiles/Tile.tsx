import { PUZZLE } from "@/constants/puzzle";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Polygon as SvgPolygon } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedProps, runOnJS } from "react-native-reanimated";
import { polygonToSvgPoints } from "@/geometry/svg";
import { useEffect } from "react";

const AnimatedPolygon = Animated.createAnimatedComponent(SvgPolygon);

type Props = {
    cellSize: number,
    tile: Polygon,
    setTile: (newTile: Polygon) => void;
};

export default function Tile({ cellSize, tile, setTile }: Props) {
    const origin = useSharedValue<Point>(tile.origin ?? [0, 0]);
    const startOrigin = useSharedValue<Point>([0, 0]);

    useEffect(() => {
        origin.value = tile.origin ?? [0, 0];
    }, [tile.origin, origin]);

    const setTileOrigin = (newOrigin: Point) => {
        setTile({
            ...tile,
            origin: newOrigin,
        });
    };

    const drag = Gesture.Pan()
        .onBegin(() => {
            startOrigin.value = [...origin.value];
        })
        .onUpdate((event) => {
            origin.value = [
                startOrigin.value[0] + event.translationX / cellSize,
                startOrigin.value[1] + event.translationY / cellSize
            ];
        })
        .onEnd(() => {
            runOnJS(setTileOrigin)(origin.value);
        });

    const animatedProps = useAnimatedProps(() => ({
        points: tile.vertices.map(vertex => (
            `${(origin.value[0] + vertex[0]) * cellSize},${(origin.value[1] + vertex[1]) * cellSize}`
        )).join(" ")
    }));

    return (
        <GestureDetector gesture={drag}>
            <AnimatedPolygon
                // points={polygonToSvgPoints(tile, cellSize)}
                stroke={PUZZLE.tile.border.color}
                strokeWidth={PUZZLE.tile.border.thickness}
                strokeLinejoin="round"
                fill={PUZZLE.tile.color}
                animatedProps={animatedProps}
            />
        </GestureDetector>
    );
}