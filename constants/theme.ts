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
    primary: '#a585ff',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    secondaryText: '#b4b4b4',
    border: '#323232',
    card: '#1a1a1a',
    icon: '#a585ff',
    accent: '#201736',
    primaryContainer: '#201736',
    onPrimaryContainer: '#b4b4b4',
  },
} as CustomMD3Theme;

export type { CustomMD3Theme as AppTheme }; 