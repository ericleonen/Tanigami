import LevelsGrid from "@/components/levels/LevelsGrid";
import { View, StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";
import { LEVELS } from "@/data/levels";

export default function LevelsScreen() {
    return (
        <View style={styles.container}>
            <LevelsGrid levels={LEVELS} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.blue
    }
});