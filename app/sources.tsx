import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { openSource } from "@/components/sakinah-ui";
import { sourceDirectory } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function SourcesScreen() {
  const colors = useColors();
  const router = useRouter();
  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><FlatList
    data={sourceDirectory}
    numColumns={2}
    columnWrapperStyle={{ gap: 10 }}
    keyExtractor={(item) => item.id}
    contentContainerStyle={{ paddingTop: 14, paddingBottom: 32, gap: 10 }}
    ListHeaderComponent={<View style={{ marginBottom: 5 }}><View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}><View><Text style={{ color: colors.foreground, fontSize: 25, fontWeight: "800", ...rtl }}>دليل المصادر</Text><Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, ...rtl }}>مصادر النص والتحقق والفهرسة مستقلة عن الفهارس</Text></View><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" color={colors.foreground} size={21} /></Pressable></View><View style={{ marginTop: 14, padding: 13, borderRadius: 16, backgroundColor: `${colors.warning}14`, borderWidth: 1, borderColor: `${colors.warning}2A` }}><Text style={{ color: colors.warning, fontSize: 12, fontWeight: "800", ...rtl }}>قاعدة سَكينة</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 4, lineHeight: 18, ...rtl }}>هذه روابط المصدر والتحقق فقط. اعرض المادة من فهرس المحتوى، ثم راجع مصدرها هنا.</Text></View></View>}
    renderItem={({ item }) => <Pressable onPress={() => openSource(item.url)} style={({ pressed }) => ({ flex: 1, minHeight: 140, padding: 14, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, opacity: pressed ? 0.7 : 1 })}><View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}><View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: `${colors.primary}14`, justifyContent: "center", alignItems: "center" }}><MaterialIcons name={item.icon as never} color={colors.primary} size={18} /></View><MaterialIcons name="open-in-new" color={colors.muted} size={16} /></View><Text numberOfLines={2} style={{ color: colors.foreground, marginTop: 10, fontSize: 12, fontWeight: "800", ...rtl }}>{item.name}</Text><Text numberOfLines={3} style={{ color: colors.muted, marginTop: 4, fontSize: 10, lineHeight: 15, ...rtl }}>{item.scope}</Text></Pressable>}
  /></ScreenContainer>;
}
