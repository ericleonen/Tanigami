import { COLORS } from "@/constants/colors";
import { PUZZLE } from "@/constants/puzzle";
import { polygonToSvgPoints } from "@/geometry/svg"
import useLayoutSize from "@/hooks/useLayoutSize";
import { StyleSheet, View } from "react-native";
import Svg, { G, Polygon } from "react-native-svg"

type Props = {
    target: Shape,
    color: string
}

export default function TargetPreview({ target, color }: Props) {
    const { layoutSize: containerSize, handleLayout } = useLayoutSize(0);
    const size = Math.max(containerSize.width - 2 * PUZZLE.target.border.previewThickness, 0);

    const polygons = target.map(polygon => (
        <Polygon 
            key={polygon.id}
            points={polygonToSvgPoints(polygon, size / PUZZLE.columns)}
            fill={color}
            stroke={COLORS.black}
            strokeWidth={PUZZLE.target.border.previewThickness}
            strokeLinejoin="round"
        /> 
    ));

    return (
        <View 
            style={styles.container}
            onLayout={handleLayout}
        >
            <Svg height={containerSize.height} width={containerSize.width}>
                <G transform={`translate(${PUZZLE.target.border.previewThickness},${PUZZLE.target.border.previewThickness})`}>
                    {polygons}
                </G>
            </Svg>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        aspectRatio: 1
    }
});