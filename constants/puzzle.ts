import { COLORS } from "./colors";

export const PUZZLE = {
    screenPadding: 16,
    rows: 16,
    columns: 8,
    target: {
        color: COLORS.lightgray,
        border: {
            color: COLORS.black,
            thickness: 4,
            previewThickness: 2
        },
        grid: {
            color: COLORS.gray,
            thickness: 2
        },
    },
    tile: {
        color: COLORS.yellow,
        highlightOpacity: 0.5,
        border: {
            color: COLORS.black,
            thickness: 4
        },
        animation: {
            damping: 20,
            stiffness: 200
        }
    }
}