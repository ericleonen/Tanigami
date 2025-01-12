import { Pressable, Text, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS } from "@/constants/colors";
import { Link, router, type Href } from "expo-router";
import TYPOGRAPHY from "@/constants/type";

type Props = {
    icon: keyof typeof FontAwesome5.glyphMap,
    label: string,
    color: typeof COLORS[keyof typeof COLORS],
    href: Href,
    style?: StyleProp<ViewStyle>
}

export default function ModeButton({ icon, label, color, href, style }: Props) {
    const onPress = () => {
        router.replace(href);
    }
    
    return (
        <Pressable
            style={({ pressed }) => [
                styles.button,
                { 
                    backgroundColor: color,
                    transform: [
                        { scale: pressed ? 0.95 : 1 }
                    ]
                },
                style
            ]}
            onPress={onPress}
        >
            
            <FontAwesome5
                style={styles.icon}
                name={icon}
                size={36}
            />
            <Text style={styles.label}>
                {label}
            </Text>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        width: "100%",
        borderWidth: 3,
        borderColor: COLORS.black,
        boxShadow: "4 4 0 " + COLORS.black
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