import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#007AFF' }}>
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