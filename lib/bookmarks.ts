import AsyncStorage from "@react-native-async-storage/async-storage";

import { bookmarkSort, type Bookmark } from "@/lib/bookmark-utils";

const BOOKMARKS_KEY = "sakinah.bookmarks.v1";

export async function getBookmarks(): Promise<Bookmark[]> {
  try { return (JSON.parse((await AsyncStorage.getItem(BOOKMARKS_KEY)) ?? "[]") as Bookmark[]).sort(bookmarkSort); } catch { return []; }
}

export async function hasBookmark(id: string) { return (await getBookmarks()).some((item) => item.id === id); }

export async function toggleBookmark(bookmark: Bookmark) {
  const existing = await getBookmarks();
  const found = existing.some((item) => item.id === bookmark.id);
  const next = found ? existing.filter((item) => item.id !== bookmark.id) : [bookmark, ...existing].sort(bookmarkSort);
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  return !found;
}

export async function removeBookmark(id: string) {
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify((await getBookmarks()).filter((item) => item.id !== id)));
}
