# 📊 Управление состоянием

## Обзор

В приложении используется комбинация React Context API и локального состояния компонентов для эффективного управления данными.

## Контексты

### FavoritesContext

Управление избранными группами и преподавателями.

```typescript
// contexts/FavoritesContext.tsx

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addToFavorites: (item: GroupInfo | TeacherInfo, type: 'group' | 'teacher') => Promise<void>;
  removeFromFavorites: (id: number, type: 'group' | 'teacher') => Promise<void>;
  isFavorite: (id: number, type: 'group' | 'teacher') => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Загрузка избранного при монтировании
  useEffect(() => {
    loadFavorites();
  }, []);

  // Методы управления избранным
  const addToFavorites = async (item, type) => {
    // Реализация
  };

  const removeFromFavorites = async (id, type) => {
    // Реализация
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};
```

### ThemeContext

Управление темой оформления приложения.

```typescript
// contexts/ThemeContext.tsx

interface ThemeContextType {
  isDarkTheme: boolean;
  useSystemTheme: boolean;
  toggleTheme: () => Promise<void>;
  toggleSystemTheme: () => Promise<void>;
}

export const ThemeProvider: React.FC = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [useSystemTheme, setUseSystemTheme] = useState(true);

  // Инициализация темы
  useEffect(() => {
    loadThemeSettings();
  }, []);

  // Методы управления темой
  const toggleTheme = async () => {
    // Реализация
  };

  const toggleSystemTheme = async () => {
    // Реализация
  };

  return (
    <ThemeContext.Provider value={{
      isDarkTheme,
      useSystemTheme,
      toggleTheme,
      toggleSystemTheme
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### ScheduleSettingsContext

Настройки отображения расписания.

```typescript
// contexts/ScheduleSettingsContext.tsx

interface ScheduleSettings {
  showCabinetNumbers: boolean;
  showTeacherNames: boolean;
  compactMode: boolean;
  showLessonNumbers: boolean;
}

export const ScheduleSettingsProvider: React.FC = ({ children }) => {
  const [settings, setSettings] = useState<ScheduleSettings>(defaultSettings);

  // Загрузка настроек
  useEffect(() => {
    loadSettings();
  }, []);

  // Методы управления настройками
  const updateSettings = async (newSettings: Partial<ScheduleSettings>) => {
    // Реализация
  };

  return (
    <ScheduleSettingsContext.Provider value={{
      settings,
      updateSettings
    }}>
      {children}
    </ScheduleSettingsContext.Provider>
  );
};
```

## Иерархия состояний

```
App (_layout.tsx)
├── ThemeProvider
│   ├── FavoritesProvider
│   │   └── ScheduleSettingsProvider
│   │       └── RootLayoutNav
│   │           ├── TabsNavigator
│   │           │   ├── GroupList (использует FavoritesContext)
│   │           │   ├── TeacherList (использует FavoritesContext)
│   │           │   └── Settings (использует все контексты)
│   │           └── ScheduleView (ис��ользует ScheduleSettingsContext)
```

## Локальное состояние

### Компоненты с локальным состоянием

#### GroupList
```typescript
const GroupList: React.FC<GroupListProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredGroups, setFilteredGroups] = useState<GroupInfo[]>([]);
  
  // Логика фильтрации
};
```

#### WeekSelector
```typescript
const WeekSelector: React.FC<WeekSelectorProps> = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Логика переключения недель
};
```

#### ScheduleView
```typescript
const ScheduleView: React.FC<ScheduleViewProps> = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Логика обновления данных
};
```

## Персистентность данных

### AsyncStorage

Сохранение состояния в локальное хранилище:

```typescript
// Ключи для хранения
const STORAGE_KEYS = {
  FAVORITES: '@favorites',
  THEME: '@theme',
  SETTINGS: '@settings'
};

// Сохранение данных
const saveData = async (key: string, data: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

// Загрузка данных
const loadData = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};
```

## Оптимизация состояния

### Мемоизация

```typescript
// Мемоизация вычисляемых значений
const filteredGroups = useMemo(() => {
  return groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [groups, searchQuery]);

// Мемоизация колбэков
const handleGroupSelect = useCallback((group: GroupInfo) => {
  // Обработка выбора группы
}, []);
```

### Дебаунсинг

```typescript
// Дебаунс поискового запроса
const debouncedSearch = useCallback(
  debounce((query: string) => {
    setFilteredGroups(
      groups.filter(group =>
        group.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  }, 300),
  [groups]
);
```

## Обработка ошибок

```typescript
const ErrorBoundary: React.FC = ({ children }) => {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Произошла ошибка: {error.message}
        </Text>
      </View>
    );
  }

  return children;
};
```

## Рекомендации

1. Использовать контексты для глобального состояния
2. Держать локальное состояние максимально близко к компонентам
3. Применять мемоизацию для оптимизации
4. Использовать TypeScript для типизации состояния
5. Обрабатывать ошибки на всех уровнях 