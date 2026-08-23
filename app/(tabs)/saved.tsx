import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";

import { AppHeader, EmptyState } from "@/components/sakinah-ui";
import { ScreenContainer } from "@/components/screen-container";
import { verifiedLibraryItems } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { getBookmarks, removeBookmark } from "@/lib/bookmarks";
import { type Bookmark } from "@/lib/bookmark-utils";
import { useSakinahStore } from "@/lib/sakinah-store";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };
type SavedEntry = { type: "library"; id: string; title: string; subtitle: string; text: string } | { type: "bookmark"; bookmark: Bookmark };

export default function SavedScreen() {
  const colors = useColors(); const router = useRouter(); const { favoriteIds, hydrated } = useSakinahStore(); const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const refresh = useCallback(() => { getBookmarks().then(setBookmarks); }, []);
  useFocusEffect(refresh);
  const entries = useMemo<SavedEntry[]>(() => [
    ...favoriteIds.map((id) => verifiedLibraryItems.find((item) => item.id === id)).filter(Boolean).map((item) => ({ type: "library" as const, id: item!.id, title: item!.title, subtitle: item!.subtitle, text: "مادة مكتبية محفوظة" })),
    ...bookmarks.map((bookmark) => ({ type: "bookmark" as const, bookmark })),
  ], [bookmarks, favoriteIds]);
  const open = (entry: SavedEntry) => {
    if (entry.type === "library") { router.push(`/reader/${entry.id}`); return; }
    const { bookmark } = entry;
    if (bookmark.kind === "quran") router.push({ pathname: "/quran/[number]", params: { number: String(bookmark.surah), ayah: String(bookmark.ayah) } });
    else if (bookmark.kind === "bukhari") router.push({ pathname: "/bukhari/[book]", params: { book: String(bookmark.book), hadith: String(bookmark.hadith) } });
    else router.push({ pathname: "/muslim/[book]", params: { book: String(bookmark.book), hadith: String(bookmark.hadith) } });
  };
  return <ScreenContainer className="px-5"><FlatList data={entries} numColumns={2} keyExtractor={(entry) => entry.type === "library" ? `library:${entry.id}` : entry.bookmark.id} columnWrapperStyle={entries.length ? { gap: 10 } : undefined} renderItem={({ item }) => { const bookmark = item.type === "bookmark" ? item.bookmark : null; const library = item.type === "library" ? item : null; const icon = !bookmark ? "menu-book" : bookmark.kind === "quran" ? "auto-stories" : "format-quote"; const tag = !bookmark ? "مادة محفوظة" : bookmark.kind === "quran" ? "آية محفوظة" : "حديث محفوظ"; const title = bookmark ? bookmark.title : library!.title; const subtitle = bookmark ? bookmark.subtitle : library!.subtitle; const text = bookmark ? bookmark.text : library!.text; return <Pressable onPress={() => open(item)} onLongPress={() => bookmark ? removeBookmark(bookmark.id).then(refresh) : undefined} style={({ pressed }) => ({ flex: 1, minHeight: 185, padding: 14, marginBottom: 10, borderRadius: 18, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, opacity: pressed ? 0.68 : 1 })}><View style={{ flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center" }}><View style={{ width: 34, height: 34, borderRadius: 11, backgroundColor: `${colors.primary}16`, alignItems: "center", justifyContent: "center" }}><MaterialIcons name={icon} size={18} color={colors.primary} /></View><MaterialIcons name={bookmark ? "bookmark" : "chevron-left"} size={18} color={bookmark ? colors.warning : colors.muted} /></View><Text numberOfLines={2} style={{ color: colors.foreground, fontSize: 13, fontWeight: "800", marginTop: 11, ...rtl }}>{title}</Text><Text numberOfLines={2} style={{ color: colors.primary, fontSize: 10, fontWeight: "700", marginTop: 5, ...rtl }}>{subtitle}</Text><Text numberOfLines={3} style={{ color: colors.muted, fontSize: 10, lineHeight: 15, marginTop: 7, ...rtl }}>{text}</Text><Text style={{ color: colors.muted, fontSize: 9, marginTop: "auto", paddingTop: 8, ...rtl }}>{bookmark ? `${tag} · ضغط مطول للإزالة` : tag}</Text></Pressable>; }} ListEmptyComponent={hydrated ? <EmptyState title="لا توجد مواد أو علامات محفوظة" text="المس رقم الآية أو رمز الحفظ بجانب الحديث لتظهر علامة مستقلة هنا." /> : null} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 28, flexGrow: 1 }} ListHeaderComponent={<AppHeader title="المحفوظات" subtitle="علامات للآيات والأحاديث وموادك المختارة على جهازك" />} /></ScreenContainer>;
}
