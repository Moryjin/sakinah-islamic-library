import { describe, expect, it } from "vitest";

import { assertValidDownload, audioExtensionFor, readableAudioDownloadError, storageFileName } from "../lib/download-validation";

describe("download validation", () => {
  it("يرفض استجابات الخطأ والملفات الصغيرة أو غير الصوتية", () => {
    expect(() => assertValidDownload({ status: 429, mimeType: "text/html", bytes: 2254, allowedMimeTypes: ["audio"], minBytes: 8192, code: "AUDIO_DOWNLOAD" })).toThrow("AUDIO_DOWNLOAD_HTTP_429");
    expect(() => assertValidDownload({ status: 200, mimeType: "text/html", bytes: 2254, allowedMimeTypes: ["audio"], minBytes: 8192, code: "AUDIO_DOWNLOAD" })).toThrow("AUDIO_DOWNLOAD_TOO_SMALL");
  });

  it("يتعرف على امتداد الصوت ويعطي رسالة قابلة للفهم لحد الطلبات", () => {
    expect(audioExtensionFor("https://host/file.wav?x=1")).toBe("wav");
    expect(readableAudioDownloadError(new Error("AUDIO_DOWNLOAD_HTTP_429"))).toContain("حدّ الطلبات");
  });

  it("ينتج اسم تخزين قصيرًا ثابتًا لروابط التلاوات الطويلة ويشرح فشل مساحة الحفظ", () => {
    const longUrl = `https://upload.wikimedia.org/${"very-long-path/".repeat(40)}recitation.ogg`;
    expect(storageFileName("recitation", longUrl, "ogg")).toMatch(/^recitation-[a-z0-9]+\.ogg$/);
    expect(storageFileName("recitation", longUrl, "ogg").length).toBeLessThan(64);
    expect(readableAudioDownloadError(new Error("ENAMETOOLONG"))).toContain("مساحة الحفظ");
  });
});
