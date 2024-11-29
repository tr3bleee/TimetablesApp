import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { useFavorites } from '@/app/contexts/FavoritesContext';

export default function FavoritesScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { favorites, removeFromFavorites } = useFavorites();

  const handleItemPress = (id: number, type: 'group' | 'teacher') => {
    if (type === 'group') {
      router.push(`/schedule/${id}`);
    } else {
      router.push(`/teacher/${id}`);
    }
  };

  const sortedFavorites = [...favorites].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      {sortedFavorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name="star" 
            size={48} 
            color={theme.colors.onSurfaceVariant} 
          />
          <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
            У вас пока нет избранного
          </Text>
        </View>
      ) : (
        sortedFavorites.map((item) => (
          <TouchableOpacity
            key={`${item.type}-${item.id}`}
            style={[styles.itemContainer, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.outline 
            }]}
            onPress={() => handleItemPress(item.id, item.type)}
          >
            <View style={styles.itemContent}>
              <View style={[styles.iconContainer, { 
                backgroundColor: theme.colors.primaryContainer 
              }]}>
                <Ionicons
                  name={item.type === 'group' ? 'school' : 'person'}
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.itemName, { color: theme.colors.onSurface }]}>
                  {item.name}
                </Text>
                <Text style={[styles.itemType, { color: theme.colors.onSurfaceVariant }]}>
                  {item.type === 'group' ? 'Группа' : 'Преподаватель'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromFavorites(item.id, item.type)}
              >
                <Ionicons
                  name="star"
                  size={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  itemContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  textContainer: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemType: {
    fontSize: 14,
  },
  removeButton: {
    padding: 8,
  },
}); 