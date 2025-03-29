import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ScheduleSettings {
  showCabinetNumbers: boolean;
  showTeacherNames: boolean;
  compactMode: boolean;
  showLessonNumbers: boolean;
  showSnow: boolean;
}

export interface ScheduleSettingsContextType {
  settings: ScheduleSettings;
  updateSettings: (key: keyof ScheduleSettings, value: boolean) => Promise<void>;
}

const ScheduleSettingsContext = createContext<ScheduleSettingsContextType | undefined>(undefined);

export const ScheduleSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ScheduleSettings>({
    showCabinetNumbers: true,
    showTeacherNames: true,
    compactMode: false,
    showLessonNumbers: true,
    showSnow: false,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('scheduleSettings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(prevSettings => ({
          ...prevSettings,
          ...parsedSettings,
        }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSettings = async (key: keyof ScheduleSettings, value: boolean) => {
    try {
      const newSettings = { ...settings, [key]: value };
      await AsyncStorage.setItem('scheduleSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <ScheduleSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </ScheduleSettingsContext.Provider>
  );
};

export const useScheduleSettings = () => {
  const context = useContext(ScheduleSettingsContext);
  if (context === undefined) {
    throw new Error('useScheduleSettings must be used within a ScheduleSettingsProvider');
  }
  return context;
};