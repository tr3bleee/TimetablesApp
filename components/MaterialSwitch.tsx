import React from 'react';
import { Animated, Pressable, StyleSheet, View, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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

  if (Platform.OS === 'ios') {
    return (
      <Switch
        value={selected}
        onValueChange={onPress}
        disabled={disabled}
        trackColor={{ false: '#e2e8f0', true: '#7f61dd' }}
      />
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.switch,
        {
          backgroundColor: selected ? '#7f61dd' : '#e2e8f0',
          opacity: disabled ? 0.5 : 1,
        },
      ]}>
      <Animated.View
        style={[
          styles.thumb,
          {
            transform: [{ translateX }],
          },
        ]}>
        {selected ? renderIcon(switchOnIcon) : renderIcon(switchOffIcon)}
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 52,
    height: 32,
    borderRadius: 16,
    padding: 6,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});