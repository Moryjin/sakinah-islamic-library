import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { bukhariOnlineCitation, getBukhariSection, type BukhariHadith } from "@/lib/bukhari-online";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function BukhariBookScreen() {
  const colors = useColors();
  const router = useRouter();
  const { book } = useLocalSearchParams<{ book: string }>();
  const bookNumber = Number(book);
  const [title, setTitle] = useState("تحميل الكتاب");
  const [range, setRange] = useState("");
  const [hadiths, setHadiths] = useState<BukhariHadith[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const load = useCallback(() => { setLoading(true); setError(false); getBukhariSection(bookNumber).then((result) => { setTitle(result.title); setRange(`${result.firstHadith}–${result.lastHadith}`); setHadiths(result.hadiths); }).catch(() => setError(true)).finally(() => setLoading(false)); }, [bookNumber]);
  useEffect(() => { load(); }, [load]);

  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><FlatList
    data={hadiths}
    keyExtractor={(item) => String(item.number)}
    contentContainerStyle={{ paddingTop: 14, paddingBottom: 32, gap: 10 }}
    ListHeaderComponent={<View style={{ marginBottom: 7 }}><View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}><View style={{ flex: 1, marginLeft: 14 }}><Text style={{ color: colors.foreground, fontSize: 22, fontWeight: "800", ...rtl }}>الكتاب {bookNumber}</Text><Text numberOfLines={2} style={{ color: colors.muted, fontSize: 11, marginTop: 4, ...rtl }}>{title} {range ? `· الأحاديث ${range}` : ""}</Text></View><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: "center", alignItems: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" color={colors.foreground} size={21} /></Pressable></View><View style={{ marginTop: 14, borderRadius: 15, padding: 13, backgroundColor: `${colors.warning}14` }}><Text style={{ color: colors.warning, fontSize: 11, fontWeight: "800", ...rtl }}>بطاقة مصدر مرحلي</Text><Text style={{ color: colors.muted, fontSize: 10, lineHeight: 17, marginTop: 4, ...rtl }}>{bukhariOnlineCitation.source} · الكتاب {bookNumber} · نص المصدر متاح عبر الإنترنت</Text></View></View>}
    ListEmptyComponent={loading ? <View style={{ paddingTop: 85, alignItems: "center" }}><ActivityIndicator color={colors.primary} size="large" /><Text style={{ color: colors.muted, marginTop: 12, ...rtl }}>يجري تحميل أحاديث الكتاب…</Text></View> : error ? <View style={{ paddingTop: 65, alignItems: "center" }}><MaterialIcons name="cloud-off" color={colors.muted} size={34} /><Text style={{ color: colors.foreground, marginTop: 12, fontWeight: "800", ...rtl }}>تعذر جلب أحاديث الكتاب</Text><Pressable onPress={load} style={({ pressed }) => ({ marginTop: 14, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 })}><Text style={{ color: "#FFFFFF", fontWeight: "800" }}>إعادة المحاولة</Text></Pressable></View> : null}
    renderItem={({ item }) => <View style={{ backgroundColor: colors.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: colors.border }}><View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800", ...rtl }}>حديث رقم {item.arabicNumber}</Text><Text style={{ color: colors.muted, fontSize: 10, ...rtl }}>كتاب {item.book} · باب {item.chapterNumber}</Text></View><Text style={{ color: colors.foreground, fontSize: 17, lineHeight: 32, ...rtl }}>{item.text}</Text><Text style={{ color: colors.muted, fontSize: 10, marginTop: 10, ...rtl }}>{item.grade ? `درجة المصدر: ${item.grade}` : "الدرجة غير متاحة في بيانات المصدر المرحلي"}</Text></View>}
  /></ScreenContainer>;
}
