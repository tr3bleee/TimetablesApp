import { useScheduleSettings } from '@/app/contexts/ScheduleSettingsContext';
import React from 'react';
import { Animated, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const Snowflake = () => {
  const startPositionX = React.useMemo(() => Math.random() * width, []);
  const animatedValue = React.useRef(new Animated.Value(-10)).current;

  React.useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: height + 10,
          duration: 5000 + Math.random() * 3000,
          useNativeDriver: true,
        }),
      ])
    );
    
    animation.start();

    return () => {
      animation.stop();
      animatedValue.setValue(-10);
    };
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
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!settings.showSnow || !mounted) return null;

  return (
    <>
      {[...Array(50)].map((_, index) => (
        <Snowflake key={index} />
      ))}
    </>
  );
};