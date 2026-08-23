import { FlatList } from "react-native";

import { AppHeader, EmptyState, LibraryItemCard } from "@/components/sakinah-ui";
import { verifiedLibraryItems } from "@/data/sakinah-library";
import { useSakinahStore } from "@/lib/sakinah-store";
import { ScreenContainer } from "@/components/screen-container";

export default function SavedScreen() {
  const { favoriteIds, hydrated } = useSakinahStore();
  const items = favoriteIds.map((id) => verifiedLibraryItems.find((item) => item.id === id)).filter(Boolean) as typeof verifiedLibraryItems;
  return (
    <ScreenContainer className="px-5">
      <FlatList data={items} keyExtractor={(item) => item.id} renderItem={({ item }) => <LibraryItemCard item={item} />} ListEmptyComponent={hydrated ? <EmptyState title="لا توجد مواد محفوظة" text="اضغط رمز الحفظ بجانب أي مادة لتظهر هنا، مع بطاقتها المرجعية." /> : null} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 28, flexGrow: 1 }} ListHeaderComponent={<AppHeader title="المحفوظات" subtitle="موادك المختارة محفوظة على جهازك" />} />
    </ScreenContainer>
  );
}
