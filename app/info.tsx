import React, { useLayoutEffect } from "react";
import {
	Text,
	View,
	StyleSheet,
	Linking,
	TouchableOpacity,
	Platform,
} from "react-native";
import { useNavigation, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function InfoScreen() {
	const navigation = useNavigation();

	useLayoutEffect(() => {
		navigation.setOptions({
			title: "О приложении",
			headerShadowVisible: false,
		});
	}, [navigation]);

	const openGithub = () => {
		Linking.openURL("https://github.com/y9tr3ble");
	};

	const openTelegram = () => {
		Linking.openURL("https://t.me/Tr3ble");
	};

	return (
		<>
			<Stack.Screen
				options={{
					headerTintColor: "#7f61dd",
					headerBackTitle: "Группы",
					headerTitleStyle: {
						color: "#1e293b",
					},
				}}
			/>
			<View style={styles.container}>
				<View style={styles.header}>
					<View style={styles.logoContainer}>
						<Ionicons name="calendar" size={48} color="#7f61dd" />
					</View>
					<Text style={styles.appName}>Расписание для Хекслет</Text>
					<Text style={styles.version}>Версия 1.0.0</Text>
				</View>

				<View style={styles.content}>
					<View style={styles.card}>
						<View style={styles.cardHeader}>
							<Ionicons
								name="person-circle-outline"
								size={24}
								color="#7f61dd"
							/>
							<Text style={styles.cardTitle}>Разработчик</Text>
						</View>
						<Text style={styles.developerName}>Новиков Никита</Text>
						<Text style={styles.description}>
							Студент Хекслет Колледж{"\n"}
							Группа 01-24.ИСИП.ОФ 9
						</Text>
					</View>

					<View style={styles.card}>
						<View style={styles.cardHeader}>
							<Ionicons name="link-outline" size={24} color="#7f61dd" />
							<Text style={styles.cardTitle}>Ссылки</Text>
						</View>
						<View style={styles.linksContainer}>
							<TouchableOpacity
								style={styles.linkButton}
								onPress={openGithub}
								activeOpacity={0.7}
							>
								<Ionicons name="logo-github" size={24} color="#7f61dd" />
								<Text style={styles.linkText}>GitHub</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={styles.linkButton}
								onPress={openTelegram}
								activeOpacity={0.7}
							>
								<Ionicons name="paper-plane" size={24} color="#7f61dd" />
								<Text style={styles.linkText}>Telegram</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</View>
		</>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8fafc",
	},
	header: {
		alignItems: "center",
		paddingVertical: 32,
		backgroundColor: "#ffffff",
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
	},
	logoContainer: {
		width: 80,
		height: 80,
		borderRadius: 20,
		backgroundColor: "#eff6ff",
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	appName: {
		fontSize: 24,
		fontWeight: "700",
		color: "#1e293b",
		marginBottom: 4,
	},
	version: {
		fontSize: 15,
		color: "#64748b",
	},
	content: {
		padding: 16,
		gap: 16,
	},
	card: {
		backgroundColor: "#ffffff",
		borderRadius: 16,
		padding: 16,
		...Platform.select({
			ios: {
				shadowColor: "#000",
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4,
			},
			android: {
				elevation: 3,
			},
		}),
	},
	cardHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		marginBottom: 16,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: "#1e293b",
	},
	developerName: {
		fontSize: 17,
		fontWeight: "500",
		color: "#334155",
		marginBottom: 4,
	},
	description: {
		fontSize: 15,
		color: "#64748b",
		lineHeight: 20,
	},
	linksContainer: {
		flexDirection: "row",
		gap: 12,
	},
	linkButton: {
		flex: 1,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		backgroundColor: "#eff6ff",
		padding: 12,
		borderRadius: 12,
	},
	linkText: {
		fontSize: 16,
		fontWeight: "500",
		color: "#7f61dd",
	},
});
