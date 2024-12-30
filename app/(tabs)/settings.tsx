import { useScheduleSettings } from '@/app/contexts/ScheduleSettingsContext';
import { useThemeContext } from '@/app/contexts/ThemeContext';
import { MaterialSwitchListItem } from '@/components/MaterialSwitchListItem';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function Settings() {
  const theme = useTheme();
  const { isDarkTheme, useSystemTheme, toggleTheme, toggleSystemTheme } = useThemeContext();
  const { settings, updateSettings } = useScheduleSettings();

  return (
    <>
      <ExpoStatusBar style={isDarkTheme ? 'light' : 'dark'} />
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="color-palette" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Внешний вид
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <MaterialSwitchListItem
              title="Использовать системную тему"
              selected={useSystemTheme}
              onPress={toggleSystemTheme}
              switchOnIcon="phone-portrait"
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
            <MaterialSwitchListItem
              title="Тёмная тема"
              selected={isDarkTheme}
              onPress={toggleTheme}
              disabled={useSystemTheme}
              switchOnIcon="moon"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="snow" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Эффекты
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <MaterialSwitchListItem
              title="Снег"
              selected={settings.showSnow}
              onPress={() => updateSettings('showSnow', !settings.showSnow)}
              switchOnIcon="snow"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="calendar" size={20} color={theme.colors.primary} />
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Расписание
            </Text>
          </View>
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <MaterialSwitchListItem
              title="Показывать номера кабинетов"
              selected={settings.showCabinetNumbers}
              onPress={() => updateSettings('showCabinetNumbers', !settings.showCabinetNumbers)}
              switchOnIcon="location"
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
            <MaterialSwitchListItem
              title="Показывать имена преподавателей"
              selected={settings.showTeacherNames}
              onPress={() => updateSettings('showTeacherNames', !settings.showTeacherNames)}
              switchOnIcon="people"
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
            <MaterialSwitchListItem
              title="Компактный режим"
              selected={settings.compactMode}
              onPress={() => updateSettings('compactMode', !settings.compactMode)}
              switchOnIcon="contract"
            />
            <View style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
            <MaterialSwitchListItem
              title="Показывать номера уроков"
              selected={settings.showLessonNumbers}
              onPress={() => updateSettings('showLessonNumbers', !settings.showLessonNumbers)}
              switchOnIcon="list"
            />
          </View>
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
    paddingHorizontal: 16,
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
});