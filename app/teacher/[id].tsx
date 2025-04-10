import { useSchedule } from '@/app/hooks/useSchedule';
import { TeacherInfo, getTeachers } from '@/app/services/api/scheduleApi';
import { GroupData } from '@/app/types/schedule';
import { ScheduleView } from '@/components/ScheduleView';
import { WeekSelector } from '@/components/WeekSelector';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function TeacherSchedulePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [teacher, setTeacher] = useState<TeacherInfo | null>(null);
  const theme = useTheme();
  
  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const teachers = await getTeachers();
        const foundTeacher = teachers.find(t => t.id === parseInt(id));
        if (foundTeacher) {
          setTeacher(foundTeacher);
        }
      } catch (error) {
        console.error('Error fetching teacher info:', error);
      }
    };
    
    fetchTeacher();
  }, [id]);
  
  const {
    schedule,
    loading,
    error,
    isNextWeek,
    handleWeekChange,
    refetch
  } = useSchedule({
    type: 'teacher',
    id: parseInt(id)
  });

  const handleRefresh = () => {
    refetch();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{
          title: teacher?.fio || `Преподаватель ${id}`,
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            color: theme.colors.onSurface,
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
        data={schedule as GroupData | null}
        loading={loading}
        error={error}
        isNextWeek={isNextWeek}
        isTeacherSchedule
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