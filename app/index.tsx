import ModeButton from "@/components/home/ModeButton";
import { COLORS } from "@/constants/colors";
import STORAGE from "@/constants/storage";
import TYPOGRAPHY from "@/constants/type";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
import { StyleSheet, View, Text } from "react-native";

export default function HomeScreen() {
	const storedSolvedLevels = useAsyncStorage(STORAGE.solvedLevels);

	useFocusEffect(() => {
		storedSolvedLevels.removeItem();
	})

	return (
		<View style={styles.container}>
			<Text style={styles.title}>TANIGAMI</Text>
			<View style={styles.navContainer}>
				<ModeButton
					icon="play"
					label="Levels"
					color={COLORS.yellow}
					href="./play/levelSelector"
				/>
				<ModeButton 
					icon="infinity"
					label="Endless Mode"
					color="white"
					href="./play/endless"
					style={{ marginTop: 16 }}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		padding: 32,
		backgroundColor: COLORS.blue
	},
	navContainer: {
		width: "100%",
		marginTop: 48
	},
	title: {
		fontSize: 48,
		fontFamily: TYPOGRAPHY.black
	}
});
