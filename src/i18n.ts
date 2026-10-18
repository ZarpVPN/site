import { createContext, useContext } from "react";
import english from "./locales/en";
import { initializePageLanguage, languageStorageKey, supportedLocales } from "./languagePreferences";
export { languages } from "./languagePreferences";
import type { Locale } from "./languagePreferences";
export type { Locale } from "./languagePreferences";

export type Messages = typeof english;
export type Selection = { locale: Locale; messages: Messages };
export type Translate = (key: string, values?: Record<string, string>) => string;

const loaders = {
  ru: () => import("./locales/ru"),
  es: () => import("./locales/es"),
  pt: () => import("./locales/pt"),
  zh: () => import("./locales/zh"),
  fr: () => import("./locales/fr"),
  de: () => import("./locales/de"),
  fa: () => import("./locales/fa"),
};
export const storageKey = languageStorageKey;

export async function loadLanguage(locale: Locale): Promise<Selection> {
  return { locale, messages: locale === "en" ? english : (await loaders[locale]()).default };
}

export async function initialLanguage(): Promise<Selection> {
  const locale = initializePageLanguage(supportedLocales, storageKey);
  try {
    return await loadLanguage(locale);
  } catch {
    return { locale: "en", messages: english };
  }
}

export const I18nContext = createContext<{ locale: Locale; t: Translate } | null>(null);
export const LanguageContext = createContext<((locale: Locale) => Promise<void>) | null>(null);
export const LanguagePendingContext = createContext(false);
export const LanguageFailureContext = createContext(false);

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("I18nProvider is missing");
  return context;
}

