import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { createServer } from "vite";

const dist = resolve("dist");
const template = await readFile(join(dist, "index.html"), "utf8");
const stylesheetTag = template.match(/<link rel="stylesheet" crossorigin href="(\/assets\/[^"/]+\.css)">/);
if (!stylesheetTag) throw new Error("Vite output is missing the site stylesheet");
const stylesheet = await readFile(join(dist, stylesheetTag[1].slice(1)), "utf8");
if (/<\/style/i.test(stylesheet)) throw new Error("Stylesheet cannot be safely inlined");
const styledTemplate = template.replace(stylesheetTag[0], `<style data-site-styles>${stylesheet}</style>`);
const startMarker = "<!-- SEO_START -->";
const endMarker = "<!-- SEO_END -->";
const headStart = styledTemplate.indexOf(startMarker);
const headEnd = styledTemplate.indexOf(endMarker);
if (headStart < 0 || headEnd < headStart || !styledTemplate.includes('<div id="root"></div>')) {
  throw new Error("Vite output is missing the SEO or React root marker");
}

const escapeHtml = value => String(value).replace(/[&"<>]/g, character => ({
  "&": "&amp;", '"': "&quot;", "<": "&lt;", ">": "&gt;",
})[character]);

const vite = await createServer({
  logLevel: "error",
  server: { middlewareMode: true, hmr: false },
  appType: "custom",
});

try {
  const { renderPage } = await vite.ssrLoadModule("/src/entry-server.tsx");
  const { supportedLocales } = await vite.ssrLoadModule("/src/languagePreferences.ts");
  const urls = [];

  for (const locale of supportedLocales) {
    const { content, seo } = await renderPage(locale);
    const image = "https://zarp.dev/assets/zarp-logo.jpg";
    const alternates = [
      ...seo.alternates.map(({ language, url }) =>
        `<link rel="alternate" hreflang="${language}" href="${escapeHtml(url)}" />`),
      '<link rel="alternate" hreflang="x-default" href="https://zarp.dev/" />',
    ];
    const head = [
      `<meta name="description" content="${escapeHtml(seo.description)}" />`,
      `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`,
      ...alternates,
      '<meta property="og:type" content="website" />',
      '<meta property="og:site_name" content="Zarp" />',
      `<meta property="og:url" content="${escapeHtml(seo.canonical)}" />`,
      `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
      `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
      `<meta property="og:image" content="${image}" />`,
      '<meta property="og:image:width" content="200" />',
      '<meta property="og:image:height" content="200" />',
      '<meta name="twitter:card" content="summary" />',
      `<title>${escapeHtml(seo.title)}</title>`,
      `<script type="application/ld+json">${JSON.stringify(seo.structuredData).replace(/</g, "\\u003c")}</script>`,
    ].join("\n    ");
    const localized = styledTemplate.replace(
      '<html lang="en">',
      `<html lang="${locale}" dir="${locale === "fa" ? "rtl" : "ltr"}">`,
    );
    const start = localized.indexOf(startMarker);
    const end = localized.indexOf(endMarker);
    const page = localized.slice(0, start) + head + localized.slice(end + endMarker.length);
    const html = page.replace('<div id="root"></div>', `<div id="root">${content}</div>`);
    const target = join(dist, locale === "en" ? "index.html" : `${locale}/index.html`);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, html);
    urls.push(seo.canonical);
  }

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map(url => `  <url><loc>${escapeHtml(url)}</loc></url>`),
    '</urlset>',
    '',
  ].join("\n");
  await writeFile(join(dist, "sitemap.xml"), sitemap);
  await writeFile(join(dist, "404.html"), `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta name="robots" content="noindex" />
<meta name="viewport" content="width=device-width, initial-scale=1" /><title>Page not found - Zarp</title>
<style>body{min-height:100vh;margin:0;display:grid;place-items:center;background:#101113;color:#f5f5f6;font:1rem system-ui}main{text-align:center}a{color:#ff8227}</style>
</head><body><main><h1>Page not found</h1><p><a href="/">Go to Zarp</a></p></main></body></html>\n`);
  process.stdout.write(`Prerendered ${urls.length} language pages and sitemap.xml\n`);
} finally {
  await vite.close();
}
