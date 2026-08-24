import { describe, expect, it } from "vitest";

import { assertValidDownload, audioExtensionFor, readableAudioDownloadError } from "../lib/download-validation";

describe("download validation", () => {
  it("يرفض استجابات الخطأ والملفات الصغيرة أو غير الصوتية", () => {
    expect(() => assertValidDownload({ status: 429, mimeType: "text/html", bytes: 2254, allowedMimeTypes: ["audio"], minBytes: 8192, code: "AUDIO_DOWNLOAD" })).toThrow("AUDIO_DOWNLOAD_HTTP_429");
    expect(() => assertValidDownload({ status: 200, mimeType: "text/html", bytes: 2254, allowedMimeTypes: ["audio"], minBytes: 8192, code: "AUDIO_DOWNLOAD" })).toThrow("AUDIO_DOWNLOAD_TOO_SMALL");
  });

  it("يتعرف على امتداد الصوت ويعطي رسالة قابلة للفهم لحد الطلبات", () => {
    expect(audioExtensionFor("https://host/file.wav?x=1")).toBe("wav");
    expect(readableAudioDownloadError(new Error("AUDIO_DOWNLOAD_HTTP_429"))).toContain("حدّ الطلبات");
  });
});
