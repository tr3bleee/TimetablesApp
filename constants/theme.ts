import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import type { AppTheme } from '@/app/types/theme';

const lightColors = {
  // Основные цвета
  primary: '#7f61dd',
  secondary: '#64748b',
  background: '#f8fafc',
  surface: '#ffffff',
  error: '#ef4444',
  
  // Текст
  text: '#1e293b',
  secondaryText: '#64748b',
  onSurface: '#1e293b',
  onSurfaceVariant: '#64748b',
  
  // Границы и разделители
  border: '#e2e8f0',
  outline: '#e2e8f0',
  
  // Контейнеры
  card: '#ffffff',
  primaryContainer: '#f3f0ff',
  onPrimaryContainer: '#1e293b',
  
  // Акценты
  accent: '#f3f0ff',
  icon: '#7f61dd',
  success: '#22c55e',
};

const darkColors = {
  // Основные цвета
  primary: '#a585ff',
  secondary: '#b4b4b4',
  background: '#000000',
  surface: '#111111',
  error: '#ef4444',
  
  // Текст
  text: '#ffffff',
  secondaryText: '#b4b4b4',
  onSurface: '#ffffff',
  onSurfaceVariant: '#b4b4b4',
  
  // Границы и разделители
  border: '#222222',
  outline: '#222222',
  
  // Контейнеры
  card: '#111111',
  primaryContainer: '#150d24',
  onPrimaryContainer: '#b4b4b4',
  
  // Акценты
  accent: '#150d24',
  icon: '#a585ff',
  success: '#4ade80',
};

export const lightTheme: AppTheme = {
  ...MD3LightTheme,
  colors: lightColors,
};

export const darkTheme: AppTheme = {
  ...MD3DarkTheme,
  colors: darkColors,
};

export type { AppTheme }; 