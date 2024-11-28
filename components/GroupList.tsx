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
        borderColor: theme.colors.border
      }]}>
        <Ionicons name="search" size={20} color={theme.colors.secondaryText} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="Поиск группы..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={theme.colors.secondaryText}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => setSearchQuery('')}
            style={styles.clearButton}
          >
            <Ionicons name="close-circle" size={20} color={theme.colors.secondaryText} />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : Object.keys(groupedAndFilteredGroups).length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="school" size={48} color={theme.colors.secondaryText} />
          <Text style={[styles.emptyText, { color: theme.colors.secondaryText }]}>
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
                <Text style={[styles.categoryTitle, { color: theme.colors.text }]}>
                  {category}
                </Text>
                <View style={styles.groupsGrid}>
                  {categoryGroups.map((group) => (
                    <TouchableOpacity
                      key={group.id}
                      style={[styles.groupItem, {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border
                      }]}
                      onPress={() => onSelectGroup(group)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.groupContent}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.colors.accent }]}>
                          <Ionicons name="people" size={24} color={theme.colors.primary} />
                        </View>
                        <Text style={[styles.groupName, { color: theme.colors.text }]}>
                          {group.name}
                        </Text>
                        <View style={styles.arrowContainer}>
                          <Ionicons name="chevron-forward" size={20} color={theme.colors.secondaryText} />
                        </View>
                      </View>
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
    color: '#1e293b',
    marginBottom: 12,
    paddingLeft: 4,
  },
  groupsGrid: {
    gap: 12,
  },
  groupItem: {
    backgroundColor: '#ffffff',
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
  groupContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
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
  groupName: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  arrowContainer: {
    marginLeft: 'auto',
  },
}); 