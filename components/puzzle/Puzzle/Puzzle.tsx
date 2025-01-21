import { StyleSheet, View } from "react-native";
import { PUZZLE } from "@/constants/puzzle";
import TargetShape from "./TargetShape";
import Tiles from "./Tiles";
import useLayoutSize from "@/hooks/useLayoutSize";
import { useState } from "react";
import useHandlePuzzleSolved from "@/components/puzzle/Puzzle/hooks/useHandlePuzzleSolved";
import React from "react";

type Props = {
    target: Shape,
    initialTiles: Polygon[],
    onSolved: () => void
}

const svgMargin = Math.max(
    PUZZLE.target.border.thickness,
    PUZZLE.tile.border.thickness
);

export default function Puzzle({ target, initialTiles, onSolved }: Props) {
    const { layoutSize: svgSize, handleLayout } = useLayoutSize(PUZZLE.screenPadding);

    const cellSize = Math.min(
        Math.max(svgSize.width - 2 * svgMargin, 0) / PUZZLE.columns,
        Math.max(svgSize.height - 2 * svgMargin, 0) / PUZZLE.rows
    )

    const [tiles, setTiles] = useState<Polygon[]>(initialTiles);
    const [targetHighlight, setTargetHighlight] = useState<Polygon | null>(null);
    const [disabled, setDisabled] = useState(false);

    useHandlePuzzleSolved(tiles, target, () => {
        onSolved();
        setDisabled(true);
    });

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
                disabled={disabled}
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