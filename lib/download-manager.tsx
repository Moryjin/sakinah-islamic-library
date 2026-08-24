import * as FileSystem from "expo-file-system/legacy";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Platform } from "react-native";

import { type RecitationMeta, libraryItems } from "@/data/sakinah-library";
import { downloadRecitation, getRecitationDownload, removeRecitationDownload } from "@/lib/audio-downloads";
import { readableAudioDownloadError } from "@/lib/download-validation";
import { shouldPublishProgress } from "@/lib/download-manager-utils";
import { downloadHadithPack, getHadithPack, removeHadithPack, type HadithPackId } from "@/lib/hadith-packs";
import { downloadQuranPack, getQuranPack, removeQuranPack } from "@/lib/quran-pack";

export type DownloadId = "quran" | "bukhari" | "muslim" | `audio:${string}`;
export type DownloadState = "idle" | "downloading" | "completed" | "failed" | "cancelled";
export type DownloadItem = { id: DownloadId; title: string; subtitle: string; kind: "content" | "audio"; state: DownloadState; progress: number; bytes?: number; error?: string; recording?: RecitationMeta };
type ContentId = "quran" | HadithPackId;
type TaskScope = { attachTask: (task: FileSystem.DownloadResumable) => void; ownsAttempt: () => boolean; publish: (value: number) => void; finish: () => void };

const DownloadManagerContext = createContext<ReturnType<typeof useDownloadManagerState> | null>(null);
const audioId = (recording: RecitationMeta) => `audio:${encodeURIComponent(recording.audioUrl).replace(/%/g, "_")}` as DownloadId;
const contentDetails: Record<ContentId, Pick<DownloadItem, "title" | "subtitle">> = {
  quran: { title: "المصحف كاملًا", subtitle: "حزمة للقراءة دون اتصال" },
  bukhari: { title: "صحيح البخاري", subtitle: "حزمة محلية كاملة" },
  muslim: { title: "صحيح مسلم", subtitle: "حزمة محلية كاملة" },
};
const contentItem = (id: ContentId, state: DownloadState, details: Partial<DownloadItem> = {}): DownloadItem => ({ id, kind: "content", progress: state === "completed" ? 1 : 0, ...contentDetails[id], ...details, state });
const readablePackError = (error: unknown) => {
  const code = error instanceof Error ? error.message : "";
  if (["ENAMETOOLONG", "DESTINATIONALREADYEXISTS", "EACCES", "ENOENT", "CANNOT_CREATE", "FILE_SYSTEM"].some((fragment) => code.toUpperCase().includes(fragment))) return "تعذر تجهيز مساحة الحفظ المحلية. حُذف الملف الجزئي؛ أعد المحاولة بعد التأكد من مساحة الهاتف.";
  if (code.includes("HTTP_429")) return "الخادم حدّ الطلبات مؤقتًا. أعد المحاولة بعد قليل.";
  if (code.includes("HTTP_")) return "رفض مصدر الحزمة التنزيل مؤقتًا.";
  if (code.includes("MIME") || code.includes("INVALID")) return "وصل ملف غير صالح، لذلك حذفه التطبيق تلقائيًا.";
  return "تعذر تنزيل الحزمة. تحقق من الاتصال ثم أعد المحاولة.";
};
const audioCatalog = Array.from(new Map(libraryItems.flatMap((item) => (item.recitations ?? []).map((recording) => [recording.audioUrl, recording] as const))).values());

