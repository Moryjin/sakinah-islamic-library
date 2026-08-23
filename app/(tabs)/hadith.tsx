import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { FlatList, Pressable as TouchableOpacity, Text, View } from "react-native";

import { AppHeader, LibraryItemCard, SectionTitle } from "@/components/sakinah-ui";
import { collectionMeta, libraryItems, type LibraryKind } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";

const filters: LibraryKind[] = ["bukhari", "muslim"];

export default function HadithScreen() {
  const [selected, setSelected] = useState<LibraryKind>("bukhari");
  const colors = useColors();
  const meta = collectionMeta[selected];
  const items = libraryItems.filter((item) => item.kind === selected);

  return (
    <ScreenContainer className="px-5">
      <FlatList data={items} keyExtractor={(item) => item.id} renderItem={({ item }) => <LibraryItemCard item={item} />} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 28 }} ListHeaderComponent={<>
        <AppHeader title="الحديث الشريف" subtitle="صحيح البخاري وصحيح مسلم، مع بيانات المرجع" />
        <View className="flex-row-reverse" style={{ gap: 8 }}>
          {filters.map((kind) => <TouchableOpacity key={kind} onPress={() => setSelected(kind)} style={({ pressed }) => ({ flex: 1, borderRadius: 18, minHeight: 68, padding: 13, backgroundColor: selected === kind ? collectionMeta[kind].color : colors.surface, borderWidth: 1, borderColor: selected === kind ? collectionMeta[kind].color : colors.border, opacity: pressed ? 0.72 : 1 })}><View className="flex-row-reverse items-center gap-2"><MaterialIcons name={collectionMeta[kind].icon as any} size={18} color={selected === kind ? "#FFFFFF" : collectionMeta[kind].color} /><Text style={{ color: selected === kind ? "#FFFFFF" : colors.foreground, fontSize: 14, fontWeight: "800", writingDirection: "rtl" }}>{collectionMeta[kind].title}</Text></View><Text style={{ color: selected === kind ? "rgba(255,255,255,0.78)" : colors.muted, fontSize: 11, marginTop: 8, textAlign: "right", writingDirection: "rtl" }}>مصدر · كتاب · رقم حديث</Text></TouchableOpacity>)}
        </View>
        <SectionTitle title={meta.title} />
      </>} />
    </ScreenContainer>
  );
}
