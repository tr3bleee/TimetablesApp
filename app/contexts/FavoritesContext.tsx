import { GroupInfo, TeacherInfo } from '@/app/services/api/scheduleApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface FavoriteItem {
  id: number;
  type: 'group' | 'teacher';
  name: string;
  timestamp: number;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: GroupInfo | TeacherInfo, type: 'group' | 'teacher') => Promise<void>;
  removeFromFavorites: (id: number, type: 'group' | 'teacher') => Promise<void>;
  isFavorite: (id: number, type: 'group' | 'teacher') => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (newFavorites: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addToFavorites = async (item: GroupInfo | TeacherInfo, type: 'group' | 'teacher') => {
    const newFavorite: FavoriteItem = {
      id: item.id,
      type,
      name: type === 'group' ? (item as GroupInfo).name : (item as TeacherInfo).fio,
      timestamp: Date.now()
    };
    
    const newFavorites = [...favorites, newFavorite];
    await saveFavorites(newFavorites);
  };

  const removeFromFavorites = async (id: number, type: 'group' | 'teacher') => {
    const newFavorites = favorites.filter(
      item => !(item.id === id && item.type === type)
    );
    await saveFavorites(newFavorites);
  };

  const isFavorite = (id: number, type: 'group' | 'teacher') => {
    return favorites.some(item => item.id === id && item.type === type);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};