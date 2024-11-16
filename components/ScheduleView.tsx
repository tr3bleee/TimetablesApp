import React from 'react';
import { SectionList, StyleSheet, Text, View, ActivityIndicator, Platform } from 'react-native';
import { GroupData, Lesson } from '../app/types/schedule';
import { DAYS_OF_WEEK, getWeekDates } from '../app/utils/dateUtils';
import { LessonCard } from './LessonCard';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  data: GroupData | null;
  loading: boolean;
  error: string | null;
  isNextWeek: boolean;
}

export const ScheduleView: React.FC<Props> = ({ data, loading, error, isNextWeek }) => {
  if (loading) return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#2563eb" />
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
    </View>
  );

  const weekDates = data ? getWeekDates(data.startDate) : [];
  
  const groupedLessons = data?.lessons?.reduce((acc: { [key: number]: Lesson[] }, lesson) => {
    if (!acc[lesson.weekday]) {
      acc[lesson.weekday] = [];
    }
    acc[lesson.weekday].push(lesson);
    return acc;
  }, {}) || {};

  const sortedSections = Object.keys(groupedLessons).map(day => ({
    title: DAYS_OF_WEEK[parseInt(day) - 1],
    date: weekDates[parseInt(day) - 1],
    data: groupedLessons[parseInt(day)].sort((a, b) => a.lesson - b.lesson),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{data?.group?.name || "N/A"}</Text>
          <Text style={styles.dateInfo}>
            {isNextWeek ? 'Следующая неделя' : 'Текущая неделя'} с {new Date(data?.startDate || '').toLocaleDateString('ru-RU')}
          </Text>
        </View>
      </View>
      <SectionList
        sections={sortedSections}
        renderItem={({ item }) => <LessonCard lesson={item} />}
        keyExtractor={(item) => item.id}
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  groupInfo: {
    gap: 4,
  },
  groupName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  dateInfo: {
    fontSize: 14,
    color: '#64748b',
  },
  sectionHeader: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  dayDate: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});