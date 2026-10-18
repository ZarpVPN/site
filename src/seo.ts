import { github, platforms } from "./data";
import type { Locale, Messages } from "./i18n";
import { localePath, supportedLocales } from "./languagePreferences";

export const siteOrigin = "https://zarp.dev";
export const canonicalUrl = (locale: Locale) => `${siteOrigin}${localePath(locale)}`;

export function getSeo(locale: Locale, messages: Messages) {
  const title = messages.siteTitle;
  const description = messages.siteDescription;
  const canonical = canonicalUrl(locale);
  const alternates = supportedLocales.map(language => ({ language, url: canonicalUrl(language) }));
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteOrigin}/#website`,
        name: "Zarp",
        url: siteOrigin,
        inLanguage: supportedLocales,
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteOrigin}/#app`,
        name: "Zarp",
        url: canonical,
        description,
        image: `${siteOrigin}/assets/zarp-logo.jpg`,
        applicationCategory: "SecurityApplication",
        operatingSystem: ["Windows 10/11", "Android 8.0+", "macOS 14+"],
        downloadUrl: platforms.map(platform => platform.release.url),
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: 0, priceCurrency: "USD" },
        sameAs: github,
      },
    ],
  };
  return { title, description, canonical, alternates, structuredData };
}
