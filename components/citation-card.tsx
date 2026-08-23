import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Pressable, Text, View } from "react-native";

import { openSource } from "@/components/sakinah-ui";
import { type LibraryItem } from "@/data/sakinah-library";
import { useColors } from "@/hooks/use-colors";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };

function MetaRow({ label, value }: { label: string; value: string }) {
  const colors = useColors();
  return (
    <View style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ color: colors.muted, fontSize: 11, fontWeight: "800", ...rtl }}>{label}</Text>
      <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 21, marginTop: 3, ...rtl }}>{value}</Text>
    </View>
  );
}

export function CitationCard({ item }: { item: LibraryItem }) {
  const colors = useColors();
  const hadith = item.hadith;
  const tafsir = item.tafsir;
  const book = item.book;
  const qiraat = item.qiraat;

  return (
    <View style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 24, padding: 16, marginBottom: 15 }}>
      <View className="flex-row-reverse items-center justify-between mb-3">
        <View className="flex-row-reverse items-center gap-2"><View style={{ width: 29, height: 29, borderRadius: 10, backgroundColor: `${colors.primary}18`, alignItems: "center", justifyContent: "center" }}><MaterialIcons name="verified-user" size={16} color={colors.primary} /></View><Text style={{ color: colors.foreground, fontSize: 16, fontWeight: "800", ...rtl }}>بطاقة التوثيق</Text></View>
        <View style={{ backgroundColor: `${colors.success}18`, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 999 }}><Text style={{ color: colors.success, fontSize: 11, fontWeight: "800" }}>مكتملة</Text></View>
      </View>
      <MetaRow label="المصدر" value={`${item.source.label} · ${item.source.site}`} />
      <MetaRow label="الموضع المرجعي" value={item.source.reference} />
      {tafsir ? <><MetaRow label="التفسير" value={`${tafsir.tafsirName} · ${tafsir.scholar}`} /><MetaRow label="موضع الآيات" value={tafsir.ayahRange} /></> : null}
      {book ? <><MetaRow label="المؤلف" value={book.author} /><MetaRow label="الطبعة أو التحقيق" value={book.edition} /><MetaRow label="الموضع" value={book.location} /></> : null}
      {qiraat ? <><MetaRow label="القارئ والرواية" value={`${qiraat.qari} · ${qiraat.riwayah}`} /><MetaRow label="الطريق والموضع" value={`${qiraat.tariq} · ${qiraat.locus}`} /></> : null}
      {hadith ? <>
        <MetaRow label="الراوي" value={hadith.narrator} />
        <MetaRow label="الكتاب والباب والرقم" value={`${hadith.sourceBook} · ${hadith.chapter} · حديث ${hadith.number}`} />
        <MetaRow label="درجة الحديث وحكم المحدّث" value={`${hadith.grade} · ${hadith.grader}`} />
        <MetaRow label="التخريج" value={hadith.takhrij} />
        <MetaRow label="السند الكامل" value={hadith.isnad} />
      </> : null}
      <View className="flex-row-reverse items-center" style={{ gap: 9, marginTop: 14 }}>
        <Pressable onPress={() => openSource(item.source.url)} style={({ pressed }) => ({ flex: 1, flexDirection: "row-reverse", justifyContent: "center", alignItems: "center", gap: 6, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 11, opacity: pressed ? 0.7 : 1 })}><MaterialIcons name="open-in-new" size={16} color="#FFFFFF" /><Text style={{ color: "#FFFFFF", fontSize: 12, fontWeight: "800" }}>فتح المصدر</Text></Pressable>
        {hadith ? <Pressable onPress={() => openSource(hadith.isnadUrl)} style={({ pressed }) => ({ flex: 1, flexDirection: "row-reverse", justifyContent: "center", alignItems: "center", gap: 6, borderColor: colors.border, borderWidth: 1, backgroundColor: colors.background, borderRadius: 14, paddingVertical: 11, opacity: pressed ? 0.7 : 1 })}><MaterialIcons name="account-tree" size={16} color={colors.primary} /><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800" }}>السند الأصلي</Text></Pressable> : null}
        {tafsir ? <Pressable onPress={() => openSource(tafsir.tafsirUrl)} style={({ pressed }) => ({ flex: 1, flexDirection: "row-reverse", justifyContent: "center", alignItems: "center", gap: 6, borderColor: colors.border, borderWidth: 1, backgroundColor: colors.background, borderRadius: 14, paddingVertical: 11, opacity: pressed ? 0.7 : 1 })}><MaterialIcons name="auto-stories" size={16} color={colors.primary} /><Text style={{ color: colors.primary, fontSize: 12, fontWeight: "800" }}>التفسير</Text></Pressable> : null}
      </View>
    </View>
  );
}
