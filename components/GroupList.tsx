import { useFavorites } from '@/app/contexts/FavoritesContext';
import { GroupInfo } from '@/constants/groups';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    FlatList,
    GestureResponderEvent,
    LayoutAnimation,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useTheme } from 'react-native-paper';

interface GroupListProps {
  groups: GroupInfo[];
  onSelectGroup: (group: GroupInfo) => void;
}

const getSpecializationLabel = (name: string): string => {
  if (name.includes('ОДФ')) return '';
  if (name.includes('ИСИП')) return 'Информационные системы и программирование';
  if (name.includes('СИСА')) return 'Системное администрирование';
  if (name.includes('Д')) return 'Дизайн';
  if (name.includes('Р')) return 'Реклама';
  return 'Специальность не указана';
};

const getSpecializationColor = (name: string): string => {
  if (name.includes('ИСИП')) return '#7c4dff';
  if (name.includes('СИСА')) return '#00bcd4';
  if (name.includes('Д')) return '#ff4081';
  if (name.includes('Р')) return '#ff9800';
  if (name.includes('ОДФ')) return '#4caf50';
  return '#9e9e9e';
};

const sortGroups = (groups: GroupInfo[]) => {
  return groups.sort((a, b) => {
    // Преобразуем строки в числа для сравнения
    return Number(a.category) - Number(b.category);
  });
};

export const GroupList: React.FC<GroupListProps> = ({ groups, onSelectGroup }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -100],
    extrapolate: 'clamp',
  });

  const groupedAndFilteredGroups = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    
    const filterGroup = (group: GroupInfo) => {
      if (!query) return true;
      return (
        group.name.toLowerCase().includes(query) ||
        getSpecializationLabel(group.name).toLowerCase().includes(query)
      );
    };

    const filtered = sortGroups(groups.filter(filterGroup));

    return filtered.reduce((acc, group) => {
      const category = `${group.category} группа`;
      if (!acc[category]) acc[category] = [];
      acc[category].push(group);
      return acc;
    }, {} as Record<string, GroupInfo[]>);
  }, [groups, searchQuery]);

  const handleSearch = (text: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (isLoading) return;
    setIsLoading(true);
    setSearchQuery(text);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleFavoritePress = async (group: GroupInfo, event: GestureResponderEvent) => {
    event.stopPropagation(); // Предотвращаем переход на экран группы
    if (isFavorite(group.id, 'group')) {
      await removeFromFavorites(group.id, 'group');
    } else {
      await addToFavorites(group, 'group');
    }
  };

  const renderGroupItem = ({ item: group }: { item: GroupInfo }) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const isGroupFavorite = isFavorite(group.id, 'group');

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
        onPress={() => onSelectGroup(group)}
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
              onPress={(e) => handleFavoritePress(group, e)}
              style={styles.favoriteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons 
                name={isGroupFavorite ? "star" : "star-outline"} 
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

  const renderSectionHeader = (title: string, count: number) => (
    <View style={[styles.sectionHeader, { backgroundColor: theme.colors.background }]}>
      <View style={styles.sectionTitleContainer}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          {title}
        </Text>
        <View style={[styles.groupCount, { backgroundColor: theme.colors.primaryContainer }]}>
          <Text style={[styles.groupCountText, { color: theme.colors.primary }]}>
            {count}
          </Text>
        </View>
      </View>
      <View style={[styles.sectionDivider, { backgroundColor: theme.colors.primary }]} />
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Animated.View 
        style={[
          styles.searchWrapper,
          {
            backgroundColor: theme.colors.background,
            transform: [{ translateY: headerHeight }],
            ...Platform.select({
              ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
              },
              android: {
                elevation: 3,
              },
            }),
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
      ) : Object.keys(groupedAndFilteredGroups).length === 0 ? (
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
          {Object.entries(groupedAndFilteredGroups)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([category, categoryGroups]) => (
              <View key={category}>
                {renderSectionHeader(category, categoryGroups.length)}
                <View style={styles.groupsGrid}>
                  {categoryGroups.map((group) => (
                    <View key={group.id} style={styles.groupItemWrapper}>
                      {renderGroupItem({ item: group })}
                    </View>
                  ))}
                </View>
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
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'column',
    gap: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: -0.5,
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
  sectionDivider: {
    height: 2,
    flex: 1,
    borderRadius: 1,
    opacity: 0.2,
  },
  groupsGrid: {
    paddingHorizontal: 16,
    gap: 12,
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
      android: {
        elevation: 4,
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