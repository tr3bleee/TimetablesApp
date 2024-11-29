import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Platform, 
  Animated,
  SectionList,
  SectionListProps,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { GroupData, Lesson, TeacherSchedule } from '@/app/types/schedule';
import { DAYS_OF_WEEK, getWeekDates } from '@/app/utils/dateUtils';
import { LessonCard } from './LessonCard';

interface Props {
  data: GroupData | TeacherSchedule | null;
  loading: boolean;
  error: string | null;
  isNextWeek: boolean;
  isTeacherSchedule?: boolean;
  onRefresh?: () => void;
}

interface ScheduleSection {
  title: string;
  date: string;
  data: Lesson[];
}

const AnimatedSectionList = Animated.createAnimatedComponent<
  React.ComponentType<SectionListProps<Lesson, ScheduleSection>>
>(SectionList);

const isCurrentDay = (weekday: number, isNextWeek: boolean): boolean => {
  const now = new Date();
  const currentWeekday = now.getDay() || 7;
  return !isNextWeek && weekday === currentWeekday;
};

export const ScheduleView: React.FC<Props> = ({ 
  data, 
  loading, 
  error, 
  isNextWeek,
  isTeacherSchedule,
  onRefresh
}) => {
  const theme = useTheme();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const sectionListRef = React.useRef<SectionList<Lesson, ScheduleSection>>(null);

  const hasCurrentLesson = (sections: ScheduleSection[]): boolean => {
    if (isNextWeek) return false;
    
    const now = new Date();
    const currentWeekday = now.getDay() || 7;
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const todaySection = sections.find(
      section => DAYS_OF_WEEK.indexOf(section.title) + 1 === currentWeekday
    );

    if (!todaySection) return false;

    return todaySection.data.some(lesson => {
      const [startHour, startMinute] = lesson.startTime.split(':').map(Number);
      const [endHour, endMinute] = lesson.endTime.split(':').map(Number);
      const lessonStartTime = startHour * 60 + startMinute;
      const lessonEndTime = endHour * 60 + endMinute;
      
      return currentTime >= lessonStartTime && currentTime <= lessonEndTime;
    });
  };

  if (loading) return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
        Загрузка расписания...
      </Text>
    </View>
  );

  if (error) return (
    <View style={styles.centerContainer}>
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
        <Ionicons 
          name="alert-circle-outline" 
          size={32} 
          color={theme.colors.error} 
        />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          {error}
        </Text>
      </View>
    </View>
  );

  if (!data?.lessons || data.lessons.length === 0) return (
    <View style={styles.centerContainer}>
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
        <Ionicons 
          name="calendar-clear-outline" 
          size={32} 
          color={theme.colors.onSurfaceVariant} 
        />
        <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
          Расписание отсутствует
        </Text>
      </View>
    </View>
  );

  const weekDates = data ? getWeekDates(data.startDate) : [];
  
  const groupedLessons = data?.lessons?.reduce((acc: { [key: number]: Lesson[] }, lesson: Lesson) => {
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

  const sortedSections: ScheduleSection[] = Object.keys(groupedLessons).map(day => ({
    title: DAYS_OF_WEEK[parseInt(day) - 1],
    date: weekDates[parseInt(day) - 1],
    data: groupedLessons[parseInt(day)].sort((a, b) => a.lesson - b.lesson),
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <AnimatedSectionList
        ref={sectionListRef}
        sections={sortedSections}
        renderItem={({ item, section }: { item: Lesson; section: ScheduleSection }) => (
          <>
            {section.data.length === 0 ? (
              <View style={[styles.emptyDayContainer, { backgroundColor: theme.colors.surfaceVariant }]}>
                <Text style={[styles.emptyDayText, { color: theme.colors.onSurfaceVariant }]}>
                  В этот день нет занятий
                </Text>
              </View>
            ) : (
              <LessonCard 
                lesson={item} 
                isTeacherSchedule={isTeacherSchedule}
                isNextWeek={isNextWeek}
              />
            )}
          </>
        )}
        renderSectionHeader={({ section }: { section: ScheduleSection }) => (
          <Animated.View style={[
            styles.sectionHeader,
            {
              backgroundColor: theme.colors.background,
              borderBottomColor: theme.colors.outline,
              borderLeftWidth: isCurrentDay(DAYS_OF_WEEK.indexOf(section.title) + 1, isNextWeek) ? 3 : 0,
              borderLeftColor: theme.colors.primary,
            }
          ]}>
            <View style={styles.dayHeader}>
              <View style={styles.dayInfo}>
                <Text style={[styles.dayTitle, { color: theme.colors.primary }]}>
                  {section.title}
                </Text>
                <View style={styles.dateContainer}>
                  <Ionicons 
                    name="calendar-outline" 
                    size={14} 
                    color={theme.colors.onSurfaceVariant} 
                  />
                  <Text style={[styles.dayDate, { color: theme.colors.onSurfaceVariant }]}>
                    {section.date}
                  </Text>
                </View>
              </View>
              <View style={[styles.lessonCount, { backgroundColor: theme.colors.primaryContainer }]}>
                <Text style={[styles.lessonCountText, { color: theme.colors.primary }]}>
                  {section.data.length} пары
                </Text>
              </View>
            </View>
          </Animated.View>
        )}
        contentContainerStyle={[
          styles.listContent,
          { 
            paddingTop: Platform.OS === 'ios' ? 8 : 0,
            paddingBottom: 100,
          }
        ]}
        SectionSeparatorComponent={() => <View style={{ height: 8 }} />}
        stickySectionHeadersEnabled={true}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: theme.colors.background }}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
            progressViewOffset={Platform.select({
              ios: 0,
              android: 0,
            })}
            progressBackgroundColor={theme.colors.surface}
            {...Platform.select({
              ios: {
                title: 'Обновление...',
                titleColor: theme.colors.primary,
                tintColor: theme.colors.primary,
              },
            })}
          />
        }
      />
      {hasCurrentLesson(sortedSections) && (
        <TouchableOpacity 
          style={[styles.floatingButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => {
            const currentDay = new Date().getDay() || 7;
            const sectionIndex = sortedSections.findIndex(
              section => DAYS_OF_WEEK.indexOf(section.title) + 1 === currentDay
            );
            if (sectionIndex !== -1) {
              sectionListRef.current?.scrollToLocation({
                sectionIndex,
                itemIndex: 0,
              });
            }
          }}
        >
          <Ionicons name="time" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    flex: 1,
  },
  emptyContainer: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 8,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    zIndex: 2,
    marginBottom: 8,
    marginHorizontal: -8,
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
    paddingVertical: 0,
  },
  dayInfo: {
    gap: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  dayDate: {
    fontSize: 15,
    fontWeight: '500',
  },
  lessonCount: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  lessonCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyDayContainer: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyDayText: {
    fontSize: 16,
    flex: 1,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});