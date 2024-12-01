# 🎨 Стилизация

## Темы

### Светлая тема

```typescript
const lightTheme = {
  colors: {
    primary: '#7f61dd',
    background: '#ffffff',
    surface: '#ffffff',
    text: '#000000',
    onSurface: '#000000',
    onSurfaceVariant: '#666666',
    outline: '#e0e0e0',
    primaryContainer: '#f4f0ff',
    secondary: '#9e9e9e',
    error: '#b00020',
    errorContainer: '#fde7e9'
  }
};
```

### Темная тема

```typescript
const darkTheme = {
  colors: {
    primary: '#9f81fd',
    background: '#121212',
    surface: '#1e1e1e',
    text: '#ffffff',
    onSurface: '#ffffff',
    onSurfaceVariant: '#cccccc',
    outline: '#2c2c2c',
    primaryContainer: '#2c2c2c',
    secondary: '#757575',
    error: '#cf6679',
    errorContainer: '#340e0e'
  }
};
```

## Компоненты UI

### Карточки

```typescript
const cardStyles = StyleSheet.create({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
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
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.3,
  }
});
```

### Кнопки

```typescript
const buttonStyles = StyleSheet.create({
  primary: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.primary,
  },
  secondary: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.primaryContainer,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  }
});
```

### Поля ввода

```typescript
const inputStyles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  icon: {
    marginRight: 12,
  }
});
```

## Типографика

### Заголовки

```typescript
const typography = StyleSheet.create({
  h1: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  }
});
```

## Анимации

### Переходы

```typescript
const fadeIn = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
};

const slideIn = {
  from: {
    transform: [{ translateY: 20 }],
    opacity: 0,
  },
  to: {
    transform: [{ translateY: 0 }],
    opacity: 1,
  },
};
```

### Интерактивные элементы

```typescript
const pressableStyles = (pressed: boolean) => ({
  transform: [{ scale: pressed ? 0.98 : 1 }],
  opacity: pressed ? 0.9 : 1,
});
```

## Адаптивный дизайн

### Размеры экрана

```typescript
const { width, height } = Dimensions.get('window');

const metrics = {
  screenWidth: width,
  screenHeight: height,
  isSmallDevice: width < 375,
};
```

### Отступы

```typescript
const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const layout = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  column: {
    flexDirection: 'column',
    gap: spacing.md,
  }
});
```

## Использование тем

### Хук useTheme

```typescript
const Component = () => {
  const theme = useTheme();
  
  return (
    <View style={[
      styles.container,
      { backgroundColor: theme.colors.background }
    ]}>
      <Text style={[
        styles.text,
        { color: theme.colors.onSurface }
      ]}>
        Контент
      </Text>
    </View>
  );
};
```

### Переключение тем

```typescript
const { isDarkTheme, toggleTheme } = useThemeContext();

// Применение стилей в зависимости от темы
const dynamicStyles = {
  backgroundColor: isDarkTheme ? '#121212' : '#ffffff',
  color: isDarkTheme ? '#ffffff' : '#000000',
};
```

## Рекомендации по стилизации

### Лучшие практики

1. Использовать StyleSheet.create для оптимизации
2. Группировать стили по компонентам
3. Использовать константы для повторяющихся значений
4. Применять Platform.select для платформо-зависимых стилей

### Производительность

1. Избегать инлайн стилей
2. Мемоизировать динамические стили
3. Использовать StyleSheet.flatten при необходимости
4. Оптимизировать анимации

### Доступность

1. Использовать достаточный контраст
2. Обеспечивать читаемые размеры текста
3. Поддерживать масштабирование
4. Учитывать VoiceOver и TalkBack
