import { Text, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS } from "@/constants/colors";
import { router, type Href } from "expo-router";
import TYPOGRAPHY from "@/constants/type";
import Button from "../ui/Button";

type Props = {
    icon: keyof typeof FontAwesome5.glyphMap,
    label: string,
    color: string,
    href: Href,
    style?: StyleProp<ViewStyle>
}

export default function ModeButton({ icon, label, color, href, style }: Props) {
    const onPress = () => {
        router.push(href);
    }
    
    return (
        <Button
            onPress={onPress}
            containerStyle={[
                styles.button,
                { backgroundColor: color },
                style
            ]}
        >
            <FontAwesome5
                style={styles.icon}
                name={icon}
                size={36}
            />
            <Text style={styles.label}>
                {label}
            </Text>
        </Button>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        width: "100%"
    },
    icon: {
        marginHorizontal: 12,
        opacity: 0.8,
        width: 48
    },
    label: {
        fontSize: 28,
        fontFamily: TYPOGRAPHY.bold,
        opacity: 0.8
    }
});