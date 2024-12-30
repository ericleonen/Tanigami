import { Dispatch, SetStateAction } from "react"
import Tile from "./Tile"

type Props = {
    cellSize: number,
    tiles: Polygon[],
    setTiles: Dispatch<SetStateAction<Polygon[]>>
}

export default function Tiles({ cellSize, tiles, setTiles }: Props) {
    const shiftTiles = () => {
        setTiles(prevTiles => [...prevTiles.slice(1), prevTiles[0]])
    }

    return cellSize ? tiles.map((tile, i) => {
        const setTile = (newTile: Polygon) => {
            setTiles(prevTiles => prevTiles.map((prevTile, j) => (
                i === j ? newTile : prevTile
            )))
        };

        return (
            <Tile 
                key={`tile_${i}`}
                {...{cellSize, tile, setTile, shiftTiles}} 
            />
        )
    }) : null;
}