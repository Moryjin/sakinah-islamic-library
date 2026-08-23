import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

import { MotionIn } from "@/components/motion-in";
import { AppHeader } from "@/components/sakinah-ui";
import { sectionMeta, type LibraryKind } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";

const sections: LibraryKind[] = ["quran", "qiraat", "tafsir", "bukhari", "muslim", "adhkar", "daily-ward", "bidaya", "ibn-taymiyyah", "nawawi", "ibn-baz", "fatwa", "hanafi", "maliki", "shafii", "hanbali", "tawhid"];
const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function LibraryScreen() {
  const router = useRouter();
  const colors = useColors();
  return <ScreenContainer className="px-5"><MotionIn className="flex-1"><FlatList data={sections} keyExtractor={(item) => item} numColumns={2} columnWrapperStyle={{ gap: 10 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 30, gap: 10 }} ListHeaderComponent={<>
    <AppHeader title="المكتبة" subtitle="أبواب مستقلة، ومادة لا تظهر إلا مع بطاقتها المرجعية" />
    <View style={{ flexDirection: "row-reverse", gap: 10, marginBottom: 10 }}><Pressable onPress={() => router.push("/indexes" as any)} style={({ pressed }) => ({ flex: 1, minHeight: 94, padding: 14, borderRadius: 18, backgroundColor: colors.primary, opacity: pressed ? 0.72 : 1 })}><MaterialIcons name="format-list-bulleted" color="#FFFFFF" size={21} /><Text style={{ color: "#FFFFFF", fontWeight: "800", fontSize: 14, marginTop: 9, ...rtl }}>فهارس المحتوى</Text><Text style={{ color: "#DDF5EA", fontSize: 10, marginTop: 4, ...rtl }}>الأبواب والكتب والقراءة المباشرة</Text></Pressable><Pressable onPress={() => router.push("/sources" as any)} style={({ pressed }) => ({ flex: 1, minHeight: 94, padding: 14, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, opacity: pressed ? 0.72 : 1 })}><MaterialIcons name="verified-user" color={colors.warning} size={21} /><Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 14, marginTop: 9, ...rtl }}>دليل المصادر</Text><Text style={{ color: colors.muted, fontSize: 10, marginTop: 4, ...rtl }}>المصدر والتحقق والفهرسة</Text></Pressable></View><Pressable onPress={() => router.push("/books" as any)} style={({ pressed }) => ({ minHeight: 64, paddingHorizontal: 15, borderRadius: 17, borderWidth: 1, borderColor: `${colors.primary}45`, backgroundColor: `${colors.primary}10`, flexDirection: "row-reverse", alignItems: "center", gap: 10, marginBottom: 14, opacity: pressed ? 0.7 : 1 })}><MaterialIcons name="download-for-offline" color={colors.primary} size={22} /><View style={{ flex: 1 }}><Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 13, ...rtl }}>تغطية الكتب والتنزيلات</Text><Text style={{ color: colors.muted, fontSize: 10, marginTop: 3, ...rtl }}>حالة القراءة الشبكية والحزمة المحلية لكل باب</Text></View><MaterialIcons name="chevron-left" color={colors.primary} size={20} /></Pressable>
  </>} renderItem={({ item: kind }) => { const section = sectionMeta[kind]; return <Pressable onPress={() => router.push({ pathname: "/books/[kind]" as any, params: { kind } } as any)} style={({ pressed }) => ({ flex: 1, minHeight: 120, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 14, opacity: pressed ? 0.66 : 1 })}><View style={{ width: 34, height: 34, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: `${section.color}18` }}><MaterialIcons name={section.icon as any} size={18} color={section.color} /></View><Text numberOfLines={2} style={{ color: colors.foreground, fontSize: 12, fontWeight: "800", marginTop: 10, ...rtl }}>{section.title}</Text><Text numberOfLines={2} style={{ color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 4, ...rtl }}>كتب وفهرس ومصدر وصول</Text></Pressable>; }} /></MotionIn></ScreenContainer>;
}
