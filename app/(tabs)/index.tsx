import { ScrollView, StyleSheet, Text, View, Pressable, Platform } from "react-native";
import type { GroupInfo } from "../../constants/groups";
import { GROUPS } from "../../constants/groups";
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
				<View key={category} style={styles.categoryContainer}>
					<Text style={styles.categoryTitle}>Группа {category}</Text>
					<View style={styles.groupsGrid}>
						{groups.map((group: GroupInfo) => (
							<Pressable 
								key={group.id}
								style={({ pressed }) => [
									styles.groupCard,
									{ opacity: pressed ? 0.9 : 1 }
								]}
								onPress={() => router.push(`/schedule/${group.id}`)}
							>
								<Ionicons name="people-outline" size={24} color="#7f61dd" />
								<Text style={styles.groupName}>{group.name}</Text>
								<Ionicons 
									name="chevron-forward" 
									size={20} 
									color="#94a3b8"
									style={styles.arrow}
								/>
							</Pressable>
						))}
					</View>
				</View>
			))}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#f8fafc',
	},
	contentContainer: {
		padding: 16,
		paddingBottom: 100,
	},
	categoryContainer: {
		marginBottom: 24,
	},
	categoryTitle: {
		fontSize: 20,
		fontWeight: '700',
		color: '#1e293b',
		marginBottom: 12,
		paddingLeft: 4,
	},
	groupsGrid: {
		gap: 12,
	},
	groupCard: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#ffffff',
		padding: 16,
		borderRadius: 12,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4,
			},
			android: {
				elevation: 3,
			},
		}),
	},
	groupName: {
		flex: 1,
		fontSize: 16,
		fontWeight: '500',
		color: '#334155',
		marginLeft: 12,
	},
	arrow: {
		marginLeft: 8,
	},
});
