import { GroupData, Lesson, TeacherSchedule } from '@/app/types/schedule';
import { DAYS_OF_WEEK, getWeekDates } from '@/app/utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  RefreshControl,
  SectionList,
  SectionListProps,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useTheme } from 'react-native-paper';
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
        <View style={styles.emptyIconContainer}>
          <Ionicons 
            name="calendar-clear-outline" 
            size={40} 
            color={theme.colors.onSurfaceVariant} 
          />
        </View>
        <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
          Расписание отсутствует
        </Text>
      </View>
      <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
        На данный момент нет данных о расписании
      </Text>
      {onRefresh && (
        <TouchableOpacity 
          style={[styles.refreshButton, { backgroundColor: theme.colors.primaryContainer }]}
          onPress={onRefresh}
          activeOpacity={0.7}
        >
          <Ionicons 
            name="refresh-outline" 
            size={18} 
            color={theme.colors.primary} 
          />
          <Text style={[styles.refreshButtonText, { color: theme.colors.primary }]}>
            Обновить
          </Text>
        </TouchableOpacity>
      )}
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
    gap: 16,
    paddingHorizontal: 32,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    maxWidth: 400,
    elevation: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
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
    padding: 24,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 400,
    elevation: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  emptyIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
  },
  emptyDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
    opacity: 0.8,
    maxWidth: 300,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    elevation: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
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
});