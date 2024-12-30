import React from 'react';
import { Animated, Dimensions } from 'react-native';
import { useScheduleSettings } from '@/app/contexts/ScheduleSettingsContext';

const { width, height } = Dimensions.get('window');

const Snowflake = () => {
  const startPositionX = Math.random() * width;
  const animatedValue = new Animated.Value(-10);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: height + 10,
          duration: 5000 + Math.random() * 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.Text
      style={{
        position: 'absolute',
        left: startPositionX,
        transform: [{ translateY: animatedValue }],
        color: 'white',
        fontSize: 10,
      }}>
      ❄
    </Animated.Text>
  );
};

export const Snow = () => {
  const { settings } = useScheduleSettings();

  if (!settings.showSnow) return null;

  return (
    <>
      {[...Array(50)].map((_, index) => (
        <Snowflake key={index} />
      ))}
    </>
  );
};