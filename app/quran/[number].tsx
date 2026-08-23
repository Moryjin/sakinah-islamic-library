import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { useReadingSettings } from "@/lib/reading-settings";
import { getQuranSurah, quranOnlineCitation, type QuranSurah } from "@/lib/quran-online";
import { getBookmarks, toggleBookmark } from "@/lib/bookmarks";
import { quranBookmarkId } from "@/lib/bookmark-utils";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function QuranSurahScreen() {
  const colors = useColors();
  const router = useRouter();
  const { scale } = useReadingSettings();
  const { number, ayah } = useLocalSearchParams<{ number: string; ayah?: string }>();
  const surahNumber = Number(number);
  const targetAyah = Number(ayah);
  const [surah, setSurah] = useState<QuranSurah | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [bookmarkIds, setBookmarkIds] = useState<string[]>([]);
  const load = useCallback(() => {
    setLoading(true);
    setError(false);
    getQuranSurah(surahNumber).then(setSurah).catch(() => setError(true)).finally(() => setLoading(false));
  }, [surahNumber]);
  useEffect(() => { load(); }, [load]);
  useFocusEffect(useCallback(() => { getBookmarks().then((items) => setBookmarkIds(items.map((item) => item.id))); }, []));

  const textSize = Math.round(24 * scale);
  const lineHeight = Math.round(52 * scale);
  const toggleAyahBookmark = async (ayah: QuranSurah["ayahs"][number]) => {
    if (!surah) return;
    const id = quranBookmarkId(surah.number, ayah.numberInSurah);
    const saved = await toggleBookmark({ id, kind: "quran", title: surah.name, subtitle: `سورة ${surah.number} · الآية ${ayah.numberInSurah} · الصفحة ${ayah.page}`, text: ayah.text, surah: surah.number, ayah: ayah.numberInSurah, createdAt: new Date().toISOString() });
    setBookmarkIds((current) => saved ? [...current, id] : current.filter((item) => item !== id));
  };

  return (
    <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 14, paddingBottom: 34 }}>
        <View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ color: colors.foreground, fontSize: 25, fontWeight: "800", ...rtl }}>{surah?.name ?? "تحميل السورة"}</Text>
            <Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, ...rtl }}>{surah ? `${surah.numberOfAyahs} آيات · ${surah.revelationType === "Meccan" ? "مكية" : "مدنية"}${targetAyah ? ` · علامة الآية ${targetAyah}` : ""}` : ""}</Text>
          </View>
          <View style={{ flexDirection: "row-reverse", gap: 8 }}>
            <Pressable onPress={() => router.push("/settings/reading")} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}>
              <MaterialIcons name="format-size" size={20} color={colors.primary} />
            </Pressable>
            <Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}>
              <MaterialIcons name="arrow-forward" size={21} color={colors.foreground} />
            </Pressable>
          </View>
        </View>
        <View style={{ marginTop: 16, borderRadius: 17, padding: 14, backgroundColor: `${colors.primary}0E` }}>
          <Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800", ...rtl }}>بطاقة مصدر النص</Text>
          <Text style={{ color: colors.muted, fontSize: 11, lineHeight: 18, marginTop: 4, ...rtl }}>مصدر العرض: {quranOnlineCitation.displaySource} · مرجع التحقق: {quranOnlineCitation.verificationSource}</Text>
        </View>
        {loading ? <View style={{ paddingTop: 90, alignItems: "center" }}><ActivityIndicator color={colors.primary} size="large" /><Text style={{ color: colors.muted, marginTop: 12, ...rtl }}>يجري تحميل آيات السورة…</Text></View> : null}
        {error ? <View style={{ paddingTop: 70, alignItems: "center" }}><MaterialIcons name="cloud-off" color={colors.muted} size={34} /><Text style={{ color: colors.foreground, marginTop: 12, fontWeight: "800", ...rtl }}>تعذر جلب السورة الآن</Text><Pressable onPress={load} style={({ pressed }) => ({ marginTop: 14, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 })}><Text style={{ color: "#FFFFFF", fontWeight: "800" }}>إعادة المحاولة</Text></Pressable></View> : null}
        {surah ? <View style={{ marginTop: 16, paddingHorizontal: 18, paddingVertical: 24, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 24 }}>
          <Text style={{ color: colors.foreground, fontSize: textSize, lineHeight, letterSpacing: 0.15, ...rtl }}>
            {surah.ayahs.map((ayah) => { const id = quranBookmarkId(surah.number, ayah.numberInSurah); const saved = bookmarkIds.includes(id); return <Text key={ayah.numberInSurah}>{`${ayah.text} `}<Text onPress={() => toggleAyahBookmark(ayah)} accessibilityRole="button" accessibilityLabel={`حفظ علامة للآية ${ayah.numberInSurah}`} style={{ color: saved ? colors.warning : colors.primary, fontSize: Math.round(15 * scale), fontWeight: "800", textDecorationLine: saved ? "underline" : "none" }}>{`${saved ? "۞" : "﴿"}${ayah.numberInSurah}${saved ? "۞" : "﴾"}`}</Text>{" "}</Text>; })}
          </Text>
          <Text style={{ color: colors.muted, fontSize: 10, marginTop: 15, ...rtl }}>المس رقم الآية لحفظها أو إزالة علامتها من المحفوظات</Text>
          <View style={{ flexDirection: "row-reverse", justifyContent: "space-between", marginTop: 22, paddingTop: 13, borderTopWidth: 1, borderTopColor: colors.border }}>
            <Text style={{ color: colors.muted, fontSize: 11, ...rtl }}>الجزء {surah.ayahs[0]?.juz ?? "—"}</Text>
            <Text style={{ color: colors.muted, fontSize: 11, ...rtl }}>الصفحة {surah.ayahs[0]?.page ?? "—"}</Text>
            <Text style={{ color: colors.muted, fontSize: 11, ...rtl }}>ترتيب مصحفي متسلسل</Text>
          </View>
        </View> : null}
      </ScrollView>
    </ScreenContainer>
  );
}
