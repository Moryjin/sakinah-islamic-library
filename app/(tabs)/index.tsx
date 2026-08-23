import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Pressable as TouchableOpacity, Text, View } from "react-native";

import { AppHeader, LibraryItemCard, SectionTitle } from "@/components/sakinah-ui";
import { collectionMeta, libraryItems } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { useSakinahStore } from "@/lib/sakinah-store";
import { ScreenContainer } from "@/components/screen-container";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };
const quickLinks = [
  { title: "القرآن الكريم", hint: "آيات وسور", icon: "menu-book" as const, route: "/library" as const, kind: "quran" as const },
  { title: "صحيح البخاري", hint: "أحاديث نبوية", icon: "format-quote" as const, route: "/hadith" as const, kind: "bukhari" as const },
  { title: "صحيح مسلم", hint: "أحاديث نبوية", icon: "auto-stories" as const, route: "/hadith" as const, kind: "muslim" as const },
  { title: "البداية والنهاية", hint: "ابن كثير", icon: "account-balance" as const, route: "/library" as const, kind: "bidaya" as const },
];

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();
  const { lastOpenedId } = useSakinahStore();
  const continueItem = libraryItems.find((item) => item.id === lastOpenedId) ?? libraryItems[0];

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <FlatList data={[continueItem]} keyExtractor={(item) => item.id} renderItem={({ item }) => <LibraryItemCard item={item} compact />} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 16, paddingBottom: 34 }} ListHeaderComponent={
        <>
          <AppHeader title="السَّلام عليكم" subtitle="رفيقك الهادئ للقراءة والتدبر" />
          <View style={{ backgroundColor: colors.primary, borderRadius: 28, padding: 21, overflow: "hidden" }}>
            <View style={{ position: "absolute", left: -28, top: -42, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.08)" }} />
            <View className="flex-row-reverse items-start justify-between">
              <View className="flex-1 pl-4"><Text style={{ color: "#F8E7B6", fontSize: 13, fontWeight: "700", ...rtl }}>ورد اليوم</Text><Text style={{ color: "#FFFFFF", fontSize: 25, fontWeight: "800", lineHeight: 37, marginTop: 5, ...rtl }}>وَقُل رَّبِّ زِدْنِي عِلْمًا</Text><Text style={{ color: "#D2E9DF", fontSize: 13, marginTop: 6, ...rtl }}>طه · الآية ١١٤</Text></View>
              <Image source={require("@/assets/images/icon.png")} style={{ width: 62, height: 62, borderRadius: 16 }} contentFit="cover" />
            </View>
            <TouchableOpacity onPress={() => router.push({ pathname: "/reader/[id]", params: { id: "quran-fatiha" } })} style={({ pressed }) => ({ backgroundColor: "#FFFFFF", alignSelf: "flex-end", paddingHorizontal: 14, paddingVertical: 9, borderRadius: 14, marginTop: 20, opacity: pressed ? 0.72 : 1 })}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800" }}>ابدأ القراءة</Text></TouchableOpacity>
          </View>
          <SectionTitle title="تصفح المكتبة" />
          <View className="flex-row-reverse flex-wrap justify-between" style={{ gap: 10 }}>
            {quickLinks.map((link) => {
              const meta = collectionMeta[link.kind];
              return <TouchableOpacity key={link.title} onPress={() => router.push(link.route)} style={({ pressed }) => ({ width: "48.6%", backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 20, padding: 14, opacity: pressed ? 0.74 : 1 })}><View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: `${meta.color}18`, alignItems: "center", justifyContent: "center", marginBottom: 10 }}><MaterialIcons name={link.icon} size={19} color={meta.color} /></View><Text className="text-[14px] font-bold text-foreground" style={rtl}>{link.title}</Text><Text className="text-[11px] text-muted mt-1" style={rtl}>{link.hint}</Text></TouchableOpacity>;
            })}
          </View>
          <SectionTitle title="تابع من حيث توقفت" action="عرض الكل" onAction={() => router.push("/saved")} />
        </>
      } />
    </ScreenContainer>
  );
}
