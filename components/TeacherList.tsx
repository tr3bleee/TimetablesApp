import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TeacherInfo } from '@/app/types/teacher';
import { useTheme } from 'react-native-paper';

interface TeacherListProps {
  teachers: TeacherInfo[];
  onSelectTeacher: (teacher: TeacherInfo) => void;
  selectedTeacher?: TeacherInfo;
}

export const TeacherList: React.FC<TeacherListProps> = ({ teachers, onSelectTeacher, selectedTeacher }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredTeachers = useMemo(() => {
    if (!searchQuery.trim()) return teachers;
    
    const query = searchQuery.toLowerCase();
    return teachers.filter(teacher => 
      teacher.fio.toLowerCase().includes(query)
    );
  }, [teachers, searchQuery]);

  const handleSearch = useCallback((text: string) => {
    setIsLoading(true);
    setSearchQuery(text);
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchContainer, {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.outline
      }]}>
        <Ionicons name="search-outline" size={20} color={theme.colors.secondary} style={styles.searchIcon} />
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
          >
            <Ionicons name="close-circle" size={20} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : filteredTeachers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={48} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            Преподаватели не найдены
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {filteredTeachers.map((teacher) => (
            <TouchableOpacity
              key={teacher.id}
              style={[styles.teacherItem, {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.outline
              }]}
              onPress={() => onSelectTeacher(teacher)}
              activeOpacity={0.7}
            >
              <View style={styles.teacherInfo}>
                <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                  <Ionicons 
                    name="person-circle-outline" 
                    size={24} 
                    color={theme.colors.primary} 
                  />
                </View>
                <Text style={[styles.teacherName, { color: theme.colors.onSurface }]}>
                  {teacher.fio}
                </Text>
              </View>
              <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.onSurfaceVariant} />
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1e293b',
  },
  clearButton: {
    padding: 4,
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
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  teacherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  teacherInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7f61dd',
  },
  teacherName: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    flex: 1,
  },
}); 