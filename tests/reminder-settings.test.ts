import { describe, expect, it } from "vitest";

import { defaultReminderSettings, formatReminderTime, moveReminderHour } from "../lib/reminder-utils";

describe("تذكيرات سَكينة", () => {
  it("تبدأ التذكيرات معطلة حتى يختار المستخدم تفعيلها", () => {
    expect(Object.values(defaultReminderSettings).every((setting) => setting.enabled === false)).toBe(true);
  });

  it("يعرض الوقت بصيغة ثابتة ويعيد الساعة ضمن نطاق اليوم", () => {
    expect(formatReminderTime(7, 5)).toBe("07:05");
    expect(moveReminderHour(23, 1)).toBe(0);
    expect(moveReminderHour(0, -1)).toBe(23);
  });
});
