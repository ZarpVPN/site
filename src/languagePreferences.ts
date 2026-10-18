/// <reference lib="dom" />

export const supportedLocales = ["en", "ru", "es", "pt", "zh", "fr", "de", "fa"] as const;
export type Locale = (typeof supportedLocales)[number];
export const languages: { locale: Locale; name: string }[] = [
  { locale: "en", name: "English" },
  { locale: "ru", name: "Русский" },
  { locale: "es", name: "Español" },
  { locale: "pt", name: "Português" },
  { locale: "zh", name: "中文" },
  { locale: "fr", name: "Français" },
  { locale: "de", name: "Deutsch" },
  { locale: "fa", name: "فارسی" },
];
export const languageStorageKey = "zarp-language";
export const localePath = (locale: Locale) => locale === "en" ? "/" : `/${locale}/`;

// Also runs inline in the HTML head, before React or translation detection.
// Keep this function self-contained so its compiled source can be injected.
export function initializePageLanguage(locales: readonly Locale[], storageKey: string): Locale {
  const preferred = navigator.languages?.length ? navigator.languages : [navigator.language];
  const match = (value: string) => {
    const base = value.toLowerCase().split(/[-_]/)[0];
    return locales.find(locale => locale === base);
  };
  let saved: Locale | undefined;
  try {
    saved = match(localStorage.getItem(storageKey) ?? "");
  } catch {
    // Browser language still works when storage is blocked.
  }
  const routeLocale = locales.find(locale => locale === location.pathname.split("/")[1]?.toLowerCase());
  const locale = routeLocale ?? "en";
  const preferredLocale = saved ?? preferred.map(match).find(Boolean) ?? "en";
  if ((location.pathname === "/" || location.pathname === "/index.html") && preferredLocale !== "en") {
    location.replace(`/${preferredLocale}/${location.search}${location.hash}`);
  }
  const root = document.documentElement;
  root.lang = locale;
  root.dir = locale === "fa" ? "rtl" : "ltr";

  // An unsupported primary language still needs browser translation, even
  // when a supported secondary language or saved selection is available.
  const nativeLanguage = match(preferred[0] ?? "") !== undefined;
  root.translate = !nativeLanguage;
  root.classList.toggle("notranslate", nativeLanguage);
  const existing = document.head.querySelector('meta[name="google"][content="notranslate"]');
  if (nativeLanguage && !existing) {
    const meta = document.createElement("meta");
    meta.name = "google";
    meta.content = "notranslate";
    document.head.append(meta);
  } else if (!nativeLanguage) {
    existing?.remove();
  }
  return locale;
}
