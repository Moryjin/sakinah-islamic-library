import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";

import { openSource } from "@/components/sakinah-ui";
import type { RecitationMeta } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

function formatTime(value: number) {
  const seconds = Math.max(0, Math.floor(value || 0));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function RecitationPlayer({ recitations }: { recitations: RecitationMeta[] }) {
  const colors = useColors();
  const [selected, setSelected] = useState(0);
  const recording = recitations[selected];
  const player = useAudioPlayer(recording.audioUrl);
  const status = useAudioPlayerStatus(player);
  const progress = useMemo(() => status.duration > 0 ? Math.min(100, (status.currentTime / status.duration) * 100) : 0, [status.currentTime, status.duration]);

  useEffect(() => { setAudioModeAsync({ playsInSilentMode: true }).catch(() => undefined); }, []);

  const togglePlayback = async () => {
    try {
      if (status.playing) player.pause();
      else {
        if (status.duration > 0 && status.currentTime >= status.duration) player.seekTo(0);
        player.play();
      }
    } catch {
      Alert.alert("تعذر تشغيل التلاوة", "قد لا يدعم جهازك صيغة الملف. يمكنك فتح صفحة المصدر والملف المرخص مباشرة.");
    }
  };

  return <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 22, padding: 16, marginBottom: 15 }}>
    <View className="flex-row-reverse items-center" style={{ gap: 9 }}><View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: `${colors.primary}18`, alignItems: "center", justifyContent: "center" }}><MaterialIcons name="volume-up" size={20} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", ...rtl }}>تلاوة مرخّصة</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 2, ...rtl }}>لا تظهر إلا التسجيلات التي تحمل صفحة مصدر وترخيصًا واضحين</Text></View></View>
    {recitations.length > 1 ? <View className="flex-row-reverse flex-wrap" style={{ gap: 7, marginTop: 13 }}>{recitations.map((entry, index) => <Pressable key={entry.sourcePage} onPress={() => { if (status.playing) player.pause(); setSelected(index); }} style={({ pressed }) => ({ borderRadius: 12, borderWidth: 1, borderColor: selected === index ? colors.primary : colors.border, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: selected === index ? `${colors.primary}16` : "transparent", opacity: pressed ? 0.65 : 1 })}><Text style={{ color: selected === index ? colors.primary : colors.muted, fontSize: 11, fontWeight: "700", ...rtl }} numberOfLines={1}>{entry.title}</Text></Pressable>)}</View> : null}
    <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "800", marginTop: 15, ...rtl }}>{recording.title}</Text>
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 20, marginTop: 5, ...rtl }}>القارئ أو الوصف: {recording.reciter}</Text>
    <Text style={{ color: colors.muted, fontSize: 12, lineHeight: 20, ...rtl }}>الرواية أو الأسلوب: {recording.riwayah}</Text>
    <Pressable onPress={togglePlayback} style={({ pressed }) => ({ backgroundColor: colors.primary, marginTop: 15, borderRadius: 16, minHeight: 48, flexDirection: "row-reverse", alignItems: "center", justifyContent: "center", gap: 8, opacity: pressed ? 0.72 : 1 })}><MaterialIcons name={status.playing ? "pause" : "play-arrow"} size={22} color="#FFFFFF" /><Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800" }}>{status.playing ? "إيقاف مؤقت" : "تشغيل التلاوة"}</Text></Pressable>
    <View style={{ height: 4, borderRadius: 2, backgroundColor: colors.border, marginTop: 12, overflow: "hidden" }}><View style={{ width: `${progress}%`, height: "100%", backgroundColor: colors.primary }} /></View><View className="flex-row-reverse justify-between" style={{ marginTop: 5 }}><Text style={{ color: colors.muted, fontSize: 10 }}>{formatTime(status.currentTime)}</Text><Text style={{ color: colors.muted, fontSize: 10 }}>{formatTime(status.duration)}</Text></View>
    <View style={{ backgroundColor: `${colors.primary}10`, borderRadius: 15, padding: 12, marginTop: 13 }}><View className="flex-row-reverse items-center" style={{ gap: 6 }}><MaterialIcons name="verified" color={colors.primary} size={16} /><Text style={{ color: colors.primary, fontWeight: "800", fontSize: 12, ...rtl }}>الترخيص: {recording.license}</Text></View><Text style={{ color: colors.muted, fontSize: 11, lineHeight: 18, marginTop: 5, ...rtl }}>الناشر: {recording.publisher}</Text><Text style={{ color: colors.muted, fontSize: 11, lineHeight: 18, marginTop: 2, ...rtl }}>{recording.note}</Text><View className="flex-row-reverse" style={{ gap: 8, marginTop: 9 }}><Pressable onPress={() => openSource(recording.sourcePage)} style={({ pressed }) => ({ flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 11, paddingVertical: 8, opacity: pressed ? 0.65 : 1 })}><Text style={{ color: colors.primary, fontSize: 11, textAlign: "center", fontWeight: "700" }}>صفحة المصدر</Text></Pressable><Pressable onPress={() => openSource(recording.licenseUrl)} style={({ pressed }) => ({ flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 11, paddingVertical: 8, opacity: pressed ? 0.65 : 1 })}><Text style={{ color: colors.primary, fontSize: 11, textAlign: "center", fontWeight: "700" }}>نص الترخيص</Text></Pressable></View></View>
  </View>;
}
