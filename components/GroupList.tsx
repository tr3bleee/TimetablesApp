import { useFavorites } from '@/app/contexts/FavoritesContext';
import { useSearch } from '@/app/hooks/useSearch';
import { getSpecializationColor, getSpecializationLabel } from '@/app/utils/groupUtils';
import { GroupInfo } from '@/constants/groups';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from 'react-native-paper';

interface GroupListProps {
  groups: GroupInfo[];
  onSelectGroup: (group: GroupInfo) => void;
}

const sortGroups = (a: GroupInfo, b: GroupInfo) => 
  Number(a.category) - Number(b.category);

const getSearchFields = (group: GroupInfo) => [
  group.name,
  `${group.category} группа`
];

export const GroupList: React.FC<GroupListProps> = ({ groups, onSelectGroup }) => {
  const theme = useTheme();
  const scrollY = useRef(new Animated.Value(0)).current;
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const {
    query,
    filteredItems,
    handleSearch,
    clearSearch
  } = useSearch(groups, getSearchFields, sortGroups);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -64],
    extrapolate: 'clamp',
  });

  const groupedItems = React.useMemo(() => {
    return filteredItems.reduce((acc, group) => {
      const category = `${group.category} группа`;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(group);
      return acc;
    }, {} as Record<string, GroupInfo[]>);
  }, [filteredItems]);

  // Выносим поле поиска в отдельный компонент для переиспользования
  const renderSearchField = () => (
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
          placeholder="Поиск группы..."
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
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderSearchField()}
      
      {filteredItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="school" 
            size={48} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            Группы не найдены
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
          {Object.entries(groupedItems).map(([category, categoryGroups]) => (
            <View key={category}>
              <View style={[styles.sectionHeader, { backgroundColor: theme.colors.background }]}>
                <View style={styles.sectionTitleContainer}>
                  <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                    {category}
                  </Text>
                  <View style={styles.titleCountDivider}>
                    <View style={[styles.dividerLine, { 
                      backgroundColor: theme.colors.primary,
                      opacity: 0.2
                    }]} />
                    <View style={[styles.groupCount, { backgroundColor: theme.colors.primaryContainer }]}>
                      <Text style={[styles.groupCountText, { color: theme.colors.primary }]}>
                        {categoryGroups.length}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={styles.groupsGrid}>
                {categoryGroups.map(group => (
                  <GroupItem
                    key={group.id}
                    group={group}
                    onSelect={onSelectGroup}
                    isFavorite={isFavorite(group.id, 'group')}
                    onToggleFavorite={async () => {
                      if (isFavorite(group.id, 'group')) {
                        await removeFromFavorites(group.id, 'group');
                      } else {
                        await addToFavorites(group, 'group');
                      }
                    }}
                    theme={theme}
                  />
                ))}
              </View>
            </View>
          ))}
        </Animated.ScrollView>
      )}
    </View>
  );
};

// Выносим GroupItem в отдельный компонент для оптимизации
const GroupItem = React.memo(({ 
  group, 
  onSelect, 
  isFavorite, 
  onToggleFavorite,
  theme 
}: {
  group: GroupInfo;
  onSelect: (group: GroupInfo) => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  theme: any;
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

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

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={() => onSelect(group)}
      activeOpacity={1}
    >
      <Animated.View style={[
        styles.groupItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.outline,
          transform: [{ scale: scaleAnim }]
        }
      ]}>
        <View style={styles.groupInfo}>
          <View style={[styles.avatarContainer, { 
            backgroundColor: theme.colors.primaryContainer,
            borderLeftColor: getSpecializationColor(group.name),
            borderLeftWidth: 3,
          }]}>
            <Text style={[styles.groupAvatar, { color: theme.colors.primary }]}>
              {group.name.split('-')[0]}
            </Text>
          </View>
          <View style={styles.groupDetails}>
            <Text style={[styles.groupName, { color: theme.colors.onSurface }]}>
              {group.name}
            </Text>
            {getSpecializationLabel(group.name) && (
              <Text style={[styles.groupSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                {getSpecializationLabel(group.name)}
              </Text>
            )}
          </View>
          <TouchableOpacity 
            onPress={onToggleFavorite}
            style={styles.favoriteButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons 
              name={isFavorite ? "star" : "star-outline"} 
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
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    padding: 16,
    paddingTop: 12,
    height: 68,
    backgroundColor: 'transparent',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingRight: 8,
    borderRadius: 16,
    borderWidth: 1,
    height: 48,
    backgroundColor: 'transparent',
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
    padding: 4,
    marginLeft: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
    borderRadius: 16,
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
    marginTop: -60,
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
    paddingTop: 76,
    paddingBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sectionTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  titleCountDivider: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 2,
  },
  groupCount: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  groupCountText: {
    fontSize: 12,
    fontWeight: '600',
  },
  groupsGrid: {
    paddingHorizontal: 16,
    gap: 10,
  },
  groupItemWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  groupItem: {
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
    }),
  },
  groupInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 3,
  },
  groupAvatar: {
    fontSize: 18,
    fontWeight: '600',
  },
  groupDetails: {
    flex: 1,
    gap: 4,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  groupSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  groupMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  groupBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  groupBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 8,
    marginRight: 8,
  },
}); 