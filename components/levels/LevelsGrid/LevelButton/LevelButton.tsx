import { COLORS } from "@/constants/colors"
import { Pressable, StyleSheet, Text, View } from "react-native"
import TargetPreview from "./TargetPreview"
import TYPOGRAPHY from "@/constants/type"

type Props = {
    level: Level
}

export default function LevelButton({ level }: Props) {
    return (
        <Pressable style={styles.button}>
            <View style={styles.levelCircle}>
                <Text style={styles.levelText}>{level.index}</Text>
            </View>
            <TargetPreview target={level.target} />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        height: "100%",
        aspectRatio: 1,
        backgroundColor: COLORS.white,
        alignItems: "center",
        borderWidth: 3,
        boxShadow: "4 4 0 " + COLORS.black,
        padding: 4,
        position: "relative"
    },
    levelCircle: {
        height: 28,
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "50%",
        boxShadow: "1 1 0 " + COLORS.black,
        position: "absolute",
        backgroundColor: "white",
        left: 4,
        top: 4,
        zIndex: 2
    },
    levelText: {
        textAlign: "center",
        fontSize: 12,
        fontFamily: TYPOGRAPHY.black
    }
})