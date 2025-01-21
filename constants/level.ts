import { COLORS } from "./colors";

const LEVEL = {
    styles: {
        "locked": {
            targetColor: COLORS.black,
            backgroundColor: COLORS.gray
        },
        "current": {
            targetColor: COLORS.white,
            backgroundColor: COLORS.yellow
        },
        "solved": {
            targetColor: COLORS.yellow,
            backgroundColor: COLORS.white
        }
    }
}

export default LEVEL;