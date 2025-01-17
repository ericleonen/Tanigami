import Puzzle from "@/components/puzzle/Puzzle";
import { PUZZLE } from "@/constants/puzzle";
import { LEVELS } from "@/data/levels";
import shuffleAndArrangeTiles from "@/puzzle/shuffleAndArrangeTiles";
import splitTarget from "@/puzzle/splitTarget";
import { useLocalSearchParams } from "expo-router";

export default function LevelScreen() {
    const level = LEVELS[+useLocalSearchParams().index - 1];
    const tiles = splitTarget(level.target, {
        minArea: 3,
        numTiles: 5,
        minAngle: 30,
        minWidth: 0.5,
        gamma: 3
    })

    return (
        <Puzzle 
            target={level.target}
            initialTiles={shuffleAndArrangeTiles(tiles, {
                origin: [0, PUZZLE.columns],
                rows: PUZZLE.columns,
                columns: PUZZLE.columns
            }, {
                alpha: 0.1,
                maxSteps: 100
            })}
        />
    )
}