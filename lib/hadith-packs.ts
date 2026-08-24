import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

import { assertValidDownload } from "@/lib/download-validation";
import { trustedUrlOrNull } from "@/lib/security";

export type HadithPackId = "bukhari" | "muslim";
type PackRecord = { id: HadithPackId; uri: string; bytes: number; downloadedAt: string; sourceUrl: string };

const PACKS_KEY = "sakinah.hadith-packs.v1";
const packDirectory = FileSystem.documentDirectory ? `${FileSystem.documentDirectory}sakinah-hadith/` : null;

export const hadithPackCatalog: Record<HadithPackId, { title: string; sourceUrl: string }> = {
  bukhari: { title: "صحيح البخاري", sourceUrl: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-bukhari.json" },
  muslim: { title: "صحيح مسلم", sourceUrl: "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-muslim.json" },
};

async function records(): Promise<Partial<Record<HadithPackId, PackRecord>>> {
  try { return JSON.parse((await AsyncStorage.getItem(PACKS_KEY)) ?? "{}"); } catch { return {}; }
}

async function saveRecords(next: Partial<Record<HadithPackId, PackRecord>>) {
  await AsyncStorage.setItem(PACKS_KEY, JSON.stringify(next));
}

function destination(id: HadithPackId) {
  if (!packDirectory) throw new Error("PACK_STORAGE_UNAVAILABLE");
  return `${packDirectory}${id}.json`;
}

export async function getHadithPack(id: HadithPackId): Promise<PackRecord | null> {
  if (Platform.OS === "web") return null;
  const record = (await records())[id];
  if (!record) return null;
  const info = await FileSystem.getInfoAsync(record.uri);
  return info.exists && !!info.size && info.size > 1024 ? record : null;
}

export async function readHadithPack<T>(id: HadithPackId): Promise<T | null> {
  const record = await getHadithPack(id);
  if (!record) return null;
  try { return JSON.parse(await FileSystem.readAsStringAsync(record.uri)) as T; } catch { return null; }
}

export async function downloadHadithPack(id: HadithPackId, onProgress?: (ratio: number) => void, onTask?: (task: FileSystem.DownloadResumable) => void): Promise<PackRecord> {
  if (Platform.OS === "web") throw new Error("PACKS_NATIVE_ONLY");
  const source = trustedUrlOrNull(hadithPackCatalog[id].sourceUrl);
  if (!source) throw new Error("PACK_SOURCE_UNTRUSTED");
  if (!packDirectory) throw new Error("PACK_STORAGE_UNAVAILABLE");
  await FileSystem.makeDirectoryAsync(packDirectory, { intermediates: true });
  const uri = destination(id);
  await FileSystem.deleteAsync(uri, { idempotent: true });
  const task = FileSystem.createDownloadResumable(source, uri, { headers: { Accept: "application/json,text/plain;q=0.9,*/*;q=0.1" } }, (event) => {
    if (event.totalBytesExpectedToWrite > 0) onProgress?.(event.totalBytesWritten / event.totalBytesExpectedToWrite);
  });
  onTask?.(task);
  let result: FileSystem.FileSystemDownloadResult | undefined;
  try { result = await task.downloadAsync(); } catch (error) { await FileSystem.deleteAsync(uri, { idempotent: true }); throw error; }
  const info = result?.uri ? await FileSystem.getInfoAsync(result.uri) : null;
  try {
    if (!result?.uri || !info?.exists || !info.size) throw new Error("PACK_DOWNLOAD_FAILED");
    assertValidDownload({ status: result.status, mimeType: result.mimeType, bytes: info.size, allowedMimeTypes: ["application/json", "text/json", "text/plain"], minBytes: 1024, code: "HADITH_PACK" });
    JSON.parse(await FileSystem.readAsStringAsync(result.uri));
  } catch (error) { if (result?.uri) await FileSystem.deleteAsync(result.uri, { idempotent: true }); throw error; }
  const record: PackRecord = { id, uri: result.uri, bytes: info.size, downloadedAt: new Date().toISOString(), sourceUrl: source };
  try { await saveRecords({ ...(await records()), [id]: record }); } catch (error) { await FileSystem.deleteAsync(result.uri, { idempotent: true }); throw error; }
  return record;
}

export async function removeHadithPack(id: HadithPackId) {
  const current = await getHadithPack(id);
  if (current) await FileSystem.deleteAsync(current.uri, { idempotent: true });
  const next = await records();
  delete next[id];
  await saveRecords(next);
}
