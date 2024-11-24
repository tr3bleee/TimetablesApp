import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { MaterialSwitchListItem } from '@/components/MaterialSwitchListItem';

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
    <>
      <ExpoStatusBar style="dark" />
      <ScrollView style={styles.container}>
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Расписание</Text>
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
    backgroundColor: '#f8fafc',
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8,
			paddingHorizontal: 16,
		},
	});