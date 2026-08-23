import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

import type { RecitationMeta } from "@/data/sakinah-library";
import { trustedUrlOrNull } from "@/lib/security";

type AudioRecord = { uri: string; sourceUrl: string; downloadedAt: string };
const KEY = "sakinah.recitation-downloads.v1";
const directory = FileSystem.documentDirectory ? `${FileSystem.documentDirectory}sakinah-recitation/` : null;
const idFor = (url: string) => encodeURIComponent(url).replace(/%/g, "_");
async function all() { try { return JSON.parse((await AsyncStorage.getItem(KEY)) ?? "{}") as Record<string, AudioRecord>; } catch { return {}; } }

export async function getRecitationDownload(recording: RecitationMeta) {
  if (Platform.OS === "web") return null;
  const current = (await all())[idFor(recording.audioUrl)];
  if (!current || !(await FileSystem.getInfoAsync(current.uri)).exists) return null;
  return current;
}

export async function downloadRecitation(recording: RecitationMeta, onProgress?: (value: number) => void) {
  if (Platform.OS === "web") throw new Error("AUDIO_DOWNLOAD_NATIVE_ONLY");
  const source = trustedUrlOrNull(recording.audioUrl); if (!source || !directory) throw new Error("AUDIO_SOURCE_UNTRUSTED");
  await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
  const uri = `${directory}${idFor(source)}.audio`;
  const task = FileSystem.createDownloadResumable(source, uri, {}, (event) => { if (event.totalBytesExpectedToWrite > 0) onProgress?.(event.totalBytesWritten / event.totalBytesExpectedToWrite); });
  const result = await task.downloadAsync(); if (!result?.uri) throw new Error("AUDIO_DOWNLOAD_FAILED");
  const next = { ...(await all()), [idFor(recording.audioUrl)]: { uri: result.uri, sourceUrl: source, downloadedAt: new Date().toISOString() } }; await AsyncStorage.setItem(KEY, JSON.stringify(next)); return next[idFor(recording.audioUrl)];
}

export async function removeRecitationDownload(recording: RecitationMeta) {
  const current = await getRecitationDownload(recording); if (current) await FileSystem.deleteAsync(current.uri, { idempotent: true });
  const next = await all(); delete next[idFor(recording.audioUrl)]; await AsyncStorage.setItem(KEY, JSON.stringify(next));
}
