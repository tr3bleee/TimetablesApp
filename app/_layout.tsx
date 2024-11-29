import { FavoritesProvider } from '@/app/contexts/FavoritesContext';
import { ScheduleSettingsProvider } from '@/app/contexts/ScheduleSettingsContext';
import { ThemeProvider, useThemeContext } from '@/app/contexts/ThemeContext';
import { darkTheme, lightTheme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useRouter } from "expo-router";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { Platform, TouchableOpacity } from 'react-native';
import { PaperProvider } from 'react-native-paper';

const RootLayoutNav = () => {
  const router = useRouter();
  const { isDarkTheme } = useThemeContext();
  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <ExpoStatusBar style={isDarkTheme ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerTintColor: theme.colors.primary,
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
      </Stack>
    </PaperProvider>
  );
};

export default function RootLayout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <ScheduleSettingsProvider>
          <RootLayoutNav />
        </ScheduleSettingsProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}
