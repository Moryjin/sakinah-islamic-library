export type ReminderId = "morning" | "evening" | "salawat" | "dailyWard";
export type ReminderSettings = Record<ReminderId, { enabled: boolean; hour: number; minute: number }>;

export const defaultReminderSettings: ReminderSettings = {
  morning: { enabled: false, hour: 7, minute: 0 },
  evening: { enabled: false, hour: 17, minute: 0 },
  salawat: { enabled: false, hour: 21, minute: 0 },
  dailyWard: { enabled: false, hour: 20, minute: 0 },
};

export function formatReminderTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function moveReminderHour(hour: number, offset: number) {
  return (hour + offset + 24) % 24;
}
