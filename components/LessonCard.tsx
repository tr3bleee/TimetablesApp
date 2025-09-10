import { useScheduleSettings } from '@/app/contexts/ScheduleSettingsContext';
import { Lesson } from '@/app/types/schedule';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface Subgroup {
  group?: {
    subgroup?: {
      name: string;
    };
  };
  teacher?: {
    id: number;
    fio: string;
  };
  subgroupNumber: string;
  cabinet?: {
    name: string;
  };
}

interface Props {
  lesson: Lesson;
  isTeacherSchedule?: boolean;
  isNextWeek?: boolean;
}

const isCurrentLesson = (lesson: Lesson, isNextWeek: boolean = false): boolean => {
  const now = new Date();
  const currentWeekday = now.getDay() || 7; // Convert Sunday (0) to 7 to match API format
  
  // If lesson is for next week, or different weekday, it's not current
  if (isNextWeek || currentWeekday !== lesson.weekday) {
    return false;
  }

  const [startHour, startMinute] = lesson.startTime.split(':').map(Number);
  const [endHour, endMinute] = lesson.endTime.split(':').map(Number);
  
  const lessonStart = new Date();
  lessonStart.setHours(startHour, startMinute, 0);
  
  const lessonEnd = new Date();
  lessonEnd.setHours(endHour, endMinute, 0);
  
  return now >= lessonStart && now <= lessonEnd;
};

