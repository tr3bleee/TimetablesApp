import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ScheduleHeaderProps {
  title: string;
  onBack?: () => void;
  isNextWeek: boolean;
  onWeekChange: (isNext: boolean) => void;
  showBackButton?: boolean;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  title,
  onBack,
  isNextWeek,
  onWeekChange,
  showBackButton = true
}) => (
  <View style={styles.header}>
    <View style={styles.headerTop}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={20} color="#7f61dd" />
        </TouchableOpacity>
      )}
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>
    </View>
    <View style={styles.weekSelector}>
      <TouchableOpacity 
        style={[styles.weekButton, !isNextWeek && styles.weekButtonActive]}
        onPress={() => onWeekChange(false)}
      >
        <Text style={[styles.weekButtonText, !isNextWeek && styles.weekButtonTextActive]}>
          Текущая неделя
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.weekButton, isNextWeek && styles.weekButtonActive]}
        onPress={() => onWeekChange(true)}
      >
        <Text style={[styles.weekButtonText, isNextWeek && styles.weekButtonTextActive]}>
          Следующая неделя
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    backgroundColor: '#f3f0ff',
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    letterSpacing: -0.5,
  },
  weekSelector: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  weekButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  weekButtonActive: {
    backgroundColor: '#7f61dd',
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
}); 