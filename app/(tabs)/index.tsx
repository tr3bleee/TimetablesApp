import { Text, ScrollView, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { GROUPS } from "../constants/groups";
import type { GroupInfo } from "../constants/groups";

interface GroupedGroups {
	[key: number]: GroupInfo[];
}

export default function HomePage() {
	const groupedGroups = GROUPS.reduce((acc: GroupedGroups, group) => {
		if (!acc[group.category]) {
			acc[group.category] = [];
		}
		acc[group.category].push(group);
		return acc;
	}, {} as GroupedGroups);

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.contentContainer}
		>
			{Object.entries(groupedGroups).map(([category, groups]) => (
				<View key={category}>
					<Text style={styles.numberGroup}>Группа {category}:</Text>
					{groups.map((group: GroupInfo) => (
						<Link
							key={group.id}
							href={`/schedule/${group.id}`}
							style={styles.linkGroup}
						>
							{group.name}
						</Link>
					))}
				</View>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		marginTop: 5,
	},
	contentContainer: {
		flexGrow: 1,
		alignItems: "center",
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
		backgroundColor: "#007AFF",
		borderRadius: 10,
		overflow: "hidden",
		textAlign: "center",
		color: "#ffffff",
		fontSize: 16,
	},
});
