import { COLORS } from "./colors";

export const PUZZLE = {
    padding: 16,
    board: {
        dimension: 8,
        grid: {
            color: COLORS.gray,
            thickness: 2
        },
        target: {
            color: COLORS.lightgray,
            border: {
                color: COLORS.black,
                thickness: 4
            }
        }
    }
}