import { I18nManager, type TextStyle, type ViewStyle } from "react-native";
import { RTL_DIRECTION, RTL_LANGUAGE_TAG, RTL_ROW_DIRECTION, RTL_TEXT_ALIGN } from "@/lib/rtl-policy";

export { RTL_LANGUAGE_TAG } from "@/lib/rtl-policy";

export const rtlText: TextStyle = { textAlign: RTL_TEXT_ALIGN, writingDirection: RTL_DIRECTION };
export const rtlRoot: ViewStyle = { flex: 1, direction: RTL_DIRECTION };
export const rtlRow: ViewStyle = { flexDirection: RTL_ROW_DIRECTION };

export function enforceRtlLayout() {
  I18nManager.allowRTL(true);
  if (!I18nManager.isRTL) I18nManager.forceRTL(true);
}
