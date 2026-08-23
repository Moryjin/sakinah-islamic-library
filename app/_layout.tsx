import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaFrameContext, SafeAreaInsetsContext, SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import type { EdgeInsets, Metrics, Rect } from "react-native-safe-area-context";
import "react-native-reanimated";

import "@/lib/_core/nativewind-pressable";
import { SakinahStoreProvider } from "@/lib/sakinah-store";
import { ThemeProvider } from "@/lib/theme-provider";
import { initManusRuntime, subscribeSafeAreaInsets } from "@/lib/_core/manus-runtime";
import { trpc, createTRPCClient } from "@/lib/trpc";
import { SakinahSplash } from "@/components/sakinah-splash";
import { AppErrorBoundary } from "@/components/app-error-boundary";
import { RTL_LANGUAGE_TAG, rtlRoot } from "@/lib/rtl";

SplashScreen.preventAutoHideAsync().catch(() => undefined);
SplashScreen.setOptions({ duration: 450, fade: true });

const DEFAULT_WEB_INSETS: EdgeInsets = { top: 0, right: 0, bottom: 0, left: 0 };
const DEFAULT_WEB_FRAME: Rect = { x: 0, y: 0, width: 0, height: 0 };

export const unstable_settings = { anchor: "(tabs)" };

export default function RootLayout() {
  const initialInsets = initialWindowMetrics?.insets ?? DEFAULT_WEB_INSETS;
  const initialFrame = initialWindowMetrics?.frame ?? DEFAULT_WEB_FRAME;
  const [insets, setInsets] = useState<EdgeInsets>(initialInsets);
  const [frame, setFrame] = useState<Rect>(initialFrame);
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 1 } } }));
  const [trpcClient] = useState(() => createTRPCClient());
  // طبقة React المطلقة آمنة على الويب، لكنها ليست ضرورية فوق شاشة Android الأصلية
  // وقد تحجب المحتوى إذا تعطل تنفيذ مؤقت البداية في إصدار مستقل.
  const [showBrandSplash, setShowBrandSplash] = useState(Platform.OS === "web");

  useEffect(() => { initManusRuntime(); }, []);
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => undefined);
    const timer = Platform.OS === "web" ? setTimeout(() => setShowBrandSplash(false), 1150) : undefined;
    return () => { if (timer) clearTimeout(timer); };
  }, []);
  const handleSafeAreaUpdate = useCallback((metrics: Metrics) => { setInsets(metrics.insets); setFrame(metrics.frame); }, []);
  useEffect(() => {
    if (Platform.OS !== "web") return;
    return subscribeSafeAreaInsets(handleSafeAreaUpdate);
  }, [handleSafeAreaUpdate]);

  const providerInitialMetrics = useMemo(() => {
    const metrics = initialWindowMetrics ?? { insets: initialInsets, frame: initialFrame };
    return { ...metrics, insets: { ...metrics.insets, top: Math.max(metrics.insets.top, 16), bottom: Math.max(metrics.insets.bottom, 12) } };
  }, [initialInsets, initialFrame]);

  const content = (
    <GestureHandlerRootView style={rtlRoot} nativeID={`sakinah-root-${RTL_LANGUAGE_TAG}`}>
      <trpc.Provider client={trpcClient} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <SakinahStoreProvider>
            <View style={rtlRoot} accessibilityLanguage={RTL_LANGUAGE_TAG}>
            <Stack screenOptions={{ headerShown: false, animation: "fade_from_bottom", animationDuration: 240, gestureDirection: "horizontal" }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="reader/[id]" />
              <Stack.Screen name="section/[kind]" />
              <Stack.Screen name="methodology" />
              <Stack.Screen name="oauth/callback" />
            </Stack>
            <StatusBar style="auto" />
            {showBrandSplash ? <SakinahSplash /> : null}
            </View>
          </SakinahStoreProvider>
        </QueryClientProvider>
      </trpc.Provider>
    </GestureHandlerRootView>
  );

  return (
    <AppErrorBoundary>
      <ThemeProvider>
      <SafeAreaProvider initialMetrics={providerInitialMetrics}>
        {Platform.OS === "web" ? <SafeAreaFrameContext.Provider value={frame}><SafeAreaInsetsContext.Provider value={insets}>{content}</SafeAreaInsetsContext.Provider></SafeAreaFrameContext.Provider> : content}
      </SafeAreaProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
