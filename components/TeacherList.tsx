import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  TextInput,
  ActivityIndicator,
  Platform,
  Animated,
  LayoutAnimation,
  GestureResponderEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TeacherInfo } from '@/app/types/teacher';
import { useTheme } from 'react-native-paper';
import { useFavorites } from '@/app/contexts/FavoritesContext';

interface TeacherListProps {
  teachers: TeacherInfo[];
  onSelectTeacher: (teacher: TeacherInfo) => void;
}

const sortTeachers = (teachers: TeacherInfo[]) => {
  return teachers.sort((a, b) => a.fio.localeCompare(b.fio));
};

export const TeacherList: React.FC<TeacherListProps> = ({ 
  teachers, 
  onSelectTeacher 
}) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const filteredTeachers = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return sortTeachers(teachers);
    
    return sortTeachers(
      teachers.filter(teacher => 
        teacher.fio.toLowerCase().includes(query) ||
        (teacher.position?.toLowerCase() || '').includes(query)
      )
    );
  }, [teachers, searchQuery]);

  const handleFavoritePress = async (teacher: TeacherInfo, event: GestureResponderEvent) => {
    event.stopPropagation();
    if (isFavorite(teacher.id, 'teacher')) {
      await removeFromFavorites(teacher.id, 'teacher');
    } else {
      await addToFavorites(teacher, 'teacher');
    }
  };

  const renderTeacherItem = ({ item: teacher }: { item: TeacherInfo }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const isTeacherFavorite = isFavorite(teacher.id, 'teacher');

    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.97,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    const initials = teacher.fio
      .split(' ')
      .map(part => part[0])
      .join('')
      .substring(0, 2);

    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() => onSelectTeacher(teacher)}
        activeOpacity={1}
      >
        <Animated.View style={[
          styles.teacherItem,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.outline,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <View style={styles.teacherInfo}>
            <View style={[styles.avatarContainer, { 
              backgroundColor: theme.colors.primaryContainer 
            }]}>
              <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
                {initials}
              </Text>
            </View>
            <View style={styles.teacherDetails}>
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
              onPress={(e) => handleFavoritePress(teacher, e)}
              style={styles.favoriteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name={isTeacherFavorite ? "star" : "star-outline"} 
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
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, -50],
    extrapolate: 'clamp',
  });

  const handleSearch = (text: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSearchQuery(text);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View style={[styles.searchWrapper, {
        transform: [{ translateY: headerHeight }],
        backgroundColor: theme.colors.background,
      }]}>
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
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={theme.colors.onSurfaceVariant}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
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

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : filteredTeachers.length === 0 ? (
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
          {filteredTeachers.map((teacher) => (
            <View key={teacher.id} style={styles.teacherItemWrapper}>
              {renderTeacherItem({ item: teacher })}
            </View>
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
    top: 8,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: 12,
    paddingTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
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
  },
  clearButton: {
    padding: 8,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingTop: 80,
    paddingBottom: 32,
    paddingHorizontal: 8,
    gap: 12,
  },
  teacherItemWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  teacherItem: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: 'white',
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
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
  },
  teacherDetails: {
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
    opacity: 0.8,
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
  },
}); 