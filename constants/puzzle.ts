import { COLORS } from "./colors";

export const PUZZLE = {
    screenPadding: 16,
    columns: 8,
    target: {
        color: COLORS.lightgray,
        border: {
            color: COLORS.black,
            thickness: 4
        },
        grid: {
            color: COLORS.gray,
            thickness: 2
        },
    },
    tile: {
        color: COLORS.yellow,
        border: {
            color: COLORS.black,
            thickness: 4
        },
        updateInterval: 0
    }
}