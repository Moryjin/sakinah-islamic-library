import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { adhkarOnlineCitation, getAdhkarCategories, type AdhkarCategory } from "@/lib/adhkar-online";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function OnlineAdhkarIndex() {
  const colors = useColors();
  const router = useRouter();
  const [categories, setCategories] = useState<AdhkarCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = useCallback(() => { setLoading(true); setError(false); getAdhkarCategories().then(setCategories).catch(() => setError(true)).finally(() => setLoading(false)); }, []);
  useEffect(() => { load(); }, [load]);

  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><FlatList
    data={categories}
    keyExtractor={(item) => String(item.id)}
    contentContainerStyle={{ paddingTop: 14, paddingBottom: 32, gap: 9 }}
    ListHeaderComponent={<View style={{ marginBottom: 8 }}><View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}><View><Text style={{ color: colors.foreground, fontSize: 24, fontWeight: "800", ...rtl }}>حصن المسلم</Text><Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, ...rtl }}>فهرس أذكار شبكي معروض داخل سَكينة</Text></View><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" color={colors.foreground} size={21} /></Pressable></View><View style={{ marginTop: 14, padding: 13, borderRadius: 15, backgroundColor: `${colors.primary}10` }}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800", ...rtl }}>المصدر: {adhkarOnlineCitation.source}</Text><Text style={{ color: colors.muted, fontSize: 11, lineHeight: 18, marginTop: 4, ...rtl }}>اختر بابًا لعرض نصوصه داخل التطبيق. لا تستخدم روابط الصوت غير الآمنة الواردة من المصدر.</Text></View></View>}
    ListEmptyComponent={loading ? <View style={{ paddingTop: 90, alignItems: "center" }}><ActivityIndicator color={colors.primary} size="large" /><Text style={{ color: colors.muted, marginTop: 12, ...rtl }}>يجري تحميل أبواب الأذكار…</Text></View> : error ? <View style={{ paddingTop: 70, alignItems: "center" }}><MaterialIcons name="cloud-off" color={colors.muted} size={34} /><Text style={{ color: colors.foreground, marginTop: 12, fontWeight: "800", ...rtl }}>تعذر الاتصال بمصدر الأذكار</Text><Pressable onPress={load} style={({ pressed }) => ({ marginTop: 14, backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, opacity: pressed ? 0.7 : 1 })}><Text style={{ color: "#FFFFFF", fontWeight: "800" }}>إعادة المحاولة</Text></Pressable></View> : null}
    renderItem={({ item }) => <Pressable onPress={() => router.push(`/adhkar/${item.id}` as Href)} style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: 17, borderWidth: 1, borderColor: colors.border, padding: 15, opacity: pressed ? 0.7 : 1 })}><View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 11 }}><View style={{ width: 37, height: 37, borderRadius: 12, backgroundColor: `${colors.primary}14`, alignItems: "center", justifyContent: "center" }}><MaterialIcons name="wb-sunny" color={colors.primary} size={19} /></View><Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "800", flex: 1, ...rtl }}>{item.title}</Text><MaterialIcons name="chevron-left" color={colors.muted} size={21} /></View></Pressable>}
  /></ScreenContainer>;
}
