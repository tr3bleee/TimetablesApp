import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lesson } from '../types/schedule';

interface Props {
  lesson: Lesson;
}

export const LessonCard: React.FC<Props> = ({ lesson }) => {
  const subjectName = lesson.subject ? lesson.subject.name : "Без предмета";
  const teacherNames = lesson.teachers.map(teacher => teacher.fio).join(", ") || "Без преподавателя";

  return (
    <View style={styles.item}>
      <Text style={styles.title}>{subjectName}</Text>
      <Text style={styles.text}>Начало пары: {lesson.startTime}</Text>
      <Text style={styles.text}>Конец пары: {lesson.endTime}</Text>
      <Text style={styles.text}>Преподаватель: {teacherNames}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 4,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
  },
});