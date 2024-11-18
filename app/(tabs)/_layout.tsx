import { Tabs } from "expo-router";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Platform } from "react-native";
import HomePage from "./index";
import Settings from "./settings";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

const Tab = createMaterialBottomTabNavigator();

function MaterialTabs() {
	return (
		<>
			<ExpoStatusBar style="dark" />
			<Tab.Navigator
				initialRouteName="index"
				activeColor="#7f61dd"
				inactiveColor="#64748b"
				barStyle={{
					backgroundColor: "#ffffff",
					borderTopWidth: 1,
					borderTopColor: "#e2e8f0",
					height: 80,
					justifyContent: "center",
				}}
				shifting={false}
				labeled={true}
			>
				<Tab.Screen
					name="index"
					component={HomePage}
					options={{
						tabBarLabel: "Расписание",
						tabBarIcon: ({ color, focused }) => (
							<Ionicons
								name={focused ? "calendar" : "calendar-outline"}
								size={24}
								color={color}
							/>
						),
					}}
				/>
				<Tab.Screen
					name="settings"
					component={Settings}
					options={{
						tabBarLabel: "Настройки",
						tabBarIcon: ({ color, focused }) => (
							<Ionicons
								name={focused ? "settings" : "settings-outline"}
								size={24}
								color={color}
							/>
						),
					}}
				/>
			</Tab.Navigator>
		</>
	);
}

export default function TabLayout() {
	if (Platform.OS === "android") {
		return <MaterialTabs />;
	}

	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarActiveTintColor: "#7f61dd",
				tabBarStyle: {
					height: 84,
					paddingBottom: 30,
					paddingTop: 5,
					borderTopWidth: 1,
					borderTopColor: "#e2e8f0",
					position: "absolute",
					bottom: 0,
					left: 0,
					right: 0,
					backgroundColor: "#ffffff",
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "500",
				}
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					tabBarLabel: "Расписание",
					tabBarIcon: ({ focused, color }) => (
						<Ionicons
							name={focused ? "calendar" : "calendar-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
			<Tabs.Screen
				name="settings"
				options={{
					tabBarLabel: "Настройки",
					tabBarIcon: ({ focused, color }) => (
						<Ionicons
							name={focused ? "settings" : "settings-outline"}
							size={24}
							color={color}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
