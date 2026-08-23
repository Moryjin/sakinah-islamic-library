import { Platform, StatusBar, View, type ViewProps } from "react-native";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";
import { rtlRoot } from "@/lib/rtl";

export interface ScreenContainerProps extends ViewProps {
  /**
   * SafeArea edges to apply. Defaults to ["top", "left", "right"].
   * Bottom is typically handled by Tab Bar.
   */
  edges?: Edge[];
  /**
   * Tailwind className for the content area.
   */
  className?: string;
  /**
   * Additional className for the outer container (background layer).
   */
  containerClassName?: string;
  /**
   * Additional className for the SafeAreaView (content layer).
   */
  safeAreaClassName?: string;
}

/**
 * A container component that properly handles SafeArea and background colors.
 *
 * The outer View extends to full screen (including status bar area) with the background color,
 * while the inner SafeAreaView ensures content is within safe bounds.
 *
 * Usage:
 * ```tsx
 * <ScreenContainer className="p-4">
 *   <Text className="text-2xl font-bold text-foreground">
 *     Welcome
 *   </Text>
 * </ScreenContainer>
 * ```
 */
export function ScreenContainer({
  children,
  edges = ["top", "left", "right"],
  className,
  containerClassName,
  safeAreaClassName,
  style,
  ...props
}: ScreenContainerProps) {
  // Android لا يحتاج طبقة SafeAreaView إضافية داخل كل تبويب؛ هذا المسار متعمد
  // أن يكون View أصليًا بلا className لعزل تعارضات القالب عن محتوى التطبيق.
  if (Platform.OS !== "web") {
    const nativePadding = className?.includes("p-5")
      ? { padding: 20 }
      : className?.includes("px-5")
        ? { paddingHorizontal: 20 }
        : undefined;

    return (
      <View style={{ flex: 1, backgroundColor: "#F8F6F1" }} {...props}>
        <View style={[{ flex: 1, paddingTop: (StatusBar.currentHeight ?? 0) + 8 }, nativePadding, style]}>
          {children}
        </View>
      </View>
    );
  }

  return (
    <View
      className={cn(
        "flex-1",
        "bg-background",
        containerClassName
      )}
      {...props}
    >
      <SafeAreaView
        edges={edges}
        className={cn("flex-1", safeAreaClassName)}
        style={[rtlRoot, style]}
      >
        <View className={cn("flex-1", className)} style={rtlRoot}>{children}</View>
      </SafeAreaView>
    </View>
  );
}
