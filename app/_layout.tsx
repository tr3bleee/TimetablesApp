import { PaperProvider } from 'react-native-paper';
import { Stack } from "expo-router";
import { TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { lightTheme, darkTheme } from '@/constants/theme';
import { ThemeProvider, useThemeContext } from '@/app/contexts/ThemeContext';

const RootLayoutNav = () => {
  const router = useRouter();
  const { isDarkTheme } = useThemeContext();
  const theme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <ExpoStatusBar style={isDarkTheme ? 'light' : 'dark'} />
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            title: Platform.select({
              ios: 'Хекслет Колледж',
              android: 'Хекслет Колледж'
            }),
            headerTitleStyle: {
              color: theme.colors.text,
            },
            headerStyle: {
              backgroundColor: theme.colors.surface,
            },
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => router.push('/info')}
                style={{ marginRight: 15 }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name="info"
          options={{
            headerTintColor: theme.colors.primary,
            headerBackTitle: "Расписание",
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
      <RootLayoutNav />
    </ThemeProvider>
  );
}
