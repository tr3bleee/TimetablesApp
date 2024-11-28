import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WeekSelectorProps {
  isNextWeek: boolean;
  onWeekChange: (isNext: boolean) => void;
}

export const WeekSelector: React.FC<WeekSelectorProps> = ({ isNextWeek, onWeekChange }) => {
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
    <View style={styles.container}>
      <View style={styles.weekSelector}>
        <TouchableOpacity 
          style={[
            styles.weekButton, 
            !isNextWeek && styles.weekButtonActive,
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
                name="today-outline" 
                size={20} 
                color={!isNextWeek ? '#ffffff' : '#64748b'} 
              />
              <Text style={[
                styles.weekButtonText, 
                !isNextWeek && styles.weekButtonTextActive
              ]}>
                Текущая неделя
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.weekButton, 
            isNextWeek && styles.weekButtonActive,
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
                name="calendar-outline" 
                size={20} 
                color={isNextWeek ? '#ffffff' : '#64748b'} 
              />
              <Text style={[
                styles.weekButtonText, 
                isNextWeek && styles.weekButtonTextActive
              ]}>
                Следующая неделя
              </Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
      <Text style={styles.dateInfo}>
        Начало недели: {getStartDate()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
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
    backgroundColor: '#f1f5f9',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  weekButtonActive: {
    backgroundColor: '#7f61dd',
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
    color: '#64748b',
    fontWeight: '500',
  },
  weekButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  dateInfo: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '500',
  },
}); 