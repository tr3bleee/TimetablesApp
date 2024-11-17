import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View, Switch } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { Icon, useTheme } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type SwitchProps = {
  selected: boolean;
  onPress: () => void;
  fluid?: boolean;
  switchOnIcon?: IconSource;
  switchOffIcon?: IconSource;
  disabled?: boolean;
};

export const MaterialSwitch = ({
  selected,
  onPress,
  switchOnIcon,
  switchOffIcon,
  disabled,
}: SwitchProps) => {
  const theme = useTheme();

  // iOS native switch
  if (Platform.OS === 'ios') {
    return (
      <Switch
        value={selected}
        onValueChange={onPress}
        disabled={disabled}
        trackColor={{
          true: theme.colors.primary,
          false: theme.colors.surfaceVariant,
        }}
        ios_backgroundColor={theme.colors.surfaceVariant}
      />
    );
  }

  const position = useSharedValue(selected ? 10 : -10);
  const handleHeight = useSharedValue(selected ? 24 : 16);
  const handleWidth = useSharedValue(selected ? 24 : 16);
  const [active, setActive] = useState(selected);
  const [isPressed, setIsPressed] = useState(false);

  const iconOnStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    opacity: interpolate(
      position.value,
      [-10, 10],
      [0, 1],
      Extrapolate.CLAMP
    ),
  }));

  const iconOffStyle = useAnimatedStyle(() => ({
    position: 'absolute',
    opacity: interpolate(
      position.value,
      [-10, 10],
      [1, 0],
      Extrapolate.CLAMP
    ),
  }));

  const pan = Gesture.Pan()
    .activateAfterLongPress(100)
    .onTouchesUp(() => setIsPressed(false))
    .runOnJS(true)
    .hitSlop(disabled ? -30 : 0)
    .onStart(() => {
      setIsPressed(true);
      handleHeight.value = withTiming(28, { duration: 160 });
      handleWidth.value = withTiming(28, { duration: 160 });
    })
    .onChange((event) => {
      if (position.value + event.translationX / 10 < -10) {
        position.value = -10;
        return;
      }
      if (position.value + event.translationX / 10 > 10) {
        position.value = 10;
        return;
      }
      position.value += event.translationX / 10;
    })
    .onEnd(() => {
      setIsPressed(false);
      if (position.value > 0) {
        position.value = withTiming(10);
        handleHeight.value = withTiming(24, { duration: 160 });
        handleWidth.value = withTiming(24, { duration: 160 }, (finished) => {
          'worklet';
          if (finished && !active) {
            runOnJS(callbackFunction)();
          }
        });
        return;
      }

      if (position.value < 0) {
        position.value = withTiming(-10);
        handleHeight.value = withTiming(16, { duration: 160 });
        handleWidth.value = withTiming(16, { duration: 160 }, (finished) => {
          'worklet';
          if (finished && active) {
            runOnJS(callbackFunction)();
          }
        });
        return;
      }
    });

  const handleStyle = useAnimatedStyle(() =>
    disabled
      ? {
          transform: [{ translateX: active ? 10 : -10 }],
          height: active ? 24 : 16,
          width: active ? 24 : 16,
          marginVertical: 'auto',
          minHeight: switchOffIcon ? 24 : 16,
          minWidth: switchOffIcon ? 24 : 16,
          opacity: active ? 1 : 0.36,
          backgroundColor: active
            ? theme.colors.surface
            : theme.colors.onSurface,
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }
      : {
          transform: [{ translateX: position.value }],
          opacity: 1,
          height: handleHeight.value,
          width: handleWidth.value,
          marginVertical: 'auto',
          minHeight: switchOffIcon ? 24 : 16,
          minWidth: switchOffIcon ? 24 : 16,
          backgroundColor: interpolateColor(
            position.value,
            [-10, 10],
            [theme.colors.outline, theme.colors.onPrimary]
          ),
          borderRadius: 20,
          justifyContent: 'center',
          alignItems: 'center',
        }
  );

  const trackStyle = useAnimatedStyle(() =>
    disabled
      ? {
          borderWidth: 2,
          borderRadius: 16,
          justifyContent: 'center',
          height: 32,
          width: 52,
          opacity: 0.12,
          backgroundColor: active
            ? theme.colors.onSurface
            : theme.colors.surfaceVariant,
          borderColor: theme.colors.onSurface,
        }
      : {
          alignItems: 'center',
          opacity: 1,
          backgroundColor: interpolateColor(
            position.value,
            [-10, 10],
            [theme.colors.surfaceVariant, theme.colors.primary]
          ),
          borderColor: interpolateColor(
            position.value,
            [-10, 10],
            [theme.colors.outline, theme.colors.primary]
          ),
          borderWidth: 2,
          borderRadius: 16,
          justifyContent: 'center',
          height: 32,
          width: 52,
        }
  );

  const handleOutlineStyle = useAnimatedStyle(() => ({
    height: 40,
    width: 40,
    borderRadius: 20,
    position: 'absolute',
    transform: [{ translateX: position.value }],
    backgroundColor: !isPressed
      ? 'transparent'
      : interpolateColor(
          position.value,
          [-10, 10],
          [theme.colors.onSurface, theme.colors.primary]
        ),
    alignItems: 'center',
    opacity: 0.18,
    justifyContent: 'center',
  }));

  const callbackFunction = () => {
    onPress();
    setIsPressed(false);
  };

  const changeSwitch = (withCallback: boolean) => {
    if (active) {
      handleHeight.value = withTiming(16, { duration: 100 });
      handleWidth.value = withTiming(16, { duration: 100 });
      position.value = withTiming(
        -10,
        { duration: 250 },
        withCallback
          ? (finished) => {
              'worklet';
              if (finished) {
                runOnJS(callbackFunction)();
              }
            }
          : undefined
      );
      setActive(false);
    } else {
      handleHeight.value = withTiming(24, { duration: 100 });
      handleWidth.value = withTiming(24, { duration: 100 });
      position.value = withTiming(
        10,
        { duration: 250 },
        withCallback
          ? (finished) => {
              'worklet';
              if (finished) {
                runOnJS(callbackFunction)();
              }
            }
          : undefined
      );
      setActive(true);
    }
  };

  useEffect(() => {
    if (active !== selected) {
      changeSwitch(false);
    }
    handleHeight.value = withTiming(selected ? 24 : 16);
    handleWidth.value = withTiming(selected ? 24 : 16);
  }, [selected]);

  return (
    <View style={{ borderRadius: 20, backgroundColor: theme.colors.surface }}>
      <View style={styles.stateOuter}>
        <Animated.View style={handleOutlineStyle} key={3} />
      </View>
      <GestureHandlerRootView>
        <GestureDetector gesture={pan}>
          <Animated.View style={trackStyle} key={1}>
            <View
              style={{
                justifyContent: 'center',
                height: 32,
                width: 52,
                alignItems: 'center',
              }}
            />
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
      <View style={styles.stateOuter} pointerEvents="none">
        <Animated.View style={handleStyle} key={2}>
          {switchOnIcon ? (
            <Animated.View style={iconOnStyle}>
              <Icon
                source={switchOnIcon}
                size={16}
                color={
                  disabled
                    ? theme.colors.onSurface
                    : theme.colors.onPrimaryContainer
                }
              />
            </Animated.View>
          ) : null}
          {switchOffIcon ? (
            <Animated.View style={iconOffStyle}>
              <Icon
                source={switchOffIcon}
                size={16}
                color={theme.colors.surface}
              />
            </Animated.View>
          ) : null}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stateOuter: {
    justifyContent: 'center',
    height: 32,
    width: 52,
    alignItems: 'center',
    position: 'absolute',
  },
});
