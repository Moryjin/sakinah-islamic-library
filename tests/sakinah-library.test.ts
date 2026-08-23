import { describe, expect, it } from "vitest";

import { allowedSourceHosts, hasCompleteCitation, libraryItems, sectionMeta, sourceDirectory, verifiedLibraryItems } from "../data/sakinah-library";

describe("بيانات مكتبة سَكينة", () => {
  it("تتضمن الأبواب المستقلة التي يقوم عليها التطبيق", () => {
    expect(Object.keys(sectionMeta)).toEqual(expect.arrayContaining(["quran", "qiraat", "tafsir", "bukhari", "muslim", "adhkar", "daily-ward", "bidaya", "ibn-taymiyyah", "nawawi", "ibn-baz", "fatwa", "hanafi", "maliki", "shafii", "hanbali", "tawhid"]));
  });

  it("لا يسمح بعرض أي مادة لا تحقق بطاقة التوثيق الإلزامية", () => {
    expect(verifiedLibraryItems).toHaveLength(libraryItems.length);
    for (const item of libraryItems) expect(hasCompleteCitation(item)).toBe(true);
  });

  it("يكمل كل حديث ظاهر السند والمصدر والتخريج والدرجة", () => {
    const hadithItems = libraryItems.filter((item) => item.hadith);
    expect(hadithItems.length).toBeGreaterThan(0);
    for (const item of hadithItems) {
      expect(item.hadith?.isnad.trim()).not.toBe("");
      expect(item.hadith?.grade.trim()).not.toBe("");
      expect(item.hadith?.takhrij.trim()).not.toBe("");
      expect(item.hadith?.isnadUrl).toMatch(/^https:\/\//);
    }
  });

  it("يحصر قائمة المصادر في نطاقات مسموحة وصريحة", () => {
    const domains = sourceDirectory.map((source) => new URL(source.url).hostname);
    expect(domains).toEqual(expect.arrayContaining(["qurancomplex.gov.sa", "quran.ksu.edu.sa", "dorar.net", "shamela.ws", "binbaz.org.sa"]));
    for (const item of libraryItems) expect(allowedSourceHosts).toContain(new URL(item.source.url).hostname);
  });

  it("لا يقبل التلاوة إلا مع المصدر والترخيص والرابط الصوتي", () => {
    const recordings = libraryItems.flatMap((item) => item.recitations ?? []);
    expect(recordings.length).toBeGreaterThan(0);
    for (const recording of recordings) {
      expect(recording.license.trim()).not.toBe("");
      expect(recording.sourcePage).toMatch(/^https:\/\//);
      expect(recording.audioUrl).toMatch(/^https:\/\//);
      expect(recording.licenseUrl).toMatch(/^https:\/\//);
    }
  });
});
