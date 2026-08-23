const HISN_API_BASE = "https://www.hisnmuslim.com/api/ar";

export const adhkarOnlineCitation = {
  source: "حصن المسلم · من أذكار الكتاب والسنة",
  url: "https://hisnmuslim.com/i/ar/1",
  indexUrl: `${HISN_API_BASE}/husn_ar.json`,
};

type RawCategory = { ID: number; TITLE: string; TEXT: string };
type RawDhikr = { ID: number; ARABIC_TEXT: string; REPEAT?: number | string };

export type AdhkarCategory = { id: number; title: string; sourceUrl: string };
export type OnlineDhikr = { id: number; text: string; repeat: string };

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`ADHKAR_NETWORK_${response.status}`);
  const raw = (await response.text()).replace(/^\uFEFF/, "");
  return JSON.parse(raw) as T;
}

export async function getAdhkarCategories(): Promise<AdhkarCategory[]> {
  const payload = await fetchJson<Record<string, RawCategory[]>>(adhkarOnlineCitation.indexUrl);
  const categories = payload["العربية"] ?? [];
  return categories.map((item) => ({ id: item.ID, title: item.TITLE, sourceUrl: `${HISN_API_BASE}/${item.ID}.json` }));
}

export async function getAdhkarCategory(id: number): Promise<{ title: string; items: OnlineDhikr[] }> {
  if (!Number.isInteger(id) || id < 1) throw new Error("ADHKAR_CATEGORY_INVALID");
  const payload = await fetchJson<Record<string, RawDhikr[]>>(`${HISN_API_BASE}/${id}.json`);
  const [title, rawItems] = Object.entries(payload)[0] ?? [];
  if (!title || !Array.isArray(rawItems)) throw new Error("ADHKAR_SOURCE_UNAVAILABLE");
  return { title, items: rawItems.filter((item) => Boolean(item.ARABIC_TEXT)).map((item) => ({ id: item.ID, text: item.ARABIC_TEXT.trim(), repeat: String(item.REPEAT ?? "—") })) };
}
