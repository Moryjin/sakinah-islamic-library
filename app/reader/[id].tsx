import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable as TouchableOpacity, Text, View } from "react-native";

import { openSource, SourcePill } from "@/components/sakinah-ui";
import { collectionMeta, libraryItems } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { useSakinahStore } from "@/lib/sakinah-store";
import { ScreenContainer } from "@/components/screen-container";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function ReaderScreen() {
  useKeepAwake();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colors = useColors();
  const { favoriteIds, toggleFavorite, markOpened } = useSakinahStore();
  const item = libraryItems.find((entry) => entry.id === id);

  useEffect(() => { if (item) markOpened(item.id); }, [item, markOpened]);
  if (!item) return null;
  const meta = collectionMeta[item.kind];
  const saved = favoriteIds.includes(item.id);

  return (
    <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}>
      <FlatList data={[item.body]} keyExtractor={(_, index) => String(index)} renderItem={({ item: body }) => <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 26, padding: 20 }}><Text style={{ color: colors.foreground, fontSize: item.kind === "quran" ? 23 : 18, lineHeight: item.kind === "quran" ? 48 : 34, textAlign: "right", writingDirection: "rtl" }}>{body}</Text></View>} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }} ListHeaderComponent={<>
        <View className="flex-row-reverse items-center justify-between mb-6"><TouchableOpacity onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" size={21} color={colors.foreground} /></TouchableOpacity><View className="flex-1 mx-3"><Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "800", ...rtl }} numberOfLines={1}>{item.title}</Text><Text style={{ color: colors.muted, fontSize: 12, marginTop: 3, ...rtl }}>{item.subtitle}</Text></View><TouchableOpacity onPress={() => toggleFavorite(item.id)} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name={saved ? "bookmark" : "bookmark-border"} size={21} color={saved ? colors.primary : colors.foreground} /></TouchableOpacity></View>
        <View style={{ backgroundColor: `${meta.color}15`, borderRadius: 20, padding: 15, marginBottom: 15 }}><Text style={{ color: meta.color, fontSize: 12, fontWeight: "800", ...rtl }}>{item.source.label}</Text><Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", marginTop: 5, ...rtl }}>{item.source.reference}</Text><Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, marginTop: 6, ...rtl }}>{item.source.note}</Text><View className="flex-row-reverse items-center justify-between mt-3"><SourcePill item={item} /><TouchableOpacity onPress={() => openSource(item.source.url)} style={({ pressed }) => ({ flexDirection: "row-reverse", alignItems: "center", gap: 5, opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="open-in-new" size={15} color={colors.primary} /><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800" }}>فتح المرجع</Text></TouchableOpacity></View></View>
      </>} />
    </ScreenContainer>
  );
}
