import { Tabs } from "expo-router";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Platform, StyleSheet } from "react-native";
import HomePage from "./index";
import Settings from "./settings";
import { BlurView } from "expo-blur";

const Tab = createMaterialBottomTabNavigator();

function MaterialTabs() {
	return (
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
					backgroundColor: "transparent",
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "500",
				},
				tabBarBackground: () => (
					<BlurView
						tint="light"
						intensity={50}
						style={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
						}}
					/>
				),
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

const styles = StyleSheet.create({
	blurContainer: {
		flex: 1,
		padding: 20,
		margin: 16,
		textAlign: "center",
		justifyContent: "center",
		overflow: "hidden",
		borderRadius: 20,
	},
});
