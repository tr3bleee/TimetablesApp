import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useTheme } from 'react-native-paper';
import { Platform } from 'react-native';

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
					height: Platform.select({
						ios: 80,
						android: 60,
					}),
					paddingBottom: Platform.select({
						ios: 25,
						android: 10,
					}),
					paddingTop: Platform.select({
						ios: 8,
						android: 5,
					}),
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "600",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Расписание",
					headerTitle: "Группы",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="school" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="teacher"
				options={{
					title: "Преподаватели",
					headerTitle: "Преподаватели",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Настройки",
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="settings" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}
