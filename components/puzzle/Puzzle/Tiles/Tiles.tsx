import Tile from "./Tile"

type Props = {
    cellSize: number,
    tiles: Polygon[]
}

export default function Tiles({ cellSize, tiles }: Props) {
    return tiles.map((tile, i) => (
        <Tile 
            key={`tile_${i}`}
            {...{cellSize, tile}} 
        />
    ))
}