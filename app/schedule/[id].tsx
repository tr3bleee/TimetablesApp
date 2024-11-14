import { useLocalSearchParams } from 'expo-router';
import { GROUPS } from '../../constants/groups';
import GroupScheduleScreen from '../screens/GroupScheduleScreen';

export default function SchedulePage() {
  const { id } = useLocalSearchParams();
  const group = GROUPS.find(g => g.id === Number(id));

  return (
    <GroupScheduleScreen 
      groupId={Number(id)} 
      groupName={group?.name || 'Неизвестная группа'} 
    />
  );
}