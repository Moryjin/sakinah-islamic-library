import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useCallback, useEffect, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";

import { useColors } from "@/hooks/use-colors";
import { downloadHadithPack, getHadithPack, hadithPackCatalog, removeHadithPack, type HadithPackId } from "@/lib/hadith-packs";

const rtl = { textAlign: "right" as const, writingDirection: "rtl" as const };
const sizeLabel = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(1)} م.ب`;

export function HadithPackDownload({ id, onDownloaded }: { id: HadithPackId; onDownloaded?: () => void }) {
  const colors = useColors();
  const [bytes, setBytes] = useState<number | null>(null);
  const [ratio, setRatio] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const refresh = useCallback(() => { getHadithPack(id).then((pack) => setBytes(pack?.bytes ?? null)); }, [id]);
  useEffect(() => { refresh(); }, [refresh]);
  const download = async () => { try { setError(null); setRatio(0); const pack = await downloadHadithPack(id, setRatio); setBytes(pack.bytes); onDownloaded?.(); } catch { setError("تعذر تنزيل الحزمة. تحقق من الاتصال ثم أعد المحاولة."); } finally { setRatio(null); } };
  const remove = async () => { await removeHadithPack(id); setBytes(null); };
  const title = hadithPackCatalog[id].title;
  if (Platform.OS === "web") return null;
  return <View style={{ marginTop: 12, borderRadius: 16, padding: 13, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface }}><View style={{ flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between" }}><View style={{ flex: 1, marginLeft: 10 }}><Text style={{ color: colors.foreground, fontSize: 12, fontWeight: "800", ...rtl }}>{bytes ? `${title} محفوظ على الجهاز` : `تنزيل ${title} كاملًا`}</Text><Text style={{ color: colors.muted, fontSize: 10, marginTop: 4, ...rtl }}>{bytes ? `${sizeLabel(bytes)} · متاح دون اتصال` : "اختياري · يحفظ داخل التطبيق فقط بلا إذن وسائط"}</Text></View><MaterialIcons name={bytes ? "offline-pin" : "download-for-offline"} color={bytes ? colors.success : colors.primary} size={22} /></View>{ratio !== null ? <View style={{ marginTop: 10, height: 5, borderRadius: 3, backgroundColor: `${colors.primary}20`, overflow: "hidden" }}><View style={{ width: `${Math.round(ratio * 100)}%`, height: 5, backgroundColor: colors.primary }} /></View> : null}{error ? <Text style={{ color: colors.error, fontSize: 10, marginTop: 8, ...rtl }}>{error}</Text> : null}<Pressable onPress={bytes ? remove : download} disabled={ratio !== null} style={({ pressed }) => ({ alignSelf: "flex-end", marginTop: 10, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: bytes ? `${colors.error}16` : colors.primary, opacity: pressed || ratio !== null ? 0.65 : 1 })}><Text style={{ color: bytes ? colors.error : "#FFFFFF", fontWeight: "800", fontSize: 11, ...rtl }}>{ratio !== null ? `جار التنزيل ${Math.round(ratio * 100)}٪` : bytes ? "حذف الحزمة" : "تنزيل للحفظ"}</Text></Pressable></View>;
}
