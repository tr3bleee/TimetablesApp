import { MD3Theme } from 'react-native-paper';

// Определяем все цвета, которые используются в приложении
interface AppColors {
  // Основные цвета
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  error: string;
  
  // Текст
  text: string;
  secondaryText: string;
  onSurface: string;
  onSurfaceVariant: string;
  
  // Границы и разделители
  border: string;
  outline: string;
  
  // Контейнеры
  card: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  
  // Акценты
  accent: string;
  icon: string;
  success: string;
}

// Создаем свой тип темы, наследуя все кроме colors из MD3Theme
export interface AppTheme extends Omit<MD3Theme, 'colors'> {
  colors: AppColors;
} 