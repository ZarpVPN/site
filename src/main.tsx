import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles.scss";
import App from "./App.tsx";
import { configurePageScrolling } from "./pageScroll";
import { initialLanguage } from "./i18n";
import { I18nProvider } from "./I18nProvider";

configurePageScrolling();

void initialLanguage().then(initial => {
  const root = document.getElementById("root")!;
  const app = (
    <StrictMode>
      <I18nProvider initial={initial}><App /></I18nProvider>
    </StrictMode>
  );
  if (root.hasChildNodes()) hydrateRoot(root, app);
  else createRoot(root).render(app);
});
