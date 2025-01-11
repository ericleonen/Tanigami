import LevelsGrid from "@/components/levels/LevelsGrid";
import { View, StyleSheet } from "react-native";
import bunny from "@/assets/targets/bunny.json";
import { COLORS } from "@/constants/colors";

const bunnyShape = bunny.shape as Shape;

const levels: Level[] = Array.from(Array(100)).map((_, i) => ({
    index: i + 1,
    target: bunnyShape,
    tiles: []
}))

export default function LevelsScreen() {
    return (
        <View style={styles.container}>
            <LevelsGrid levels={levels} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.blue
    }
});