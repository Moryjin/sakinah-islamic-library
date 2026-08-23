import { Image } from "expo-image";
import { useEffect, useRef } from "react";
import { Animated, Text, View } from "react-native";

export function SakinahSplash() {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 240, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 420, useNativeDriver: true }),
    ]).start();
  }, [opacity, scale]);
  return <Animated.View style={{ position: "absolute", inset: 0, zIndex: 50, backgroundColor: "#0F5B4C", justifyContent: "center", alignItems: "center", opacity }}>
    <Animated.View style={{ alignItems: "center", transform: [{ scale }] }}>
      <Image source={require("@/assets/images/splash-icon.png")} style={{ width: 116, height: 116, borderRadius: 32 }} contentFit="cover" />
      <Text style={{ color: "#FFFFFF", fontSize: 31, fontWeight: "800", marginTop: 21, writingDirection: "rtl" }}>سَكينة</Text>
      <View style={{ width: 72, height: 1, backgroundColor: "#D9B56E", marginVertical: 13 }} />
      <Text style={{ color: "#F8E7B6", fontSize: 15, fontWeight: "700", writingDirection: "rtl" }}>لا سند، لا نص</Text>
    </Animated.View>
  </Animated.View>;
}
