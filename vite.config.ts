import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { initializePageLanguage, languageStorageKey, supportedLocales } from "./src/languagePreferences.ts";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    {
      name: "page-language",
      transformIndexHtml: () => [{
        tag: "script",
        children: `(${initializePageLanguage.toString()})(${JSON.stringify(supportedLocales)}, ${JSON.stringify(languageStorageKey)});`,
        injectTo: "head",
      }],
    },
  ],
});
