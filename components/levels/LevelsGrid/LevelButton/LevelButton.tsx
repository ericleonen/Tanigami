import { COLORS } from "@/constants/colors"
import { StyleSheet, Text, View } from "react-native"
import TargetPreview from "./TargetPreview"
import TYPOGRAPHY from "@/constants/type"
import Button from "@/components/ui/Button"
import { router } from "expo-router"

type Props = {
    level: Level
}

export default function LevelButton({ level }: Props) {
    const onPress = () => {
        router.push(`/play/levels/${level.index}`);
    }

    return (
        <Button 
            onPress={onPress}
            containerStyle={styles.button}
        >
            <View style={styles.levelCircle}>
                <Text style={styles.levelText}>{level.index}</Text>
            </View>
            <TargetPreview target={level.target} />
        </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        height: "100%",
        aspectRatio: 1,
        backgroundColor: COLORS.white,
        alignItems: "center",
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