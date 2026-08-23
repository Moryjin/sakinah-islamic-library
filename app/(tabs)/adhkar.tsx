import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useMemo, useState } from "react";
import { type Href, useRouter } from "expo-router";
import { Alert, FlatList, Platform, Pressable, Switch, Text, View } from "react-native";

import { MotionIn } from "@/components/motion-in";
import { AppHeader, LibraryItemCard, SectionTitle } from "@/components/sakinah-ui";
import { verifiedLibraryItems } from "@/data/sakinah-library";
import { syncLocalReminders } from "@/lib/reminders";
import { defaultReminderSettings, formatReminderTime, moveReminderHour, type ReminderId, type ReminderSettings } from "@/lib/reminder-utils";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";

const STORAGE_KEY = "sakinah-reminder-settings";
const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };
const reminderRows: { id: ReminderId; title: string; subtitle: string; icon: keyof typeof MaterialIcons.glyphMap }[] = [
  { id: "morning", title: "أذكار الصباح", subtitle: "بعد الفجر أو في الوقت الذي تختاره", icon: "wb-sunny" },
  { id: "evening", title: "أذكار المساء", subtitle: "قبل الغروب أو في الوقت الذي تختاره", icon: "nights-stay" },
  { id: "salawat", title: "الصلاة على النبي ﷺ", subtitle: "تذكير اختياري موثق", icon: "favorite-border" },
  { id: "dailyWard", title: "ورد القرآن اليومي", subtitle: "ورد قصير موثق يمكن تعديله لاحقًا", icon: "event-available" },
];
const categories = [
  { title: "الصباح والمساء", icon: "wb-sunny" as const },
  { title: "ما بعد الصلاة", icon: "mosque" as const },
  { title: "النوم والاستيقاظ", icon: "bedtime" as const },
  { title: "المنزل والمسجد", icon: "home" as const },
  { title: "السفر", icon: "luggage" as const },
  { title: "الطعام", icon: "restaurant" as const },
  { title: "الكرب والمرض", icon: "healing" as const },
  { title: "الاستغفار", icon: "refresh" as const },
];

