import { describe, expect, it } from "vitest";

import { collectionMeta, libraryItems, sourceDirectory } from "../data/sakinah-library";

describe("بيانات مكتبة سَكينة", () => {
  it("تغطي الأقسام الإسلامية الأربعة المطلوبة", () => {
    expect(Object.keys(collectionMeta).sort()).toEqual(["bidaya", "bukhari", "muslim", "quran"]);
    expect(new Set(libraryItems.map((item) => item.kind))).toEqual(new Set(["quran", "bukhari", "muslim", "bidaya"]));
  });

  it("يربط كل نص بمرجع ورابط آمن قابل للرجوع", () => {
    for (const item of libraryItems) {
      expect(item.source.label.trim()).not.toBe("");
      expect(item.source.reference.trim()).not.toBe("");
      expect(item.source.site.trim()).not.toBe("");
      expect(item.source.url).toMatch(/^https:\/\//);
    }
  });

  it("يحصر قائمة المصادر الموثوقة في نطاقات مرجعية صريحة", () => {
    const domains = sourceDirectory.map((source) => new URL(source.url).hostname);
    expect(domains).toEqual(expect.arrayContaining(["qurancomplex.gov.sa", "quran.ksu.edu.sa", "dorar.net", "shamela.ws"]));
  });
});
