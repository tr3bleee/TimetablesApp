import { MD3Theme } from 'react-native-paper';

interface CustomColors {
  text: string;
  secondaryText: string;
  border: string;
  accent: string;
  card: string;
  icon: string;
}

export interface CustomMD3Theme extends MD3Theme {
  colors: MD3Theme['colors'] & CustomColors;
}

export type AppTheme = CustomMD3Theme; 