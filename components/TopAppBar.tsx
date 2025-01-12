import { COLORS } from "@/constants/colors";
import TYPOGRAPHY from "@/constants/type";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native"

type Props = {
    title: string
}

export default function TopAppBar({ title }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 60 : 60,
        backgroundColor: COLORS.white,
        borderBottomWidth: 3,
        borderBottomColor: COLORS.black,
        justifyContent: "center",
        alignItems: "center",
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
        
    },
    title: {
        fontSize: 24,
        fontFamily: TYPOGRAPHY.black
    }
});