export const LessonCard: React.FC<Props> = ({ lesson, isTeacherSchedule, isNextWeek }) => {
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
    if (!lesson.subject) return 'help-circle';

    const subjectName = lesson.subject.name.toLowerCase();

    // Математика и точные науки
    if (subjectName.includes('математик') || 
        subjectName.includes('алгебра') || 
        subjectName.includes('геометрия') ||
        subjectName.includes('численные методы')) {
      return 'calculator';
    }

    // Программирование и разработка
    if (subjectName.includes('информатик') || 
        subjectName.includes('программирован') ||
        subjectName.includes('разработка программных модулей') ||
        subjectName.includes('основы алгоритмизации') ||
        subjectName.includes('технология разработки программного обеспечения') ||
        subjectName.includes('поддержка и тестирование программных модулей') ||
        subjectName.includes('разработка информационных ресурсов')) {
      return 'code-slash';
    }

    // Базы данных
    if (subjectName.includes('основы проектирования баз данных') ||
        subjectName.includes('баз данных')) {
      return 'server';
    }

    // Компьютерные сети и IT
    if (subjectName.includes('компьютерные сети') ||
        subjectName.includes('организация, принципы построения и функционирования компьютерных сетей') ||
        subjectName.includes('информационные технологии')) {
      return 'wifi';
    }

    // Motion дизайн и видео
    if (subjectName.includes('motion дизайн') ||
        subjectName.includes('технические регламенты для видео') ||
        subjectName.includes('видео дизайн-проектов')) {
      return 'videocam';
    }

    // Web дизайн
    if (subjectName.includes('web дизайн') ||
        subjectName.includes('веб дизайн')) {
      return 'globe';
    }

    // Проектная работа и фриланс
    if (subjectName.includes('основы проектой работы') ||
        subjectName.includes('фриланс работы') ||
        subjectName.includes('проектной работы')) {
      return 'briefcase';
    }

    // Изобразительное искусство
    if (subjectName.includes('живопись') ||
        subjectName.includes('цветоведения') ||
        subjectName.includes('рисунок') ||
        subjectName.includes('перспективы') ||
        subjectName.includes('фото дизайн-проектов')) {
      return 'brush';
    }

    // Естественные науки
    if (subjectName.includes('физик')) {
      return 'flash';
    }
    if (subjectName.includes('хими')) {
      return 'flask';
    }
    if (subjectName.includes('биолог')) {
      return 'leaf';
    }
    if (subjectName.includes('географ')) {
      return 'map';
    }

    // Гуманитарные науки
    if (subjectName.includes('истори')) {
      return 'time';
    }
    if (subjectName.includes('язык') || 
        subjectName.includes('литератур')) {
      return 'language';
    }

    // Физкультура и спорт
    if (subjectName.includes('физкультур') || 
        subjectName.includes('физическая культура')) {
      return 'fitness';
    }

    // Безопасность
    if (subjectName.includes('безопасност') || 
        subjectName.includes('обж')) {
      return 'shield-checkmark';
    }

    return 'book';
  };

  const hasMultipleTeachers = lesson.teachers.length > 1;
  const hasExplicitSubgroups = lesson.unionGroups.some(group => group.subgroup?.name);
  const shouldShowSubgroups = !isTeacherSchedule && (hasMultipleTeachers || hasExplicitSubgroups);

  const renderSubgroups = () => {
    if (isTeacherSchedule || (!hasMultipleTeachers && !hasExplicitSubgroups)) {
      return null;
    }

    let subgroups: Subgroup[] = [];

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
            backgroundColor: theme.colors.primaryContainer 
          }]}>
            <Text style={[styles.subgroupTitle, { color: theme.colors.primary }]}>
              {subgroup.subgroupNumber}
            </Text>
            {subgroup.teacher && (
              <View style={styles.teachersContainer}>
                <Ionicons name="person" size={14} color={theme.colors.onSurfaceVariant} />
                <TouchableOpacity
                  onPress={() => subgroup.teacher && handleTeacherPress(subgroup.teacher.id)}
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
                <Ionicons name="location" size={14} color={theme.colors.onSurfaceVariant} />
                <Text style={[styles.location, { color: theme.colors.onSurfaceVariant }]}>
                  {subgroup.cabinet.name}
                </Text>
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderTimeContainer = () => (
    <View style={[styles.timeContainer, {
      backgroundColor: isCurrentLesson(lesson, isNextWeek) 
        ? theme.colors.primary 
        : theme.colors.primaryContainer,
      borderBottomColor: theme.colors.outline,
      padding: settings.compactMode ? 8 : 12,
    }]}>
      {settings.showLessonNumbers && (
        <Text style={[styles.lessonNumber, { 
          color: isCurrentLesson(lesson, isNextWeek)
            ? theme.colors.surface  // Меняем на светлый цвет для текущего урока
            : theme.colors.primary 
        }]}>
          №{lesson.lesson}
        </Text>
      )}
      <View style={styles.timeWrapper}>
        <Text style={[styles.time, { 
          color: isCurrentLesson(lesson, isNextWeek)
            ? theme.colors.surface  // Меняем на светлый цвет для текущего урока
            : theme.colors.onSurfaceVariant 
        }]}>
          {lesson.startTime}
        </Text>
        <Text style={[styles.timeDivider, { 
          color: isCurrentLesson(lesson, isNextWeek)
            ? theme.colors.surface  // Меняем на светлый цвет для текущего урока
            : theme.colors.onSurfaceVariant 
        }]}>
          —
        </Text>
        <Text style={[styles.time, { 
          color: isCurrentLesson(lesson, isNextWeek)
            ? theme.colors.surface  // Меняем на светлый цвет для текущего урока
            : theme.colors.onSurfaceVariant 
        }]}>
          {lesson.endTime}
        </Text>
        {isCurrentLesson(lesson, isNextWeek) && (
          <Text style={[styles.currentIndicator, { 
            color: theme.colors.surface,  // Меняем на светлый цвет
            fontWeight: '600'
          }]}>
            Сейчас
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={[
      styles.container, 
      { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.outline,
      },
      isCurrentLesson(lesson, isNextWeek) && {
        borderLeftWidth: 3,
        borderLeftColor: theme.colors.primary,
      }
    ]}>
      {renderTimeContainer()}
      
      <View style={styles.contentContainer}>
        <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryContainer }]}>
          <Ionicons 
            name={getSubjectIcon()} 
            size={24} 
            color={theme.colors.primary} 
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={[styles.subject, { 
            color: theme.colors.onSurfaceVariant,
            fontSize: settings.compactMode ? 14 : 16,
          }]}>
            {lesson.subject?.name || 'Нет предмета'}
          </Text>
          
          {!shouldShowSubgroups ? (
            <>
              {!isTeacherSchedule && settings.showTeacherNames && lesson.teachers.length > 0 && (
                <View style={styles.teachersContainer}>
                  <Ionicons name="person" size={14} color={theme.colors.onSurfaceVariant} />
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
                          <Text style={{ color: theme.colors.onSurfaceVariant }}>, </Text>
                        )}
                      </React.Fragment>
                    ))}
                  </View>
                </View>
              )}
              
              {settings.showCabinetNumbers && lesson.cabinet && (
                <View style={styles.locationContainer}>
                  <Ionicons name="location" size={14} color={theme.colors.onSurfaceVariant} />
                  <Text style={[styles.location, { color: theme.colors.onSurfaceVariant }]}>
                    {lesson.cabinet.name}
                  </Text>
                </View>
              )}

              {isTeacherSchedule && lesson.unionGroups.length > 0 && (
                <View style={styles.groupsContainer}>
                  <Ionicons name="people" size={14} color={theme.colors.onSurfaceVariant} />
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
                          <Text style={{ color: theme.colors.onSurfaceVariant }}>, </Text>
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
    marginHorizontal: 8,
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
    }),
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    gap: 8,
  },
  lessonNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    fontSize: 16,
    fontWeight: '500',
  },
  timeDivider: {
    fontSize: 14,
  },
  contentContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    gap: 6,
  },
  subject: {
    fontSize: 18,
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
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  location: {
    fontSize: 15,
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
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  subgroupsContainer: {
    marginTop: 8,
    gap: 12,
  },
  subgroupItem: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  subgroupTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  currentIndicator: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  groupSubtitle: {
    fontSize: 15,
    fontWeight: '500',
  },
});