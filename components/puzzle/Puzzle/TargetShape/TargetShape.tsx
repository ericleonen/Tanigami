import { PUZZLE } from "@/constants/puzzle";
import { shapeToSvgPoints } from "@/geometry/svg";
import { Fragment } from "react";
import Svg, { ClipPath, Defs, G, Polygon as SvgPolygon } from "react-native-svg";
import Grid from "./Grid";
import { getPolygonDimensions, getPolygonOrigin } from "@/geometry/polygon";

type Props = {
    cellSize: number,
    svgWidth: number,
    svgMargin: number,
    target: Shape
};

export default function TargetShape({ cellSize, svgWidth, svgMargin, target }: Props) {
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

    return (
        <Svg 
            height={svgWidth} 
            width={svgWidth}
            style={{ marginTop: PUZZLE.screenPadding }}
        >
            <G transform={`translate(${svgMargin},${svgMargin})`}>
                {polygons}
            </G>
        </Svg>
    );
}