import { PUZZLE } from "@/constants/puzzle";
import { polygonToSvgPoints } from "@/geometry/svg";
import { Fragment, useEffect } from "react";
import Svg, { ClipPath, Defs, G, Polygon as SvgPolygon } from "react-native-svg";
import Grid from "./Grid";
import { getPolygonDimensions } from "@/geometry/polygon";
import * as Haptics from 'expo-haptics';

type Props = {
    cellSize: number,
    svgWidth: number,
    svgMargin: number,
    target: Shape,
    targetHighlight: Polygon | null
};

export default function TargetShape({ cellSize, svgWidth, svgMargin, target, targetHighlight }: Props) {
    const highlight = targetHighlight ? (
        <SvgPolygon
            points={polygonToSvgPoints(targetHighlight, cellSize)}
            fill={PUZZLE.tile.color}
            opacity={PUZZLE.tile.highlightOpacity}
        />
    ) : null;

    useEffect(() => {
        if (targetHighlight) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    }, [targetHighlight]);
    
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
                    {highlight}
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