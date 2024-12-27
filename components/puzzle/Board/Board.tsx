import { StyleSheet, useWindowDimensions, View } from "react-native";
import Svg from "react-native-svg";
import Grid from "./Grid";
import { PUZZLE } from "@/constants/puzzle";

export default function Board() {
    const screenWidth = useWindowDimensions().width;
    const size = screenWidth - 2 * PUZZLE.padding;

    return (
        <View style={styles.container}>
            <View style={styles.board}>
                <Svg
                    height={size} 
                    width={size}
                >
                    <Grid size={size} dimension={PUZZLE.board.dimension} />
                </Svg>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    board: {
        borderWidth: PUZZLE.board.border.thickness,
        borderColor: PUZZLE.board.border.color,
        backgroundColor: PUZZLE.board.backgroundColor
    }
});