import { PUZZLE } from "@/constants/puzzle";
import { polygonToSvgPoints } from "@/geometry/svg";
import { Fragment } from "react";
import Svg, { ClipPath, Defs, G, Polygon as SvgPolygon } from "react-native-svg";
import Grid from "./Grid";
import { getPolygonDimensions } from "@/geometry/polygon";

type Props = {
    cellSize: number,
    svgWidth: number,
    svgMargin: number,
    target: Shape
};

export default function TargetShape({ cellSize, svgWidth, svgMargin, target }: Props) {
    const polygons = target.map(polygon => {
        const key = polygon.id;
        const svgPoints = polygonToSvgPoints(polygon, cellSize);

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
                        origin={polygon.origin}
                        {...getPolygonDimensions(polygon)}
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
        )
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