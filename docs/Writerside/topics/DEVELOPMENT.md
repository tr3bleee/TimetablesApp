# Руководство разработчика

## Настройка окружения

### Установка зависимостей

```bash
# Установка Expo CLI глобально
npm install -g expo-cli

# Клонирование репозитория
git clone https://github.com/y9tr3ble/schedule-app.git

# Переход в директорию проекта
cd schedule-app

# Установка зависимостей проекта
npm install
```

## Запуск проекта

### Режим разработки
```bash
# Запуск с Expo Go
npx expo start

# Запуск для Android
npx expo start --android

# Запуск для iOS
npx expo start --ios
```

### Горячая перезагрузка
- Включена по умолчанию
- Двойное нажатие 'r' для ручной перезагрузки
- Shake устройства для меню разработчика

## Структура проекта

### Основные директории
```
app/                  # Основные экраны и навигация
├── (tabs)/           # Вкладки приложения
├── schedule/         # Экраны расписания
└── teacher/          # Экраны преподавателей

components/          # Переиспользуемые компоненты
contexts/           # React контексты
constants/          # Константы приложения
```

### Ключевые файлы
```
app.json             # Конфигурация Expo
babel.config.js      # Конфигурация Babel
tsconfig.json        # Конфигурация TypeScript
package.json         # Зависимости и скрипты
```

## Разработка

### Создание нового компонента
```typescript
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';

interface Props {
  // Определение пропсов
}

export const NewComponent: React.FC<Props> = (props) => {
  const theme = useTheme();
  
  return (
    <View style={styles.container}>
      {/* Контент компонента */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Стили
  }
});
```

### Работа с контекстами
```typescript
// Создание контекста
const MyContext = createContext<ContextType | undefined>(undefined);

// Провайдер
export const MyProvider: React.FC = ({ children }) => {
  // Логика провайдера
  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

// Хук для использования
export const useMyContext = () => {
  const context = useContext(MyContext);
  if (context === undefined) {
    throw new Error('useMyContext must be used within a MyProvider');
  }
  return context;
};
```

## Тестирование

### Модульные тесты
```bash
# Запуск всех тестов
npm test

# Запуск с покрытием
npm run test:coverage

# Запуск конкретного теста
npm test ComponentName.test.tsx
```

### E2E тестирование
```bash
# Установка Detox
npm install -g detox-cli

# Сборка для тестирования
detox build

# Запуск тестов
detox test
```

## Сборка приложения

### Android
```bash
# Создание релизной сборки
eas build -p android --profile production

# Локальная сборка APK
npx expo run:android
```

### iOS
```bash
# Создание релизной сборки
eas build -p ios --profile production

# Локальная сборка
npx expo run:ios
```

## Деплой

### Публикация в Expo
```bash
# Публикация обновления
expo publish

# Публикация конкретного канала
expo publish --release-channel production
```

### App Store / Google Play
1. Создание релизной сборки
2. Тестирование сборки
3. Подготовка материалов
4. Публикация в магазинах

## Рекомендации по разработке

### Код стайл
- Использовать TypeScript
- Следовать принципам Clean Code
- Документировать код
- Использовать ESLint и Prettier

### Производительность
- Мемоизация компонентов
- Оптимизация ререндеров
- Ленивая загрузка
- Кэширование данных

### Безопасность
- Проверка входных данных
- Безопасное хранение данных
- Обработка ошибок
- Защита API ключей

## Решение проблем

### Общие проблемы
1. Очистка кэша
```bash
npx expo start -c
```

2. Пересборка проекта
```bash
npm run clean
npm install
```

3. Обновление зависимостей
```bash
npm update
```

### Отладка
- Использование React Native Debugger
- Console.log и отладочные точки
- Performance Monitor
- Network Inspector
