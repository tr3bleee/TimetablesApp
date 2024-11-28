import { useLocalSearchParams, Stack } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ScheduleView } from '@/components/ScheduleView';
import { useSchedule } from '@/app/hooks/useSchedule';
import { TEACHERS } from '@/constants/teachers';
import { WeekSelector } from '@/components/WeekSelector';
import { useTheme } from 'react-native-paper';

export default function TeacherSchedulePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const teacher = TEACHERS.find(t => t.id === parseInt(id));
  const theme = useTheme();
  
  const {
    schedule,
    loading,
    error,
    isNextWeek,
    handleWeekChange
  } = useSchedule({
    type: 'teacher',
    id: parseInt(id)
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{
          title: teacher?.fio || `Преподаватель ${id}`,
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            color: theme.colors.text,
            fontSize: 18,
            fontWeight: '600',
          },
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
          headerBackTitle: 'Преподаватели',
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
        isTeacherSchedule
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 