import { describe, expect, it } from "vitest";
import { hadithBookmarkId, quranBookmarkId } from "../lib/bookmark-utils";

describe("مفاتيح العلامات المرجعية", () => {
  it("ينشئ مفتاحًا فريدًا لكل آية", () => expect(quranBookmarkId(2, 255)).toBe("quran:2:255"));
  it("يفصل علامة البخاري عن مسلم حتى مع تطابق الأرقام", () => expect(hadithBookmarkId("bukhari", 1, 1)).not.toBe(hadithBookmarkId("muslim", 1, 1)));
});
