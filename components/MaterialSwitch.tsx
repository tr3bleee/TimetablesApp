import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

interface MaterialSwitchProps {
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  fluid?: boolean;
  switchOnIcon?: string | (() => React.ReactNode);
  switchOffIcon?: string | (() => React.ReactNode);
}

export const MaterialSwitch: React.FC<MaterialSwitchProps> = ({
  selected,
  onPress,
  disabled = false,
  fluid = false,
  switchOnIcon,
  switchOffIcon,
}) => {
  const theme = useTheme();
  const translateX = React.useRef(new Animated.Value(selected ? 20 : 0)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: selected ? 20 : 0,
      useNativeDriver: true,
      bounciness: fluid ? 20 : 0,
    }).start();
  }, [selected, fluid]);

  const renderIcon = (icon: string | (() => React.ReactNode) | undefined) => {
    if (!icon) return null;
    if (typeof icon === 'function') return icon();
    return <Ionicons name={icon as any} size={14} color="#fff" />;
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={`Switch ${selected ? 'on' : 'off'}`}
      style={[
        styles.switch,
        selected ? { backgroundColor: theme.colors.primary } : { backgroundColor: theme.colors.border },
        disabled && styles.disabled,
      ]}>
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX }],
            backgroundColor: theme.colors.surface,
          },
        ]}>
        {selected ? (
          <Ionicons 
            name="checkmark-outline" 
            size={14} 
            color={theme.colors.surface} 
          />
        ) : (
          <Ionicons 
            name="close-outline" 
            size={14} 
            color={theme.colors.onSurfaceVariant} 
          />
        )}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  disabled: {
    opacity: 0.5,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
