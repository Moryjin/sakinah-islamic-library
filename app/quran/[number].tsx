import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getQuranSurah, quranOnlineCitation, type QuranAyah, type QuranSurah } from "@/lib/quran-online";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function QuranSurahScreen() {
  const colors = useColors();
  const router = useRouter();
  const { number } = useLocalSearchParams<{ number: string }>();
  const surahNumber = Number(number);
  const [surah, setSurah] = useState<QuranSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    getQuranSurah(surahNumber).then(setSurah).catch(() => setError(true)).finally(() => setLoading(false));
  }, [surahNumber]);

  useEffect(() => { load(); }, [load]);

  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><FlatList
    data={surah?.ayahs ?? []}
    keyExtractor={(item) => String(item.numberInSurah)}
    contentContainerStyle={{ paddingTop: 14, paddingBottom: 32, gap: 10 }}
    ListHeaderComponent={<View style={{ marginBottom: 8 }}><View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}><View style={{ flex: 1, marginLeft: 14 }}><Text style={{ color: colors.foreground, fontSize: 25, fontWeight: "800", ...rtl }}>{surah?.name ?? "تحميل السورة"}</Text><Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, ...rtl }}>{surah ? `${surah.numberOfAyahs} آيات · ${surah.revelationType === "Meccan" ? "مكية" : "مدنية"}` : ""}</Text></View><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" size={21} color={colors.foreground} /></Pressable></View><View style={{ marginTop: 16, borderRadius: 17, padding: 14, backgroundColor: `${colors.primary}0E` }}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800", ...rtl }}>بطاقة مصدر النص</Text><Text style={{ color: colors.muted, fontSize: 11, lineHeight: 18, marginTop: 4, ...rtl }}>مصدر العرض: {quranOnlineCitation.displaySource} · مرجع التحقق: {quranOnlineCitation.verificationSource}</Text></View></View>}
    ListEmptyComponent={loading ? <View style={{ paddingTop: 90, alignItems: "center" }}><ActivityIndicator color={colors.primary} size="large" /><Text style={{ color: colors.muted, marginTop: 12, ...rtl }}>يجري تحميل الآيات…</Text></View> : error ? <View style={{ paddingTop: 70, alignItems: "center" }}><MaterialIcons name="cloud-off" color={colors.muted} size={34} /><Text style={{ color: colors.foreground, marginTop: 12, fontWeight: "800", ...rtl }}>تعذر جلب السورة الآن</Text><Pressable onPress={load} style={({ pressed }) => ({ marginTop: 14, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 })}><Text style={{ color: "#FFFFFF", fontWeight: "800" }}>إعادة المحاولة</Text></Pressable></View> : null}
    renderItem={({ item }: { item: QuranAyah }) => <View style={{ backgroundColor: colors.surface, borderRadius: 18, paddingHorizontal: 16, paddingVertical: 17, borderWidth: 1, borderColor: colors.border }}><Text style={{ color: colors.foreground, fontSize: 21, lineHeight: 42, ...rtl }}>{item.text} <Text style={{ color: colors.primary, fontSize: 14 }}>﴿{item.numberInSurah}﴾</Text></Text><Text style={{ color: colors.muted, fontSize: 10, marginTop: 8, ...rtl }}>الجزء {item.juz} · الصفحة {item.page}</Text></View>}
  /></ScreenContainer>;
}
