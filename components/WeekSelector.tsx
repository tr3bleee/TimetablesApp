import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

interface WeekSelectorProps {
  isNextWeek: boolean;
  onWeekChange: (isNext: boolean) => void;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({ isNextWeek, onWeekChange }) => {
  const theme = useTheme();
  const [pressedButton, setPressedButton] = React.useState<'current' | 'next' | null>(null);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = (button: 'current' | 'next') => {
    setPressedButton(button);
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setPressedButton(null);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getStartDate = () => {
    const now = new Date();
    if (isNextWeek) {
      now.setDate(now.getDate() + 7);
    }
    const day = now.getDay() || 7;
    now.setDate(now.getDate() - day + 1);
    return now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
  };

  return (
    <View style={[styles.container, { 
      backgroundColor: theme.colors.surface,
      borderBottomColor: theme.colors.outline 
    }]}>
      <View style={styles.weekSelector}>
        <TouchableOpacity 
          style={[
            styles.weekButton, 
            { backgroundColor: !isNextWeek ? theme.colors.primary : theme.colors.primaryContainer },
            pressedButton === 'current' && styles.weekButtonPressed
          ]}
          onPress={() => onWeekChange(false)}
          onPressIn={() => handlePressIn('current')}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={styles.buttonContent}>
              <Ionicons 
                name="today" 
                size={20} 
                color={!isNextWeek ? theme.colors.surface : theme.colors.secondary} 
              />
              <Text style={[
                styles.weekButtonText, 
                { color: !isNextWeek ? theme.colors.surface : theme.colors.onSurfaceVariant }
              ]}>
                Текущая неделя
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.weekButton, 
            { backgroundColor: isNextWeek ? theme.colors.primary : theme.colors.primaryContainer },
            pressedButton === 'next' && styles.weekButtonPressed
          ]}
          onPress={() => onWeekChange(true)}
          onPressIn={() => handlePressIn('next')}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <View style={styles.buttonContent}>
              <Ionicons 
                name="calendar" 
                size={20} 
                color={isNextWeek ? theme.colors.surface : theme.colors.secondary} 
              />
              <Text style={[
                styles.weekButtonText, 
                { color: isNextWeek ? theme.colors.surface : theme.colors.onSurfaceVariant }
              ]}>
                Следующая неделя
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
      <Text style={[styles.dateInfo, { color: theme.colors.onSurfaceVariant }]}>
        Начало недели: {getStartDate()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  weekSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  weekButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  weekButtonPressed: {
    opacity: 0.9,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  weekButtonText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
  dateInfo: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
}); 