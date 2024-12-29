import { PUZZLE } from "@/constants/puzzle";
import { shapeToSvgPoints } from "@/geometry/svg";
import { Fragment } from "react";
import { ClipPath, Defs, G, Polygon as SvgPolygon } from "react-native-svg";
import Grid from "./Grid";
import { getPolygonDimensions, getPolygonOrigin } from "@/geometry/box";
import { pointSum } from "@/geometry/point";

type Props = {
    cellSize: number,
    target: Shape
};

export default function TargetShape({ cellSize, target }: Props) {
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
                    stroke={PUZZLE.target.border.color}
                    strokeWidth={PUZZLE.target.border.thickness}
                    strokeLinejoin="round"
                    fill="none"
                />
            </Fragment>
        );
    });

    return polygons;
}