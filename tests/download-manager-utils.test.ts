import { describe, expect, it } from "vitest";

import { PROGRESS_UPDATE_INTERVAL_MS, shouldPublishProgress } from "../lib/download-manager-utils";

describe("خنق تقدم التنزيل", () => {
  it("ينشر أول وآخر تحديث فورًا ويحد التحديثات المتتابعة", () => {
    expect(shouldPublishProgress(undefined, 1_000, 0.01)).toBe(true);
    expect(shouldPublishProgress(1_000, 1_000 + PROGRESS_UPDATE_INTERVAL_MS - 1, 0.4)).toBe(false);
    expect(shouldPublishProgress(1_000, 1_000 + PROGRESS_UPDATE_INTERVAL_MS, 0.4)).toBe(true);
    expect(shouldPublishProgress(1_000, 1_001, 1)).toBe(true);
  });
});
