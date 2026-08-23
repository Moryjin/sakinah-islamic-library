const QURAN_API_BASE = "https://api.alquran.cloud/v1";

export const quranOnlineCitation = {
  displaySource: "Al Quran Cloud API",
  displayUrl: "https://alquran.cloud/api",
  verificationSource: "مجمع الملك فهد لطباعة المصحف الشريف",
  verificationUrl: "https://qurancomplex.gov.sa/",
};

type QuranApiEnvelope<T> = { code: number; status: string; data: T };

export type QuranSurahSummary = {
  number: number;
  name: string;
  englishName: string;
  numberOfAyahs: number;
  revelationType: "Meccan" | "Medinan";
};

export type QuranAyah = {
  numberInSurah: number;
  text: string;
  juz: number;
  page: number;
};

export type QuranSurah = QuranSurahSummary & { ayahs: QuranAyah[] };

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${QURAN_API_BASE}${path}`);
  if (!response.ok) throw new Error(`QURAN_NETWORK_${response.status}`);
  const payload = (await response.json()) as QuranApiEnvelope<T>;
  if (payload.code !== 200 || !payload.data) throw new Error("QURAN_SOURCE_UNAVAILABLE");
  return payload.data;
}

export function getQuranSurahs() {
  return request<QuranSurahSummary[]>("/surah");
}

export function getQuranSurah(number: number) {
  if (!Number.isInteger(number) || number < 1 || number > 114) throw new Error("QURAN_SURAH_INVALID");
  return request<QuranSurah>(`/surah/${number}/quran-uthmani`);
}
