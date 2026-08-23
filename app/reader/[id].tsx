import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useKeepAwake } from "expo-keep-awake";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { CitationCard } from "@/components/citation-card";
import { RecitationPlayer } from "@/components/recitation-player";
import { EmptyState } from "@/components/sakinah-ui";
import { collectionMeta, hasCompleteCitation, libraryItems } from "@/data/sakinah-library";
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

  useEffect(() => { if (item && hasCompleteCitation(item)) markOpened(item.id); }, [item, markOpened]);
  if (!item || !hasCompleteCitation(item)) {
    return <ScreenContainer className="px-5"><EmptyState title="لا يمكن عرض هذه المادة" text="سياسة سَكينة تمنع عرض أي مادة بلا بطاقة توثيق ومصدر قابل للفتح." icon="gpp-bad" /></ScreenContainer>;
  }

  const meta = collectionMeta[item.kind];
  const saved = favoriteIds.includes(item.id);
  const isQuran = item.kind === "quran" || item.kind === "daily-ward";

  return (
    <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}>
      <FlatList data={[item.body]} keyExtractor={(_, index) => String(index)} renderItem={({ item: body }) => <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 26, padding: 20 }}><Text style={{ color: colors.foreground, fontSize: isQuran ? 23 : 17, lineHeight: isQuran ? 48 : 32, ...rtl }}>{body}</Text></View>} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 12, paddingBottom: 28 }} ListHeaderComponent={<>
        <View className="flex-row-reverse items-center justify-between mb-6"><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" size={21} color={colors.foreground} /></Pressable><View className="flex-1 mx-3"><Text style={{ color: colors.foreground, fontSize: 17, fontWeight: "800", ...rtl }} numberOfLines={1}>{item.title}</Text><Text style={{ color: colors.muted, fontSize: 12, marginTop: 3, ...rtl }}>{item.subtitle}</Text></View><Pressable onPress={() => toggleFavorite(item.id)} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name={saved ? "bookmark" : "bookmark-border"} size={21} color={saved ? colors.primary : colors.foreground} /></Pressable></View>
        <View style={{ backgroundColor: `${meta.color}15`, borderRadius: 18, padding: 13, marginBottom: 15 }}><Text style={{ color: meta.color, fontSize: 12, fontWeight: "800", ...rtl }}>{meta.title}</Text><Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 21, marginTop: 4, ...rtl }}>{item.source.note}</Text></View>
        <CitationCard item={item} />
        {item.recitations?.length ? <RecitationPlayer recitations={item.recitations} /> : null}
      </>} />
    </ScreenContainer>
  );
}
