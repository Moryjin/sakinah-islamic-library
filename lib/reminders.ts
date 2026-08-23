import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { type ReminderId, type ReminderSettings } from "@/lib/reminder-utils";

export { defaultReminderSettings, formatReminderTime, moveReminderHour, type ReminderId, type ReminderSettings } from "@/lib/reminder-utils";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

const reminderContent: Record<ReminderId, { title: string; body: string; itemId: string }> = {
  morning: { title: "أذكار الصباح", body: "وردك الموثق جاهز. افتح البطاقة لعرض المصدر والسند والدرجة.", itemId: "dhikr-subhanallah" },
  evening: { title: "أذكار المساء", body: "وردك الموثق جاهز. افتح البطاقة لعرض المصدر والسند والدرجة.", itemId: "dhikr-sayyid-istighfar" },
  salawat: { title: "الصلاة على النبي ﷺ", body: "تذكير اختياري موثق. افتح البطاقة لعرض السند والتخريج والدرجة.", itemId: "dhikr-salawat" },
  dailyWard: { title: "ورد القرآن اليومي", body: "وردك القرآني الموثق بانتظارك.", itemId: "daily-ward-ikhlas" },
};

async function ensurePermission() {
  if (Platform.OS === "web") return "unsupported" as const;
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("sakinah-reminders", {
      name: "تذكيرات سَكينة",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 180],
      lightColor: "#0F5B4C",
    });
  }
  const existing = await Notifications.getPermissionsAsync();
  if (existing.status === "granted") return "granted" as const;
  const requested = await Notifications.requestPermissionsAsync();
  return requested.status === "granted" ? ("granted" as const) : ("denied" as const);
}

export async function syncLocalReminders(settings: ReminderSettings) {
  const permission = await ensurePermission();
  if (permission !== "granted") return permission;

  await Notifications.cancelAllScheduledNotificationsAsync();
  await Promise.all(
    (Object.keys(settings) as ReminderId[])
      .filter((id) => settings[id].enabled)
      .map((id) => {
        const setting = settings[id];
        const content = reminderContent[id];
        return Notifications.scheduleNotificationAsync({
          content: {
            title: content.title,
            body: content.body,
            data: { url: `/reader/${content.itemId}`, reminderId: id },
            color: "#0F5B4C",
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: setting.hour,
            minute: setting.minute,
            channelId: "sakinah-reminders",
          },
        });
      }),
  );
  return "granted" as const;
}
