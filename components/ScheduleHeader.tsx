import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'react-native-paper';

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
}) => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  
  const styles = StyleSheet.create({
    header: {
      backgroundColor: theme.colors.surface,
      paddingTop: insets.top + 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outline,
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
      backgroundColor: theme.colors.primaryContainer,
      borderRadius: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.onSurface,
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
      backgroundColor: theme.colors.primaryContainer,
    },
    weekButtonActive: {
      backgroundColor: theme.colors.primary,
    },
    weekButtonText: {
      fontSize: 14,
      textAlign: 'center',
      color: theme.colors.onSurfaceVariant,
      fontWeight: '500',
    },
    weekButtonTextActive: {
      color: theme.colors.surface,
      fontWeight: '600',
    },
  });

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        {showBackButton && (
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={onBack}
          >
            <Ionicons name="chevron-back-outline" size={24} color="#7f61dd" />
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
}; 