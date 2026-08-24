import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

import { MotionIn } from "@/components/motion-in";
import { openSource, SectionTitle } from "@/components/sakinah-ui";
import { sourceDirectory } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };
const methodology = [
  ["لا سند، لا نص", "لا تعرض سَكينة نصًا دينيًا أو اقتباسًا علميًا قبل اكتمال مصدره ورابطه وموضعه المرجعي."],
  ["الحديث", "تعرض بطاقة الحديث: السند، الراوي، المصدر، الكتاب، الباب، الرقم، التخريج، درجة الحديث، وحكم المحدّث."],
  ["القرآن والتفسير", "يفصل التطبيق بين نص الآية والتفسير، ويعرض السورة والآية ثم اسم التفسير والمفسر وموضعه ورابطه."],
  ["كتب التراث والفتاوى", "تظهر بيانات المؤلف والطبعة والجزء أو الباب والموضع والرابط. ولا يحوّل الفهرس إلى فتوى شخصية."],
  ["سياسة المصادر", "لا تُدرج مادة إلا من قائمة المصادر المسموحة التي تظهر أدناه، وتُراجع الإحالة قبل إتاحتها."],
];

export default function MethodologyScreen() {
  const colors = useColors();
  const router = useRouter();
  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><MotionIn className="flex-1"><FlatList data={sourceDirectory} keyExtractor={(source) => source.id} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 14, paddingBottom: 28 }} ListHeaderComponent={<>
    <View className="flex-row-reverse items-center mb-5"><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" size={21} color={colors.foreground} /></Pressable><View className="flex-1 mr-3"><Text style={{ color: colors.foreground, fontSize: 23, fontWeight: "800", ...rtl }}>منهج ومصادر سَكينة</Text><Text style={{ color: colors.muted, fontSize: 12, marginTop: 3, ...rtl }}>شفافية المصدر قبل النص</Text></View></View>
    <View style={{ backgroundColor: colors.primary, borderRadius: 24, padding: 18, marginBottom: 12 }}><Text style={{ color: colors.onPrimaryMuted, fontSize: 13, fontWeight: "800", ...rtl }}>فلسفة سَكينة</Text><Text style={{ color: colors.onPrimary, fontSize: 24, fontWeight: "800", marginTop: 7, ...rtl }}>لا سند، لا نص</Text><Text style={{ color: colors.onPrimaryMuted, fontSize: 13, lineHeight: 21, marginTop: 8, ...rtl }}>نفتح الطريق إلى المرجع، ولا نستبدل به بطاقة مجهولة أو نصًا بلا توثيق.</Text></View>
    <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 8, borderRadius: 16, padding: 12, marginBottom: 6, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}><MaterialIcons name="person-outline" size={18} color={colors.primary} /><Text style={{ color: colors.muted, fontSize: 11, flex: 1, ...rtl }}>تطبيق ليبي من تطوير عبدالعظيم الشريقي</Text></View>
    <SectionTitle title="قواعد القبول" />
    {methodology.map(([title, text], index) => <View key={title} style={{ backgroundColor: colors.surface, borderRadius: 18, padding: 15, marginBottom: 9, borderColor: colors.border, borderWidth: 1 }}><View className="flex-row-reverse items-center" style={{ gap: 9 }}><View style={{ width: 25, height: 25, borderRadius: 9, backgroundColor: `${colors.primary}18`, alignItems: "center", justifyContent: "center" }}><Text style={{ color: colors.primary, fontWeight: "800", fontSize: 12 }}>{index + 1}</Text></View><Text style={{ color: colors.foreground, fontSize: 14, fontWeight: "800", ...rtl }}>{title}</Text></View><Text style={{ color: colors.muted, fontSize: 12, lineHeight: 20, marginTop: 8, ...rtl }}>{text}</Text></View>)}
    <SectionTitle title="المصادر المسموحة" />
  </>} renderItem={({ item: source }) => <Pressable onPress={() => openSource(source.url)} style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: 18, padding: 14, marginBottom: 9, flexDirection: "row-reverse", alignItems: "center", borderColor: colors.border, borderWidth: 1, opacity: pressed ? 0.68 : 1 })}><View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: `${colors.primary}18`, alignItems: "center", justifyContent: "center" }}><MaterialIcons name={source.icon as any} color={colors.primary} size={18} /></View><View style={{ flex: 1, marginRight: 10 }}><Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "800", ...rtl }}>{source.name}</Text><Text style={{ color: colors.muted, fontSize: 11, marginTop: 3, ...rtl }}>{source.scope}</Text></View><MaterialIcons name="open-in-new" size={17} color={colors.muted} /></Pressable>} /></MotionIn></ScreenContainer>;
}
