import { Component, type ErrorInfo, type ReactNode } from "react";
import { ScrollView, Text, View } from "react-native";

type AppErrorBoundaryProps = { children: ReactNode };
type AppErrorBoundaryState = { error: Error | null };

/**
 * يحوّل أي استثناء في شجرة الواجهة إلى رسالة قابلة للتشخيص على الجهاز.
 * لا يعتمد على NativeWind أو السياق أو الصور حتى يظل ظاهرًا إذا تعطل أي منها.
 */
export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[SakinahErrorBoundary]", error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <View style={{ flex: 1, backgroundColor: "#10211F", paddingHorizontal: 24, paddingVertical: 48 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
          <Text style={{ color: "#F8E7B6", fontSize: 26, fontWeight: "800", textAlign: "right", writingDirection: "rtl" }}>تعذر فتح سَكينة</Text>
          <Text style={{ color: "#FFFFFF", fontSize: 16, lineHeight: 25, marginTop: 12, textAlign: "right", writingDirection: "rtl" }}>تم إيقاف الشاشة البيضاء وعرض رمز التشخيص. أرسل هذه الرسالة إلى فريق التطبيق مع لقطة للشاشة.</Text>
          <View style={{ marginTop: 20, padding: 15, borderRadius: 14, backgroundColor: "#18362F" }}>
            <Text selectable style={{ color: "#FFFFFF", fontSize: 13, lineHeight: 21, textAlign: "left" }}>{`${error.name}: ${error.message}`}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}
