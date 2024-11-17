import { PaperProvider } from 'react-native-paper';
import { Stack } from "expo-router";
import { TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const router = useRouter();

  return (
    <PaperProvider>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            title: Platform.select({
              ios: 'Хекслет Колледж',
              android: 'Хекслет Колледж'
            }),
            headerTitleStyle: {
              color: '#1e293b',
            },
            headerRight: () => (
              <TouchableOpacity 
                onPress={() => router.push('/info')}
                style={{ marginRight: 15 }}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={24}
                  color="#7f61dd"
                />
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen 
          name="info"
          options={{
            headerTintColor: "#7f61dd",
            headerBackTitle: "Расписание",
            headerTitleStyle: {
              color: "#1e293b",
            },
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
