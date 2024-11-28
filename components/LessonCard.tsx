import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Lesson } from '@/app/types/schedule';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  lesson: Lesson;
  isTeacherSchedule?: boolean;
}

export const LessonCard: React.FC<Props> = ({ lesson, isTeacherSchedule }) => {
  const getSubjectIcon = () => {
    if (!lesson.subject) return 'help-circle-outline';

    const subjectName = lesson.subject.name.toLowerCase();

    // Математика и связанные предметы
    if (subjectName.includes('математик') || 
        subjectName.includes('алгебра') || 
        subjectName.includes('геометрия')) {
      return 'calculator-outline';
    }

    // Информатика и программирование
    if (subjectName.includes('информатик') || 
        subjectName.includes('программирован') ||
        subjectName.includes('компьютер')) {
      return 'desktop-outline';
    }

    // Физика
    if (subjectName.includes('физик')) {
      return 'flash-outline';
    }

    // Химия
    if (subjectName.includes('хими')) {
      return 'flask-outline';
    }

    // Биология
    if (subjectName.includes('биолог')) {
      return 'leaf-outline';
    }

    // География
    if (subjectName.includes('географ')) {
      return 'earth-outline';
    }

    // История
    if (subjectName.includes('истори') || 
        subjectName.includes('археолог')) {
      return 'time-outline';
    }

    // Языки
    if (subjectName.includes('язык') || 
        subjectName.includes('литератур') ||
        subjectName.includes('чтение')) {
      return 'language-outline';
    }

    // Физкультура и спорт
    if (subjectName.includes('физкультур') || 
        subjectName.includes('спорт')) {
      return 'basketball-outline';
    }

    // Музыка
    if (subjectName.includes('музык')) {
      return 'musical-notes-outline';
    }

    // Искусство
    if (subjectName.includes('искусств') || 
        subjectName.includes('рисован') ||
        subjectName.includes('изо')) {
      return 'color-palette-outline';
    }

    // Технология
    if (subjectName.includes('технолог')) {
      return 'construct-outline';
    }

    // ОБЖ
    if (subjectName.includes('обж') || 
        subjectName.includes('безопасност')) {
      return 'shield-checkmark-outline';
    }

    // Экономика
    if (subjectName.includes('эконом')) {
      return 'cash-outline';
    }

    // Право
    if (subjectName.includes('право')) {
      return 'receipt-outline';
    }

    // Психология
    if (subjectName.includes('психолог')) {
      return 'brain-outline';
    }

    // Философия
    if (subjectName.includes('философ')) {
      return 'prism-outline';
    }

    // Практика/лабораторные
    if (subjectName.includes('практик') || 
        subjectName.includes('лабораторн')) {
      return 'flask-outline';
    }

    // Лекции
    if (subjectName.includes('лекци')) {
      return 'reader-outline';
    }

    // По умолчанию
    return 'book-outline';
  };

  const hasMultipleTeachers = lesson.teachers.length > 1;
  const hasExplicitSubgroups = lesson.unionGroups.some(group => group.subgroup?.name);
  const shouldShowSubgroups = !isTeacherSchedule && (hasMultipleTeachers || hasExplicitSubgroups);

  const renderSubgroups = () => {
    if (isTeacherSchedule || (!hasMultipleTeachers && !hasExplicitSubgroups)) {
      return null;
    }

    // Если есть явные подгруппы, используем их
    if (hasExplicitSubgroups) {
      const subgroups = lesson.unionGroups
        .filter(group => group.subgroup?.name) // Фильтруем только группы с явными подгруппами
        .sort((a, b) => {
          // Сортируем по номеру подгруппы
          const numA = parseInt(a.subgroup?.name?.match(/\d+/)?.[0] || '0');
          const numB = parseInt(b.subgroup?.name?.match(/\d+/)?.[0] || '0');
          return numA - numB;
        })
        .map((group, index) => {
          const teacher = lesson.teachers[index] || lesson.teachers[0];
          const cabinet = Array.isArray(lesson.cabinet) ? lesson.cabinet[index] : lesson.cabinet;
          return {
            group,
            teacher,
            subgroupNumber: group.subgroup?.name || '',
            cabinet
          };
        });

      return (
        <View style={styles.subgroupsContainer}>
          {subgroups.map((subgroup, index) => (
            <View key={index} style={styles.subgroupItem}>
              <Text style={styles.subgroupTitle}>{subgroup.subgroupNumber}</Text>
              {subgroup.teacher && (
                <View style={styles.teachersContainer}>
                  <Ionicons name="person-outline" size={14} color="#64748b" />
                  <Text style={styles.teachers}>{subgroup.teacher.fio}</Text>
                </View>
              )}
              {subgroup.cabinet && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={14} color="#64748b" />
                  <Text style={styles.location}>{subgroup.cabinet.name}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      );
    }

    // Если есть несколько преподавателей, разделяем по ним
    if (hasMultipleTeachers) {
      const teacherSubgroups = lesson.teachers.map((teacher, index) => ({
        teacher,
        subgroupNumber: index + 1,
        cabinet: Array.isArray(lesson.cabinet) ? lesson.cabinet[index] : lesson.cabinet
      }));

      return (
        <View style={styles.subgroupsContainer}>
          {teacherSubgroups.map((subgroup, index) => (
            <View key={index} style={styles.subgroupItem}>
              <Text style={styles.subgroupTitle}>
                {`Подгруппа ${subgroup.subgroupNumber}`}
              </Text>
              <View style={styles.teachersContainer}>
                <Ionicons name="person-outline" size={14} color="#64748b" />
                <Text style={styles.teachers}>{subgroup.teacher.fio}</Text>
              </View>
              {subgroup.cabinet && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={14} color="#64748b" />
                  <Text style={styles.location}>{subgroup.cabinet.name}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Text style={styles.lessonNumber}>№{lesson.lesson}</Text>
        <Text style={styles.time}>{lesson.startTime}</Text>
        <Text style={styles.timeDivider}>—</Text>
        <Text style={styles.time}>{lesson.endTime}</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getSubjectIcon()} 
            size={24} 
            color="#7f61dd" 
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.subject}>
            {lesson.subject?.name || 'Нет предмета'}
          </Text>
          
          {!shouldShowSubgroups ? (
            <>
              {!isTeacherSchedule && lesson.teachers.length > 0 && (
                <View style={styles.teachersContainer}>
                  <Ionicons name="person-outline" size={14} color="#64748b" />
                  <Text style={styles.teachers}>
                    {lesson.teachers.map(t => t.fio).join(', ')}
                  </Text>
                </View>
              )}
              
              {lesson.cabinet && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={14} color="#64748b" />
                  <Text style={styles.location}>{lesson.cabinet.name}</Text>
                </View>
              )}

              {isTeacherSchedule && lesson.unionGroups.length > 0 && (
                <View style={styles.groupsContainer}>
                  <Ionicons name="people-outline" size={14} color="#64748b" />
                  <Text style={styles.groups}>
                    {lesson.unionGroups.map(g => g.group.name).join(', ')}
                  </Text>
                </View>
              )}
            </>
          ) : (
            renderSubgroups()
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
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
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    gap: 8,
  },
  lessonNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f61dd',
    marginRight: 4,
  },
  time: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  timeDivider: {
    fontSize: 14,
    color: '#94a3b8',
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    gap: 6,
  },
  subject: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  teachersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teachers: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 14,
    color: '#64748b',
  },
  groupsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groups: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  subgroupsContainer: {
    marginTop: 8,
    gap: 12,
  },
  subgroupItem: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  subgroupTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f61dd',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
});