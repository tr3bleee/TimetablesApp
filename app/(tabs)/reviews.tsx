import { Text, View, StyleSheet } from "react-native";

export default function Reviews() {
	return (
		<>
			<View style={styles.container}>
				<Text>Отзывы</Text>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
});
