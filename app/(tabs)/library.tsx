import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

import { MotionIn } from "@/components/motion-in";
import { AppHeader, openSource, SectionTitle } from "@/components/sakinah-ui";
import { sourceDirectory, sectionMeta, type LibraryKind } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";

const sections: LibraryKind[] = ["quran", "qiraat", "tafsir", "bukhari", "muslim", "adhkar", "daily-ward", "bidaya", "ibn-taymiyyah", "nawawi", "ibn-baz", "fatwa", "hanafi", "maliki", "shafii", "hanbali", "tawhid"];
const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function LibraryScreen() {
  const router = useRouter();
  const colors = useColors();
  return <ScreenContainer className="px-5"><MotionIn className="flex-1"><FlatList data={sourceDirectory} keyExtractor={(item) => item.id} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 30 }} ListHeaderComponent={<>
    <AppHeader title="المكتبة" subtitle="أبواب مستقلة، ومادة لا تظهر إلا مع بطاقتها المرجعية" />
    <View style={{ backgroundColor: `${colors.primary}15`, borderRadius: 22, padding: 16, marginBottom: 6 }}><View className="flex-row-reverse items-center" style={{ gap: 8 }}><MaterialIcons name="verified-user" size={20} color={colors.primary} /><Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", ...rtl }}>دليل الأبواب</Text></View><Text style={{ color: colors.muted, fontSize: 12, lineHeight: 20, marginTop: 7, ...rtl }}>اختر القسم، ثم افتح المادة لمراجعة المصدر والسند والتخريج والدرجة عند الحديث.</Text></View>
    <View className="flex-row-reverse flex-wrap justify-between" style={{ gap: 10, marginTop: 12 }}>
      {sections.map((kind) => { const section = sectionMeta[kind]; return <Pressable key={kind} onPress={() => kind === "adhkar" ? router.push("/adhkar") : router.push({ pathname: "/section/[kind]", params: { kind } })} style={({ pressed }) => ({ width: "48.5%", minHeight: 110, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 14, opacity: pressed ? 0.72 : 1 })}><View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: `${section.color}18`, alignItems: "center", justifyContent: "center" }}><MaterialIcons name={section.icon as any} size={19} color={section.color} /></View><Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "800", marginTop: 10, ...rtl }}>{section.title}</Text><Text style={{ color: colors.muted, fontSize: 11, lineHeight: 17, marginTop: 3, ...rtl }} numberOfLines={2}>{section.description}</Text></Pressable>; })}
    </View>
    <SectionTitle title="المصادر المسموحة" action="منهج سَكينة" onAction={() => router.push("/methodology")} />
  </>} renderItem={({ item: source }) => <Pressable onPress={() => openSource(source.url)} style={({ pressed }) => ({ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 17, padding: 13, marginBottom: 8, flexDirection: "row-reverse", alignItems: "center", opacity: pressed ? 0.66 : 1 })}><View style={{ width: 34, height: 34, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: `${colors.primary}18` }}><MaterialIcons name={source.icon as any} size={17} color={colors.primary} /></View><View style={{ flex: 1, marginRight: 10 }}><Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "800", ...rtl }}>{source.name}</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 2, ...rtl }}>{source.scope}</Text></View><MaterialIcons name="open-in-new" size={16} color={colors.muted} /></Pressable>} /></MotionIn></ScreenContainer>;
}