export default function AdhkarScreen() {
  const colors = useColors();
  const router = useRouter();
  const [settings, setSettings] = useState<ReminderSettings>(defaultReminderSettings);
  const [saving, setSaving] = useState(false);
  const adhkar = useMemo(() => verifiedLibraryItems.filter((item) => item.kind === "adhkar" || item.kind === "daily-ward"), []);

  useEffect(() => { AsyncStorage.getItem(STORAGE_KEY).then((stored) => { if (stored) setSettings(JSON.parse(stored) as ReminderSettings); }).catch(() => undefined); }, []);
  const patch = (id: ReminderId, changes: Partial<ReminderSettings[ReminderId]>) => setSettings((current) => ({ ...current, [id]: { ...current[id], ...changes } }));
  const save = async () => {
    setSaving(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      const result = await syncLocalReminders(settings);
      if (result === "unsupported") Alert.alert("تذكيرات الجوال", "الإشعارات المحلية تعمل على الهاتف فقط، وليست مدعومة في معاينة الويب.");
      else if (result === "denied") Alert.alert("يلزم الإذن", "اسمح بإشعارات سَكينة من إعدادات الهاتف لتفعيل التذكيرات.");
      else Alert.alert("تم الحفظ", "تم حفظ تفضيلاتك وجدولة التذكيرات المفعلة.");
    } catch { Alert.alert("تعذر الحفظ", "حاول مرة أخرى بعد التحقق من أذونات الإشعارات."); }
    finally { setSaving(false); }
  };

  return <ScreenContainer className="px-5"><MotionIn className="flex-1"><FlatList data={adhkar} keyExtractor={(item) => item.id} renderItem={({ item }) => <LibraryItemCard item={item} />} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 28 }} ListHeaderComponent={<>
    <AppHeader title="الأذكار والورد" subtitle="مصنفة بحسب الوقت والمناسبة، مع المصدر والسند والدرجة" />
    <Pressable onPress={() => router.push("/adhkar/online" as Href)} style={({ pressed }) => ({ marginBottom: 14, padding: 15, borderRadius: 18, backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 })}><View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 9 }}><MaterialIcons name="cloud-queue" color="#FFFFFF" size={21} /><View style={{ flex: 1 }}><Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800", ...rtl }}>فهرس حصن المسلم عبر الإنترنت</Text><Text style={{ color: "#DDF5EA", fontSize: 11, marginTop: 3, ...rtl }}>أبواب الأذكار كاملة معروضة داخل التطبيق</Text></View><MaterialIcons name="chevron-left" color="#FFFFFF" size={21} /></View></Pressable>
    <SectionTitle title="التصنيف" />
    <View className="flex-row-reverse flex-wrap justify-between" style={{ gap: 8 }}>{categories.map((category) => <View key={category.title} style={{ width: "48.8%", flexDirection: "row-reverse", alignItems: "center", gap: 8, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 15, padding: 10 }}><MaterialIcons name={category.icon} size={17} color={colors.primary} /><Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "700", flex: 1, ...rtl }}>{category.title}</Text></View>)}</View>
    <View style={{ backgroundColor: `${colors.primary}15`, borderRadius: 22, padding: 16, marginBottom: 7 }}><View className="flex-row-reverse items-center" style={{ gap: 8 }}><MaterialIcons name="schedule" size={19} color={colors.primary} /><Text style={{ color: colors.foreground, fontSize: 15, fontWeight: "800", ...rtl }}>تذكيراتك</Text></View><Text style={{ color: colors.muted, fontSize: 12, lineHeight: 20, marginTop: 6, ...rtl }}>اختر ما تريد تفعيله وحدد الساعة. كل تنبيه يفتح مادة موثقة داخل سَكينة.</Text></View>
    {reminderRows.map((row) => { const setting = settings[row.id]; return <View key={row.id} style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 14, marginTop: 9 }}><View className="flex-row-reverse items-center"><View style={{ width: 35, height: 35, borderRadius: 12, backgroundColor: `${colors.primary}18`, alignItems: "center", justifyContent: "center" }}><MaterialIcons name={row.icon} size={18} color={colors.primary} /></View><View style={{ flex: 1, marginRight: 10 }}><Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "800", ...rtl }}>{row.title}</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 3, ...rtl }}>{row.subtitle}</Text></View><Switch value={setting.enabled} onValueChange={(enabled) => patch(row.id, { enabled })} trackColor={{ false: colors.border, true: `${colors.primary}99` }} thumbColor={setting.enabled ? colors.primary : colors.surface} /></View><View className="flex-row-reverse items-center justify-between" style={{ marginTop: 12 }}><Text style={{ color: colors.muted, fontSize: 12, ...rtl }}>وقت التذكير</Text><View className="flex-row-reverse items-center" style={{ gap: 7 }}><Pressable onPress={() => patch(row.id, { hour: moveReminderHour(setting.hour, 1) })} style={({ pressed }) => ({ width: 31, height: 31, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="add" size={17} color={colors.primary} /></Pressable><Text style={{ color: colors.foreground, fontWeight: "800", fontSize: 14, minWidth: 42, textAlign: "center" }}>{formatReminderTime(setting.hour, setting.minute)}</Text><Pressable onPress={() => patch(row.id, { hour: moveReminderHour(setting.hour, -1) })} style={({ pressed }) => ({ width: 31, height: 31, borderRadius: 10, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="remove" size={17} color={colors.primary} /></Pressable></View></View></View>; })}
    <Pressable onPress={save} disabled={saving} style={({ pressed }) => ({ backgroundColor: colors.primary, borderRadius: 16, alignItems: "center", paddingVertical: 14, marginTop: 14, opacity: pressed || saving ? 0.7 : 1 })}><Text style={{ color: "#FFFFFF", fontSize: 14, fontWeight: "800" }}>{saving ? "جارٍ الحفظ..." : Platform.OS === "web" ? "حفظ التفضيلات" : "حفظ وتفعيل التذكيرات"}</Text></Pressable>
    <SectionTitle title="مواد موثقة" />
  </>} /></MotionIn></ScreenContainer>;
}
