import { FlatList, StyleSheet, View } from "react-native"
import LevelButton from "./LevelButton/LevelButton";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { useFocusEffect } from "expo-router";
import STORAGE from "@/constants/storage";

type Props = {
    levels: Level[]
}

export default function LevelsGrid({ levels }: Props) {
    const [solvedLevels, setSolvedLevels] = useState<number | null>(null);

    const storedSolvedLevels = useAsyncStorage(STORAGE.solvedLevels);

    const readSolvedLevelsItem = async () => {
        const solvedLevelsItem = await storedSolvedLevels.getItem();
        setSolvedLevels(+(solvedLevelsItem || 0));

        if (solvedLevelsItem === null) {
            await storedSolvedLevels.setItem("0");
        }
    }

    useFocusEffect(() => {
        readSolvedLevelsItem();
    });

    return solvedLevels !== null ? (
        <FlatList
            contentContainerStyle={styles.scrollGrid}
            data={levels}
            renderItem={({ item: level }) => (
                <View style={styles.gridItem}>
                    <LevelButton 
                        level={level}
                        levelState={
                            level.index - 1 < solvedLevels ? "solved" :
                            level.index - 1 === solvedLevels ? "current" :
                            "locked"
                        }
                    />
                </View>
            )}
            keyExtractor={level => "level_" + level.index}
            horizontal={false}
            numColumns={3}
        />
    ) : null;
}

const styles = StyleSheet.create({
    scrollGrid: {
        padding: 12
    },
    gridItem: {
        aspectRatio: 1,
        width: "33.33%",
        padding: 12
    }
});