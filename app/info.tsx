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
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useTheme } from 'react-native-paper';
import { useThemeContext } from '@/app/contexts/ThemeContext';

export default function InfoScreen() {
	const navigation = useNavigation();
	const theme = useTheme();
	const { isDarkTheme } = useThemeContext();

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
			<ExpoStatusBar style={isDarkTheme ? 'light' : 'dark'} />			
			<Stack.Screen
				options={{
					headerTintColor: theme.colors.primary,
					headerBackTitle: "Группы",
					headerTitleStyle: {
						color: theme.colors.text,
					},
					headerStyle: {
						backgroundColor: theme.colors.surface,
					},
				}}
			/>
			<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
				<View style={[styles.header, { 
					backgroundColor: theme.colors.surface,
					borderBottomColor: theme.colors.border 
				}]}>
					<View style={[styles.logoContainer, { backgroundColor: theme.colors.accent }]}>
						<Ionicons name="calendar" size={48} color={theme.colors.primary} />
					</View>
					<Text style={[styles.appName, { color: theme.colors.text }]}>
						Расписание для Хекслет
					</Text>
					<Text style={[styles.version, { color: theme.colors.secondaryText }]}>
						Версия 1.0.0
					</Text>
				</View>

				<View style={styles.content}>
					<View style={[styles.card, { 
						backgroundColor: theme.colors.surface,
						shadowColor: isDarkTheme ? '#000' : '#000',
					}]}>
						<View style={styles.cardHeader}>
							<Ionicons
								name="person-circle-outline"
								size={24}
								color={theme.colors.primary}
							/>
							<Text style={[styles.cardTitle, { color: theme.colors.text }]}>
								Разработчик
							</Text>
						</View>
						<Text style={[styles.developerName, { color: theme.colors.text }]}>
							Новиков Никита
						</Text>
						<Text style={[styles.description, { color: theme.colors.secondaryText }]}>
							Студент Хекслет Колледж{"\n"}
							Группа 01-24.ИСИП.ОФ 9
						</Text>
					</View>

					<View style={[styles.card, { 
						backgroundColor: theme.colors.surface,
						shadowColor: isDarkTheme ? '#000' : '#000',
					}]}>
						<View style={styles.cardHeader}>
							<Ionicons name="link-outline" size={24} color={theme.colors.primary} />
							<Text style={[styles.cardTitle, { color: theme.colors.text }]}>
								Ссылки
							</Text>
						</View>
						<View style={styles.linksContainer}>
							<TouchableOpacity
								style={[styles.linkButton, { backgroundColor: theme.colors.accent }]}
								onPress={openGithub}
								activeOpacity={0.7}
							>
								<Ionicons name="logo-github" size={24} color={theme.colors.primary} />
								<Text style={[styles.linkText, { color: theme.colors.primary }]}>
									GitHub
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.linkButton, { backgroundColor: theme.colors.accent }]}
								onPress={openTelegram}
								activeOpacity={0.7}
							>
								<Ionicons name="paper-plane" size={24} color={theme.colors.primary} />
								<Text style={[styles.linkText, { color: theme.colors.primary }]}>
									Telegram
								</Text>
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
		borderRadius: 16,
		padding: 16,
		...Platform.select({
			ios: {
				shadowColor: '#000',
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
