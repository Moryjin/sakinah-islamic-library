import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

import type { RecitationMeta } from "@/data/sakinah-library";
import { assertValidDownload, audioExtensionFor, storageFileName } from "@/lib/download-validation";
import { trustedUrlOrNull } from "@/lib/security";

type AudioRecord = { uri: string; sourceUrl: string; downloadedAt: string; bytes: number; mimeType: string | null };
const KEY = "sakinah.recitation-downloads.v1";
const directory = FileSystem.documentDirectory ? `${FileSystem.documentDirectory}sakinah-recitation/` : null;
const idFor = (url: string) => encodeURIComponent(url).replace(/%/g, "_");
const MIN_AUDIO_BYTES = 8 * 1024;
async function all() { try { return JSON.parse((await AsyncStorage.getItem(KEY)) ?? "{}") as Record<string, AudioRecord>; } catch { return {}; } }
async function forget(id: string) { const next = await all(); delete next[id]; await AsyncStorage.setItem(KEY, JSON.stringify(next)); }

export async function getRecitationDownload(recording: RecitationMeta) {
  if (Platform.OS === "web") return null;
  const id = idFor(recording.audioUrl); const current = (await all())[id];
  if (!current) return null;
  const info = await FileSystem.getInfoAsync(current.uri);
  if (!info.exists || !info.size || info.size < MIN_AUDIO_BYTES || current.uri.endsWith(".audio")) { if (info.exists) await FileSystem.deleteAsync(current.uri, { idempotent: true }); await forget(id); return null; }
  return current;
}

export async function downloadRecitation(recording: RecitationMeta, onProgress?: (value: number) => void, onTask?: (task: FileSystem.DownloadResumable) => void) {
  if (Platform.OS === "web") throw new Error("AUDIO_DOWNLOAD_NATIVE_ONLY");
  const source = trustedUrlOrNull(recording.audioUrl); if (!source || !directory) throw new Error("AUDIO_SOURCE_UNTRUSTED");
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  const id = idFor(recording.audioUrl); const uri = `${directory}${storageFileName("recitation", source, audioExtensionFor(source))}`;
  await FileSystem.deleteAsync(uri, { idempotent: true });
  const task = FileSystem.createDownloadResumable(source, uri, { headers: { Accept: "audio/*,application/ogg;q=0.9,*/*;q=0.1" } }, (event) => { if (event.totalBytesExpectedToWrite > 0) onProgress?.(event.totalBytesWritten / event.totalBytesExpectedToWrite); });
  onTask?.(task);
  let result: FileSystem.FileSystemDownloadResult | undefined;
  try { result = await task.downloadAsync(); } catch (error) { await FileSystem.deleteAsync(uri, { idempotent: true }); await forget(id); throw error; }
  const info = result?.uri ? await FileSystem.getInfoAsync(result.uri) : null;
  try {
    if (!result?.uri || !info?.exists || !info.size) throw new Error("AUDIO_DOWNLOAD_FAILED");
    assertValidDownload({ status: result.status, mimeType: result.mimeType, bytes: info.size, allowedMimeTypes: ["audio", "application/ogg"], minBytes: MIN_AUDIO_BYTES, code: "AUDIO_DOWNLOAD" });
  } catch (error) { if (result?.uri) await FileSystem.deleteAsync(result.uri, { idempotent: true }); await forget(id); throw error; }
  const record: AudioRecord = { uri: result.uri, sourceUrl: source, downloadedAt: new Date().toISOString(), bytes: info.size, mimeType: result.mimeType };
  try { await AsyncStorage.setItem(KEY, JSON.stringify({ ...(await all()), [id]: record })); } catch (error) { await FileSystem.deleteAsync(result.uri, { idempotent: true }); throw error; }
  return record;
}

export async function removeRecitationDownload(recording: RecitationMeta) {
  const current = await getRecitationDownload(recording); if (current) await FileSystem.deleteAsync(current.uri, { idempotent: true });
  await forget(idFor(recording.audioUrl));
}
