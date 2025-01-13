import { Dimensions, StyleSheet, View } from "react-native";
import { PUZZLE } from "@/constants/puzzle";
import TargetShape from "./TargetShape";
import Tiles from "./Tiles";
import useLayoutSize from "@/hooks/useLayoutSize";
import { useEffect, useState } from "react";
import useIsPuzzleSolved from "@/components/puzzle/Puzzle/hooks/useIsPuzzleSolved";
import splitTarget from "@/puzzle/splitTarget";

type Props = {
    target: Shape,
    initialTiles: Polygon[]
}

const svgMargin = Math.max(
    PUZZLE.target.border.thickness,
    PUZZLE.tile.border.thickness
);

export default function Puzzle({ target, initialTiles }: Props) {
    const { layoutSize: svgSize, handleLayout } = useLayoutSize(PUZZLE.screenPadding);
    const cellSize = Math.max(svgSize.width - 2 * svgMargin, 0) / PUZZLE.columns;

    const [tiles, setTiles] = useState<Polygon[]>(initialTiles);
    const [targetHighlight, setTargetHighlight] = useState<Polygon | null>(null);

    const solved = useIsPuzzleSolved(tiles, target);

    return (
        <View
            style={styles.container}
            onLayout={handleLayout}
        >
            <TargetShape 
                cellSize={cellSize}
                svgWidth={svgSize.width} 
                svgMargin={svgMargin}
                target={target}
                targetHighlight={targetHighlight}
            />
            <Tiles 
                cellSize={cellSize}
                svgSize={svgSize}
                svgMargin={svgMargin}
                tiles={tiles} 
                setTiles={setTiles}
                target={target}
                setTargetHighlight={setTargetHighlight}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center"
    },
});