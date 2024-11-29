import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialSwitch } from './MaterialSwitch';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

interface MaterialSwitchListItemProps {
  title: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  fluid?: boolean;
  switchOnIcon?: string;
  switchOffIcon?: string;
}

export const MaterialSwitchListItem: React.FC<MaterialSwitchListItemProps> = ({
  title,
  selected,
  onPress,
  disabled,
  fluid,
  switchOnIcon,
  switchOffIcon,
}) => {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[styles.container]}
      disabled={disabled}
    >
      <View style={styles.content}>
        {switchOnIcon && (
          <Ionicons 
            name={switchOnIcon as any} 
            size={20} 
            color={disabled ? theme.colors.secondary : theme.colors.primary} 
            style={styles.icon}
          />
        )}
        <Text style={[
          styles.title, 
          { 
            color: disabled ? theme.colors.secondary : theme.colors.text,
            opacity: disabled ? 0.5 : 1,
          }
        ]}>
          {title}
        </Text>
      </View>
      <MaterialSwitch
        selected={selected}
        onPress={onPress}
        disabled={disabled}
        fluid={fluid}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    flex: 1,
  },
});