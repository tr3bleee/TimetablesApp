import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GroupList } from '@/components/GroupList';
import { GROUPS } from '@/constants/groups';

export default function HomePage() {
	const router = useRouter();

	const handleGroupSelect = (group: { id: number; name: string }) => {
		router.push(`/schedule/${group.id}`);
	};

	return (
		<View style={styles.container}>
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
		backgroundColor: '#f8fafc',
	},
});
