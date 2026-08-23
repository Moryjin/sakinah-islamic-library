import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { type ReadingSize, useReadingSettings } from "@/lib/reading-settings";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };
const options: { id: ReadingSize; title: string; label: string }[] = [
  { id: "small", title: "صغير", label: "قراءة مكثفة" },
  { id: "standard", title: "قياسي", label: "الحجم الافتراضي" },
  { id: "large", title: "كبير", label: "قراءة مريحة" },
  { id: "xlarge", title: "كبير جدًا", label: "وضوح أعلى" },
];

export default function ReadingSettingsScreen() {
  const colors = useColors(); const router = useRouter(); const { size, setSize, scale } = useReadingSettings();
  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><View style={{ paddingTop: 16 }}><View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}><View><Text style={{ color: colors.foreground, fontSize: 24, fontWeight: "800", ...rtl }}>إعدادات القراءة</Text><Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, ...rtl }}>يطبّق الحجم على المصحف والحديث والأذكار والكتب</Text></View><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" size={21} color={colors.foreground} /></Pressable></View><View style={{ marginTop: 22, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}><Text style={{ color: colors.foreground, fontSize: Math.round(22 * scale), lineHeight: Math.round(42 * scale), ...rtl }}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text><Text style={{ color: colors.muted, marginTop: 10, fontSize: Math.round(14 * scale), lineHeight: Math.round(24 * scale), ...rtl }}>مثال مباشر للحجم الذي اخترته</Text></View><Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", marginTop: 24, marginBottom: 10, ...rtl }}>حجم الخط</Text>{options.map((option) => <Pressable key={option.id} onPress={() => setSize(option.id)} style={({ pressed }) => ({ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", minHeight: 64, paddingHorizontal: 15, marginBottom: 9, borderRadius: 17, backgroundColor: size === option.id ? `${colors.primary}14` : colors.surface, borderWidth: 1.5, borderColor: size === option.id ? colors.primary : colors.border, opacity: pressed ? 0.68 : 1 })}><View><Text style={{ color: size === option.id ? colors.primary : colors.foreground, fontSize: 14, fontWeight: "800", ...rtl }}>{option.title}</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 3, ...rtl }}>{option.label}</Text></View><MaterialIcons name={size === option.id ? "radio-button-checked" : "radio-button-unchecked"} size={22} color={size === option.id ? colors.primary : colors.muted} /></Pressable>)}</View></ScreenContainer>;
}
