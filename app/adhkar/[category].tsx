import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { adhkarOnlineCitation, getAdhkarCategory, type OnlineDhikr } from "@/lib/adhkar-online";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function OnlineAdhkarCategory() {
  const colors = useColors();
  const router = useRouter();
  const { category } = useLocalSearchParams<{ category: string }>();
  const id = Number(category);
  const [title, setTitle] = useState("تحميل الباب");
  const [items, setItems] = useState<OnlineDhikr[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = useCallback(() => { setLoading(true); setError(false); getAdhkarCategory(id).then((result) => { setTitle(result.title); setItems(result.items); }).catch(() => setError(true)).finally(() => setLoading(false)); }, [id]);
  useEffect(() => { load(); }, [load]);

  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><FlatList
    data={items}
    keyExtractor={(item) => String(item.id)}
    contentContainerStyle={{ paddingTop: 14, paddingBottom: 32, gap: 10 }}
    ListHeaderComponent={<View style={{ marginBottom: 8 }}><View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}><View style={{ flex: 1, marginLeft: 14 }}><Text style={{ color: colors.foreground, fontSize: 23, fontWeight: "800", ...rtl }}>{title}</Text><Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, ...rtl }}>نصوص مرجعية معروضة من المصدر الشبكي</Text></View><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" color={colors.foreground} size={21} /></Pressable></View><View style={{ marginTop: 14, padding: 13, borderRadius: 15, backgroundColor: `${colors.primary}10` }}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800", ...rtl }}>بطاقة المصدر</Text><Text style={{ color: colors.muted, fontSize: 11, lineHeight: 18, marginTop: 4, ...rtl }}>{adhkarOnlineCitation.source} · الباب {id} · اتصال الإنترنت مطلوب</Text></View></View>}
    ListEmptyComponent={loading ? <View style={{ paddingTop: 90, alignItems: "center" }}><ActivityIndicator color={colors.primary} size="large" /><Text style={{ color: colors.muted, marginTop: 12, ...rtl }}>يجري تحميل الأذكار…</Text></View> : error ? <View style={{ paddingTop: 70, alignItems: "center" }}><MaterialIcons name="cloud-off" color={colors.muted} size={34} /><Text style={{ color: colors.foreground, marginTop: 12, fontWeight: "800", ...rtl }}>تعذر جلب باب الأذكار</Text><Pressable onPress={load} style={({ pressed }) => ({ marginTop: 14, backgroundColor: colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, opacity: pressed ? 0.7 : 1 })}><Text style={{ color: "#FFFFFF", fontWeight: "800" }}>إعادة المحاولة</Text></Pressable></View> : null}
    renderItem={({ item }) => <View style={{ backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}><Text style={{ color: colors.foreground, fontSize: 18, lineHeight: 34, ...rtl }}>{item.text}</Text><View style={{ alignSelf: "flex-end", marginTop: 11, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: `${colors.primary}12` }}><Text style={{ color: colors.primary, fontSize: 11, fontWeight: "800", ...rtl }}>التكرار: {item.repeat}</Text></View><Text style={{ color: colors.muted, fontSize: 10, marginTop: 9, ...rtl }}>المصدر: حصن المسلم · الباب {id} · الذكر {item.id}</Text></View>}
  /></ScreenContainer>;
}
