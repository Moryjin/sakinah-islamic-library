export type DownloadValidationInput = {
  status: number;
  mimeType: string | null;
  bytes: number;
  allowedMimeTypes: readonly string[];
  minBytes: number;
  code: string;
};

export function normalizedMimeType(value: string | null | undefined) {
  return (value ?? "").split(";")[0].trim().toLowerCase();
}

export function assertValidDownload({ status, mimeType, bytes, allowedMimeTypes, minBytes, code }: DownloadValidationInput) {
  if (status < 200 || status >= 300) throw new Error(`${code}_HTTP_${status}`);
  if (bytes < minBytes) throw new Error(`${code}_TOO_SMALL`);
  const normalized = normalizedMimeType(mimeType);
  if (!allowedMimeTypes.some((type) => normalized === type || normalized.startsWith(`${type}/`))) throw new Error(`${code}_MIME_${normalized || "UNKNOWN"}`);
}

export function audioExtensionFor(url: string) {
  const pathname = url.split("?")[0].toLowerCase();
  const extension = ["mp3", "ogg", "wav", "m4a", "aac"].find((candidate) => pathname.endsWith(`.${candidate}`));
  return extension ?? "audio";
}

/** Generates a short deterministic filename so long remote URLs never exceed Android filename limits. */
export function storageFileName(prefix: string, sourceUrl: string, extension: string) {
  let hash = 2166136261;
  for (let index = 0; index < sourceUrl.length; index += 1) hash = Math.imul(hash ^ sourceUrl.charCodeAt(index), 16777619);
  return `${prefix}-${(hash >>> 0).toString(36)}.${extension}`;
}

function isStorageFailure(code: string) {
  return ["ENAMETOOLONG", "DESTINATIONALREADYEXISTS", "EACCES", "ENOENT", "CANNOT_CREATE", "FILE_SYSTEM"].some((fragment) => code.toUpperCase().includes(fragment));
}

export function readableAudioDownloadError(error: unknown) {
  const code = error instanceof Error ? error.message : "";
  if (isStorageFailure(code)) return "تعذر تجهيز مساحة الحفظ المحلية. حُذف الملف الجزئي؛ أعد المحاولة بعد التأكد من مساحة الهاتف.";
  if (code.includes("HTTP_429")) return "الخادم حدّ الطلبات مؤقتًا. انتظر قليلًا ثم أعد المحاولة أو اختر تلاوة أخرى.";
  if (code.includes("HTTP_")) return "رفض مصدر التلاوة التنزيل مؤقتًا. افتح صفحة المصدر أو حاول لاحقًا.";
  if (code.includes("MIME") || code.includes("TOO_SMALL")) return "وصلت استجابة غير صوتية أو ملف غير مكتمل، لذلك لم يُحفظ على الجهاز.";
  return "تعذر تنزيل التلاوة. تحقق من الاتصال ثم أعد المحاولة.";
}
