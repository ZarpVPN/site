import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import english from "./locales/en";
import { I18nContext, LanguageContext, LanguagePendingContext, LanguageFailureContext, loadLanguage, storageKey } from "./i18n";
import type { Locale, Messages, Selection, Translate } from "./i18n";

export function I18nProvider({ initial, children }: { initial: Selection; children: ReactNode }) {
  const [selection, setSelection] = useState(initial);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const request = useRef(0);
  const currentSelection = useRef(initial);
  const selectLanguage = useCallback(async (locale: Locale) => {
    const current = ++request.current;
    if (currentSelection.current.locale === locale) {
      setPending(false);
      setFailed(false);
      try { localStorage.setItem(storageKey, locale); } catch { /* Storage is optional. */ }
      return;
    }
    setPending(true);
    setFailed(false);
    try {
      const next = await loadLanguage(locale);
      if (current !== request.current) return;
      currentSelection.current = next;
      setSelection(next);
      try { localStorage.setItem(storageKey, locale); } catch { /* Selection still works without storage. */ }
    } catch {
      if (current === request.current) setFailed(true);
    } finally {
      if (current === request.current) setPending(false);
    }
  }, []);
  const value = useMemo(() => ({
    locale: selection.locale,
    t: ((key, values) => {
      const message = selection.messages[key as keyof Messages] ?? english[key as keyof Messages] ?? key;
      return values ? message.replace(/\{(\w+)\}/g, (placeholder, name: string) => values[name] ?? placeholder) : message;
    }) as Translate,
  }), [selection]);

  useLayoutEffect(() => {
    document.documentElement.lang = selection.locale;
    document.documentElement.dir = selection.locale === "fa" ? "rtl" : "ltr";
    document.title = selection.messages.siteTitle;
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]']) {
      document.querySelector(selector)?.setAttribute("content", selection.messages.siteDescription);
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", selection.messages.siteTitle);
  }, [selection]);

  return (
    <I18nContext value={value}>
      <LanguageContext value={selectLanguage}>
        <LanguagePendingContext value={pending}>
          <LanguageFailureContext value={failed}>{children}</LanguageFailureContext>
        </LanguagePendingContext>
      </LanguageContext>
    </I18nContext>
  );
}
