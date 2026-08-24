import * as FileSystem from "expo-file-system/legacy";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Platform } from "react-native";

import { type RecitationMeta, libraryItems } from "@/data/sakinah-library";
import { downloadRecitation, getRecitationDownload, removeRecitationDownload } from "@/lib/audio-downloads";
import { readableAudioDownloadError } from "@/lib/download-validation";
import { downloadHadithPack, getHadithPack, removeHadithPack, type HadithPackId } from "@/lib/hadith-packs";
import { downloadQuranPack, getQuranPack, removeQuranPack } from "@/lib/quran-pack";

export type DownloadId = "quran" | "bukhari" | "muslim" | `audio:${string}`;
export type DownloadState = "idle" | "downloading" | "completed" | "failed" | "cancelled";
export type DownloadItem = { id: DownloadId; title: string; subtitle: string; kind: "content" | "audio"; state: DownloadState; progress: number; bytes?: number; error?: string; recording?: RecitationMeta };

const DownloadManagerContext = createContext<ReturnType<typeof useDownloadManagerState> | null>(null);
const audioId = (recording: RecitationMeta) => `audio:${encodeURIComponent(recording.audioUrl).replace(/%/g, "_")}` as DownloadId;
const readablePackError = (error: unknown) => {
  const code = error instanceof Error ? error.message : "";
  if (code.includes("HTTP_429")) return "الخادم حدّ الطلبات مؤقتًا. أعد المحاولة بعد قليل.";
  if (code.includes("HTTP_")) return "رفض مصدر الحزمة التنزيل مؤقتًا.";
  if (code.includes("MIME") || code.includes("INVALID")) return "وصل ملف غير صالح، لذلك حذفه التطبيق تلقائيًا.";
  return "تعذر تنزيل الحزمة. تحقق من الاتصال ثم أعد المحاولة.";
};
const audioCatalog = Array.from(new Map(libraryItems.flatMap((item) => (item.recitations ?? []).map((recording) => [recording.audioUrl, recording] as const))).values());

function useDownloadManagerState() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const tasks = useRef<Partial<Record<DownloadId, FileSystem.DownloadResumable>>>({});
  const cancelled = useRef(new Set<DownloadId>());
  const setItem = useCallback((next: DownloadItem) => setItems((current) => [...current.filter((entry) => entry.id !== next.id), next]), []);

  const refresh = useCallback(async () => {
    if (Platform.OS === "web") { setItems([]); return; }
    const [quran, bukhari, muslim, ...audio] = await Promise.all([getQuranPack(), getHadithPack("bukhari"), getHadithPack("muslim"), ...audioCatalog.map((recording) => getRecitationDownload(recording))]);
    const completed: DownloadItem[] = [];
    if (quran) completed.push({ id: "quran", title: "المصحف كاملًا", subtitle: "قراءة السور دون اتصال", kind: "content", state: "completed", progress: 1, bytes: quran.bytes });
    if (bukhari) completed.push({ id: "bukhari", title: "صحيح البخاري", subtitle: "حزمة محلية كاملة", kind: "content", state: "completed", progress: 1, bytes: bukhari.bytes });
    if (muslim) completed.push({ id: "muslim", title: "صحيح مسلم", subtitle: "حزمة محلية كاملة", kind: "content", state: "completed", progress: 1, bytes: muslim.bytes });
    audio.forEach((saved, index) => { const recording = audioCatalog[index]; if (saved) completed.push({ id: audioId(recording), title: recording.title, subtitle: `تلاوة محفوظة · ${recording.reciter}`, kind: "audio", state: "completed", progress: 1, bytes: saved.bytes, recording }); });
    setItems((current) => [...current.filter((entry) => entry.state === "downloading"), ...completed]);
  }, []);

  useEffect(() => { refresh().catch(() => undefined); }, [refresh]);

  const startContent = useCallback(async (id: "quran" | HadithPackId) => {
    if (Platform.OS === "web" || tasks.current[id]) return;
    cancelled.current.delete(id);
    const title = id === "quran" ? "المصحف كاملًا" : id === "bukhari" ? "صحيح البخاري" : "صحيح مسلم";
    const subtitle = id === "quran" ? "حزمة للقراءة دون اتصال" : "حزمة محلية كاملة";
    setItem({ id, title, subtitle, kind: "content", state: "downloading", progress: 0 });
    const progress = (value: number) => setItems((current) => current.map((entry) => entry.id === id ? { ...entry, progress: Math.max(0, Math.min(1, value)) } : entry));
    try {
      const saved = id === "quran" ? await downloadQuranPack(progress, (task) => { tasks.current[id] = task; }) : await downloadHadithPack(id, progress, (task) => { tasks.current[id] = task; });
      setItem({ id, title, subtitle, kind: "content", state: "completed", progress: 1, bytes: saved.bytes });
    } catch (error) { setItem({ id, title, subtitle, kind: "content", state: cancelled.current.has(id) ? "cancelled" : "failed", progress: 0, error: cancelled.current.has(id) ? "أُلغي التنزيل وحُذف الملف الجزئي." : readablePackError(error) }); }
    finally { delete tasks.current[id]; cancelled.current.delete(id); }
  }, [setItem]);

  const startAudio = useCallback(async (recording: RecitationMeta) => {
    const id = audioId(recording); if (Platform.OS === "web" || tasks.current[id]) return;
    cancelled.current.delete(id); const subtitle = `تلاوة مرخّصة · ${recording.reciter}`;
    setItem({ id, title: recording.title, subtitle, kind: "audio", recording, state: "downloading", progress: 0 });
    const progress = (value: number) => setItems((current) => current.map((entry) => entry.id === id ? { ...entry, progress: Math.max(0, Math.min(1, value)) } : entry));
    try { const saved = await downloadRecitation(recording, progress, (task) => { tasks.current[id] = task; }); setItem({ id, title: recording.title, subtitle, kind: "audio", recording, state: "completed", progress: 1, bytes: saved.bytes }); }
    catch (error) { setItem({ id, title: recording.title, subtitle, kind: "audio", recording, state: cancelled.current.has(id) ? "cancelled" : "failed", progress: 0, error: cancelled.current.has(id) ? "أُلغي التنزيل وحُذف الملف الجزئي." : readableAudioDownloadError(error) }); }
    finally { delete tasks.current[id]; cancelled.current.delete(id); }
  }, [setItem]);

  const cancel = useCallback(async (id: DownloadId) => { const task = tasks.current[id]; if (!task) return; cancelled.current.add(id); await task.cancelAsync().catch(() => undefined); }, []);
  const remove = useCallback(async (item: DownloadItem) => { if (item.id === "quran") await removeQuranPack(); else if (item.id === "bukhari" || item.id === "muslim") await removeHadithPack(item.id); else if (item.recording) await removeRecitationDownload(item.recording); setItems((current) => current.filter((entry) => entry.id !== item.id)); }, []);
  const retry = useCallback((item: DownloadItem) => item.kind === "audio" && item.recording ? startAudio(item.recording) : startContent(item.id as "quran" | HadithPackId), [startAudio, startContent]);

  return useMemo(() => ({ items, audioCatalog, refresh, startContent, startAudio, cancel, remove, retry }), [items, refresh, startContent, startAudio, cancel, remove, retry]);
}

export function DownloadManagerProvider({ children }: { children: ReactNode }) { const state = useDownloadManagerState(); return <DownloadManagerContext.Provider value={state}>{children}</DownloadManagerContext.Provider>; }
export function useDownloadManager() { const context = useContext(DownloadManagerContext); if (!context) throw new Error("DOWNLOAD_MANAGER_PROVIDER_MISSING"); return context; }
