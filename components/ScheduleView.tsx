import React from 'react';
import { SectionList, StyleSheet, Text, View, ActivityIndicator, Platform } from 'react-native';
import { GroupData, Lesson, TeacherSchedule } from '@/app/types/schedule';
import { DAYS_OF_WEEK, getWeekDates } from '@/app/utils/dateUtils';
import { LessonCard } from './LessonCard';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  data: GroupData | TeacherSchedule | null;
  loading: boolean;
  error: string | null;
  isNextWeek: boolean;
  isTeacherSchedule?: boolean;
}

export const ScheduleView: React.FC<Props> = ({ 
  data, 
  loading, 
  error, 
  isNextWeek,
  isTeacherSchedule 
}) => {
  if (loading) return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#7f61dd" />
      <Text style={styles.loadingText}>Загрузка расписания...</Text>
    </View>
  );

  if (error) return (
    <View style={styles.centerContainer}>
      <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
      <Text style={styles.errorText}>Ошибка: {error}</Text>
    </View>
  );

  if (!data?.lessons || data.lessons.length === 0) return (
    <View style={styles.centerContainer}>
      <Ionicons name="calendar-outline" size={48} color="#94a3b8" />
      <Text style={styles.emptyText}>Расписание отсутствует</Text>
      <Text style={styles.emptySubtext}>
        {isNextWeek ? 'На следующую неделю' : 'На текущую неделю'}
      </Text>
    </View>
  );

  const weekDates = data ? getWeekDates(data.startDate) : [];
  
  const groupedLessons = data?.lessons?.reduce((acc: { [key: number]: Lesson[] }, lesson) => {
    if (!acc[lesson.weekday]) {
      acc[lesson.weekday] = [];
    }

    const existingLessonIndex = acc[lesson.weekday].findIndex(
      existing => 
        existing.lesson === lesson.lesson && 
        existing.subject?.id === lesson.subject?.id &&
        existing.startTime === lesson.startTime
    );

    if (existingLessonIndex !== -1) {
      const existingLesson = acc[lesson.weekday][existingLessonIndex];
      acc[lesson.weekday][existingLessonIndex] = {
        ...existingLesson,
        id: `${existingLesson.id}-${lesson.id}`,
        teachers: [...existingLesson.teachers, ...lesson.teachers],
        unionGroups: [...existingLesson.unionGroups, ...lesson.unionGroups],
        cabinet: {
          ...existingLesson.cabinet!,
          name: `${existingLesson.cabinet?.name || ''}, ${lesson.cabinet?.name || ''}`
        }
      };
    } else {
      acc[lesson.weekday].push(lesson);
    }
    return acc;
  }, {}) || {};

  const sortedSections = Object.keys(groupedLessons).map(day => ({
    title: DAYS_OF_WEEK[parseInt(day) - 1],
    date: weekDates[parseInt(day) - 1],
    data: groupedLessons[parseInt(day)].sort((a, b) => a.lesson - b.lesson),
  }));

  return (
    <SectionList
      sections={sortedSections}
      renderItem={({ item }) => (
        <LessonCard lesson={item} isTeacherSchedule={isTeacherSchedule} />
      )}
      renderSectionHeader={({ section: { title, date } }) => (
        <View style={styles.sectionHeader}>
          <View style={styles.dayHeader}>
            <Text style={styles.dayTitle}>{title}</Text>
            <Text style={styles.dayDate}>{date}</Text>
          </View>
        </View>
      )}
      contentContainerStyle={styles.listContent}
      stickySectionHeadersEnabled={true}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={styles.centerContainer}>
          <Ionicons name="calendar-outline" size={48} color="#94a3b8" />
          <Text style={styles.emptyText}>Нет занятий</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    gap: 12,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7f61dd',
  },
  dayDate: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
});