import { StyleSheet, useWindowDimensions, View } from "react-native";
import Svg from "react-native-svg";
import { PUZZLE } from "@/constants/puzzle";
import TargetShape from "./TargetShape";
import bunny from "@/assets/targets/bunny.json";

const testTarget = bunny as Shape;

export default function Board() {
    const screenWidth = useWindowDimensions().width;
    const size = screenWidth - 2 * PUZZLE.padding;
    const svgMargin = PUZZLE.board.target.border.thickness;

    return (
        <View style={styles.container}>
            <Svg
                height={size + 2*svgMargin} 
                width={size + 2*svgMargin}
            >
                <TargetShape size={size} target={testTarget} />
            </Svg>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        aspectRatio: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});