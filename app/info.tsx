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
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from "expo-router";

export default function InfoScreen() {
	const navigation = useNavigation();
	const theme = useTheme();
	const { isDarkTheme } = useThemeContext();
	const [tapCount, setTapCount] = React.useState(0);
	const router = useRouter();

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

	const handleNamePress = () => {
		const newCount = tapCount + 1;
		setTapCount(newCount);
		
		if (newCount === 15) {
			router.push('/secret');
			setTapCount(0);
		}
	};

	return (
		<>
			<ExpoStatusBar style={isDarkTheme ? 'light' : 'dark'} />
			<Stack.Screen
				options={{
					headerTintColor: theme.colors.primary,
					headerBackTitle: "Назад",
					headerTitleStyle: {
						color: theme.colors.onSurface,
					},
					headerStyle: {
						backgroundColor: theme.colors.surface,
					},
				}}
			/>
			<View style={[styles.container, { backgroundColor: theme.colors.background }]}>
				<View style={[styles.header, { 
					backgroundColor: theme.colors.surface,
					borderBottomColor: theme.colors.outline 
				}]}>
					<View style={[styles.logoContainer, { backgroundColor: theme.colors.primaryContainer }]}>
						<Ionicons name="school" size={48} color={theme.colors.primary} />
					</View>
					<Text style={[styles.appName, { color: theme.colors.onSurface }]}>
						Расписание для Хекслет
					</Text>
					<Text style={[styles.version, { color: theme.colors.onSurfaceVariant }]}>
						Версия 1.0.0
					</Text>
				</View>

				<View style={styles.content}>
					<View style={[styles.card, { 
						backgroundColor: theme.colors.surface,
						borderColor: theme.colors.outline,
					}]}>
						<View style={styles.cardHeader}>
							<Ionicons
								name="person-circle"
								size={24}
								color={theme.colors.primary}
							/>
							<Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
								Разработчик
							</Text>
						</View>
						<TouchableOpacity onPress={handleNamePress}>
							<Text style={[styles.developerName, { color: theme.colors.onSurface }]}>
								Новиков Никита
							</Text>
						</TouchableOpacity>
						<Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
							Студент Хекслет Колледж{"\n"}
							Группа 01-24.ИСИП.ОФ 9
						</Text>
					</View>

					<View style={[styles.card, { 
						backgroundColor: theme.colors.surface,
						borderColor: theme.colors.outline,
					}]}>
						<View style={styles.cardHeader}>
							<Ionicons name="link" size={24} color={theme.colors.primary} />
							<Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
								Ссылки
							</Text>
						</View>
						<View style={styles.linksContainer}>
							<TouchableOpacity
								style={[styles.linkButton, { backgroundColor: theme.colors.primaryContainer }]}
								onPress={openGithub}
								activeOpacity={0.7}
							>
								<Ionicons name="logo-github" size={24} color={theme.colors.primary} />
								<Text style={[styles.linkText, { color: theme.colors.primary }]}>
									GitHub
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								style={[styles.linkButton, { backgroundColor: theme.colors.primaryContainer }]}
								onPress={openTelegram}
								activeOpacity={0.7}
							>
								<FontAwesome name="telegram" size={24} color={theme.colors.primary} />
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
		borderBottomWidth: 1,
	},
	logoContainer: {
		width: 80,
		height: 80,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginBottom: 16,
	},
	appName: {
		fontSize: 24,
		fontWeight: "700",
		marginBottom: 4,
	},
	version: {
		fontSize: 15,
	},
	content: {
		padding: 16,
		gap: 16,
	},
	card: {
		borderRadius: 16,
		padding: 16,
		borderWidth: 1,
		...Platform.select({
			ios: {
				shadowColor: '#000',
				shadowOffset: { width: 0, height: 2 },
				shadowOpacity: 0.1,
				shadowRadius: 4,
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
	},
	developerName: {
		fontSize: 17,
		fontWeight: "500",
		marginBottom: 4,
	},
	description: {
		fontSize: 15,
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
			padding: 12,
			borderRadius: 12,
	},
	linkText: {
		fontSize: 16,
		fontWeight: "500",
	},
});
