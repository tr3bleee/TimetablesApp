import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { MaterialSwitchListItem } from '@/components/MaterialSwitchListItem';
import { useColorScheme } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useThemeContext } from '@/app/contexts/ThemeContext';

export default function Settings() {
  const theme = useTheme();
  const { isDarkTheme, useSystemTheme, toggleTheme, toggleSystemTheme } = useThemeContext();
  const [showCabinetNumbers, setShowCabinetNumbers] = useState(true);
  const [showTeacherNames, setShowTeacherNames] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [showLessonNumbers, setShowLessonNumbers] = useState(true);

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
            selected={showCabinetNumbers}
            onPress={() => {
              setShowCabinetNumbers(!showCabinetNumbers);
              saveSettings('showCabinetNumbers', !showCabinetNumbers);
            }}
          />
          <MaterialSwitchListItem
            title="Показывать имена преподавателей"
            selected={showTeacherNames}
            onPress={() => {
              setShowTeacherNames(!showTeacherNames);
              saveSettings('showTeacherNames', !showTeacherNames);
            }}
          />
          <MaterialSwitchListItem
            title="Компактный режим"
            selected={compactMode}
            onPress={() => {
              setCompactMode(!compactMode);
              saveSettings('compactMode', !compactMode);
            }}
          />
          <MaterialSwitchListItem
            title="Показывать номера уроков"
            selected={showLessonNumbers}
            onPress={() => {
              setShowLessonNumbers(!showLessonNumbers);
              saveSettings('showLessonNumbers', !showLessonNumbers);
            }}
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