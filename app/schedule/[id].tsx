import { useLocalSearchParams, Stack } from 'expo-router';
import { GROUPS } from '../../constants/groups';
import GroupScheduleScreen from '../screens/GroupScheduleScreen';

export default function SchedulePage() {
  const { id } = useLocalSearchParams();
  const group = GROUPS.find(g => g.id === Number(id));

  return (
    <>
      <Stack.Screen 
        options={{ 
          headerTintColor: '#7f61dd',
          headerBackTitle: 'Группы',
          headerTitleStyle: {
            color: '#1e293b'
          }
        }} 
      />
      <GroupScheduleScreen 
        groupId={Number(id)} 
        groupName={group?.name || 'Неизвестная группа'} 
      />
    </>
  );
}