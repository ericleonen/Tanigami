import { StyleSheet, View } from "react-native";
import { PUZZLE } from "@/constants/puzzle";
import TargetShape from "./TargetShape";
import bunny from "@/assets/targets/bunny.json";
import Tiles from "./Tiles";
import useLayoutSize from "@/hooks/useLayoutSize";
import { useEffect, useState } from "react";
import { doesPolygonContainEdge } from "@/geometry/polygon";
import { pointSum } from "@/geometry/point";

const testTarget = bunny.shape as Shape;
const testTiles: Polygon[] = [
    {...testTarget[0], id: "piece_1"},
    {...testTarget[1], id: "piece_2"},
    {
        id: "piece_3",
        origin: [2, 2],
        vertices: [[1, 0], [2, 0], [2, 2], [1, 2], [0, 1]]
    },
    {
        id: "piece_4",
        origin: [4, 3],
        vertices: [[0, 0], [2, 2], [0, 2]]
    },
    {
        id: "piece_5",
        origin: [3, 5],
        vertices: [[1, 0], [3, 0], [3, 1], [4, 2], [3, 3], [1, 1], [0, 1]]
    },
    {
        id: "piece_6",
        origin: [3, 6],
        vertices: [[1, 0], [3, 2], [0, 2], [1, 1]]
    }
];

const svgMargin = Math.max(
    PUZZLE.target.border.thickness,
    PUZZLE.tile.border.thickness
);

export default function Puzzle() {
    const { layoutSize: svgSize, handleLayout } = useLayoutSize(PUZZLE.screenPadding);
    const [tiles, setTiles] = useState<Polygon[]>(testTiles);
    const [target, setTarget] = useState<Shape>(testTarget);
    const cellSize = Math.max(svgSize.width - 2 * svgMargin, 0) / PUZZLE.columns;
    const [targetHighlight, setTargetHighlight] = useState<Polygon | null>(null);

    useEffect(() => {
        // TODO: need to also check that the entire shape is filled
        const solved = target.every(targetPolygon => {
            const targetVertices = targetPolygon.vertices.map(vertex => pointSum(vertex, targetPolygon.origin));

            return targetVertices.every((vertex, i) => {
                const nextVertex = targetVertices[(i + 1) % targetVertices.length];
                const edge: [Point, Point] = [vertex, nextVertex];

                return tiles.some(tile => doesPolygonContainEdge(tile, edge));
            });
        });

        if (solved) console.log("solved!");
    }, [tiles, target]);

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
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        alignItems: "center"
    },
});