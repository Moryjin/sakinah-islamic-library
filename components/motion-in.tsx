import { View, type ViewProps } from "react-native";

/**
 * غلاف عرض آمن للجوال. تُعاد الحركة لاحقًا بعد التحقق من Android،
 * لكن لا تُمرر className إلى Animated.View لأن ذلك سبب محتمل لاختلاف native/web.
 */
export function MotionIn({ children, style, className, ...props }: ViewProps & { className?: string }) {
  return <View {...props} className={className} style={style}>{children}</View>;
}
