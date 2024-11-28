import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: "#7f61dd",
				headerTintColor: "#7f61dd",
				headerTitleStyle: {
					color: "#1e293b",
					fontSize: 18,
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
