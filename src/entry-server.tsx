import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { I18nProvider } from "./I18nProvider";
import { loadLanguage } from "./i18n";
import type { Locale } from "./i18n";
import { getSeo } from "./seo";

export async function renderPage(locale: Locale) {
  const initial = await loadLanguage(locale);
  return {
    content: renderToString(
      <StrictMode>
        <I18nProvider initial={initial}><App /></I18nProvider>
      </StrictMode>,
    ),
    seo: getSeo(locale, initial.messages),
  };
}
