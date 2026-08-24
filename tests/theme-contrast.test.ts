import { describe, expect, it } from "vitest";

import themeConfig from "../theme.config";

function relativeLuminance(hex: string) {
  const channels = hex.slice(1).match(/.{2}/g)?.map((channel) => Number.parseInt(channel, 16) / 255) ?? [];
  const [red, green, blue] = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(first: string, second: string) {
  const [lighter, darker] = [relativeLuminance(first), relativeLuminance(second)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

describe("لوحة ألوان سَكينة", () => {
  it("تحافظ على تباين نصوص القراءة والأزرار في الوضعين", () => {
    for (const scheme of ["light", "dark"] as const) {
      const colors = themeConfig.themeColors;
      expect(contrast(colors.foreground[scheme], colors.background[scheme])).toBeGreaterThanOrEqual(7);
      expect(contrast(colors.foreground[scheme], colors.surface[scheme])).toBeGreaterThanOrEqual(7);
      expect(contrast(colors.muted[scheme], colors.background[scheme])).toBeGreaterThanOrEqual(4.5);
      expect(contrast(colors.onPrimary[scheme], colors.primary[scheme])).toBeGreaterThanOrEqual(4.5);
      expect(contrast(colors.onPrimaryMuted[scheme], colors.primary[scheme])).toBeGreaterThanOrEqual(4.5);
    }
  });
});

