import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from 'react-native-paper';

export default function TabLayout() {
	const theme = useTheme();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: theme.colors.primary,
				tabBarInactiveTintColor: theme.colors.secondary,
				headerTintColor: theme.colors.primary,
				headerTitleStyle: {
					color: theme.colors.onSurface,
					fontSize: 18,
					fontWeight: "600",
				},
				headerStyle: {
					backgroundColor: theme.colors.surface,
				},
				tabBarStyle: {
					backgroundColor: theme.colors.surface,
					borderTopColor: theme.colors.outline,
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Расписание",
					headerTitle: "Группы",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="calendar-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="teacher"
				options={{
					title: "Преподаватели",
					headerTitle: "Преподаватели",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="people-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Настройки",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="settings-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
