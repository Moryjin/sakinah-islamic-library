import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { type Href, useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { sectionMeta, type LibraryKind } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";

const indexedSections: LibraryKind[] = ["quran", "bukhari", "muslim", "adhkar", "tafsir", "qiraat", "bidaya", "ibn-taymiyyah", "nawawi", "ibn-baz", "fatwa", "hanafi", "maliki", "shafii", "hanbali", "tawhid"];
const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function ContentIndexesScreen() {
  const colors = useColors();
  const router = useRouter();
  const open = (kind: LibraryKind) => {
    if (kind === "quran") router.push("/quran" as Href);
    else if (kind === "bukhari") router.push("/bukhari" as Href);
    else if (kind === "muslim") router.push("/muslim" as Href);
    else if (kind === "adhkar") router.push("/adhkar" as Href);
    else router.push({ pathname: "/section/[kind]", params: { kind } });
  };

  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><FlatList
    data={indexedSections}
    numColumns={2}
    columnWrapperStyle={{ gap: 10 }}
    keyExtractor={(item) => item}
    contentContainerStyle={{ paddingTop: 14, paddingBottom: 32, gap: 10 }}
    ListHeaderComponent={<View style={{ marginBottom: 5 }}><View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}><View><Text style={{ color: colors.foreground, fontSize: 25, fontWeight: "800", ...rtl }}>فهارس المحتوى</Text><Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, ...rtl }}>تنقل حسب الكتاب والقسم دون عرض روابط المصادر</Text></View><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" color={colors.foreground} size={21} /></Pressable></View><View style={{ marginTop: 14, padding: 13, borderRadius: 16, backgroundColor: `${colors.primary}10` }}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800", ...rtl }}>دليل القراءة</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 4, lineHeight: 18, ...rtl }}>الأقسام التي يتوفر فيها نص مباشر تفتح داخله، وبقية الأقسام تفتح فهرس المواد الموثقة.</Text></View></View>}
    renderItem={({ item }) => { const section = sectionMeta[item]; const direct = item === "quran" || item === "bukhari" || item === "muslim" || item === "adhkar"; return <Pressable onPress={() => open(item)} style={({ pressed }) => ({ flex: 1, minHeight: 125, padding: 14, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, opacity: pressed ? 0.7 : 1 })}><View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}><View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: `${section.color}18`, alignItems: "center", justifyContent: "center" }}><MaterialIcons name={section.icon as never} color={section.color} size={19} /></View><MaterialIcons name={direct ? "play-circle-outline" : "format-list-bulleted"} color={colors.muted} size={17} /></View><Text style={{ color: colors.foreground, marginTop: 10, fontSize: 14, fontWeight: "800", ...rtl }}>{section.title}</Text><Text numberOfLines={2} style={{ color: colors.muted, marginTop: 3, fontSize: 10, lineHeight: 15, ...rtl }}>{direct ? "عرض مباشر داخل التطبيق" : "فهرس مواد موثقة"}</Text></Pressable>; }}
  /></ScreenContainer>;
}
