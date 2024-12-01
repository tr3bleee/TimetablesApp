# 🧩 Компоненты

## Основные компоненты

### GroupList
Компонент для отображения списка групп с поиском и фильтрацией.

```typescript
interface GroupListProps {
  groups: GroupInfo[];
  onSelectGroup: (group: GroupInfo) => void;
}
```

#### Особенности:
- Поиск по названию группы
- Сортировка по категориям
- Добавление в избранное
- Анимированные карточки
- Оптимизированная производительность

### TeacherList
Компонент для отображения списка преподавателей.

```typescript
interface TeacherListProps {
  teachers: TeacherInfo[];
  onSelectTeacher: (teacher: TeacherInfo) => void;
}
```

#### Функционал:
- Поиск по ФИО и должности
- Алфавитная сортировка
- Управление избранным
- Анимации при взаимодействии
- Оптимизированный рендеринг

### ScheduleView
Основной компонент для отображения расписания.

```typescript
interface ScheduleViewProps {
  data: GroupData | TeacherSchedule | null;
  loading: boolean;
  error: string | null;
  isNextWeek: boolean;
  isTeacherSchedule?: boolean;
  onRefresh?: () => void;
}
```

#### Возможности:
- Группировка по дням недели
- Pull-to-refresh обновление
- Индикация текущего занятия
- Анимированные переходы между состояниями
- Обработка ошибок и состояния загрузки

### LessonCard
Компонент карточки отдельного занятия.

```typescript
interface LessonCardProps {
  lesson: Lesson;
  isTeacherSchedule?: boolean;
  isNextWeek?: boolean;
}
```

#### Функционал:
- Отображение информации о занятии
  - Название предмета
  - Время проведения
  - Преподаватель
  - Аудитория
- Поддержка подгрупп
- Интерактивные элементы
- Индикация текущего занятия
- Адаптивный дизайн

### WeekSelector
Компонент выбора недели расписания.

```typescript
interface WeekSelectorProps {
  isNextWeek: boolean;
  onWeekChange: (isNext: boolean) => void;
  loading?: boolean;
}
```

#### Особенности:
- Переключение между неделями
- Анимированные переходы
- Индикация загрузки
- Отображение дат недели

## Вспомогательные компоненты

### MaterialSwitch
Кастомный компонент переключателя.

```typescript
interface MaterialSwitchProps {
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  fluid?: boolean;
  switchOnIcon?: string;
  switchOffIcon?: string;
}
```

#### Функционал:
- Анимированное переключение
- Поддержка иконок
- Поддержка отключенного состояния
- Настраиваемые стили

### MaterialSwitchListItem
Элемент списка с переключателем.

```typescript
interface MaterialSwitchListItemProps {
  title: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  fluid?: boolean;
  switchOnIcon?: string;
  switchOffIcon?: string;
}
```

#### Особенности:
- Интеграция с MaterialSwitch
- Настраиваемый заголовок
- Поддержка иконок
- Адаптивный дизайн

## Оптимизация производительности

### Мемоизация
```typescript
// Пример использования React.memo
const MemoizedComponent = React.memo(Component, (prevProps, nextProps) => {
  // Логика сравнения props
});

// Пример использования useMemo
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

### Виртуализация списков
```typescript
// Пример использования VirtualizedList
<VirtualizedList
  data={items}
  renderItem={renderItem}
  getItemCount={getItemCount}
  getItem={getItem}
  initialNumToRender={10}
  maxToRenderPerBatch={10}
  windowSize={5}
/>
```

### Ленивая загрузка
```typescript
// Пример ленивой загрузки компонента
const LazyComponent = React.lazy(() => import('./Component'));

// Использование
<Suspense fallback={<LoadingSpinner />}>
  <LazyComponent />
</Suspense>
```

## Стилизация компонентов

### Использование тем
```typescript
const Component = () => {
  const theme = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Контент компонента */}
    </View>
  );
};
```

### Адаптивные стили
```typescript
const styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```