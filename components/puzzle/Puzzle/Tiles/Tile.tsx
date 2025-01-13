import { PUZZLE } from "@/constants/puzzle";
import { Polygon as SvgPolygon } from "react-native-svg";
import { polygonToSvgPoints } from "@/geometry/svg";
import Animated, { SharedValue, useAnimatedProps, useSharedValue, withSpring } from "react-native-reanimated";
import { pointScaleWorklet, pointSumWorklet } from "@/geometry/point";
import { useEffect, useMemo } from "react";

const AnimatedPolygon = Animated.createAnimatedComponent(SvgPolygon);

type Props = {
    cellSize: number;
    tile: Polygon;
    animatedTranslation?: SharedValue<Point>;
};

export default function Tile({ cellSize, tile, animatedTranslation }: Props) {
    const hasBeenDragged = useSharedValue(false);

    useEffect(() => {
        if (animatedTranslation !== undefined) {
            hasBeenDragged.value = true;
        }
    }, [animatedTranslation !== undefined]);

    const svgPoints = useMemo(() => polygonToSvgPoints({
        ...tile,
        origin: [0, 0]
    }, cellSize), [tile.id, cellSize]);

    const animatedProps = useAnimatedProps(() => {
        const origin = pointSumWorklet(
            animatedTranslation ? animatedTranslation.value : [0, 0],
            tile.origin
        );

        const translate = pointScaleWorklet(origin, cellSize);

        if (hasBeenDragged.value) {
            return {
                transform: [
                    { translateX: withSpring(translate[0], PUZZLE.tile.animation) },
                    { translateY: withSpring(translate[1], PUZZLE.tile.animation) }
                ],
                opacity: 1
            };
        } else if (cellSize) {
            return {
                transform: [
                    { translateX: translate[0] },
                    { translateY: translate[1] }
                ],
                opacity: 1
            };
        } else {
            return {
                opacity: 0
            };
        }
    });

    return (
        <AnimatedPolygon
            points={svgPoints}
            stroke={PUZZLE.tile.border.color}
            strokeWidth={PUZZLE.tile.border.thickness}
            strokeLinejoin="round"
            fill={PUZZLE.tile.color}
            animatedProps={animatedProps}
        />
    );
}
