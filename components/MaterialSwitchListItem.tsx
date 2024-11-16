import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { MaterialSwitch } from './MaterialSwitch';

interface MaterialSwitchListItemProps {
  title: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  fluid?: boolean;
  switchOnIcon?: string | (() => React.ReactNode);
  switchOffIcon?: string | (() => React.ReactNode);
  listStyle?: ViewStyle;
}

export const MaterialSwitchListItem: React.FC<MaterialSwitchListItemProps> = ({
  title,
  selected,
  onPress,
  disabled,
  fluid,
  switchOnIcon,
  switchOffIcon,
  listStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, listStyle]}
      disabled={disabled}>
      <Text style={styles.title}>{title}</Text>
      <MaterialSwitch
        selected={selected}
        onPress={onPress}
        disabled={disabled}
        fluid={fluid}
        switchOnIcon={switchOnIcon}
        switchOffIcon={switchOffIcon}
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    color: '#334155',
    flex: 1,
    marginRight: 16,
  },
});