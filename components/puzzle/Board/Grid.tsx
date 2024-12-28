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
    const offset = PUZZLE.board.target.border.thickness;

    let [minX, minY] = origin;
    minX *= cellSize;
    minY *= cellSize;
    const maxX = minX + (columns + 1) * cellSize;
    const maxY = minY + (rows + 1) * cellSize;

    for (let i = 0; i < rows - 1; i++) {
        // create horizontal line
        const y = minY + (i + 1) * cellSize;
        lines.push(
            <Line 
                key={`h-${i}`}
                x1={minX + offset}
                x2={maxX + offset}
                y1={y + offset}
                y2={y + offset}
                stroke={PUZZLE.board.grid.color}
                strokeWidth={PUZZLE.board.grid.thickness}
            />
        );
    }

    for (let i = 0; i < columns - 1; i++) {
        // create vertical line
        const x = minX + (i + 1) * cellSize;
        lines.push(
            <Line 
                key={`v-${i}`}
                x1={x + offset}
                x2={x + offset}
                y1={minY}
                y2={maxY}
                stroke={PUZZLE.board.grid.color}
                strokeWidth={PUZZLE.board.grid.thickness}
            />
        );
    }

    return (
        <>
            <Rect
                x={minX + offset}
                y={minY + offset}
                height={maxX - minX}
                width={maxY - minY}
                fill={PUZZLE.board.target.color}
            />
            {lines}
        </>
    );
}