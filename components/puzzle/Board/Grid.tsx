import { PUZZLE } from "@/constants/puzzle";
import { ReactNode } from "react"
import { Line } from "react-native-svg";

type Props = {
    size: number,
    dimension: number
}

export default function Grid({ size, dimension }: Props) {
    const cellSize = size / dimension;
    const lines: ReactNode[] = [];

    for (let i = 0; i < dimension - 1; i++) {
        // create horizontal line
        const y = (i + 1) * cellSize;
        lines.push(
            <Line 
                key={`h-${i}`}
                x1={0}
                x2={size}
                y1={y}
                y2={y}
                stroke={PUZZLE.board.grid.color}
                strokeWidth={PUZZLE.board.grid.thickness}
            />
        );

        // create vertical line
        const x = (i + 1) * cellSize;
        lines.push(
            <Line 
                key={`v-${i}`}
                x1={x}
                x2={x}
                y1={0}
                y2={size}
                stroke={PUZZLE.board.grid.color}
                strokeWidth={PUZZLE.board.grid.thickness}
            />
        );
    }

    return lines;
}