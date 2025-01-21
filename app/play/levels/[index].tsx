import LevelCompleteModal from "@/components/levels/LevelCompleteModal/LevelCompleteModal";
import Puzzle from "@/components/puzzle/Puzzle";
import { PUZZLE } from "@/constants/puzzle";
import STORAGE from "@/constants/storage";
import { LEVELS } from "@/data/levels";
import shuffleAndArrangeTiles from "@/puzzle/shuffleAndArrangeTiles";
import splitTarget from "@/puzzle/splitTarget";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function LevelScreen() {
    const level = LEVELS[+useLocalSearchParams().index - 1];
    const tiles = splitTarget(level.target, {
        minArea: 3,
        numTiles: 5,
        minAngle: 30,
        minWidth: 0.5,
        gamma: 3
    })

    const [showLevelCompleteModal, setShowLevelCompleteModal] = useState(false);
    const storedSolvedLevels = useAsyncStorage(STORAGE.solvedLevels);

    const handlePuzzleSolved = async () => {
        setShowLevelCompleteModal(true);

        const currentLevelsSolved = +(await storedSolvedLevels.getItem() || 0);
        await storedSolvedLevels.setItem("" + Math.max(level.index, currentLevelsSolved));
    }

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            title: `Level #${level.index}: ${level.name}`
        });
    }, [level.index, level.name]);

    return (
        <View style={styles.container}>
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
                onSolved={handlePuzzleSolved}
            />
            { 
                showLevelCompleteModal && 
                <LevelCompleteModal levelIndex={level.index }/>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative"
    }
})