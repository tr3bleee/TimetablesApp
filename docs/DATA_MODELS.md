# 📊 Модели данных

## Основные типы

### Группа
```typescript
// Базовая информация о группе
interface GroupInfo {
  id: number;          // Уникальный идентификатор группы
  name: string;        // Название группы (например, "П-1")
  category: string;    // Категория группы (например, "Программирование")
  course?: number;     // Номер курса (опционально)
  studentsCount?: number; // Количество студентов (опционально)
}

// Расписание группы
interface GroupSchedule {
  startDate: string;   // Дата начала недели в формате ISO
  group: GroupInfo;    // Информация о группе
  lessons: Lesson[];   // Массив занятий
  weekType?: 'current' | 'next'; // Тип недели
  lastUpdated: string; // Время последнего обновления
}

// Группировка групп
interface GroupCategory {
  id: string;         // Идентификатор категории
  name: string;       // Название категории
  groups: GroupInfo[]; // Группы в категории
  description?: string; // Описание категории
}
```

### Преподаватель
```typescript
// Базовая информация о преподавателе
interface TeacherInfo {
  id: number;         // Уникальный идентификатор
  fio: string;        // ФИО преподавателя
  position: string;   // Должность
  department?: string; // Кафедра
  email?: string;     // Email (опционально)
  photoUrl?: string;  // URL фотографии (опционально)
  subjects?: Subject[]; // Преподаваемые предметы
}

// Расписание преподавателя
interface TeacherSchedule {
  startDate: string;   // Дата начала недели
  teacher: TeacherInfo; // Информация о преподавателе
  lessons: Lesson[];    // Массив занятий
  weekType?: 'current' | 'next';
  lastUpdated: string;
  totalHours?: number;  // Общее количество часов
}
```

### Расписание
```typescript
// Занятие
interface Lesson {
  id: string;          // Уникальный идентификатор
  weekday: number;     // День недели (1-7)
  lesson: number;      // Номер пары
  startTime: string;   // Время начала (HH:mm)
  endTime: string;     // Время окончания (HH:mm)
  teachers: Teacher[]; // Преподаватели
  subject: Subject;    // Предмет
  cabinet: Cabinet;    // Аудитория
  unionGroups: UnionGroup[]; // Объединенные группы
  type?: LessonType;   // Тип занятия
  isOnline?: boolean;  // Онлайн занятие
  meetingUrl?: string; // Ссылка на онлайн встречу
  materials?: Material[]; // Учебные материалы
}

// Предмет
interface Subject {
  id: number;         // Идентификатор
  name: string;       // Полное название
  shortName?: string; // Сокращенное название
  description?: string; // Описание
  color?: string;     // Цвет для отображения
  department?: string; // Кафедра
}

// Аудитория
interface Cabinet {
  id: number;         // Идентификатор
  number: string;     // Номер аудитории
  building?: string;  // Здание
  floor?: number;     // Этаж
  capacity?: number;  // Вместимость
  type?: CabinetType; // Тип аудитории
  equipment?: string[]; // Оборудование
}

// Объединенная группа
interface UnionGroup {
  id: number;         // Идентификатор
  name: string;       // Название
  groups: GroupInfo[]; // Входящие группы
  type?: string;      // Тип объединения
}

// Тип занятия
enum LessonType {
  LECTURE = 'lecture',
  PRACTICE = 'practice',
  LAB = 'laboratory',
  SEMINAR = 'seminar',
  CONSULTATION = 'consultation'
}

// Тип аудитории
enum CabinetType {
  CLASSROOM = 'classroom',
  LABORATORY = 'laboratory',
  LECTURE_HALL = 'lecture_hall',
  COMPUTER_CLASS = 'computer_class'
}

// Учебные материалы
interface Material {
  id: string;
  title: string;
  type: 'document' | 'presentation' | 'video' | 'link';
  url: string;
  uploadedAt: string;
}
```

## Избранное

### Модели избранного
```typescript
// Элемент избранного
interface FavoriteItem {
  id: number;         // Уникальный идентификатор
  type: 'group' | 'teacher'; // Тип элемента
  data: GroupInfo | TeacherInfo; // Данные элемента
  addedAt: string;    // Дата добавления
  order?: number;     // Порядок отображения
  notes?: string;     // Заметки пользователя
  customColor?: string; // Пользовательский цвет
}

// Состояние избранного
interface FavoritesState {
  items: FavoriteItem[]; // Элементы
  lastUpdated: string;   // Последнее обновление
  maxItems?: number;     // Максимальное количество
  categories?: {         // Категории избранного
    groups: FavoriteItem[];
    teachers: FavoriteItem[];
  };
}
```

## Настройки

