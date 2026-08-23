const BUKHARI_BASE = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1";

export const bukhariOnlineCitation = {
  source: "Hadith API · ara-bukhari",
  sourceUrl: "https://github.com/fawazahmed0/hadith-api",
  datasetUrl: `${BUKHARI_BASE}/editions/ara-bukhari.json`,
  status: "مصدر مرحلي مفتوح حتى اعتماد المصدر الرسمي",
};

type RawCatalog = {
  metadata: { name: string; sections: Record<string, string> };
};

type RawHadith = {
  hadithnumber: number;
  arabicnumber: number;
  text: string;
  grades: Array<{ name?: string; grade?: string }>;
  reference: { book: number; hadith: number };
};

type RawSection = {
  metadata: { name: string; section: Record<string, string>; section_detail: Record<string, { hadithnumber_first: number; hadithnumber_last: number }> };
  hadiths: RawHadith[];
};

export type BukhariBook = { id: number; title: string };
export type BukhariHadith = { number: number; arabicNumber: number; text: string; book: number; chapterNumber: number; grade: string | null };
export type BukhariSection = { title: string; firstHadith: number; lastHadith: number; hadiths: BukhariHadith[] };

async function fetchJson<T>(path: string): Promise<T> {
  const response = await fetch(`${BUKHARI_BASE}${path}`);
  if (!response.ok) throw new Error(`BUKHARI_NETWORK_${response.status}`);
  return (await response.json()) as T;
}

export async function getBukhariBooks(): Promise<BukhariBook[]> {
  const payload = await fetchJson<RawCatalog>("/editions/ara-bukhari.json");
  return Object.entries(payload.metadata.sections)
    .filter(([key]) => Number(key) > 0)
    .map(([key, title]) => ({ id: Number(key), title }));
}

export async function getBukhariSection(book: number): Promise<BukhariSection> {
  if (!Number.isInteger(book) || book < 1 || book > 97) throw new Error("BUKHARI_BOOK_INVALID");
  const payload = await fetchJson<RawSection>(`/editions/ara-bukhari/sections/${book}.json`);
  const title = payload.metadata.section[String(book)] ?? `الكتاب ${book}`;
  const detail = payload.metadata.section_detail[String(book)];
  return {
    title,
    firstHadith: detail?.hadithnumber_first ?? 0,
    lastHadith: detail?.hadithnumber_last ?? 0,
    hadiths: payload.hadiths.map((item) => ({
      number: item.hadithnumber,
      arabicNumber: item.arabicnumber,
      text: item.text.trim(),
      book: item.reference.book,
      chapterNumber: item.reference.hadith,
      grade: item.grades[0]?.grade ?? null,
    })),
  };
}