function useDownloadManagerState() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const tasks = useRef<Partial<Record<DownloadId, FileSystem.DownloadResumable>>>({});
  const attempts = useRef<Partial<Record<DownloadId, symbol>>>({});
  const cancelled = useRef(new Set<DownloadId>());
  const mounted = useRef(true);
  const progressTimestamps = useRef<Partial<Record<DownloadId, number>>>({});
  const safelySetItems = useCallback((updater: (current: DownloadItem[]) => DownloadItem[]) => { if (mounted.current) setItems(updater); }, []);
  const setItem = useCallback((next: DownloadItem) => safelySetItems((current) => [...current.filter((entry) => entry.id !== next.id), next]), [safelySetItems]);
  const publishProgress = useCallback((id: DownloadId, value: number) => {
    const now = Date.now();
    if (!mounted.current || !shouldPublishProgress(progressTimestamps.current[id], now, value)) return;
    progressTimestamps.current[id] = now;
    safelySetItems((current) => current.map((entry) => entry.id === id ? { ...entry, progress: Math.max(0, Math.min(1, value)) } : entry));
  }, [safelySetItems]);
  const createTaskScope = useCallback((id: DownloadId): TaskScope => {
    const attempt = Symbol(id);
    let task: FileSystem.DownloadResumable | undefined;
    attempts.current[id] = attempt;
    const ownsAttempt = () => mounted.current && attempts.current[id] === attempt;
    return {
      attachTask: (nextTask) => {
        task = nextTask;
        if (ownsAttempt()) tasks.current[id] = nextTask;
        else void nextTask.cancelAsync().catch(() => undefined);
      },
      ownsAttempt,
      publish: (value) => { if (ownsAttempt()) publishProgress(id, value); },
      finish: () => {
        if (attempts.current[id] !== attempt) return;
        delete attempts.current[id];
        if (tasks.current[id] === task) delete tasks.current[id];
        cancelled.current.delete(id);
        delete progressTimestamps.current[id];
      },
    };
  }, [publishProgress]);

  const refresh = useCallback(async (isActive: () => boolean = () => mounted.current) => {
    if (Platform.OS === "web") { if (isActive()) safelySetItems(() => []); return; }
    const [quran, bukhari, muslim, ...audio] = await Promise.all([getQuranPack(), getHadithPack("bukhari"), getHadithPack("muslim"), ...audioCatalog.map((recording) => getRecitationDownload(recording))]);
    const completed: DownloadItem[] = [];
    if (quran) completed.push({ id: "quran", title: "المصحف كاملًا", subtitle: "قراءة السور دون اتصال", kind: "content", state: "completed", progress: 1, bytes: quran.bytes });
    if (bukhari) completed.push({ id: "bukhari", title: "صحيح البخاري", subtitle: "حزمة محلية كاملة", kind: "content", state: "completed", progress: 1, bytes: bukhari.bytes });
    if (muslim) completed.push({ id: "muslim", title: "صحيح مسلم", subtitle: "حزمة محلية كاملة", kind: "content", state: "completed", progress: 1, bytes: muslim.bytes });
    audio.forEach((saved, index) => { const recording = audioCatalog[index]; if (saved) completed.push({ id: audioId(recording), title: recording.title, subtitle: `تلاوة محفوظة · ${recording.reciter}`, kind: "audio", state: "completed", progress: 1, bytes: saved.bytes, recording }); });
    if (isActive()) safelySetItems((current) => [...current.filter((entry) => entry.state === "downloading"), ...completed]);
  }, [safelySetItems]);

  useEffect(() => {
    let active = true;
    mounted.current = true;
    refresh(() => active).catch(() => undefined);
    return () => {
      active = false;
      mounted.current = false;
      const activeTasks = Object.values(tasks.current);
      tasks.current = {};
      attempts.current = {};
      progressTimestamps.current = {};
      activeTasks.forEach((task) => { void task?.cancelAsync().catch(() => undefined); });
    };
  }, [refresh]);

  const startContent = useCallback(async (id: ContentId) => {
    if (Platform.OS === "web" || attempts.current[id]) return;
    cancelled.current.delete(id);
    setItem(contentItem(id, "downloading"));
    const scope = createTaskScope(id);
    try {
      const saved = id === "quran" ? await downloadQuranPack(scope.publish, scope.attachTask) : await downloadHadithPack(id, scope.publish, scope.attachTask);
      if (scope.ownsAttempt()) setItem(contentItem(id, "completed", { bytes: saved.bytes }));
    } catch (error) {
      if (scope.ownsAttempt()) setItem(contentItem(id, cancelled.current.has(id) ? "cancelled" : "failed", { error: cancelled.current.has(id) ? "أُلغي التنزيل وحُذف الملف الجزئي." : readablePackError(error) }));
    } finally { scope.finish(); }
  }, [createTaskScope, setItem]);

  const startAudio = useCallback(async (recording: RecitationMeta) => {
    const id = audioId(recording); if (Platform.OS === "web" || attempts.current[id]) return;
    cancelled.current.delete(id); const subtitle = `تلاوة مرخّصة · ${recording.reciter}`;
    setItem({ id, title: recording.title, subtitle, kind: "audio", recording, state: "downloading", progress: 0 });
    const scope = createTaskScope(id);
    try { const saved = await downloadRecitation(recording, scope.publish, scope.attachTask); if (scope.ownsAttempt()) setItem({ id, title: recording.title, subtitle, kind: "audio", recording, state: "completed", progress: 1, bytes: saved.bytes }); }
    catch (error) { if (scope.ownsAttempt()) setItem({ id, title: recording.title, subtitle, kind: "audio", recording, state: cancelled.current.has(id) ? "cancelled" : "failed", progress: 0, error: cancelled.current.has(id) ? "أُلغي التنزيل وحُذف الملف الجزئي." : readableAudioDownloadError(error) }); }
    finally { scope.finish(); }
  }, [createTaskScope, setItem]);

  const cancel = useCallback(async (id: DownloadId) => { const task = tasks.current[id]; if (!task) return; cancelled.current.add(id); await task.cancelAsync().catch(() => undefined); }, []);
  const remove = useCallback(async (item: DownloadItem) => { if (item.id === "quran") await removeQuranPack(); else if (item.id === "bukhari" || item.id === "muslim") await removeHadithPack(item.id); else if (item.recording) await removeRecitationDownload(item.recording); safelySetItems((current) => current.filter((entry) => entry.id !== item.id)); }, [safelySetItems]);
  const retry = useCallback((item: DownloadItem) => item.kind === "audio" && item.recording ? startAudio(item.recording) : startContent(item.id as ContentId), [startAudio, startContent]);

  return useMemo(() => ({ items, audioCatalog, refresh, startContent, startAudio, cancel, remove, retry }), [items, refresh, startContent, startAudio, cancel, remove, retry]);
}

export function DownloadManagerProvider({ children }: { children: ReactNode }) { const state = useDownloadManagerState(); return <DownloadManagerContext.Provider value={state}>{children}</DownloadManagerContext.Provider>; }
export function useDownloadManager() { const context = useContext(DownloadManagerContext); if (!context) throw new Error("DOWNLOAD_MANAGER_PROVIDER_MISSING"); return context; }
