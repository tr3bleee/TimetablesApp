import { useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View } from 'react-native';
import { ScheduleView } from '../../components/ScheduleView';
import { getGroupSchedule } from '../services/api/scheduleApi';
import { GroupData } from '../types/schedule';

interface Props {
  groupId: number;
  groupName: string;
}

const GroupScheduleScreen: React.FC<Props> = ({ groupId, groupName }) => {
  const [data, setData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: groupName,
    });
  }, [navigation, groupName]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`🔄 Fetching schedule for group ${groupId}`);
        const response = await getGroupSchedule(groupId);
        setData(response);
      } catch (err) {
        console.error('❌ Error fetching schedule:', err);
        setError(err instanceof Error ? err.message : 'Ошибка при загрузке данных');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [groupId]);

  return (
    <View style={{ flex: 1 }}>
      <ScheduleView 
        data={data}
        loading={loading}
        error={error}
      />
    </View>
  );
};

export default GroupScheduleScreen;