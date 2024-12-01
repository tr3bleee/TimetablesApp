# API Документация

## Конфигурация

```typescript
const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  PUBLICATION_ID: process.env.EXPO_PUBLIC_PUBLICATION_ID
};
```

## Основные методы

### Расписание группы

```typescript
getGroupSchedule(groupId: number, nextWeek: boolean): Promise<GroupData>
```

#### Параметры:
- `groupId`: ID группы
- `nextWeek`: флаг следующей недели

#### Ответ:
```typescript
interface GroupData {
  startDate: string;
  group: {
    id: number;
    name: string;
  };
  lessons: Lesson[];
}
```

### Расписание преподавателя

```typescript
getTeacherSchedule(teacherId: number, nextWeek: boolean): Promise<TeacherSchedule>
```

#### Параметры:
- `teacherId`: ID преподавателя
- `nextWeek`: флаг следующей недели

#### Ответ:
```typescript
interface TeacherSchedule {
  startDate: string;
  teacher: TeacherInfo;
  lessons: Lesson[];
}
```

## Модели данных

### Lesson
```typescript
interface Lesson {
  id: string;
  weekday: number;
  lesson: number;
  startTime: string;
  endTime: string;
  teachers: Teacher[];
  subject: Subject;
  cabinet: Cabinet;
  unionGroups: UnionGroup[];
}
```

### Teacher
```typescript
interface Teacher {
  id: number;
  fio: string;
  position: string;
}
```

## Обработка ошибок

### Типы ошибок
- Сетевые ошибки (NetworkError)
- Ошибки сервера (ServerError)
- Ошибки валидации (ValidationError)

### Обработка
```typescript
try {
  const data = await getGroupSchedule(groupId, false);
} catch (error) {
  if (error instanceof NetworkError) {
    // Обработка сетевой ошибки
  } else if (error instanceof ServerError) {
    // Обработка серверной ошибки
  }
}
```

## Кэширование

### Стратегии кэширования
- In-memory кэш для быстрого доступа
- AsyncStorage для персистентного хранения
- Stale-while-revalidate для оптимизации загрузки

### Пример реализации кэша
```typescript
const CACHE_TTL = 5 * 60 * 1000; // 5 минут

class ScheduleCache {
  private cache: Map<string, {
    data: any;
    timestamp: number;
  }>;

  constructor() {
    this.cache = new Map();
  }

  set(key: string, data: any) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  get(key: string) {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
}
```

## Утилиты API

### Форматирование данных
```typescript
export const formatScheduleData = (data: RawScheduleData): FormattedSchedule => {
  // Логика форматирования данных
};
```

### Валидация
```typescript
export const validateScheduleData = (data: any): boolean => {
  // Логика валидации
};
```

## Примеры использования

### Получение расписания группы
```typescript
const getGroupScheduleWithCache = async (groupId: number, nextWeek: boolean) => {
  const cacheKey = `group_${groupId}_${nextWeek}`;
  const cached = scheduleCache.get(cacheKey);
  
  if (cached) {
    return cached;
  }
  
  const data = await getGroupSchedule(groupId, nextWeek);
  scheduleCache.set(cacheKey, data);
  return data;
};
```