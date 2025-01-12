import bunny from "../targets/bunny.json";

const bunnyShape = bunny.shape as Shape;

export const LEVELS: Level[] = Array.from(Array(100)).map((_, i) => ({
    index: i + 1,
    target: bunnyShape,
    tiles: []
}))