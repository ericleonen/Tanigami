import Board from "@/components/puzzle/Board";
import { PUZZLE } from "@/constants/puzzle";
import { StyleSheet, View } from "react-native";

export default function Index() {
	return (
		<View style={styles.container}>
			<Board />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	}
});
