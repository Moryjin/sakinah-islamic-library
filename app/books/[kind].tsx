import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { openSource } from "@/components/sakinah-ui";
import { sectionMeta, type LibraryKind, verifiedLibraryItems } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";
import { bookCatalog } from "@/lib/book-catalog";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

export default function BookCatalogScreen() {
  const colors = useColors(); const router = useRouter(); const { kind } = useLocalSearchParams<{ kind: string }>();
  const entry = bookCatalog[kind as LibraryKind]; const meta = sectionMeta[kind as LibraryKind];
  if (!entry || !meta) return <ScreenContainer className="px-5"><Text style={{ color: colors.foreground, ...rtl }}>القسم غير متاح</Text></ScreenContainer>;
  const items = verifiedLibraryItems.filter((item) => item.kind === kind);
  const openInside = () => {
    if (kind === "quran" || kind === "daily-ward") router.push("/quran");
    else if (kind === "bukhari") router.push("/bukhari");
    else if (kind === "muslim") router.push("/muslim");
    else if (kind === "adhkar") router.push("/adhkar/online");
    else openSource(entry.catalogUrl);
  };
  return <ScreenContainer className="px-5" edges={["top", "bottom", "left", "right"]}><View style={{ paddingTop: 16 }}><View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}><View style={{ flex: 1, marginLeft: 12 }}><Text style={{ color: colors.foreground, fontSize: 23, fontWeight: "800", ...rtl }}>{entry.title}</Text><Text style={{ color: colors.muted, fontSize: 12, marginTop: 4, ...rtl }}>فهرس وصول واضح لكل الكتب والمواد في الباب</Text></View><Pressable onPress={() => router.back()} style={({ pressed }) => ({ width: 42, height: 42, borderRadius: 21, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.65 : 1 })}><MaterialIcons name="arrow-forward" color={colors.foreground} size={21} /></Pressable></View><View style={{ marginTop: 18, padding: 16, borderRadius: 20, backgroundColor: `${meta.color}18`, borderWidth: 1, borderColor: `${meta.color}35` }}><Text style={{ color: meta.color, fontSize: 13, fontWeight: "800", ...rtl }}>حالة الإتاحة</Text><Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 21, marginTop: 6, ...rtl }}>{entry.description}</Text><Text style={{ color: entry.localStatus === "available" ? colors.success : colors.warning, fontSize: 11, fontWeight: "800", marginTop: 10, ...rtl }}>{entry.localStatus === "available" ? "تنزيل محلي متاح داخل سَكينة" : "قراءة عبر الفهرس أو صفحة المصدر داخل المتصفح المدمج"}</Text></View><Pressable onPress={openInside} style={({ pressed }) => ({ marginTop: 14, minHeight: 54, paddingHorizontal: 16, borderRadius: 16, backgroundColor: colors.primary, flexDirection: "row-reverse", alignItems: "center", gap: 9, opacity: pressed ? 0.7 : 1 })}><MaterialIcons name={entry.localStatus === "available" ? "menu-book" : "open-in-new"} color="#FFFFFF" size={21} /><Text style={{ color: "#FFFFFF", fontWeight: "800", flex: 1, ...rtl }}>{entry.catalogLabel}</Text></Pressable><Pressable onPress={() => openSource(entry.catalogUrl)} style={({ pressed }) => ({ marginTop: 10, minHeight: 50, paddingHorizontal: 16, borderRadius: 16, borderColor: colors.border, borderWidth: 1, backgroundColor: colors.surface, flexDirection: "row-reverse", alignItems: "center", gap: 9, opacity: pressed ? 0.7 : 1 })}><MaterialIcons name="verified" color={colors.primary} size={19} /><Text style={{ color: colors.primary, fontWeight: "800", flex: 1, ...rtl }}>فتح المصدر الموثق داخل التطبيق</Text></Pressable>{items.map((item) => <Pressable key={item.id} onPress={() => router.push({ pathname: "/reader/[id]", params: { id: item.id } })} style={({ pressed }) => ({ marginTop: 10, padding: 14, borderRadius: 17, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, opacity: pressed ? 0.68 : 1 })}><Text style={{ color: colors.foreground, fontSize: 13, fontWeight: "800", ...rtl }}>{item.title}</Text><Text style={{ color: colors.muted, fontSize: 10, marginTop: 4, ...rtl }}>{item.subtitle}</Text></Pressable>)}</View></ScreenContainer>;
}
