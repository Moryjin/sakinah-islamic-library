export const PROGRESS_UPDATE_INTERVAL_MS = 120;

/** يمنع إعادة الرسم المفرطة مع إبقاء أول وآخر تقدم ظاهرين فورًا. */
export function shouldPublishProgress(previousAt: number | undefined, now: number, progress: number) {
  return progress >= 1 || previousAt === undefined || now - previousAt >= PROGRESS_UPDATE_INTERVAL_MS;
}
