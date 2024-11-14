import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Text, View, StyleSheet, Linking, TouchableOpacity } from "react-native";
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function InfoScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'О приложении',
    });
  }, [navigation]);

  const openGithub = () => {
    Linking.openURL('https://github.com/y9tr3ble');
  };

  const openTelegram = () => {
    Linking.openURL('https://t.me/Tr3ble');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>О приложении</Text>
        <Text style={styles.version}>Версия 1.0.0</Text>
        
        <View style={styles.developerSection}>
          <Text style={styles.sectionTitle}>Разработчик</Text>
          <Text style={styles.developerName}>Новиков Никита</Text>
          <Text style={styles.description}>
            Студент Хекслет Колледж{'\n'}
            Группа 01-24.ИСИП.ОФ 9
          </Text>
        </View>

        <View style={styles.linksSection}>
          <TouchableOpacity style={styles.linkButton} onPress={openGithub}>
            <Ionicons name="logo-github" size={24} color="#007AFF" />
            <Text style={styles.linkText}>GitHub</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={openTelegram}>
            <Ionicons name="paper-plane" size={24} color="#007AFF" />
            <Text style={styles.linkText}>Telegram</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  version: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  developerSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  developerName: {
    fontSize: 18,
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    lineHeight: 22,
  },
  linksSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    gap: 8,
  },
  linkText: {
    fontSize: 16,
    color: '#007AFF',
  },
});