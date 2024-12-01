# 🌐 Сетевой слой

## Конфигурация

### Базовая настройка

```typescript
// services/api/config.ts
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
  PUBLICATION_ID: process.env.EXPO_PUBLIC_PUBLICATION_ID,
  TIMEOUT: 10000, // 10 секунд
  RETRY_ATTEMPTS: 3,
};
```

### Инстанс Axios

```typescript
// services/api/instance.ts
import axios from 'axios';

export const apiInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Интерцептор запросов
apiInstance.interceptors.request.use(
  (config) => {
    // Добавление publication_id
    config.params = {
      ...config.params,
      publication_id: API_CONFIG.PUBLICATION_ID,
    };
    return config;
  },
  (error) => Promise.reject(error)
);

// Интерцептор ответов
apiInstance.interceptors.response.use(
  (response) => response,
  (error) => handleApiError(error)
);
```

## API Сервисы

### Расписание

```typescript
// services/api/scheduleService.ts
export class ScheduleService {
  static async getGroupSchedule(groupId: number, nextWeek: boolean): Promise<GroupSchedule> {
    try {
      const response = await apiInstance.get(`/schedule/group/${groupId}`, {
        params: { next_week: nextWeek }
      });
      return response.data;
    } catch (error) {
      throw handleScheduleError(error);
    }
  }

  static async getTeacherSchedule(teacherId: number, nextWeek: boolean): Promise<TeacherSchedule> {
    try {
      const response = await apiInstance.get(`/schedule/teacher/${teacherId}`, {
        params: { next_week: nextWeek }
      });
      return response.data;
    } catch (error) {
      throw handleScheduleError(error);
    }
  }
}
```

## Обработка ошибок

### Типы ошибок

```typescript
// types/api.ts
export enum ApiErrorType {
  NETWORK = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT_ERROR',
  SERVER = 'SERVER_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION = 'VALIDATION_ERROR',
}

export class ApiError extends Error {
  constructor(
    public type: ApiErrorType,
    public message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### Обработчик ошибок

```typescript
// services/api/errorHandler.ts
export const handleApiError = (error: any): never => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      throw new ApiError(
        ApiErrorType.NETWORK,
        'Ошибка сети. Проверьте подключение к интернету.'
      );
    }

    const { response } = error;
    switch (response.status) {
      case 404:
        throw new ApiError(
          ApiErrorType.NOT_FOUND,
          'Запрашиваемые данные не найдены.',
          404
        );
      case 422:
        throw new ApiError(
          ApiErrorType.VALIDATION,
          'Ошибка валидации данных.',
          422,
          response.data.errors
        );
      default:
        throw new ApiError(
          ApiErrorType.SERVER,
          'Ошибка сервера.',
          response.status
        );
    }
  }

  throw new ApiError(
    ApiErrorType.NETWORK,
    'Неизвестная ошибка сети.'
  );
};
```

## Кэширование

### Стратегия кэширования

```typescript
// services/cache/scheduleCache.ts
export class ScheduleCache {
  private static CACHE_TTL = 5 * 60 * 1000; // 5 минут
  private static cache = new Map<string, CacheItem>();

  static async get(key: string): Promise<any | null> {
    const item = this.cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() - item.timestamp > this.CACHE_TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  static set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  static clear(): void {
    this.cache.clear();
  }
}
```

## Retry механизм

### Реализация повторных попыток

```typescript
// services/api/retry.ts
export const withRetry = async <T>(
  operation: () => Promise<T>,
  retryCount: number = API_CONFIG.RETRY_ATTEMPTS
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < retryCount; i++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (!isRetryableError(error)) {
        throw error;
      }
      
      await delay(getRetryDelay(i));
    }
  }
  
  throw lastError;
};

const isRetryableError = (error: any): boolean => {
  if (error instanceof ApiError) {
    return error.type === ApiErrorType.NETWORK || 
           error.type === ApiErrorType.TIMEOUT;
  }
  return false;
};

const getRetryDelay = (attempt: number): number => {
  return Math.min(1000 * Math.pow(2, attempt), 10000);
};
```

## Мониторинг

### Логирование запросов

```typescript
// services/api/logging.ts
export const logApiRequest = (config: any) => {
  if (__DEV__) {
    console.log(`API Request: ${config.method.toUpperCase()} ${config.url}`);
    console.log('Params:', config.params);
    console.log('Data:', config.data);
  }
};

export const logApiResponse = (response: any) => {
  if (__DEV__) {
    console.log(`API Response: ${response.status}`);
    console.log('Data:', response.data);
  }
};
```

## Оптимизация

### Параллельные запросы

```typescript
// services/api/parallel.ts
export const fetchParallelData = async (groupIds: number[]): Promise<GroupSchedule[]> => {
  const promises = groupIds.map(id => 
    ScheduleService.getGroupSchedule(id, false)
  );
  
  return Promise.all(promises);
};
```

### Отмена запросов

```typescript
// hooks/useSchedule.ts
export const useSchedule = (groupId: number) => {
  const abortController = useRef<AbortController>();

  useEffect(() => {
    abortController.current = new AbortController();

    const fetchSchedule = async () => {
      try {
        const response = await apiInstance.get(`/schedule/group/${groupId}`, {
          signal: abortController.current.signal
        });
        // Обработка ответа
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled');
        }
      }
    };

    fetchSchedule();

    return () => {
      abortController.current?.abort();
    };
  }, [groupId]);
};
```

## Рекомендации

### Лучшие практики
1. Использовать единый инстанс axios
2. Реализовать обработку ошибок
3. Внедрить кэширование
4. Добавить retry механизм
5. Логировать запросы в development

### Безопасность
1. Валидация входных данных
2. Санитизация ответов
3. Защита от CSRF
4. Обработка чувствительных данных
5. Таймауты запросов 