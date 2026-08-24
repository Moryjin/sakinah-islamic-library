import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

import { assertValidDownload } from "@/lib/download-validation";
import { trustedUrlOrNull } from "@/lib/security";

const PACK_KEY = "sakinah.quran-pack.v1";
const sourceUrl = "https://api.alquran.cloud/v1/quran/quran-uthmani";
const destination = FileSystem.documentDirectory ? `${FileSystem.documentDirectory}sakinah-quran-uthmani.json` : null;
type PackRecord = { uri: string; bytes: number; downloadedAt: string; sourceUrl: string };

export async function getQuranPack(): Promise<PackRecord | null> {
  if (Platform.OS === "web") return null;
  try {
    const record = JSON.parse((await AsyncStorage.getItem(PACK_KEY)) ?? "null") as PackRecord | null;
    if (!record) return null;
    const info = await FileSystem.getInfoAsync(record.uri);
    return info.exists && !!info.size && info.size > 1024 ? record : null;
  } catch { return null; }
}

export async function readQuranPack<T>(): Promise<T | null> {
  const record = await getQuranPack();
  if (!record) return null;
  try { return JSON.parse(await FileSystem.readAsStringAsync(record.uri)) as T; } catch { return null; }
}

export async function downloadQuranPack(onProgress?: (ratio: number) => void, onTask?: (task: FileSystem.DownloadResumable) => void): Promise<PackRecord> {
  if (Platform.OS === "web") throw new Error("QURAN_PACKS_NATIVE_ONLY");
  const trustedSource = trustedUrlOrNull(sourceUrl);
  if (!trustedSource || !destination) throw new Error("QURAN_PACK_SOURCE_UNTRUSTED");
  await FileSystem.deleteAsync(destination, { idempotent: true });
  const task = FileSystem.createDownloadResumable(trustedSource, destination, { headers: { Accept: "application/json,text/plain;q=0.9,*/*;q=0.1" } }, (event) => {
    if (event.totalBytesExpectedToWrite > 0) onProgress?.(event.totalBytesWritten / event.totalBytesExpectedToWrite);
  });
  onTask?.(task);
  let result: FileSystem.FileSystemDownloadResult | undefined;
  try { result = await task.downloadAsync(); } catch (error) { await FileSystem.deleteAsync(destination, { idempotent: true }); throw error; }
  const info = result?.uri ? await FileSystem.getInfoAsync(result.uri) : null;
  try {
    if (!result?.uri || !info?.exists || !info.size) throw new Error("QURAN_PACK_DOWNLOAD_FAILED");
    assertValidDownload({ status: result.status, mimeType: result.mimeType, bytes: info.size, allowedMimeTypes: ["application/json", "text/json", "text/plain"], minBytes: 1024, code: "QURAN_PACK" });
    JSON.parse(await FileSystem.readAsStringAsync(result.uri));
  } catch (error) { if (result?.uri) await FileSystem.deleteAsync(result.uri, { idempotent: true }); throw error; }
  const record: PackRecord = { uri: result.uri, bytes: info.size, downloadedAt: new Date().toISOString(), sourceUrl: trustedSource };
  try { await AsyncStorage.setItem(PACK_KEY, JSON.stringify(record)); } catch (error) { await FileSystem.deleteAsync(result.uri, { idempotent: true }); throw error; }
  return record;
}

export async function removeQuranPack() {
  const record = await getQuranPack();
  if (record) await FileSystem.deleteAsync(record.uri, { idempotent: true });
  await AsyncStorage.removeItem(PACK_KEY);
}
