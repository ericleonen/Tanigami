import { COLORS } from "@/constants/colors";
import { PropsWithChildren } from "react"
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native"
import * as Haptics from "expo-haptics";

type Props = PropsWithChildren<{
    onPress: () => void,
    containerStyle: StyleProp<ViewStyle>
}>;

export default function Button({ onPress, containerStyle, children }: Props) {
    return (
        <Pressable
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
                onPress();
            }} 
            style={({ pressed }) => [
                styles.button,
                { 
                    transform: [{ scale: pressed ? 0.95 : 1 }]
                },
                containerStyle
            ]}
        >
            {children}
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        borderWidth: 3,
        borderColor: COLORS.black,
        boxShadow: "4 4 0 " + COLORS.black
    }
});