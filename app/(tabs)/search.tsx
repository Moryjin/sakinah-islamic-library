import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMemo, useState } from "react";
import { FlatList, TextInput, View } from "react-native";

import { AppHeader, EmptyState, LibraryItemCard, SectionTitle } from "@/components/sakinah-ui";
import { verifiedLibraryItems } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const colors = useColors();
  const results = useMemo(() => {
    const normalized = query.trim();
    if (!normalized) return [];
    return verifiedLibraryItems.filter((item) => `${item.title} ${item.subtitle} ${item.excerpt} ${item.tags.join(" ")}`.includes(normalized));
  }, [query]);

  return (
    <ScreenContainer className="px-5">
      <FlatList data={results} keyExtractor={(item) => item.id} renderItem={({ item }) => <LibraryItemCard item={item} />} ListEmptyComponent={query.trim() ? <EmptyState title="لا توجد نتائج مطابقة" text="جرّب كلمة أخرى أو ابحث باسم الكتاب أو السورة أو الموضوع." icon="search-off" /> : <EmptyState title="ابحث في مكتبة سَكينة" text="تظهر النتائج من القرآن وصحيحي البخاري ومسلم والبداية والنهاية مع مصدر كل مادة." icon="travel-explore" />} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 28, flexGrow: 1 }} ListHeaderComponent={<>
        <AppHeader title="بحث موحد" subtitle="نتائج منظّمة بحسب المصدر" />
        <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, paddingHorizontal: 14, height: 54, flexDirection: "row-reverse", alignItems: "center" }}><MaterialIcons name="search" size={21} color={colors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="ابحث في القرآن والحديث والكتب" placeholderTextColor={colors.muted} returnKeyType="done" style={{ flex: 1, color: colors.foreground, fontSize: 15, textAlign: "right", writingDirection: "rtl", marginRight: 9 }} /></View>
        {query.trim() ? <SectionTitle title={`النتائج · ${results.length}`} /> : null}
      </>} />
    </ScreenContainer>
  );
}
