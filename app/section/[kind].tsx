import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

import { MotionIn } from "@/components/motion-in";
import { EmptyState, LibraryItemCard, SectionTitle } from "@/components/sakinah-ui";
import { sectionMeta, type LibraryKind, verifiedLibraryItems } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { ScreenContainer } from "@/components/screen-container";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function SectionScreen() {
  const { kind } = useLocalSearchParams<{ kind: string }>();
  const router = useRouter();
  const colors = useColors();
  const section = sectionMeta[kind as LibraryKind];
  if (!section) return <ScreenContainer className="px-5"><EmptyState title="القسم غير متاح" text="تحقق من الرابط ثم عُد إلى المكتبة." icon="menu-book" /></ScreenContainer>;
  const items = verifiedLibraryItems.filter((item) => item.kind === kind);
  return (
    <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}>
      <MotionIn className="flex-1">
        <FlatList data={items} keyExtractor={(item) => item.id} renderItem={({ item }) => <LibraryItemCard item={item} />} ListEmptyComponent={<EmptyState title="لا توجد مواد معتمدة بعد" text="لن تظهر في سَكينة إلا المواد التي اكتملت بطاقة توثيقها." icon="verified-user" />} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 14, paddingBottom: 28 }} ListHeaderComponent={<>
          <View className="flex-row-reverse items-center mb-5"><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" size={21} color={colors.foreground} /></Pressable><View className="flex-1 mr-3"><Text style={{ color: colors.foreground, fontSize: 23, fontWeight: "800", ...rtl }}>{section.title}</Text><Text style={{ color: colors.muted, fontSize: 12, marginTop: 3, ...rtl }}>كل مادة هنا تظهر ببطاقة توثيق قابلة للفتح</Text></View></View>
          <View style={{ backgroundColor: `${section.color}18`, borderRadius: 22, padding: 16, marginBottom: 16 }}><View className="flex-row-reverse items-center" style={{ gap: 9 }}><MaterialIcons name={section.icon as any} size={21} color={section.color} /><Text style={{ color: section.color, fontSize: 14, fontWeight: "800", ...rtl }}>منهج القسم</Text></View><Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 22, marginTop: 8, ...rtl }}>{section.description}</Text></View>
          <SectionTitle title="مواد موثقة" />
        </>} />
      </MotionIn>
    </ScreenContainer>
  );
}
