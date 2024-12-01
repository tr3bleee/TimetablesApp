# ⚡ Оптимизация производительности

## Общие принципы

### Метрики производительности
- Время до интерактивности (TTI)
- Время первой отрисовки (FP)
- Время блокировки основного потока
- Частота кадров (FPS)
- Потребление памяти

## Оптимизация рендеринга

### Мемоизация компонентов
```typescript
// Мемоизация компонента GroupList
const MemoizedGroupList = React.memo(GroupList, (prevProps, nextProps) => {
  return prevProps.groups === nextProps.groups;
});

// Мемоизация хуков
const filteredGroups = useMemo(() => {
  return groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [groups, searchQuery]);
```

### Виртуализация списков
```typescript
// Оптимизация длинных списков
const VirtualizedGroupList: React.FC<GroupListProps> = ({ groups }) => {
  return (
    <VirtualizedList
      data={groups}
      renderItem={({ item }) => <GroupItem group={item} />}
      getItemCount={(data) => data.length}
      getItem={(data, index) => data[index]}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={5}
      updateCellsBatchingPeriod={50}
    />
  );
};
```

### Ленивая загрузка
```typescript
// Ленивая загрузка компонентов
const LazyScheduleView = React.lazy(() => import('./ScheduleView'));

// Использование
<Suspense fallback={<LoadingSpinner />}>
  <LazyScheduleView />
</Suspense>
```

## Оптимизация изображений

### Кэширование изображений
```typescript
// Использование expo-image
import { Image } from 'expo-image';

const CachedImage: React.FC<ImageProps> = ({ uri, ...props }) => {
  return (
    <Image
      source={uri}
      cachePolicy="memory-disk"
      transition={200}
      {...props}
    />
  );
};
```

### Предзагрузка ресурсов
```typescript
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';

const cacheResources = async () => {
  const imageAssets = Assets.map((asset) => {
    return Asset.fromModule(asset).downloadAsync();
  });

  const fontAssets = Font.loadAsync({
    'custom-font': require('./assets/fonts/custom-font.ttf'),
  });

  await Promise.all([...imageAssets, fontAssets]);
};
```

## Оптимизация состояния

### Управление обновлениями
```typescript
// Предотвращение лишних обновлений
const GroupItem: React.FC<GroupItemProps> = React.memo(({ group }) => {
  const { isFavorite } = useFavoritesContext();
  
  const favoriteStatus = useMemo(() => 
    isFavorite(group.id, 'group'),
    [group.id, isFavorite]
  );

  return (
    <View>
      <Text>{group.name}</Text>
      <FavoriteIcon active={favoriteStatus} />
    </View>
  );
});
```

### Батчинг обновлений
```typescript
// Группировка обновлений состояния
const handleMultipleUpdates = () => {
  batch(() => {
    setLoading(false);
    setData(newData);
    setError(null);
  });
};
```

## Оптимизация сети

### Кэширование запросов
```typescript
// Кэширование ответов API
const scheduleCache = new Map<string, {
  data: ScheduleData;
  timestamp: number;
}>();

const getScheduleWithCache = async (groupId: number) => {
  const cacheKey = `schedule_${groupId}`;
  const cached = scheduleCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  
  const data = await fetchSchedule(groupId);
  scheduleCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  return data;
};
```

### Предзагрузка данных
```typescript
// Предварительная загрузка данных
const prefetchSchedule = async (groupId: number) => {
  try {
    const data = await fetchSchedule(groupId);
    scheduleCache.set(`schedule_${groupId}`, {
      data,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error('Prefetch error:', error);
  }
};
```

## Профилирование

### React Native Profiler
```typescript
// Использование Profiler
<Profiler id="GroupList" onRender={(id, phase, actualDuration) => {
  console.log(`Component ${id} took ${actualDuration}ms to ${phase}`);
}}>
  <GroupList />
</Profiler>
```

### Метрики производительности
```typescript
import { PerformanceObserver, performance } from 'react-native-performance';

// Отслеживание производительности
const observer = new PerformanceObserver((list) => {
  const entries = list.getEntries();
  entries.forEach((entry) => {
    console.log(`${entry.name}: ${entry.duration}ms`);
  });
});

observer.observe({ entryTypes: ['measure'] });

// Измерение времени операции
performance.mark('startOperation');
// ... выполнение операции
performance.mark('endOperation');
performance.measure('operationDuration', 'startOperation', 'endOperation');
```

## Оптимизация памяти

### Очистка ресурсов
```typescript
// Правильная очистка в useEffect
useEffect(() => {
  const subscription = eventEmitter.addListener('event', handler);
  
  return () => {
    subscription.remove();
  };
}, []);
```

### Управление размером списков
```typescript
// Пагинация для длинных списков
const PaginatedList: React.FC = () => {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Item[]>([]);
  
  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);
  
  return (
    <FlatList
      data={data}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
    />
  );
};
```

## Рекомендации

### Лучшие практики
1. Использовать мемоизацию для тяжелых вычислений
2. Применять виртуализацию для длинных списков
3. Кэшировать сетевые запросы
4. Оптимизировать изображения
5. Следить за утечками памяти

### Инструменты разработчика
1. React Native Debugger
2. Chrome Performance Tools
3. Expo Performance Monitor
4. React Profiler
5. Memory Profiler

### Метрики для отслеживания
1. Время запуска приложения
2. FPS в критичных компонентах
3. Потребление памяти
4. Время ответа сети
5. Размер бандла 