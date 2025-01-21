type LayoutSize = {
    height: number,
    width: number
};

type Level = {
    name: string,
    index: number,
    target: Shape,
    tiles: Polygon[]
}

type LevelState = "locked" | "current" | "solved";