### Настройки приложения
```typescript
// Общие настройки
interface AppSettings {
  theme: ThemeSettings;
  schedule: ScheduleSettings;
  notifications: NotificationSettings;
  display: DisplaySettings;
  sync: SyncSettings;
}

// Настройки темы
interface ThemeSettings {
  isDarkTheme: boolean;
  useSystemTheme: boolean;
  primaryColor?: string;
  accentColor?: string;
  fontSize?: 'small' | 'medium' | 'large';
}

// Настройки расписания
interface ScheduleSettings {
  showCabinetNumbers: boolean;
  showTeacherNames: boolean;
  compactMode: boolean;
  showLessonNumbers: boolean;
  defaultView: 'day' | 'week';
  showWeekends: boolean;
  highlightCurrentDay: boolean;
  autoScrollToCurrent: boolean;
}

// Настройки уведомлений
interface NotificationSettings {
  enabled: boolean;
  beforeLesson: number; // минуты
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  scheduleUpdates: boolean;
}

// Настройки отображения
interface DisplaySettings {
  language: string;
  timeFormat: '12h' | '24h';
  dateFormat: string;
  listViewDensity: 'compact' | 'normal' | 'comfortable';
}

// Настройки синхронизации
interface SyncSettings {
  autoSync: boolean;
  syncInterval: number;
  syncOnWifiOnly: boolean;
  lastSyncTime: string;
}
```

## Состояния

### Состояния загрузки
```typescript
// Базовое состояние загрузки
interface LoadingState {
  loading: boolean;    // Флаг загрузки
  error: string | null; // Ошибка
  lastUpdated?: string; // Последнее обновление
  retryCount?: number;  // Количество попыток
  status?: 'idle' | 'loading' | 'success' | 'error';
}

// Состояние расписания
interface ScheduleState extends LoadingState {
  data: GroupSchedule | TeacherSchedule | null;
  isNextWeek: boolean;
  cache?: {
    [key: string]: CacheItem<GroupSchedule | TeacherSchedule>;
  };
  filters?: ScheduleFilters;
}

// Фильтры расписания
interface ScheduleFilters {
  days?: number[];
  teachers?: number[];
  subjects?: number[];
  types?: LessonType[];
}
```

[Продолжение в следующем сообщении из-за ограничения длины]�

## Ответы API

### Форматы ответов

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: ApiError;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
```

## Преобразования данных

### Маппинг данных

```typescript
// Преобразование сырых данных в модели
const mapGroupSchedule = (raw: any): GroupSchedule => ({
  startDate: raw.start_date,
  group: {
    id: raw.group.id,
    name: raw.group.name,
    category: raw.group.category
  },
  lessons: raw.lessons.map(mapLesson)
});

const mapLesson = (raw: any): Lesson => ({
  id: raw.id,
  weekday: raw.weekday,
  lesson: raw.lesson,
  startTime: raw.start_time,
  endTime: raw.end_time,
  teachers: raw.teachers.map(mapTeacher),
  subject: mapSubject(raw.subject),
  cabinet: mapCabinet(raw.cabinet),
  unionGroups: raw.union_groups.map(mapUnionGroup)
});
```

## Валидация

### Схемы валидации

```typescript
const groupSchema = {
  id: { type: 'number', required: true },
  name: { type: 'string', required: true },
  category: { type: 'string', required: true }
};

const lessonSchema = {
  id: { type: 'string', required: true },
  weekday: { type: 'number', min: 1, max: 7, required: true },
  lesson: { type: 'number', min: 1, required: true },
  startTime: { type: 'string', pattern: 'time', required: true },
  endTime: { type: 'string', pattern: 'time', required: true }
};
```

## Хранение

### Структуры хранения

```typescript
// Ключи для AsyncStorage
const STORAGE_KEYS = {
  FAVORITES: '@favorites',
  SETTINGS: '@settings',
  SCHEDULE_CACHE: '@schedule_cache'
};

// Формат кэша
interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}
```

## Типы событий

### События приложения

```typescript
type AppEvent = 
  | { type: 'SCHEDULE_LOADED'; payload: ScheduleData }
  | { type: 'FAVORITE_ADDED'; payload: FavoriteItem }
  | { type: 'FAVORITE_REMOVED'; payload: { id: number; type: string } }
  | { type: 'SETTINGS_UPDATED'; payload: Partial<AppSettings> };
```

## Рекомендации

### Лучшие практики

2. Валидировать данные при получении
3. Нормализовать данные перед сохранением
4. Использовать иммутабельные обновления
5. Документировать все интерфейсы

### Обработка данных
1. Проверять наличие обязательных полей
2. Предоставлять значения по умолчанию
3. Обрабатывать краевые случаи
4. Логировать ошибки валидации
5. Поддерживать обратную совместимость
