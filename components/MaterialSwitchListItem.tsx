import React from 'react';
import { Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { MaterialSwitch } from './MaterialSwitch';
import { useTheme } from 'react-native-paper';

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
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: theme.colors.surface },
        listStyle
      ]}
      disabled={disabled}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
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
  },
  title: {
    fontSize: 16,
    flex: 1,
    marginRight: 16,
  },
});