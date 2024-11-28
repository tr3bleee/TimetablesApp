import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Lesson } from '@/app/types/schedule';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useScheduleSettings } from '@/app/contexts/ScheduleSettingsContext';

interface Props {
  lesson: Lesson;
  isTeacherSchedule?: boolean;
}

export const LessonCard: React.FC<Props> = ({ lesson, isTeacherSchedule }) => {
  const theme = useTheme();
  const router = useRouter();
  const { settings } = useScheduleSettings();

  const handleTeacherPress = (teacherId: number) => {
    router.push(`/teacher/${teacherId}`);
  };

  const handleGroupPress = (groupId: number) => {
    router.push(`/schedule/${groupId}`);
  };

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

    return 'book-outline';
  };

  const hasMultipleTeachers = lesson.teachers.length > 1;
  const hasExplicitSubgroups = lesson.unionGroups.some(group => group.subgroup?.name);
  const shouldShowSubgroups = !isTeacherSchedule && (hasMultipleTeachers || hasExplicitSubgroups);

  const renderSubgroups = () => {
    if (isTeacherSchedule || (!hasMultipleTeachers && !hasExplicitSubgroups)) {
      return null;
    }

    let subgroups = [];

    // Если есть явные подгруппы, используем их
    if (hasExplicitSubgroups) {
      subgroups = lesson.unionGroups
        .filter(group => group.subgroup?.name)
        .sort((a, b) => {
          const numA = parseInt(a.subgroup?.name?.match(/\d+/)?.[0] || '0');
          const numB = parseInt(b.subgroup?.name?.match(/\d+/)?.[0] || '0');
          return numA - numB;
        })
        .map((group, index) => ({
          group,
          teacher: lesson.teachers[index] || lesson.teachers[0],
          subgroupNumber: group.subgroup?.name || '',
          cabinet: Array.isArray(lesson.cabinet) ? lesson.cabinet[index] : lesson.cabinet
        }));
    }
    // Если есть несколько преподавателей, разделяем по ним
    else if (hasMultipleTeachers) {
      subgroups = lesson.teachers.map((teacher, index) => ({
        teacher,
        subgroupNumber: `Подгруппа ${index + 1}`,
        cabinet: Array.isArray(lesson.cabinet) ? lesson.cabinet[index] : lesson.cabinet
      }));
    }

    return (
      <View style={styles.subgroupsContainer}>
        {subgroups.map((subgroup, index) => (
          <View key={index} style={[styles.subgroupItem, { 
            backgroundColor: theme.colors.accent 
          }]}>
            <Text style={[styles.subgroupTitle, { color: theme.colors.primary }]}>
              {subgroup.subgroupNumber}
            </Text>
            {subgroup.teacher && (
              <View style={styles.teachersContainer}>
                <Ionicons name="person-outline" size={14} color={theme.colors.secondaryText} />
                <TouchableOpacity
                  onPress={() => handleTeacherPress(subgroup.teacher.id)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.teacherLink, { color: theme.colors.primary }]}>
                    {subgroup.teacher.fio}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {subgroup.cabinet && (
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={14} color={theme.colors.secondaryText} />
                <Text style={[styles.location, { color: theme.colors.secondaryText }]}>
                  {subgroup.cabinet.name}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
        padding: settings.compactMode ? 8 : 12,
      }
    ]}>
      <View style={[styles.timeContainer, {
        backgroundColor: theme.colors.accent,
        borderBottomColor: theme.colors.border,
        padding: settings.compactMode ? 8 : 12,
      }]}>
        {settings.showLessonNumbers && (
          <Text style={[styles.lessonNumber, { color: theme.colors.primary }]}>
            №{lesson.lesson}
          </Text>
        )}
        <Text style={[styles.time, { color: theme.colors.secondaryText }]}>
          {lesson.startTime}
        </Text>
        <Text style={[styles.timeDivider, { color: theme.colors.secondaryText }]}>
          —
        </Text>
        <Text style={[styles.time, { color: theme.colors.secondaryText }]}>
          {lesson.endTime}
        </Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.accent }]}>
          <Ionicons 
            name={getSubjectIcon()} 
            size={24} 
            color={theme.colors.primary} 
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={[styles.subject, { 
            color: theme.colors.text,
            fontSize: settings.compactMode ? 14 : 16,
          }]}>
            {lesson.subject?.name || 'Нет предмета'}
          </Text>
          
          {!shouldShowSubgroups ? (
            <>
              {!isTeacherSchedule && settings.showTeacherNames && lesson.teachers.length > 0 && (
                <View style={styles.teachersContainer}>
                  <Ionicons name="person-outline" size={14} color={theme.colors.secondaryText} />
                  <View style={styles.teachersWrapper}>
                    {lesson.teachers.map((teacher, index) => (
                      <React.Fragment key={teacher.id}>
                        <TouchableOpacity
                          onPress={() => handleTeacherPress(teacher.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.teacherLink, { color: theme.colors.primary }]}>
                            {teacher.fio}
                          </Text>
                        </TouchableOpacity>
                        {index < lesson.teachers.length - 1 && (
                          <Text style={{ color: theme.colors.secondaryText }}>, </Text>
                        )}
                      </React.Fragment>
                    ))}
                  </View>
                </View>
              )}
              
              {settings.showCabinetNumbers && lesson.cabinet && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={14} color={theme.colors.secondaryText} />
                  <Text style={[styles.location, { color: theme.colors.secondaryText }]}>
                    {lesson.cabinet.name}
                  </Text>
                </View>
              )}

              {isTeacherSchedule && lesson.unionGroups.length > 0 && (
                <View style={styles.groupsContainer}>
                  <Ionicons name="people-outline" size={14} color={theme.colors.secondaryText} />
                  <View style={styles.groupsWrapper}>
                    {lesson.unionGroups.map((group, index) => (
                      <React.Fragment key={group.group.id}>
                        <TouchableOpacity
                          onPress={() => handleGroupPress(group.group.id)}
                          activeOpacity={0.7}
                        >
                          <Text style={[styles.groupLink, { color: theme.colors.primary }]}>
                            {group.group.name}
                          </Text>
                        </TouchableOpacity>
                        {index < lesson.unionGroups.length - 1 && (
                          <Text style={{ color: theme.colors.secondaryText }}>, </Text>
                        )}
                      </React.Fragment>
                    ))}
                  </View>
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
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    borderWidth: 1,
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
    borderBottomWidth: 1,
    gap: 8,
  },
  lessonNumber: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  time: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeDivider: {
    fontSize: 14,
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
  },
  teachersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  teachersWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  teacherLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 14,
  },
  groupsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupsWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  groupLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  subgroupsContainer: {
    marginTop: 8,
    gap: 12,
  },
  subgroupItem: {
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  subgroupTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});