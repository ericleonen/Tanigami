import { PUZZLE } from "@/constants/puzzle";
import React from "react";
import { ReactNode } from "react"
import { Line, Rect } from "react-native-svg";

type Props = {
    cellSize: number,
    origin: Point,
    rows: number,
    columns: number
}

export default function Grid({ cellSize, origin, rows, columns }: Props) {
    const lines: ReactNode[] = [];

    let [minX, minY] = origin;
    minX *= cellSize;
    minY *= cellSize;
    const maxX = minX + columns * cellSize;
    const maxY = minY + rows * cellSize;

    for (let i = 0; i < rows - 1; i++) {
        // create horizontal line
        const y = minY + (i + 1) * cellSize;
        lines.push(
            <Line 
                key={`h-${i}`}
                x1={minX}
                x2={maxX}
                y1={y}
                y2={y}
                stroke={PUZZLE.target.grid.color}
                strokeWidth={PUZZLE.target.grid.thickness}
            />
        );
    }

    for (let i = 0; i < columns - 1; i++) {
        // create vertical line
        const x = minX + (i + 1) * cellSize;
        lines.push(
            <Line 
                key={`v-${i}`}
                x1={x}
                x2={x}
                y1={minY}
                y2={maxY}
                stroke={PUZZLE.target.grid.color}
                strokeWidth={PUZZLE.target.grid.thickness}
            />
        );
    }

    return (
        <>
            <Rect
                x={origin[0] * cellSize}
                y={origin[1] * cellSize}
                height={rows * cellSize}
                width={columns * cellSize}
                fill={PUZZLE.target.color}
            />
            {lines}
        </>
    );
}