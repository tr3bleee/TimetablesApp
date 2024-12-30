import { FavoritesProvider } from "@/app/contexts/FavoritesContext";
import { ScheduleSettingsProvider } from "@/app/contexts/ScheduleSettingsContext";
import { ThemeProvider, useThemeContext } from "@/app/contexts/ThemeContext";
import { darkTheme, lightTheme } from "@/constants/theme";
import { Stack, useRouter } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Platform, TouchableOpacity, View } from "react-native";
import { PaperProvider, useTheme } from "react-native-paper";
import React, { useEffect } from 'react';
import { Snow } from '@/components/Snow';

const RootLayoutNav = () => {
	const { isDarkTheme } = useThemeContext();
	const theme = isDarkTheme ? darkTheme : lightTheme;

	return (
		<PaperProvider theme={theme}>
			<ExpoStatusBar style={isDarkTheme ? "light" : "dark"} />
			<View style={{ flex: 1, backgroundColor: theme.colors.background }}>
				<Stack
					screenOptions={{
						headerTintColor: theme.colors.primary,
						contentStyle: {
							backgroundColor: theme.colors.background,
						},
						animation: Platform.select({
							android: "fade_from_bottom",
							ios: "default",
						}),
					}}
				>
					<Stack.Screen
						name="(tabs)"
						options={{
							headerShown: false,
						}}
					/>
					<Stack.Screen
						name="info"
						options={{
							headerTintColor: theme.colors.primary,
							headerBackTitle: "Назад",
							headerTitle: "О приложении",
							headerTitleStyle: {
								color: theme.colors.text,
							},
							headerStyle: {
								backgroundColor: theme.colors.surface,
							},
						}}
					/>
					<Stack.Screen
						name="secret"
						options={{
							headerBackTitle: "Назад",
							presentation: Platform.select({
								ios: "modal",
								android: undefined,
							}),
							animation: Platform.select({
								ios: "flip",
								android: "fade",
							}),
						}}
					/>
				</Stack>
			</View>
		</PaperProvider>
	);
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <ScheduleSettingsProvider>
          <RootLayoutNav />
          <Snow />
        </ScheduleSettingsProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
