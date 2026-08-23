import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const packageJson = JSON.parse(await readFile(resolve(root, "package.json"), "utf8"));
const dependencies = Object.keys({ ...(packageJson.dependencies ?? {}), ...(packageJson.devDependencies ?? {}) }).join("\n").toLowerCase();
const disallowed = ["admob", "adsense", "facebook-audience-network", "appodeal", "ironsource", "unity-ads", "applovin", "adcolony", "inmobi", "chartboost", "vungle", "tapjoy", "advertising-id"];
const matches = disallowed.filter((entry) => dependencies.includes(entry));
if (matches.length) {
  console.error(`رفض الفحص: وُجدت اعتمادات إعلانية محظورة: ${matches.join(", ")}`);
  process.exit(1);
}
console.log("نجح فحص عدم الإعلانات: لا توجد اعتماديات إعلانية محظورة في package.json.");
