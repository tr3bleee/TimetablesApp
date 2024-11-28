import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import type { CustomMD3Theme } from '@/app/types/theme';

export const lightTheme: CustomMD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#8b5cf6',
    primaryContainer: '#ede9fe',
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceVariant: '#f1f5f9',
    text: '#0f172a',
    onSurface: '#1e293b',
    onSurfaceVariant: '#64748b',
    secondaryText: '#64748b',
    outline: '#e2e8f0',
    border: '#e2e8f0',
    accent: '#f5f3ff',
    card: '#ffffff',
    icon: '#8b5cf6',
    error: '#ef4444',
    success: '#22c55e',
  },
} as CustomMD3Theme;

export const darkTheme: CustomMD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#a78bfa',
    primaryContainer: '#4c1d95',
    background: '#09090b',
    surface: '#18181b',
    surfaceVariant: '#27272a',
    text: '#fafafa',
    onSurface: '#f4f4f5',
    onSurfaceVariant: '#a1a1aa',
    secondaryText: '#a1a1aa',
    outline: '#27272a',
    border: '#27272a',
    accent: '#4c1d95',
    card: '#18181b',
    icon: '#a78bfa',
    error: '#ef4444',
    success: '#22c55e',
  },
} as CustomMD3Theme;

export type { CustomMD3Theme as AppTheme }; 