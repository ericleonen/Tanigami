import { PUZZLE } from "@/constants/puzzle";
import { Polygon as SvgPolygon } from "react-native-svg";
import { polygonToSvgPoints } from "@/geometry/svg";
import Animated, { SharedValue, useAnimatedProps, withSpring } from "react-native-reanimated";
import { pointScaleWorklet, pointSumWorklet } from "@/geometry/point";
import { useMemo } from "react";

const AnimatedPolygon = Animated.createAnimatedComponent(SvgPolygon);

type Props = {
    cellSize: number;
    tile: Polygon;
    animatedTranslation?: SharedValue<Point>;
};

export default function Tile({ cellSize, tile, animatedTranslation }: Props) {
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

        return {
            transform: [
                { translateX: withSpring(translate[0], PUZZLE.tile.animation) },
                { translateY: withSpring(translate[1], PUZZLE.tile.animation) }
            ]
        };
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
