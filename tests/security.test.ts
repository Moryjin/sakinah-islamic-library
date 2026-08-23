import { describe, expect, it } from "vitest";

import { isTrustedHttpsUrl, trustedUrlOrNull } from "../lib/security";

describe("حواجز أمان روابط سَكينة", () => {
  it("يقبل روابط HTTPS للمصادر المعتمدة والترخيص فقط", () => {
    expect(isTrustedHttpsUrl("https://commons.wikimedia.org/wiki/File:AlF%C4%81tihatulKit%C4%81b.ogg")).toBe(true);
    expect(isTrustedHttpsUrl("https://creativecommons.org/publicdomain/zero/1.0/")).toBe(true);
  });

  it("يرفض النطاقات غير المعتمدة والبروتوكولات غير الآمنة", () => {
    expect(isTrustedHttpsUrl("http://commons.wikimedia.org/wiki/File:test.ogg")).toBe(false);
    expect(isTrustedHttpsUrl("https://example.com/file.ogg")).toBe(false);
    expect(trustedUrlOrNull("javascript:alert(1)")).toBeNull();
  });
});
