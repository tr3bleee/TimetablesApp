import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GroupList } from '@/components/GroupList';
import { GROUPS } from '@/constants/groups';
import { useTheme } from 'react-native-paper';

export default function HomePage() {
	const router = useRouter();
	const theme = useTheme();

	const handleGroupSelect = (group: { id: number; name: string }) => {
		router.push(`/schedule/${group.id}`);
	};

	return (
		<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
			<GroupList
				groups={GROUPS}
				onSelectGroup={handleGroupSelect}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});
