const MUSLIM_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";
import { readHadithPack } from "@/lib/hadith-packs";

export const muslimOnlineCitation = {
  source: "Hadith API · ara-muslim",
  sourceUrl: "https://github.com/fawazahmed0/hadith-api",
  datasetUrl: `${MUSLIM_BASE}/editions/ara-muslim.json`,
  status: "بيانات عربية مفتوحة المصدر؛ أرقام الكتب والأحاديث ظاهرة في بطاقة المادة",
};

type RawCatalog = { metadata: { sections: Record<string, string> } };
type RawHadith = { hadithnumber: number; arabicnumber: number | string; text: string; grades: Array<{ grade?: string }>; reference: { book: number; hadith: number } };
type RawSection = { metadata: { section: Record<string, string>; section_detail: Record<string, { hadithnumber_first: number; hadithnumber_last: number }> }; hadiths: RawHadith[] };
type RawComplete = RawCatalog & { hadiths: RawHadith[] };

export type MuslimBook = { id: number; title: string; firstHadith?: number; lastHadith?: number };
export type MuslimHadith = { number: number; arabicNumber: string; text: string; book: number; chapterNumber: number; grade: string | null };
export type MuslimSection = { title: string; firstHadith: number; lastHadith: number; hadiths: MuslimHadith[] };

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${MUSLIM_BASE}${path}`);
  if (!response.ok) throw new Error(`MUSLIM_NETWORK_${response.status}`);
  return (await response.json()) as T;
}

export async function getMuslimBooks(): Promise<MuslimBook[]> {
  const stored = await readHadithPack<RawComplete>("muslim");
  const payload = stored ?? await fetchJson<RawCatalog>("/editions/ara-muslim.json");
  const ranges = new Map<number, { firstHadith: number; lastHadith: number }>();
  stored?.hadiths.forEach((hadith) => {
    const current = ranges.get(hadith.reference.book);
    ranges.set(hadith.reference.book, { firstHadith: current ? Math.min(current.firstHadith, hadith.hadithnumber) : hadith.hadithnumber, lastHadith: current ? Math.max(current.lastHadith, hadith.hadithnumber) : hadith.hadithnumber });
  });
  return Object.entries(payload.metadata.sections).map(([key, title]) => ({ id: Number(key), title, ...ranges.get(Number(key)) }));
}

export async function getMuslimSection(book: number): Promise<MuslimSection> {
  if (!Number.isInteger(book) || book < 0 || book > 56) throw new Error("MUSLIM_BOOK_INVALID");
  const stored = await readHadithPack<RawComplete>("muslim");
  if (stored) {
    const hadiths = stored.hadiths.filter((item) => item.reference.book === book).map((item) => ({ number: item.hadithnumber, arabicNumber: String(item.arabicnumber), text: item.text.trim(), book: item.reference.book, chapterNumber: item.reference.hadith, grade: item.grades[0]?.grade ?? null }));
    return { title: stored.metadata.sections[String(book)] ?? (book === 0 ? "المقدمة" : `الكتاب ${book}`), firstHadith: hadiths[0]?.number ?? 0, lastHadith: hadiths.at(-1)?.number ?? 0, hadiths };
  }
  const payload = await fetchJson<RawSection>(`/editions/ara-muslim/sections/${book}.json`);
  const detail = payload.metadata.section_detail[String(book)];
  return {
    title: payload.metadata.section[String(book)] ?? (book === 0 ? "المقدمة" : `الكتاب ${book}`),
    firstHadith: detail?.hadithnumber_first ?? 0,
    lastHadith: detail?.hadithnumber_last ?? 0,
    hadiths: payload.hadiths.map((item) => ({ number: item.hadithnumber, arabicNumber: String(item.arabicnumber), text: item.text.trim(), book: item.reference.book, chapterNumber: item.reference.hadith, grade: item.grades[0]?.grade ?? null })),
  };
}
