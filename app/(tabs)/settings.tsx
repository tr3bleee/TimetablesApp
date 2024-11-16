import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

export default function Settings() {
  const [showCabinetNumbers, setShowCabinetNumbers] = useState(true);
  const [showTeacherNames, setShowTeacherNames] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [showLessonNumbers, setShowLessonNumbers] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setShowCabinetNumbers(parsedSettings.showCabinetNumbers ?? true);
        setShowTeacherNames(parsedSettings.showTeacherNames ?? true);
        setCompactMode(parsedSettings.compactMode ?? false);
        setShowLessonNumbers(parsedSettings.showLessonNumbers ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (key: string, value: boolean) => {
    try {
      const currentSettings = await AsyncStorage.getItem('appSettings');
      const settings = currentSettings ? JSON.parse(currentSettings) : {};
      settings[key] = value;
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Расписание</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Показывать номера кабинетов</Text>
          <Switch
            value={showCabinetNumbers}
            onValueChange={(value) => {
              setShowCabinetNumbers(value);
              saveSettings('showCabinetNumbers', value);
            }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Показывать имена преподавателей</Text>
          <Switch
            value={showTeacherNames}
            onValueChange={(value) => {
              setShowTeacherNames(value);
              saveSettings('showTeacherNames', value);
            }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Компактный режим</Text>
          <Switch
            value={compactMode}
            onValueChange={(value) => {
              setCompactMode(value);
              saveSettings('compactMode', value);
            }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Показывать номера уроков</Text>
          <Switch
            value={showLessonNumbers}
            onValueChange={(value) => {
              setShowLessonNumbers(value);
              saveSettings('showLessonNumbers', value);
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  section: {
    backgroundColor: '#ffffff',
    marginVertical: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1e293b',
    flex: 1,
    marginRight: 16,
  },
});