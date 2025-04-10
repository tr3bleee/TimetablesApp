import { useSchedule } from '@/app/hooks/useSchedule';
import { GroupInfo, getGroups } from '@/app/services/api/scheduleApi';
import { GroupData } from '@/app/types/schedule';
import { ScheduleView } from '@/components/ScheduleView';
import { WeekSelector } from '@/components/WeekSelector';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function SchedulePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const theme = useTheme();
  
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groups = await getGroups();
        const foundGroup = groups.find(g => g.id === parseInt(id));
        if (foundGroup) {
          setGroup(foundGroup);
        }
      } catch (error) {
        console.error('Error fetching group info:', error);
      }
    };
    
    fetchGroup();
  }, [id]);
  
  const {
    schedule,
    loading,
    error,
    isNextWeek,
    handleWeekChange,
    refetch
  } = useSchedule({
    type: 'group',
    id: parseInt(id)
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{
          title: group?.name || `Группа ${id}`,
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            color: theme.colors.onSurface,
            fontSize: 18,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerBackTitle: 'Группы',
        }}
      />
      <WeekSelector
        isNextWeek={isNextWeek}
        onWeekChange={handleWeekChange}
      />
      <ScheduleView
        data={schedule as GroupData | null}
        loading={loading}
        error={error}
        isNextWeek={isNextWeek}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});