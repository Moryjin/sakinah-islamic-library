const QURAN_API_BASE = "https://api.alquran.cloud/v1";
import { readQuranPack } from "@/lib/quran-pack";

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
type QuranPack = { surahs: QuranSurah[] };

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${QURAN_API_BASE}${path}`);
  if (!response.ok) throw new Error(`QURAN_NETWORK_${response.status}`);
  const payload = (await response.json()) as QuranApiEnvelope<T>;
  if (payload.code !== 200 || !payload.data) throw new Error("QURAN_SOURCE_UNAVAILABLE");
  return payload.data;
}

export async function getQuranSurahs() {
  const local = await readQuranPack<QuranPack>();
  return local ? local.surahs.map(({ number, name, englishName, numberOfAyahs, revelationType }) => ({ number, name, englishName, numberOfAyahs, revelationType })) : request<QuranSurahSummary[]>("/surah");
}

export async function getQuranSurah(number: number) {
  if (!Number.isInteger(number) || number < 1 || number > 114) throw new Error("QURAN_SURAH_INVALID");
  const local = await readQuranPack<QuranPack>();
  if (local) {
    const surah = local.surahs.find((item) => item.number === number);
    if (surah) return surah;
  }
  return request<QuranSurah>(`/surah/${number}/quran-uthmani`);
}
