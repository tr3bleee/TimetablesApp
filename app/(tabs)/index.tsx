import { Text, ScrollView, StyleSheet } from "react-native";
import { Link } from 'expo-router';

export default function HomePage() {
	return (
		<>
			<ScrollView
				style={[styles.container, { flex: 1 }]}
				contentContainerStyle={{
					flexGrow: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text style={styles.numberGroup}>Группа 1:</Text>

				<Link
					href="/screens/groups/group1/group-01.24-d"
					style={styles.linkGroup}
				>
					01-24 Д.ОФ 9
				</Link>
				<Link
					href="/"
					style={styles.linkGroup}
					onPress={() => console.log("Pressed")}
				>
					01-24 ИСИП.ОФ 9
				</Link>
				<Link
					href="/"
					style={styles.linkGroup}
					onPress={() => console.log("Pressed")}
				>
					01-24 Р.ОФ 9
				</Link>
				<Link
					href="/"
					style={styles.linkGroup}
					onPress={() => console.log("Pressed")}
				>
					01-24 СИСА.ОФ 9
				</Link>

				<Text style={styles.numberGroup}>Группа 2:</Text>
				<Link
					href="/"
					style={styles.linkGroup}
					onPress={() => console.log("Pressed")}
				>
					02-24 Д.ОФ 9
				</Link>
				<Link
					href="/"
					style={styles.linkGroup}
					onPress={() => console.log("Pressed")}
				>
					02-24 ИСИП.ОФ 9
				</Link>
				<Link
					href="/"
					style={styles.linkGroup}
					onPress={() => console.log("Pressed")}
				>
					02-24 СИСА.ОФ 9
				</Link>

				<Text style={styles.numberGroup}>Группа 3:</Text>
				<Link
					href="/"
					style={styles.linkGroup}
					onPress={() => console.log("Pressed")}
				>
					03-24 Д.ОФ 9
				</Link>
				<Link
					href="/"
					style={styles.linkGroup}
					onPress={() => console.log("Pressed")}
				>
					03-24 ИСИП.ОФ 9
				</Link>

				<Text style={styles.numberGroup}>Группа 4:</Text>
				<Link
					href="/"
					style={styles.linkGroup}
					onPress={() => console.log("Pressed")}
				>
					04-24 ИСИП.ОФ 9
				</Link>

				<Text style={styles.numberGroup}>Группа 5:</Text>
				<Link
					href="/"
					style={styles.linkGroup}
					onPress={() => console.log("Pressed")}
				>
					05-24 ИСИП.ОФ 9
				</Link>

				<Text style={styles.numberGroup}>Группа 6:</Text>
				<Link
					href="/"
					style={styles.linkGroup}
					onPress={() => console.log("Pressed")}
				>
					06-24 ИСИП.ОФ 9
				</Link>
			</ScrollView>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 5,
	},
	numberGroup: {
		fontWeight: "bold",
		fontSize: 18,
		margin: 10,
	},
	linkGroup: {
		marginBottom: 10,
		width: 235,
		padding: 10,
		backgroundColor: "#6200ee",
		borderRadius: 5,
		textAlign: "center",
		color: "#ffffff",
		fontSize: 16,
	},
});
