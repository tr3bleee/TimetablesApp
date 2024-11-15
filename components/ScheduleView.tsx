import React from 'react';
import { SectionList, StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { GroupData, Lesson } from '../app/types/schedule';
import { DAYS_OF_WEEK } from '../app/utils/dateUtils';
import { LessonCard } from './LessonCard';

interface Props {
  data: GroupData | null;
  loading: boolean;
  error: string | null;
}

export const ScheduleView: React.FC<Props> = ({ data, loading, error }) => {
  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
  if (error) return <Text style={styles.error}>Ошибка: {error}</Text>;
  if (!data?.lessons || data.lessons.length === 0) return null;

  const groupedLessons = data.lessons.reduce((acc: { [key: number]: Lesson[] }, lesson) => {
    if (!acc[lesson.weekday]) {
      acc[lesson.weekday] = [];
    }
    acc[lesson.weekday].push(lesson);
    return acc;
  }, {});

  const sortedSections = Object.keys(groupedLessons).map(day => ({
    title: DAYS_OF_WEEK[parseInt(day) - 1],
    data: groupedLessons[parseInt(day)].sort((a, b) => {
      if (a.lesson !== b.lesson) return a.lesson - b.lesson;
      if (a.startTime !== b.startTime) return a.startTime.localeCompare(b.startTime);
      return a.endTime.localeCompare(b.endTime);
    }),
  }));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Группа: {data.group?.name || "N/A"}</Text>
      <Text style={styles.title}>
        Начало недели: {data.startDate ? data.startDate.split("T")[0] : "N/A"}
      </Text>
      <SectionList
        sections={sortedSections}
        renderItem={({ item }) => <LessonCard lesson={item} />}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.dayTitle}>{title}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  sectionHeader: {
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: "#f0f0f0",
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
  },
  message: {
    marginTop: 10,
    fontSize: 16,
  },
  error: {
    marginTop: 10,
    fontSize: 16,
    color: "red",
  },
});