import Button from "@/components/ui/Button";
import { COLORS } from "@/constants/colors";
import { FontAwesome } from "@expo/vector-icons";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";

type Props = {
    icon: keyof typeof FontAwesome.glyphMap
    onPress: () => void,
    style?: StyleProp<ViewStyle>
}

export default function LevelCompleteNavButton({ icon, onPress, style }: Props) {
    return (
        <Button
            onPress={onPress}
            containerStyle={[styles.button, style]}
        >
            <FontAwesome 
                name={icon}
                size={36}
            />
        </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        height: 72,
        aspectRatio: 1,
        backgroundColor: COLORS.yellow,
        justifyContent: "center",
        alignItems: "center",
    }
})