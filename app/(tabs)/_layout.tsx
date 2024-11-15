import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#007AFF',
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => router.push('/info')}
          style={{ marginRight: 15 }}
        >
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#007AFF"
          />
        </TouchableOpacity>
      ),
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Расписание',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={focused ? color : 'black'} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="reviews"
        options={{
          title: 'Отзывы',
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'star' : 'star-outline'}
              size={28}
              color={focused ? color : 'black'} 
            />
          ),
        }}
      />
    </Tabs>
  );
}