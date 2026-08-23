export type BookmarkKind = "quran" | "bukhari" | "muslim";

export type Bookmark = {
  id: string;
  kind: BookmarkKind;
  title: string;
  subtitle: string;
  text: string;
  surah?: number;
  ayah?: number;
  book?: number;
  hadith?: number;
  createdAt: string;
};

export function quranBookmarkId(surah: number, ayah: number) { return `quran:${surah}:${ayah}`; }
export function hadithBookmarkId(kind: "bukhari" | "muslim", book: number, hadith: number) { return `${kind}:${book}:${hadith}`; }
export function bookmarkSort(a: Bookmark, b: Bookmark) { return b.createdAt.localeCompare(a.createdAt); }
