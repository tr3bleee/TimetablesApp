# 📖 Общая информация

## Описание проекта

Мобильное приложение "Расписание для Хекслет" предназначено для просмотра расписания занятий студентами и преподавателями Хекслет Колледжа. Приложение разработано с использованием современных технологий React Native и Expo.

### Основные возможности
- Просмотр расписания групп и преподавателей
- Переключение между текущей и следующей неделей
- Добавление в избранное
- Умный поиск
- Темная и светлая тема
- Настройка отображения информации

## 🏗 Архитектура

### Структура проекта
```
app/
├── _layout.tsx           # Корневой layout
├── (tabs)/              # Основные экраны
│   ├── _layout.tsx      # Навигация по вкладкам
│   ├── index.tsx        # Список групп
│   ├── teacher.tsx      # Список преподавателей
│   ├── favorites.tsx    # Избранное
│   └── settings.tsx     # Настройки
├── schedule/            # Экраны расписания
│   └── [id].tsx         # Расписание группы
└── teacher/             # Экраны преподавателей
    └── [id].tsx         # Расписание преподавателя

components/             # Переиспользуемые компоненты
├── GroupList.tsx       # Список групп
├── TeacherList.tsx     # Список преподавателей
├── ScheduleView.tsx    # Отображение расписания
├── LessonCard.tsx      # Карточка занятия
└── WeekSelector.tsx    # Выбор недели

contexts/              # React контексты
├── FavoritesContext.tsx    # Управление избранным
├── ThemeContext.tsx        # Управление темой
└── ScheduleSettingsContext.tsx # Настройки расписания

constants/             # Константы приложения
├── groups.ts          # Информация о группах
├── teachers.ts        # Информация о преподавателях
└── theme.ts           # Настройки тем
```

## 🔄 Жизненный цикл приложения

### 1. Инициализация
- Загрузка приложения
- Инициализация контекстов
- Загрузка сохраненных настроек
- Проверка темы устройства

### 2. Основной цикл
- Рендеринг интерфейса
- Обработка пользовательских действий
- Управление состоянием
- Кэширование данных

### 3. Обновление данных
- Загрузка расписания
- Обновление избранного
- Сохранение настроек
- Обработка ошибок

## 🔐 Управление состоянием

### FavoritesContext
Управление избранными группами и преподавателями.
```typescript
interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: GroupInfo | TeacherInfo, type: 'group' | 'teacher') => Promise<void>;
  removeFromFavorites: (id: number, type: 'group' | 'teacher') => Promise<void>;
  isFavorite: (id: number, type: 'group' | 'teacher') => boolean;
}
```

### ThemeContext
Управление темой оформления.
```typescript
interface ThemeContextType {
  isDarkTheme: boolean;
  useSystemTheme: boolean;
  toggleTheme: () => Promise<void>;
  toggleSystemTheme: () => Promise<void>;
}
```

### ScheduleSettingsContext
Настройки отображения расписания.
```typescript
interface ScheduleSettings {
  showCabinetNumbers: boolean;
  showTeacherNames: boolean;
  compactMode: boolean;
  showLessonNumbers: boolean;
}
```

## 📱 Навигация

### Структура навигации
- Вкладки (Tabs)
  - Расписание (index)
  - Преподаватели (teacher)
  - Избранное (favorites)
  - Настройки (settings)
- Стек навигации
  - Расписание группы (schedule/[id])
  - Расписание преподавателя (teacher/[id])
  - Информация (info)

### Параметры навигации
```typescript
type RootStackParamList = {
  '(tabs)': undefined;
  'info': undefined;
  'schedule/[id]': { id: string };
  'teacher/[id]': { id: string };
};
```

## 🔄 Обработка данных

### Локальное хранение
- AsyncStorage для настроек и избранного
- Кэширование расписания
- Управление состоянием приложения

### Сетевые запросы
- Fetch API для получения данных
- Обработка ошибок сети
- Retry механизмы
- Кэширование ответов

## 🎨 Стилизация

### Темы
- Светлая тема
- Темная тема
- Системная тема

### Компоненты
- Material Design
- Адаптивный дизайн
- Анимации
- Кастомные компоненты

## 📱 Поддерживаемые платформы

### iOS
- iOS 13.0 и выше
- Оптимизация для iPhone
- Поддержка жестов iOS

### Android
- Android 6.0 и выше
- Material Design
- Адаптация под разные устройства
