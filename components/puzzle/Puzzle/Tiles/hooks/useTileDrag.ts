import { arePointsEqualWorklet, nearestGridPointWorklet, pointScaleWorklet, pointSumWorklet } from "@/geometry/point";
import { clampPolygonToBoundingBoxWorklet, isPointInsidePolygonWorklet } from "@/geometry/polygon";
import { isPolygonInsideShapeWorklet } from "@/geometry/shape";
import { Dispatch, SetStateAction, useState } from "react";
import { Gesture, PanGesture } from "react-native-gesture-handler";
import { runOnJS, SharedValue, useSharedValue } from "react-native-reanimated";

type UseTileDragProps = {
    cellSize: number,
    boundingDimensions: Dimensions,
    offset: number,
    tiles: Polygon[],
    setTiles: Dispatch<SetStateAction<Polygon[]>>,
    target: Shape,
    setTargetHighlight: Dispatch<SetStateAction<Polygon | null>>
}

export default function useTileDrag({
    cellSize,
    boundingDimensions,
    offset,
    tiles,
    setTiles,
    target,
    setTargetHighlight
}: UseTileDragProps): {
    animatedTranslation: SharedValue<Vector>,
    drag: PanGesture,
    draggedTileId: string | null,
} {
    const animatedTranslation = useSharedValue<Vector>([0, 0]);
    const snappedTile = useSharedValue<Polygon | null>(null);
    const [draggedTile, setDraggedTile] = useState<Polygon | null>(null);

    const drag = Gesture.Pan()
        .onStart(event => {
            // adjust touch point for the offset and convert into grid cell units
            const touchPoint = pointScaleWorklet(
                [event.x - offset, event.y - offset],
                1 / cellSize
            );

            // find touched tile, make it the dragged tile, and place it on top of stack
            for (let tileIndex = tiles.length - 1; tileIndex >= 0; tileIndex--) {
                const tile = tiles[tileIndex];

                if (isPointInsidePolygonWorklet(touchPoint, tile)) {
                    runOnJS(setDraggedTile)(tile);
                    runOnJS(setTiles)([
                        ...tiles.filter(otherTile => otherTile.id !== tile.id),
                        tile
                    ]);
                    break;
                }
            }

            animatedTranslation.value = [0, 0];
        })
        .onChange(event => {
            if (!draggedTile) return;

            animatedTranslation.value = pointScaleWorklet(
                [event.translationX, event.translationY],
                1 / cellSize
            );

            const newSnappedTileOrigin = nearestGridPointWorklet(
                pointSumWorklet(animatedTranslation.value, draggedTile.origin)
            );

            if (
                draggedTile.id !== snappedTile.value?.id ||
                !arePointsEqualWorklet(newSnappedTileOrigin, snappedTile.value.origin)
            ) {
                snappedTile.value = {
                    ...draggedTile,
                    origin: newSnappedTileOrigin
                };

                if (isPolygonInsideShapeWorklet(snappedTile.value, target)) {
                    runOnJS(setTargetHighlight)(snappedTile.value);
                } else {
                    runOnJS(setTargetHighlight)(null);
                }
            }
        })
        .onEnd(() => {
            if (!draggedTile) return;

            const newTile = draggedTile;

            // snap tile inside target if applicable
            if (
                snappedTile.value &&
                isPolygonInsideShapeWorklet(snappedTile.value, target)
            ) {
                newTile.origin = snappedTile.value.origin;
            } else {
                newTile.origin = pointSumWorklet(animatedTranslation.value, draggedTile.origin);
                clampPolygonToBoundingBoxWorklet(newTile, {
                    origin: [0, 0],
                    ...boundingDimensions
                });
            }

            runOnJS(setTiles)(tiles.map(tile => {
                if (tile.id === newTile.id) {
                    return newTile;
                } else {
                    return tile;
                }
            }));

            runOnJS(setDraggedTile)(null);
            runOnJS(setTargetHighlight)(null);

            snappedTile.value = null;
        })

    return {
        animatedTranslation,
        drag,
        draggedTileId: draggedTile?.id || null
    };
}