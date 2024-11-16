import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Lesson } from '../app/types/schedule';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  lesson: Lesson;
}

export const LessonCard: React.FC<Props> = ({ lesson }) => {
  const subjectName = lesson.subject ? lesson.subject.name : "Без предмета";
  const teacherNames = lesson.teachers.map(teacher => teacher.fio).join(", ") || "Без преподавателя";
  const cabinetName = lesson.cabinet ? lesson.cabinet.name : "Кабинет не указан";

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.lessonNumber}>#{lesson.lesson}</Text>
        <View style={styles.timeInfo}>
          <Text style={styles.time}>{lesson.startTime}</Text>
          <Ionicons name="arrow-forward" size={12} color="#94a3b8" />
          <Text style={styles.time}>{lesson.endTime}</Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.subjectName}>{subjectName}</Text>
        <View style={styles.infoRow}>
          <View style={styles.teacherInfo}>
            <Ionicons name="person-outline" size={16} color="#64748b" />
            <Text style={styles.teacherName}>{teacherNames}</Text>
          </View>
          <View style={styles.cabinetInfo}>
            <Ionicons name="location-outline" size={16} color="#64748b" />
            <Text style={styles.cabinetName}>{cabinetName}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  timeContainer: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lessonNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  infoRow: {
    gap: 12,
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teacherName: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  cabinetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cabinetName: {
    fontSize: 14,
    color: '#64748b',
  },
});