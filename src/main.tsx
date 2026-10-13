import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.scss";
import App from "./App.tsx";
import { configurePageScrolling } from "./pageScroll";
import { initialLanguage } from "./i18n";
import { I18nProvider } from "./I18nProvider";

configurePageScrolling();

void initialLanguage().then(initial => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <I18nProvider initial={initial}><App /></I18nProvider>
    </StrictMode>,
  );
});
