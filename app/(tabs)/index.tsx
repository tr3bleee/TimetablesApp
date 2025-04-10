import { GroupInfo } from '@/app/services/api/scheduleApi';
import { GroupList } from '@/components/GroupList';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function HomePage() {
	const router = useRouter();
	const theme = useTheme();

	const handleGroupSelect = (group: GroupInfo) => {
		router.push(`/schedule/${group.id}`);
	};

	return (
		<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
			<GroupList
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
