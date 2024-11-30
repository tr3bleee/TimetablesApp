import React, { useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { useSearch } from '@/app/hooks/useSearch';
import { TeacherInfo } from '@/app/types/teacher';
import { useFavorites } from '@/app/contexts/FavoritesContext';

interface TeacherListProps {
  teachers: TeacherInfo[];
  onSelectTeacher: (teacher: TeacherInfo) => void;
}

const getSearchFields = (teacher: TeacherInfo) => [
  teacher.fio,
  teacher.position || ''
];

const sortTeachers = (a: TeacherInfo, b: TeacherInfo) => 
  a.fio.localeCompare(b.fio);

export const TeacherList: React.FC<TeacherListProps> = ({ 
  teachers, 
  onSelectTeacher 
}) => {
  const theme = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const {
    query,
    filteredItems,
    handleSearch,
    clearSearch
  } = useSearch(teachers, getSearchFields, sortTeachers);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -64],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View 
        style={[
          styles.searchWrapper,
          {
            backgroundColor: theme.colors.background,
            transform: [{ translateY: headerHeight }]
          }
        ]}
      >
        <View style={[styles.searchContainer, { 
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
        }]}>
          <Ionicons 
            name="search" 
            size={20} 
            color={theme.colors.secondary} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.onSurface }]}
            placeholder="Поиск преподавателя..."
            value={query}
            onChangeText={handleSearch}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
          {query.length > 0 && (
            <TouchableOpacity 
              onPress={clearSearch}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <Ionicons 
                name="close-circle" 
                size={20} 
                color={theme.colors.onSurfaceVariant} 
              />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="person" 
            size={48} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            Преподаватели не найдены
          </Text>
        </View>
      ) : (
        <Animated.ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
        >
          {filteredItems.map(teacher => (
            <TouchableOpacity
              key={teacher.id}
              style={[styles.teacherItem, { 
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline 
              }]}
              onPress={() => onSelectTeacher(teacher)}
            >
              <View style={styles.teacherContent}>
                <View style={[styles.avatarContainer, { 
                  backgroundColor: theme.colors.primaryContainer 
                }]}>
                  <Ionicons
                    name="person"
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.teacherInfo}>
                  <Text style={[styles.teacherName, { color: theme.colors.onSurface }]}>
                    {teacher.fio}
                  </Text>
                  {teacher.position && (
                    <Text style={[styles.teacherPosition, { color: theme.colors.onSurfaceVariant }]}>
                      {teacher.position}
                    </Text>
                  )}
                </View>
                <TouchableOpacity 
                  onPress={() => {
                    if (isFavorite(teacher.id, 'teacher')) {
                      removeFromFavorites(teacher.id, 'teacher');
                    } else {
                      addToFavorites(teacher, 'teacher');
                    }
                  }}
                  style={styles.favoriteButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons 
                    name={isFavorite(teacher.id, 'teacher') ? "star" : "star-outline"} 
                    size={24} 
                    color={theme.colors.primary} 
                  />
                </TouchableOpacity>
                <Ionicons 
                  name="chevron-forward" 
                  size={20} 
                  color={theme.colors.secondary} 
                />
              </View>
            </TouchableOpacity>
          ))}
        </Animated.ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    position: 'absolute',
    top: 4,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: 8,
    paddingTop: 8,
    height: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingRight: 6,
    borderRadius: 12,
    borderWidth: 1,
    height: 44,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    marginRight: 4,
  },
  clearButton: {
    padding: 6,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
  list: {
    flex: 1,
    marginTop: 68,
  },
  listContent: {
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: -60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  teacherItem: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  teacherContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teacherInfo: {
    flex: 1,
    gap: 4,
  },
  teacherName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  teacherPosition: {
    fontSize: 14,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
  },
}); 