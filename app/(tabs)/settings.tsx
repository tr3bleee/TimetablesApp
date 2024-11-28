import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { MaterialSwitchListItem } from '@/components/MaterialSwitchListItem';
import { useColorScheme } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useThemeContext } from '@/app/contexts/ThemeContext';
import { useScheduleSettings } from '@/app/contexts/ScheduleSettingsContext';

export default function Settings() {
  const theme = useTheme();
  const { isDarkTheme, useSystemTheme, toggleTheme, toggleSystemTheme } = useThemeContext();
  const { settings, updateSettings } = useScheduleSettings();

  return (
    <>
      <ExpoStatusBar style={isDarkTheme ? 'light' : 'dark'} />
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>
            Внешний вид
          </Text>
          <MaterialSwitchListItem
            title="Использовать системную тему"
            selected={useSystemTheme}
            onPress={toggleSystemTheme}
          />
          <MaterialSwitchListItem
            title="Тёмная тема"
            selected={isDarkTheme}
            onPress={toggleTheme}
            disabled={useSystemTheme}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.secondaryText }]}>
            Расписание
          </Text>
          <MaterialSwitchListItem
            title="Показывать номера кабинетов"
            selected={settings.showCabinetNumbers}
            onPress={() => updateSettings('showCabinetNumbers', !settings.showCabinetNumbers)}
          />
          <MaterialSwitchListItem
            title="Показывать имена преподавателей"
            selected={settings.showTeacherNames}
            onPress={() => updateSettings('showTeacherNames', !settings.showTeacherNames)}
          />
          <MaterialSwitchListItem
            title="Компактный режим"
            selected={settings.compactMode}
            onPress={() => updateSettings('compactMode', !settings.compactMode)}
          />
          <MaterialSwitchListItem
            title="Показывать номера уроков"
            selected={settings.showLessonNumbers}
            onPress={() => updateSettings('showLessonNumbers', !settings.showLessonNumbers)}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
});