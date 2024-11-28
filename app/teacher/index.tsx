import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TeacherList } from '@/components/TeacherList';
import { ScheduleView } from '@/components/ScheduleView';
import { TeacherInfo, TeacherSchedule } from '@/app/types/teacher';
import { TEACHERS } from '@/constants/teachers';

const SCHEDULE_API_URL = 'https://your-api-url/teacher-schedule';

export default function TeacherScreen() {
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherInfo>();
  const [schedule, setSchedule] = useState<TeacherSchedule | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNextWeek, setIsNextWeek] = useState(false);

  const fetchTeacherSchedule = async (teacherId: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${SCHEDULE_API_URL}/${teacherId}?next=${isNextWeek ? '1' : '0'}`
      );
      const data = await response.json();
      setSchedule(data);
    } catch (err) {
      setError('Не удалось загрузить расписание');
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherSelect = (teacher: TeacherInfo) => {
    setSelectedTeacher(teacher);
    fetchTeacherSchedule(teacher.id);
  };

  return (
    <View style={styles.container}>
      {!selectedTeacher ? (
        <TeacherList
          teachers={TEACHERS}
          onSelectTeacher={handleTeacherSelect}
          selectedTeacher={selectedTeacher}
        />
      ) : (
        <ScheduleView
          data={schedule}
          loading={loading}
          error={error}
          isNextWeek={isNextWeek}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
}); 