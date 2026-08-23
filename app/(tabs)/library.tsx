import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { FlatList, Pressable as TouchableOpacity, Text, View } from "react-native";

import { AppHeader, LibraryItemCard, openSource, SectionTitle } from "@/components/sakinah-ui";
import { collectionMeta, libraryItems, sourceDirectory, type LibraryKind } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";

const filters: LibraryKind[] = ["quran", "bidaya"];

export default function LibraryScreen() {
  const [selected, setSelected] = useState<LibraryKind>("quran");
  const colors = useColors();
  const items = libraryItems.filter((item) => item.kind === selected);
  const meta = collectionMeta[selected];

  return (
    <ScreenContainer className="px-5">
      <FlatList data={items} keyExtractor={(item) => item.id} renderItem={({ item }) => <LibraryItemCard item={item} />} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 28 }} ListHeaderComponent={<>
        <AppHeader title="المكتبة" subtitle="القرآن الكريم وكتب السيرة والتاريخ" />
        <View className="flex-row-reverse" style={{ gap: 8 }}>
          {filters.map((kind) => <TouchableOpacity key={kind} onPress={() => setSelected(kind)} style={({ pressed }) => ({ flex: 1, minHeight: 75, borderRadius: 18, backgroundColor: selected === kind ? collectionMeta[kind].color : colors.surface, borderColor: selected === kind ? collectionMeta[kind].color : colors.border, borderWidth: 1, padding: 13, opacity: pressed ? 0.72 : 1 })}><MaterialIcons name={collectionMeta[kind].icon as any} size={19} color={selected === kind ? "#FFFFFF" : collectionMeta[kind].color} /><Text style={{ textAlign: "right", writingDirection: "rtl", color: selected === kind ? "#FFFFFF" : colors.foreground, fontSize: 14, fontWeight: "800", marginTop: 10 }}>{collectionMeta[kind].title}</Text></TouchableOpacity>)}
        </View>
        <SectionTitle title={meta.title} />
        <View style={{ backgroundColor: `${meta.color}14`, borderRadius: 18, padding: 14, marginBottom: 14 }}><Text style={{ textAlign: "right", writingDirection: "rtl", color: colors.foreground, fontSize: 13, lineHeight: 21 }}>{meta.description}</Text></View>
      </>} ListFooterComponent={<><SectionTitle title="مصادر موثوقة معتمدة" /><View style={{ backgroundColor: colors.surface, borderRadius: 22, borderWidth: 1, borderColor: colors.border, overflow: "hidden" }}><View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: colors.border }}><Text style={{ color: colors.muted, fontSize: 12, lineHeight: 19, textAlign: "right", writingDirection: "rtl" }}>تُربط النصوص بمرجع محدد، وتفتح الروابط الأصلية للمراجعة. لا تُضاف مصادر جديدة إلا بعد مراجعة نطاقها وبياناتها.</Text></View>{sourceDirectory.map((source, index) => <TouchableOpacity key={source.id} onPress={() => openSource(source.url)} style={({ pressed }) => ({ padding: 15, flexDirection: "row-reverse", alignItems: "center", borderBottomWidth: index === sourceDirectory.length - 1 ? 0 : 1, borderBottomColor: colors.border, opacity: pressed ? 0.65 : 1 })}><View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: `${meta.color}14`, alignItems: "center", justifyContent: "center" }}><MaterialIcons name={source.icon as any} size={18} color={meta.color} /></View><View style={{ flex: 1, marginRight: 10 }}><Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "800", textAlign: "right", writingDirection: "rtl" }}>{source.name}</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 3, textAlign: "right", writingDirection: "rtl" }}>{source.scope}</Text></View><MaterialIcons name="open-in-new" size={16} color={colors.muted} /></TouchableOpacity>)}</View></>} />
    </ScreenContainer>
  );
}
