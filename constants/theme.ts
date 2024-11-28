import { MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import type { CustomMD3Theme } from '@/app/types/theme';

export const lightTheme: CustomMD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#7f61dd',
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#1e293b',
    secondaryText: '#64748b',
    border: '#e2e8f0',
    card: '#ffffff',
    icon: '#7f61dd',
    accent: '#f3f0ff',
  },
} as CustomMD3Theme;

export const darkTheme: CustomMD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#7f61dd',
    background: '#1a1a1a',
    surface: '#2a2a2a',
    text: '#ffffff',
    secondaryText: '#a1a1aa',
    border: '#3f3f46',
    card: '#2a2a2a',
    icon: '#7f61dd',
    accent: '#27272a',
  },
} as CustomMD3Theme;

export type { CustomMD3Theme as AppTheme }; 