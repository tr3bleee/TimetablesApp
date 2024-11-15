import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import type { GroupInfo } from "../../constants/groups";
import { GROUPS } from "../../constants/groups";
import { useRouter } from 'expo-router';

interface GroupedGroups {
	[key: number]: GroupInfo[];
}

export default function HomePage() {
	const router = useRouter();
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
						<Pressable 
							key={group.id}
							style={({ pressed }) => [
								styles.linkGroup,
								{ opacity: pressed ? 0.7 : 1 }
							]}
							onPress={() => router.push(`/schedule/${group.id}`)}
						>
							<Text style={styles.linkText}>
								{group.name}
							</Text>
						</Pressable>
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
	},
	linkText: {
		textAlign: "center",
		color: "#ffffff",
		fontSize: 16,
	},
});
