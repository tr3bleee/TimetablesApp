import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Lesson } from '../app/types/schedule';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

interface Props {
  lesson: Lesson;
}

export const LessonCard: React.FC<Props> = ({ lesson }) => {
  const [settings, setSettings] = useState({
    showCabinetNumbers: true,
    showTeacherNames: true,
    compactMode: false,
    showLessonNumbers: true,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('appSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({
          showCabinetNumbers: parsedSettings.showCabinetNumbers ?? true,
          showTeacherNames: parsedSettings.showTeacherNames ?? true,
          compactMode: parsedSettings.compactMode ?? false,
          showLessonNumbers: parsedSettings.showLessonNumbers ?? true,
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const subjectName = lesson.subject ? lesson.subject.name : "Без предмета";
  const teacherNames = lesson.teachers.map(teacher => teacher.fio).join(", ") || "Без преподавателя";
  const cabinetName = lesson.cabinet ? lesson.cabinet.name : "Кабинет не указан";

  const hasMultipleSubgroups = lesson.unionGroups?.some(ug => ug.subgroup) && lesson.unionGroups?.length > 1;
  const subgroupsInfo = hasMultipleSubgroups 
    ? lesson.unionGroups
        .filter(ug => ug.subgroup)
        .sort((a, b) => (a.subgroup?.order ?? 0) - (b.subgroup?.order ?? 0))
        .map((ug, index) => {
          const teacher = lesson.teachers[index];
          
          const cabinets = lesson.cabinet?.name.split(', ') || [];
          const cabinet = cabinets[index] || lesson.cabinet?.name || 'Кабинет не указан';

          return {
            subgroup: ug.subgroup?.name || `Подгруппа ${index + 1}`,
            teacher: teacher?.fio || 'Без преподавателя',
            cabinet: cabinet.trim()
          };
        })
    : null;

  return (
    <View style={[styles.container, settings.compactMode && styles.compactContainer]}>
      <View style={[styles.timeContainer, settings.compactMode && styles.compactTimeContainer]}>
        {settings.showLessonNumbers && (
          <Text style={styles.lessonNumber}>#{lesson.lesson}</Text>
        )}
        <View style={styles.timeInfo}>
          <Text style={styles.time}>{lesson.startTime}</Text>
          <Ionicons name="arrow-forward" size={12} color="#94a3b8" />
          <Text style={styles.time}>{lesson.endTime}</Text>
        </View>
      </View>
      
      <View style={[styles.contentContainer, settings.compactMode && styles.compactContentContainer]}>
        <Text style={styles.subjectName}>{subjectName}</Text>
        
        {hasMultipleSubgroups ? (
          <View style={styles.subgroupsContainer}>
            {subgroupsInfo?.map((info, index) => (
              <View key={index} style={styles.subgroupInfo}>
                <Text style={styles.subgroupName}>{info.subgroup}</Text>
                {settings.showTeacherNames && (
                  <View style={styles.teacherInfo}>
                    <Ionicons name="person-outline" size={16} color="#64748b" />
                    <Text style={styles.teacherName}>{info.teacher}</Text>
                  </View>
                )}
                {settings.showCabinetNumbers && (
                  <View style={styles.cabinetInfo}>
                    <Ionicons name="location-outline" size={16} color="#64748b" />
                    <Text style={styles.cabinetName}>{info.cabinet}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.infoRow}>
            {settings.showTeacherNames && (
              <View style={styles.teacherInfo}>
                <Ionicons name="person-outline" size={16} color="#64748b" />
                <Text style={styles.teacherName}>{teacherNames}</Text>
              </View>
            )}
            {settings.showCabinetNumbers && (
              <View style={styles.cabinetInfo}>
                <Ionicons name="location-outline" size={16} color="#64748b" />
                <Text style={styles.cabinetName}>{cabinetName}</Text>
              </View>
            )}
          </View>
        )}
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
  compactContainer: {
    marginHorizontal: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  compactTimeContainer: {
    padding: 8,
  },
  compactContentContainer: {
    padding: 8,
  },
  subgroupsContainer: {
    gap: 8,
  },
  subgroupInfo: {
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
  },
  subgroupName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
});