import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeContextType {
  isDarkTheme: boolean;
  useSystemTheme: boolean;
  toggleTheme: () => Promise<void>;
  toggleSystemTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [useSystemTheme, setUseSystemTheme] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    loadThemeSettings();
  }, []);

  useEffect(() => {
    if (useSystemTheme) {
      setIsDarkTheme(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, useSystemTheme]);

  const loadThemeSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('themeSettings');
      if (settings) {
        const { useSystem, isDark } = JSON.parse(settings);
        setUseSystemTheme(useSystem);
        if (!useSystem) {
          setIsDarkTheme(isDark);
        }
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    }
  };

  const saveThemeSettings = async (useSystem: boolean, isDark: boolean) => {
    try {
      await AsyncStorage.setItem(
        'themeSettings',
        JSON.stringify({ useSystem, isDark })
      );
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    setUseSystemTheme(false);
    await saveThemeSettings(false, newTheme);
  };

  const toggleSystemTheme = async () => {
    const newUseSystem = !useSystemTheme;
    setUseSystemTheme(newUseSystem);
    if (newUseSystem) {
      setIsDarkTheme(systemColorScheme === 'dark');
    }
    await saveThemeSettings(newUseSystem, isDarkTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkTheme,
        useSystemTheme,
        toggleTheme,
        toggleSystemTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}; 