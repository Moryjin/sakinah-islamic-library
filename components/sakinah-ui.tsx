import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import { Alert, Pressable as TouchableOpacity, Text, View } from "react-native";
import * as WebBrowser from "expo-web-browser";

import { collectionMeta, type LibraryItem } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { useSakinahStore } from "@/lib/sakinah-store";
import { useThemeContext } from "@/lib/theme-provider";
import { trustedUrlOrNull } from "@/lib/security";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export function openSource(url: string) {
  const trustedUrl = trustedUrlOrNull(url);
  if (!trustedUrl) {
    Alert.alert("رابط غير موثوق", "تمنع سياسة سَكينة فتح الروابط التي لا تستخدم HTTPS أو لا تنتمي إلى مصدر معتمد.");
    return;
  }
  WebBrowser.openBrowserAsync(trustedUrl, { toolbarColor: "#0F5B4C", controlsColor: "#FFFFFF", showTitle: true, enableBarCollapsing: true }).catch(() => Alert.alert("تعذر فتح المصدر", "تحقق من اتصالك بالإنترنت ثم حاول مرة أخرى."));
}

export function AppHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const colors = useColors();
  const { colorScheme, setColorScheme } = useThemeContext();
  const dark = colorScheme === "dark";

  return (
    <View className="flex-row-reverse items-center justify-between mb-5">
      <View className="flex-1 pr-3">
        <Text className="text-[25px] font-bold text-foreground" style={rtl}>{title}</Text>
        {subtitle ? <Text className="text-[13px] text-muted mt-1" style={rtl}>{subtitle}</Text> : null}
      </View>
      <TouchableOpacity accessibilityLabel={dark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع المظلم"} onPress={() => setColorScheme(dark ? "light" : "dark")} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}>
        <MaterialIcons name={dark ? "light-mode" : "dark-mode"} size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  const colors = useColors();
  return (
    <View className="flex-row-reverse items-center justify-between mb-3 mt-6">
      <Text className="text-[18px] font-bold text-foreground" style={rtl}>{title}</Text>
      {action ? <TouchableOpacity onPress={onAction} style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}><Text style={{ color: colors.primary, ...rtl, fontSize: 13, fontWeight: "700" }}>{action}</Text></TouchableOpacity> : null}
    </View>
  );
}

export function SourcePill({ item }: { item: LibraryItem }) {
  const colors = useColors();
  return (
    <TouchableOpacity onPress={() => openSource(item.source.url)} style={({ pressed }) => ({ flexDirection: "row-reverse", alignItems: "center", alignSelf: "flex-start", gap: 5, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 999, backgroundColor: colors.background, borderColor: colors.border, borderWidth: 1, opacity: pressed ? 0.65 : 1 })}>
      <MaterialIcons name="verified-user" size={14} color={colors.primary} />
      <Text style={{ color: colors.primary, fontSize: 11, fontWeight: "700" }}>مصدر موثق</Text>
    </TouchableOpacity>
  );
}

export function LibraryItemCard({ item, compact = false }: { item: LibraryItem; compact?: boolean }) {
  const router = useRouter();
  const colors = useColors();
  const { favoriteIds, toggleFavorite } = useSakinahStore();
  const meta = collectionMeta[item.kind];
  const saved = favoriteIds.includes(item.id);

  return (
    <TouchableOpacity onPress={() => router.push({ pathname: "/reader/[id]", params: { id: item.id } })} style={({ pressed }) => ({ backgroundColor: colors.surface, borderRadius: 22, borderColor: colors.border, borderWidth: 1, padding: compact ? 15 : 18, marginBottom: 12, opacity: pressed ? 0.84 : 1 })}>
      <View className="flex-row-reverse items-start justify-between">
        <View className="flex-1 pl-3">
          <View className="flex-row-reverse items-center gap-2 mb-2">
            <View style={{ backgroundColor: `${meta.color}1A`, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999 }}><Text style={{ color: meta.color, fontSize: 11, fontWeight: "700" }}>{meta.shortTitle}</Text></View>
            <Text className="text-[12px] text-muted" style={rtl}>{item.subtitle}</Text>
          </View>
          <Text className="text-[18px] font-bold text-foreground" style={rtl}>{item.title}</Text>
        </View>
        <TouchableOpacity accessibilityLabel={saved ? "إزالة من المحفوظات" : "حفظ المادة"} onPress={(event) => { event.stopPropagation(); toggleFavorite(item.id); }} style={({ pressed }) => ({ width: 34, height: 34, borderRadius: 17, backgroundColor: colors.background, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.6 : 1 })}>
          <MaterialIcons name={saved ? "bookmark" : "bookmark-border"} size={19} color={saved ? colors.primary : colors.muted} />
        </TouchableOpacity>
      </View>
      {!compact ? <Text className="text-[14px] leading-6 text-foreground mt-3" style={rtl} numberOfLines={3}>{item.excerpt}</Text> : null}
      <View className="flex-row-reverse items-center justify-between mt-4">
        <SourcePill item={item} />
        <MaterialIcons name="arrow-back-ios" size={16} color={colors.muted} style={{ transform: [{ rotate: "180deg" }] }} />
      </View>
    </TouchableOpacity>
  );
}

export function EmptyState({ title, text, icon = "bookmark-border" }: { title: string; text: string; icon?: keyof typeof MaterialIcons.glyphMap }) {
  const colors = useColors();
  return (
    <View className="items-center justify-center px-10 py-16">
      <View style={{ width: 58, height: 58, borderRadius: 29, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", marginBottom: 16 }}><MaterialIcons name={icon} size={27} color={colors.primary} /></View>
      <Text className="text-[18px] font-bold text-foreground" style={{ textAlign: "center", writingDirection: "rtl" }}>{title}</Text>
      <Text className="text-[14px] leading-6 text-muted mt-2" style={{ textAlign: "center", writingDirection: "rtl" }}>{text}</Text>
    </View>
  );
}
