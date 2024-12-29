import Puzzle from "@/components/puzzle/Puzzle";
import { StyleSheet, View } from "react-native";

export default function Index() {
	return (
		<View style={styles.container}>
			<Puzzle />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
