import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { RTL_DIRECTION, RTL_LANGUAGE_TAG, RTL_ROW_DIRECTION, RTL_TEXT_ALIGN } from "../lib/rtl-policy";

describe("سياسة RTL في سَكينة", () => {
  it("تثبت القيم المعيارية للغة والاتجاه والمحاذاة", () => {
    expect(RTL_LANGUAGE_TAG).toBe("ar");
    expect(RTL_DIRECTION).toBe("rtl");
    expect(RTL_TEXT_ALIGN).toBe("right");
    expect(RTL_ROW_DIRECTION).toBe("row-reverse");
  });

  it("يفرض RTL من نواة التطبيق وحاوية الشاشة ونمط الويب", () => {
    const root = readFileSync("app/_layout.tsx", "utf8");
    const container = readFileSync("components/screen-container.tsx", "utf8");
    const css = readFileSync("global.css", "utf8");
    expect(root).not.toContain("forceRTL(");
    expect(root).not.toContain("direction: RTL_DIRECTION");
    expect(root).toContain("accessibilityLanguage={RTL_LANGUAGE_TAG}");
    expect(container).toContain("style={[rtlRoot, style]}");
    expect(css).toContain("direction: rtl");
  });
});
