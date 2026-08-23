import { allowedSourceHosts } from "../data/sakinah-library";

const extraTrustedHosts = ["creativecommons.org"] as const;
const trustedHosts = new Set<string>([...allowedSourceHosts, ...extraTrustedHosts]);

export function isTrustedHttpsUrl(value: string) {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" && trustedHosts.has(parsed.hostname);
  } catch {
    return false;
  }
}

export function trustedUrlOrNull(value: string) {
  return isTrustedHttpsUrl(value) ? value : null;
}
