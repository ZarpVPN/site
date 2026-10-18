import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const dist = resolve("dist");
const locales = ["en", "ru", "es", "pt", "zh", "fr", "de", "fa"];
const url = locale => `https://zarp.dev/${locale === "en" ? "" : `${locale}/`}`;
const sitemap = await readFile(join(dist, "sitemap.xml"), "utf8");
const robots = await readFile(join(dist, "robots.txt"), "utf8");
assert.ok(robots.includes("Sitemap: https://zarp.dev/sitemap.xml"));

for (const locale of locales) {
  const html = await readFile(join(dist, locale === "en" ? "index.html" : `${locale}/index.html`), "utf8");
  assert.ok(html.includes(`<html lang="${locale}" dir="${locale === "fa" ? "rtl" : "ltr"}">`));
  assert.ok(html.includes('<main id="main">'));
  assert.ok(html.includes('<h1 id="hero-title">'));
  assert.ok(html.includes('<section class="downloads'));
  assert.ok(html.includes('<style data-site-styles>'));
  assert.ok(!html.includes('rel="stylesheet"'));
  assert.ok(html.includes(`rel="canonical" href="${url(locale)}"`));
  assert.ok(html.includes('name="description" content="'));
  assert.equal((html.match(/<title>/g) ?? []).length, 1);
  assert.equal((html.match(/rel="canonical"/g) ?? []).length, 1);
  assert.equal((html.match(/name="description"/g) ?? []).length, 1);
  assert.ok(html.includes(`property="og:url" content="${url(locale)}"`));
  assert.ok(html.includes('<script type="application/ld+json">'));
  assert.ok(!html.includes("<!-- SEO_START -->"));
  assert.ok(!html.includes('src="./assets/'));
  assert.ok(sitemap.includes(`<loc>${url(locale)}</loc>`));
  for (const alternative of locales) {
    assert.ok(html.includes(`hreflang="${alternative}" href="${url(alternative)}"`));
  }
  assert.ok(html.includes(`hreflang="x-default" href="${url("en")}"`));
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  assert.equal(JSON.parse(json)["@graph"][1]["@type"], "SoftwareApplication");
}
assert.equal((sitemap.match(/<loc>/g) ?? []).length, locales.length);
assert.ok((await readFile(join(dist, "404.html"), "utf8")).includes('name="robots" content="noindex"'));
process.stdout.write(`Validated SEO output for ${locales.length} locales\n`);
