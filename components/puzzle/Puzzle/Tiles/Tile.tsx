import { PUZZLE } from "@/constants/puzzle";
import { Polygon as SvgPolygon } from "react-native-svg";
import { polygonToSvgPoints } from "@/geometry/svg";

type Props = {
    cellSize: number,
    tile: Polygon
};

export default function Tile({ cellSize, tile }: Props) {
    return (
        <SvgPolygon
            points={polygonToSvgPoints(tile, cellSize)}
            stroke={PUZZLE.tile.border.color}
            strokeWidth={PUZZLE.tile.border.thickness}
            strokeLinejoin="round"
            fill={PUZZLE.tile.color}
        />
    );
}