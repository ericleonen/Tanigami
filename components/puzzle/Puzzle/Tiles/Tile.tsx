import { PUZZLE } from "@/constants/puzzle";
import { polygonToSvgPoints } from "@/geometry/svg";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { Polygon as SvgPolygon } from "react-native-svg";

type Props = {
    cellSize: number,
    tile: Polygon
}

export default function Tile({ cellSize, tile }: Props) {
    const svgPoints = polygonToSvgPoints(tile, cellSize);

    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onStart(() => {
            console.log("double tapped!");
        });

    return (
        <GestureDetector gesture={doubleTap}>
            <SvgPolygon
                points={svgPoints}
                stroke={PUZZLE.tile.border.color} 
                strokeWidth={PUZZLE.tile.border.thickness}
                strokeLinejoin="round"
                fill={PUZZLE.tile.color}
                onResponderMove={(_) => {}}
            />
        </GestureDetector>
    );
}