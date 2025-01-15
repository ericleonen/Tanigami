import Puzzle from "@/components/puzzle/Puzzle";
import { LEVELS } from "@/data/levels";
import splitTarget from "@/puzzle/splitTarget";
import { useLocalSearchParams } from "expo-router";

export default function LevelScreen() {
    const level = LEVELS[+useLocalSearchParams().index - 1];

    return (
        <Puzzle 
            target={level.target}
            initialTiles={splitTarget(level.target, 1, 5, 3)}
        />
    )
}