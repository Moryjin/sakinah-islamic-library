import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { FlatList, Image, Pressable, Text, View } from "react-native";

import { MotionIn } from "@/components/motion-in";
import { AppHeader, LibraryItemCard, SectionTitle } from "@/components/sakinah-ui";
import { sectionMeta, verifiedLibraryItems } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { useSakinahStore } from "@/lib/sakinah-store";
import { ScreenContainer } from "@/components/screen-container";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };
const quickLinks = [
  { title: "القرآن", hint: "آيات وورد", icon: "menu-book" as const, kind: "quran" as const },
  { title: "التفسير", hint: "كتب تفسير موثقة", icon: "auto-stories" as const, kind: "tafsir" as const },
  { title: "الحديث", hint: "السند والدرجة", icon: "format-quote" as const, kind: "bukhari" as const },
  { title: "الأذكار", hint: "وقت ومصدر", icon: "wb-sunny" as const, kind: "adhkar" as const },
  { title: "الفتاوى", hint: "ابن باز وابن تيمية", icon: "fact-check" as const, kind: "fatwa" as const },
  { title: "منهج سَكينة", hint: "المصادر والقبول", icon: "verified-user" as const, kind: "qiraat" as const },
];

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { lastOpenedId } = useSakinahStore();
  const continueItem = verifiedLibraryItems.find((item) => item.id === lastOpenedId) ?? verifiedLibraryItems[0];
  return <ScreenContainer className="px-5" containerClassName="bg-background"><MotionIn className="flex-1"><FlatList data={continueItem ? [continueItem] : []} keyExtractor={(item) => item.id} renderItem={({ item }) => <LibraryItemCard item={item} compact />} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 34 }} ListHeaderComponent={<>
    <AppHeader title="السَّلام عليكم" subtitle="مكتبة موثقة للقراءة والتدبر" />
    <View style={{ backgroundColor: colors.primary, borderRadius: 28, padding: 21, overflow: "hidden" }}><View style={{ position: "absolute", left: -28, top: -42, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.08)" }} /><View className="flex-row-reverse items-start justify-between"><View className="flex-1 pl-4"><Text style={{ color: "#F8E7B6", fontSize: 13, fontWeight: "700", ...rtl }}>ورد اليوم</Text><Text style={{ color: "#FFFFFF", fontSize: 25, fontWeight: "800", lineHeight: 37, marginTop: 5, ...rtl }}>لا سند، لا نص</Text><Text style={{ color: "#D2E9DF", fontSize: 13, marginTop: 6, ...rtl }}>منهج سَكينة في كل مادة تُعرض لك</Text></View><Image source={require("../../assets/images/icon.png")} style={{ width: 62, height: 62, borderRadius: 16 }} resizeMode="cover" /></View><Pressable onPress={() => router.push({ pathname: "/reader/[id]", params: { id: "daily-ward-ikhlas" } })} style={({ pressed }) => ({ backgroundColor: "#FFFFFF", alignSelf: "flex-end", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, marginTop: 20, opacity: pressed ? 0.72 : 1 })}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800" }}>افتح وردك</Text></Pressable></View>
    <SectionTitle title="الأبواب الرئيسية" action="المكتبة" onAction={() => router.push("/library")} />
    <View className="flex-row-reverse flex-wrap justify-between" style={{ gap: 10 }}>{quickLinks.map((link) => { const section = sectionMeta[link.kind]; const open = () => link.title === "الأذكار" ? router.push("/adhkar") : link.title === "منهج سَكينة" ? router.push("/methodology") : router.push({ pathname: "/section/[kind]", params: { kind: link.kind } }); return <Pressable key={link.title} onPress={open} style={({ pressed }) => ({ width: "31.8%", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 12, minHeight: 120, opacity: pressed ? 0.74 : 1 })}><View style={{ width: 33, height: 33, borderRadius: 12, backgroundColor: `${section.color}18`, alignItems: "center", justifyContent: "center", marginBottom: 9 }}><MaterialIcons name={link.icon} size={18} color={section.color} /></View><Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "800", ...rtl }}>{link.title}</Text><Text style={{ color: colors.muted, fontSize: 10, marginTop: 4, lineHeight: 14, ...rtl }}>{link.hint}</Text></Pressable>; })}</View>
    <SectionTitle title="تابع من حيث توقفت" action="المحفوظات" onAction={() => router.push("/saved")} />
  </>} /></MotionIn></ScreenContainer>;
}
