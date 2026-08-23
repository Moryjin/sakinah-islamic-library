import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type Href, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { HadithPackDownload } from "@/components/hadith-pack-download";
import { useColors } from "@/hooks/use-colors";
import { bukhariOnlineCitation, getBukhariBooks, type BukhariBook } from "@/lib/bukhari-online";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function BukhariIndexScreen() {
  const colors = useColors();
  const router = useRouter();
  const [books, setBooks] = useState<BukhariBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = useCallback(() => { setLoading(true); setError(false); getBukhariBooks().then(setBooks).catch(() => setError(true)).finally(() => setLoading(false)); }, []);
  useEffect(() => { load(); }, [load]);

  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><FlatList
    data={books}
    numColumns={2}
    columnWrapperStyle={books.length ? { gap: 10 } : undefined}
    keyExtractor={(item) => String(item.id)}
    contentContainerStyle={{ paddingTop: 14, paddingBottom: 32, gap: 10 }}
    ListHeaderComponent={<View style={{ marginBottom: 6 }}><View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}><View><Text style={{ color: colors.foreground, fontSize: 24, fontWeight: "800", ...rtl }}>صحيح البخاري</Text><Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, ...rtl }}>فهرس كامل · ٩٧ كتابًا · نص عربي</Text></View><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" color={colors.foreground} size={21} /></Pressable></View><View style={{ marginTop: 15, borderRadius: 17, padding: 14, backgroundColor: `${colors.warning}16`, borderWidth: 1, borderColor: `${colors.warning}33` }}><Text style={{ color: colors.warning, fontSize: 12, fontWeight: "800", ...rtl }}>بيانات مفتوحة موثقة المصدر</Text><Text style={{ color: colors.muted, fontSize: 11, lineHeight: 18, marginTop: 4, ...rtl }}>{bukhariOnlineCitation.status}. لكل حديث رقم الكتاب والحديث ورابط مجموعة البيانات.</Text></View><HadithPackDownload id="bukhari" onDownloaded={load} /></View>}
    ListEmptyComponent={loading ? <View style={{ paddingTop: 85, alignItems: "center" }}><ActivityIndicator color={colors.primary} size="large" /><Text style={{ color: colors.muted, marginTop: 12, ...rtl }}>يجري تحميل فهرس البخاري…</Text></View> : error ? <View style={{ paddingTop: 65, alignItems: "center" }}><MaterialIcons name="cloud-off" color={colors.muted} size={34} /><Text style={{ color: colors.foreground, marginTop: 12, fontWeight: "800", ...rtl }}>تعذر الاتصال بمصدر البخاري</Text><Pressable onPress={load} style={({ pressed }) => ({ marginTop: 14, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 })}><Text style={{ color: "#FFFFFF", fontWeight: "800" }}>إعادة المحاولة</Text></Pressable></View> : null}
    renderItem={({ item }) => <Pressable onPress={() => router.push(`/bukhari/${item.id}` as Href)} style={({ pressed }) => ({ flex: 1, minHeight: 126, padding: 14, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, opacity: pressed ? 0.7 : 1 })}><View style={{ width: 33, height: 33, borderRadius: 11, backgroundColor: `${colors.primary}14`, alignItems: "center", justifyContent: "center" }}><Text style={{ color: colors.primary, fontWeight: "800", fontSize: 12 }}>{item.id}</Text></View><Text style={{ color: colors.foreground, marginTop: 10, fontSize: 13, fontWeight: "800", ...rtl }}>الكتاب {item.id}</Text><Text numberOfLines={2} style={{ color: colors.muted, marginTop: 3, fontSize: 10, lineHeight: 15, ...rtl }}>{item.title}</Text>{item.firstHadith ? <Text style={{ color: colors.primary, marginTop: 6, fontSize: 10, fontWeight: "700", ...rtl }}>الأحاديث {item.firstHadith}–{item.lastHadith}</Text> : <Text style={{ color: colors.muted, marginTop: 6, fontSize: 10, ...rtl }}>نزّل الحزمة لعرض النطاق</Text>}</Pressable>}
  /></ScreenContainer>;
}
