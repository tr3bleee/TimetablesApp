import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { useTheme } from 'react-native-paper';

const { width } = Dimensions.get('window');

export default function SecretScreen() {
  const theme = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Stack.Screen 
        options={{
          title: "🐱 пасхалко 🐱",
          headerTintColor: theme.colors.primary,
          headerTitleStyle: {
            color: theme.colors.onSurface,
          },
          headerStyle: {
            backgroundColor: theme.colors.surface,
          },
        }}
      />
      <Image 
        source={{ uri: 'https://http.cat/402' }}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width,
    height: width,
    borderRadius: 20,
  },
}); 