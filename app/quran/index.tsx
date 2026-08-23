import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { getQuranSurahs, quranOnlineCitation, type QuranSurahSummary } from "@/lib/quran-online";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function QuranIndexScreen() {
  const colors = useColors();
  const router = useRouter();
  const [surahs, setSurahs] = useState<QuranSurahSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = () => {
    setLoading(true);
    setError(false);
    getQuranSurahs().then(setSurahs).catch(() => setError(true)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}>
      <FlatList
        data={surahs}
        keyExtractor={(item) => String(item.number)}
        contentContainerStyle={{ paddingTop: 14, paddingBottom: 28, gap: 9 }}
        ListHeaderComponent={<View style={{ marginBottom: 9 }}><View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}><View><Text style={{ color: colors.foreground, fontSize: 25, fontWeight: "800", ...rtl }}>المصحف الشريف</Text><Text style={{ color: colors.muted, fontSize: 13, marginTop: 4, ...rtl }}>١١٤ سورة · نص عربي معروض داخل التطبيق</Text></View><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" size={21} color={colors.foreground} /></Pressable></View><View style={{ marginTop: 15, padding: 13, borderRadius: 15, backgroundColor: `${colors.primary}10`, borderWidth: 1, borderColor: `${colors.primary}22` }}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800", ...rtl }}>مصدر العرض: {quranOnlineCitation.displaySource}</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 4, lineHeight: 18, ...rtl }}>مرجع التحقق: {quranOnlineCitation.verificationSource} · يلزم اتصال بالإنترنت للقراءة الكاملة.</Text></View></View>}
        ListEmptyComponent={loading ? <View style={{ paddingTop: 90, alignItems: "center" }}><ActivityIndicator color={colors.primary} size="large" /><Text style={{ color: colors.muted, marginTop: 12, ...rtl }}>يجري تحميل فهرس السور…</Text></View> : error ? <View style={{ paddingTop: 70, alignItems: "center" }}><MaterialIcons name="cloud-off" color={colors.muted} size={34} /><Text style={{ color: colors.foreground, marginTop: 12, fontWeight: "800", ...rtl }}>تعذر الاتصال بمصدر المصحف</Text><Pressable onPress={load} style={({ pressed }) => ({ marginTop: 14, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 })}><Text style={{ color: "#FFFFFF", fontWeight: "800" }}>إعادة المحاولة</Text></Pressable></View> : null}
        renderItem={({ item }) => <Pressable onPress={() => router.push({ pathname: "/quran/[number]", params: { number: String(item.number) } })} style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: 17, padding: 15, borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.7 : 1 })}><View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 12 }}><View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: `${colors.primary}14`, alignItems: "center", justifyContent: "center" }}><Text style={{ color: colors.primary, fontWeight: "800" }}>{item.number}</Text></View><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", ...rtl }}>{item.name}</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 3, ...rtl }}>{item.numberOfAyahs} آيات · {item.revelationType === "Meccan" ? "مكية" : "مدنية"}</Text></View><MaterialIcons name="chevron-left" color={colors.muted} size={22} /></View></Pressable>}
      />
    </ScreenContainer>
  );
}
