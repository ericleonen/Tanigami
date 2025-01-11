import { FlatList, StyleSheet, View } from "react-native"
import LevelButton from "./LevelButton/LevelButton";

type Props = {
    levels: Level[]
}

export default function LevelsGrid({ levels }: Props) {
    return (
        <FlatList
            contentContainerStyle={styles.scrollGrid}
            data={levels}
            renderItem={({ item: level }) => (
                <View style={styles.gridItem}>
                    <LevelButton level={level} />
                </View>
            )}
            keyExtractor={level => "level_" + level.index}
            horizontal={false}
            numColumns={3}
        />
    )
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