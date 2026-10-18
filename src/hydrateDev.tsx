import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { configurePageScrolling } from "./pageScroll";
import { initialLanguage } from "./i18n";
import { I18nProvider } from "./I18nProvider";

export async function hydrateDev() {
  configurePageScrolling();
  const initial = await initialLanguage();
  const root = document.getElementById("root")!;
  const app = <StrictMode><I18nProvider initial={initial}><App /></I18nProvider></StrictMode>;
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
  const startHero = () => {
    if (!root.querySelector(".dotted-sphere")) return false;
    void import("./clientHero").then(({ initHero }) => initHero());
    return true;
  };
  if (!startHero()) {
    const observer = new MutationObserver(() => {
      if (startHero()) observer.disconnect();
    });
    observer.observe(root, { childList: true, subtree: true });
  }
}
