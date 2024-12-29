import { PUZZLE } from "@/constants/puzzle";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Polygon as SvgPolygon } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedProps, withSpring, runOnJS } from "react-native-reanimated";
import { polygonToSvgPoints } from "@/geometry/svg";
import { useEffect } from "react";

const AnimatedPolygon = Animated.createAnimatedComponent(SvgPolygon);

type Props = {
    cellSize: number,
    tile: Polygon,
    setTile: (newTile: Polygon) => void;
};

export default function Tile({ cellSize, tile, setTile }: Props) {
    const originDelta = useSharedValue<Point>([0, 0]);

    const translateTileOrigin = (delta: Point) => {
        const origin = tile.origin || [0, 0];

        setTile({
            ...tile,
            origin: [origin[0] + delta[0], origin[1] + delta[1]],
        });
    };

    const drag = Gesture.Pan()
        .onChange((event) => {
            originDelta.value = [
                event.translationX / cellSize,
                event.translationY / cellSize
            ];
        })
        .onEnd(() => {
            runOnJS(translateTileOrigin)(originDelta.value);
            originDelta.value = [0, 0];
        });

    const animatedProps = useAnimatedProps(() => ({
        transform: [
            { translateX: originDelta.value[0] * cellSize },
            { translateY: originDelta.value[1] * cellSize }
        ]
    }));

    return (
        <GestureDetector gesture={drag}>
            <AnimatedPolygon
                points={polygonToSvgPoints(tile, cellSize)}
                stroke={PUZZLE.tile.border.color}
                strokeWidth={PUZZLE.tile.border.thickness}
                strokeLinejoin="round"
                fill={PUZZLE.tile.color}
                animatedProps={animatedProps}
            />
        </GestureDetector>
    );
}