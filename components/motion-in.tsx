import { useEffect, useRef } from "react";
import { Animated, type ViewProps } from "react-native";

export function MotionIn({ children, style, ...props }: ViewProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(8)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 240, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY]);
  return <Animated.View {...props} style={[style, { opacity, transform: [{ translateY }] }]}>{children}</Animated.View>;
}
