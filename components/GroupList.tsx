import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView,
  TextInput,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GroupInfo } from '@/constants/groups';
import { useTheme } from 'react-native-paper';

interface GroupListProps {
  groups: GroupInfo[];
  onSelectGroup: (group: GroupInfo) => void;
}

export const GroupList: React.FC<GroupListProps> = ({ groups, onSelectGroup }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const groupedAndFilteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase();
    const filtered = query
      ? groups.filter(group => group.name.toLowerCase().includes(query))
      : groups;

    return filtered.reduce((acc, group) => {
      const category = `${group.category} группа`;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(group);
      return acc;
    }, {} as Record<string, GroupInfo[]>);
  }, [groups, searchQuery]);

  const handleSearch = (text: string) => {
    setIsLoading(true);
    setSearchQuery(text);
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchContainer, { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.outline,
      }]}>
        <Ionicons name="search-outline" size={20} color={theme.colors.secondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.onSurface }]}
          placeholder="Поиск группы..."
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
      ) : Object.keys(groupedAndFilteredGroups).length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="school-outline" size={48} color={theme.colors.onSurfaceVariant} />
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            Группы не найдены
          </Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.list} 
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {Object.entries(groupedAndFilteredGroups)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([category, categoryGroups]) => (
              <View key={category} style={styles.categoryContainer}>
                <Text style={[styles.categoryTitle, { color: theme.colors.onSurface }]}>
                  {category}
                </Text>
                <View style={styles.groupsContainer}>
                  {categoryGroups.map((group) => (
                    <TouchableOpacity
                      key={group.id}
                      style={[styles.groupItem, {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.outline
                      }]}
                      onPress={() => onSelectGroup(group)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.groupInfo}>
                        <View style={[styles.avatarContainer, { backgroundColor: theme.colors.primaryContainer }]}>
                          <Ionicons 
                            name="people-circle-outline" 
                            size={24} 
                            color={theme.colors.primary} 
                          />
                        </View>
                        <Text style={[styles.groupName, { color: theme.colors.onSurface }]}>
                          {group.name}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward-outline" size={20} color={theme.colors.secondary} />
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 24,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    paddingLeft: 4,
  },
  groupsContainer: {
    gap: 8,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
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
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
}); 