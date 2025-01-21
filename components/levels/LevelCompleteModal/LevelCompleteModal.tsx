import { COLORS } from "@/constants/colors";
import TYPOGRAPHY from "@/constants/type";
import { StyleSheet, Text, View } from "react-native";
import LevelCompleteNavButton from "./LevelCompleteNavButton";
import { router } from "expo-router";

type Props = {
    levelIndex: number
}

export default function LevelCompleteModal({ levelIndex }: Props) {
    return (
        <View style={styles.invisibleContainer}>
            <View style={styles.container}>
                <Text style={styles.levelCompleteText}>Level Complete!</Text>
                <View style={styles.navButtons}>
                    <LevelCompleteNavButton
                        icon="th"
                        onPress={() => {
                            router.back()
                        }}
                    />
                    <LevelCompleteNavButton
                        icon="rotate-left"
                        onPress={() => {
                            router.replace(`/play/levels/${levelIndex}`)
                        }}
                        style={{
                            marginHorizontal: 20
                        }}
                    />
                    <LevelCompleteNavButton
                        icon="arrow-right"
                        onPress={() => {
                            router.replace(`/play/levels/${levelIndex + 1}`)
                        }}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    invisibleContainer: {
        position: "absolute",
        height: "100%",
        width: "100%",
        paddingHorizontal: 32,
        justifyContent: "center",
        alignItems: "center"
    },
    container: {
        backgroundColor: COLORS.white,
        borderWidth: 3,
        borderColor: COLORS.black,
        boxShadow: "4 4 0 " + COLORS.black,
        padding: 24,
        alignItems: "center",
        marginBottom: 64
    },
    levelCompleteText: {
        fontFamily: TYPOGRAPHY.black,
        fontSize: 36,
        textAlign: "center"
    },
    navButtons: {
        flexDirection: "row",
        marginTop: 16
    }
})