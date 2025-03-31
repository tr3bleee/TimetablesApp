import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { useTheme } from 'react-native-paper';
import { Platform, TouchableOpacity } from 'react-native';

export default function TabLayout() {
	const theme = useTheme();
	const router = useRouter();

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: theme.colors.primary,
				tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
				headerTintColor: theme.colors.primary,
				headerTitleStyle: {
					color: theme.colors.onSurface,
					fontSize: 20,
					fontWeight: "500",
				},
				headerStyle: {
					backgroundColor: theme.colors.surface,
					elevation: 0,
					shadowOpacity: 0,
				},
				tabBarStyle: {
					backgroundColor: theme.colors.surface,
					borderTopColor: theme.colors.outlineVariant,
					height: Platform.select({
						ios: 90,
						android: 65,
					}),
					paddingBottom: Platform.select({
						ios: 35,
						android: 12,
					}),
					paddingTop: Platform.select({
						ios: 10,
						android: 8,
					}),
					elevation: 0,
					shadowOpacity: 0,
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "500",
				},
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Расписание",
					headerTitle: "Группы",
					tabBarIcon: ({ color, size, focused }) => (
						<MaterialCommunityIcons 
							name={focused ? "school" : "school-outline"} 
							size={size} 
							color={color} 
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="teacher"
				options={{
					title: "Педагоги",
					headerTitle: "Педагоги",
					tabBarIcon: ({ color, size, focused }) => (
						<MaterialCommunityIcons 
							name={focused ? "account" : "account-outline"} 
							size={size} 
							color={color} 
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="favorites"
				options={{
					title: "Избранное",
					tabBarIcon: ({ color, size, focused }) => (
						<MaterialCommunityIcons 
							name={focused ? "star" : "star-outline"} 
							size={size} 
							color={color} 
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					title: "Настройки",
					headerRight: () => (
						<TouchableOpacity 
							onPress={() => router.push('/info')}
							style={{ marginRight: 15 }}
						>
							<MaterialCommunityIcons
								name="information-outline"
								size={24}
								color={theme.colors.primary}
							/>
						</TouchableOpacity>
					),
					tabBarIcon: ({ color, size, focused }) => (
						<MaterialCommunityIcons 
							name={focused ? "cog" : "cog-outline"} 
							size={size} 
							color={color} 
						/>
					),
				}}
			/>
		</Tabs>
	);
}
