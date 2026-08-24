import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const rawBundleId = "com.app.sakinah";
const bundleId = rawBundleId
  .replace(/[-_]/g, ".")
  .replace(/[^a-zA-Z0-9.]/g, "")
  .replace(/\.+/g, ".")
  .replace(/^\.+|\.+$/g, "")
  .toLowerCase()
  .split(".")
  .map((segment) => (/^[a-zA-Z]/.test(segment) ? segment : `x${segment}`))
  .join(".") || "space.manus.app";

const env = {
  appName: "سَكينة",
  appSlug: "sakinah",
  logoUrl: "/manus-storage/sakinah-icon_5eff7493.png",
  scheme: "sakinah",
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "1.0.10",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: { supportsTablet: true, bundleIdentifier: env.iosBundleId, infoPlist: { ITSAppUsesNonExemptEncryption: false, UIBackgroundModes: ["audio"] } },
  android: {
    adaptiveIcon: {
      backgroundColor: "#0F5B4C",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    versionCode: 11,
    permissions: ["POST_NOTIFICATIONS"],
    blockedPermissions: ["android.permission.RECORD_AUDIO"],
  },
  web: { bundler: "metro", output: "static", favicon: "./assets/images/favicon.png" },
  plugins: ["expo-router", "expo-asset", ["expo-audio", { microphonePermission: false }], "expo-font", "expo-video", "expo-web-browser", ["expo-notifications", { color: "#0F5B4C", defaultChannel: "sakinah-reminders" }], ["expo-splash-screen", { image: "./assets/images/splash-icon.png", imageWidth: 200, resizeMode: "contain", backgroundColor: "#0F5B4C", dark: { backgroundColor: "#10211F" } }], ["expo-build-properties", { android: { buildArchs: ["armeabi-v7a", "arm64-v8a"], minSdkVersion: 24 } }]],
  experiments: { typedRoutes: true, reactCompiler: true },
};

export default config;
