import { useLocalSearchParams, Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScheduleView } from '@/components/ScheduleView';
import { useSchedule } from '@/app/hooks/useSchedule';
import { GROUPS } from '@/constants/groups';
import { WeekSelector } from '@/components/WeekSelector';
import { useTheme } from 'react-native-paper';

export default function SchedulePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const group = GROUPS.find(g => g.id === parseInt(id));
  const theme = useTheme();
  
  const {
    schedule,
    loading,
    error,
    isNextWeek,
    handleWeekChange
  } = useSchedule({
    type: 'group',
    id: parseInt(id)
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{
          title: group?.name || `Группа ${id}`,
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            color: theme.colors.text,
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
        data={schedule}
        loading={loading}
        error={error}
        isNextWeek={isNextWeek}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});