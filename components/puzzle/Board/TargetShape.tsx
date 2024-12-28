import { PUZZLE } from "@/constants/puzzle";
import { polygonToSvgPoints, shapeToSvgPoints } from "@/geometry/svg";
import { Fragment, ReactNode } from "react";
import { ClipPath, Defs, G, Polygon as SvgPolygon } from "react-native-svg";
import Grid from "./Grid";
import { getPolygonDimensions, getPolygonOrigin } from "@/geometry/box";

type Props = {
    size: number,
    target: Shape
};

export default function TargetShape({ size, target }: Props) {
    const cellSize = size / PUZZLE.board.dimension;
    const offset = PUZZLE.board.target.border.thickness;
    target = {
        ...target,
        origin: [offset, offset]
    };

    const polygons = shapeToSvgPoints(target, cellSize).map((svgPoints, i) => {
        const key = `target_polygon_${i}`;
        return (
            <Fragment key={key}>
                <Defs>
                    <ClipPath id={key}>
                        <SvgPolygon points={svgPoints} />
                    </ClipPath>
                </Defs>
                <G clipPath={`url(#${key})`}>
                    <Grid 
                        cellSize={cellSize} 
                        origin={getPolygonOrigin(target.polygons[i])}
                        {...getPolygonDimensions(target.polygons[i])}
                    />
                </G>
                <SvgPolygon 
                    points={svgPoints}
                    stroke={PUZZLE.board.target.border.color}
                    strokeWidth={PUZZLE.board.target.border.thickness}
                    strokeLinejoin="round"
                    fill="none"
                />
            </Fragment>
        );
    });

    return polygons;
}