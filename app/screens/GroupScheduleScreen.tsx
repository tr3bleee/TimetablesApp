import { useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ScheduleView } from '../../components/ScheduleView';
import { getGroupSchedule } from '../services/api/scheduleApi';
import { GroupData } from '../types/schedule';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar as ExpoStatusBar } from "expo-status-bar";

interface Props {
  groupId: number;
  groupName: string;
}

const GroupScheduleScreen: React.FC<Props> = ({ groupId, groupName }) => {
  const [data, setData] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isNextWeek, setIsNextWeek] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: groupName,
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => {
            setIsNextWeek(!isNextWeek);
            fetchData(!isNextWeek);
          }}
          style={{ marginRight: 15 }}
        >
          <Ionicons
            name={isNextWeek ? 'arrow-back-circle-outline' : 'arrow-forward-circle-outline'}
            size={24}
            color="#7f61dd"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, groupName, isNextWeek]);

  const fetchData = async (nextWeek: boolean = false) => {
    try {
      setLoading(true);
      console.log(`🔄 Fetching schedule for group ${groupId}, ${nextWeek ? 'next' : 'current'} week`);
      const response = await getGroupSchedule(groupId, nextWeek);
      setData(response);
    } catch (err) {
      console.error('❌ Error fetching schedule:', err);
      setError(err instanceof Error ? err.message : 'Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [groupId]);

  return (
    <>
      <ExpoStatusBar style="dark" />
      <View style={{ flex: 1 }}>
        <ScheduleView 
        data={data}
        loading={loading}
        error={error}
        isNextWeek={isNextWeek}
        />
      </View>
    </>
  );
};

export default GroupScheduleScreen;