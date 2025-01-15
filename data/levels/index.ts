import levelsOrder from "./order.json";
import targetsJSON from "../targets/index.json";

const targets = targetsJSON as any;

export const LEVELS: Level[] = levelsOrder.map((name, index) => ({
    index: index + 1,
    target: targets[name],
    tiles: []
}));