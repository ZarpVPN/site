import { platforms } from "./data";
import type { PlatformId } from "./data";
import { languages, languageStorageKey, localePath } from "./languagePreferences";
import { configurePageScrolling } from "./pageScroll";
import { screenshotSources, screenshotSrcSet, screenshotUrl } from "./screenshotSources";
import { installSmoothAnchors } from "./smoothAnchors";

const icon = (name: string) => {
  const element = document.createElement("span");
  const source = `url("${import.meta.env.BASE_URL}assets/icons/${name}.svg")`;
  element.className = "icon";
  element.style.maskImage = source;
  element.style.webkitMaskImage = source;
  element.setAttribute("aria-hidden", "true");
  return element;
};

function initHeader() {
  const header = document.querySelector<HTMLElement>(".header");
  const navigation = document.getElementById("main-nav");
  const toggle = document.querySelector<HTMLButtonElement>(".menu-toggle");
  if (!header || !navigation || !toggle) return;
  const measure = () => document.documentElement.style.setProperty(
    "--header-height", `${header.getBoundingClientRect().height}px`,
  );
  new ResizeObserver(measure).observe(header);
  measure();
  const setOpen = (open: boolean) => {
    navigation.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? toggle.dataset.closeLabel ?? "" : toggle.dataset.openLabel ?? "");
    const current = toggle.querySelector(".icon");
    current?.replaceWith(icon(open ? "close" : "menu"));
  };
  toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
  navigation.querySelectorAll<HTMLAnchorElement>("a").forEach(link =>
    link.addEventListener("click", () => setOpen(false)),
  );
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
}

function initLanguages() {
  const container = document.querySelector<HTMLElement>(".language-switcher");
  const trigger = container?.querySelector<HTMLButtonElement>(".language-trigger");
  const label = container?.querySelector<HTMLElement>(".language-label");
  if (!container || !trigger || !label) return;
  const locale = document.documentElement.lang;
  const selected = Math.max(0, languages.findIndex(language => language.locale === locale));
  const baseId = label.id.slice(0, -"-label".length);
  const menuId = trigger.getAttribute("aria-controls") ?? `${baseId}-list`;
  let active = selected;
  let menu: HTMLDivElement | null = null;
  let search = "";
  let searchTime = 0;
  const setActive = (index: number) => {
    active = index;
    menu?.querySelectorAll<HTMLElement>(".language-option").forEach((option, optionIndex) =>
      option.classList.toggle("is-active", optionIndex === active),
    );
    if (menu) {
      trigger.setAttribute("aria-activedescendant", `${baseId}-${languages[active].locale}`);
      menu.children[active]?.scrollIntoView({ block: "nearest" });
    }
  };
  const close = () => {
    menu?.remove();
    menu = null;
    trigger.setAttribute("aria-expanded", "false");
    trigger.removeAttribute("aria-activedescendant");
  };
  const choose = (index: number) => {
    close();
    const next = languages[index].locale;
    try { localStorage.setItem(languageStorageKey, next); } catch { /* Storage is optional. */ }
    if (next !== locale) {
      trigger.setAttribute("aria-busy", "true");
      location.assign(`${localePath(next)}${location.search}${location.hash}`);
    }
  };
  const open = () => {
    if (menu) return;
    menu = document.createElement("div");
    menu.className = "language-menu";
    menu.id = menuId;
    menu.setAttribute("role", "listbox");
    menu.setAttribute("aria-labelledby", label.id);
    languages.forEach((language, index) => {
      const option = document.createElement("div");
      option.id = `${baseId}-${language.locale}`;
      option.className = `language-option${index === active ? " is-active" : ""}`;
      option.setAttribute("role", "option");
      option.setAttribute("aria-selected", String(index === selected));
      const name = document.createElement("bdi");
      name.lang = language.locale;
      name.translate = false;
      name.textContent = language.name;
      option.append(name);
      if (index === selected) option.append(icon("check"));
      option.addEventListener("mousedown", event => event.preventDefault());
      option.addEventListener("click", () => choose(index));
      menu!.append(option);
    });
    container.append(menu);
    trigger.setAttribute("aria-expanded", "true");
    setActive(active);
  };
  trigger.addEventListener("click", () => {
    if (menu) close();
    else {
      active = selected;
      search = "";
      open();
    }
  });
  trigger.addEventListener("keydown", event => {
    if (event.key === "Tab") return close();
    if (event.key === "Escape") {
      if (menu) {
        event.preventDefault();
        event.stopPropagation();
        close();
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (menu) choose(active);
      else {
        active = selected;
        open();
      }
    } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const wasOpen = !!menu;
      open();
      if (event.key === "Home") setActive(0);
      else if (event.key === "End") setActive(languages.length - 1);
      else if (!wasOpen) setActive(selected);
      else setActive((active + (event.key === "ArrowDown" ? 1 : languages.length - 1)) % languages.length);
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey && !event.isComposing) {
      event.preventDefault();
      const now = performance.now();
      search = (now - searchTime < 700 ? search : "") + event.key.toLocaleLowerCase();
      searchTime = now;
      const term = [...search].every(character => character === search[0]) ? search[0] : search;
      const next = languages.map((_, index) => (active + index + 1) % languages.length)
        .find(index => languages[index].name.toLocaleLowerCase().startsWith(term));
      if (next !== undefined) {
        open();
        setActive(next);
      }
    }
  });
  document.addEventListener("pointerdown", event => {
    if (menu && !container.contains(event.target as Node)) close();
  });
  container.addEventListener("focusout", event => {
    if (!container.contains(event.relatedTarget as Node)) close();
  });
}

function initProduct() {
  const section = document.querySelector<HTMLElement>(".product");
  const tabs = section?.querySelectorAll<HTMLButtonElement>('.platform-tabs [role="tab"]');
  const area = section?.querySelector<HTMLElement>(".screenshot-area");
  const title = section?.querySelector<HTMLElement>("#product-window-title");
  const repository = section?.querySelector<HTMLAnchorElement>(".screenshot-caption a");
  if (!section || !tabs?.length || !area || !title || !repository) return;
  const localize = (template: string | undefined, platform: string) =>
    (template ?? "").replace("{platform}", platform);
  const select = (index: number) => {
    if (tabs[index].getAttribute("aria-selected") === "true") return;
    const platform = platforms[index];
    tabs.forEach((tab, tabIndex) => {
      tab.setAttribute("aria-selected", String(tabIndex === index));
      tab.tabIndex = tabIndex === index ? 0 : -1;
    });
    title.textContent = localize(section.dataset.windowTitle, platform.label);
    area.classList.toggle("screenshot-android", platform.id === "android");
    const originalWidth = platform.id === "macos" ? 2000 : platform.id === "android" ? 1136 : 1252;
    const image = document.createElement("img");
    image.loading = "lazy";
    image.sizes = screenshotSources[platform.id].sizes;
    image.srcset = screenshotSrcSet(platform.id, originalWidth);
    image.src = screenshotUrl(platform.id, originalWidth, originalWidth);
    image.alt = localize(section.dataset.screenshotAlt, platform.label);
    image.width = originalWidth;
    image.height = platform.id === "macos" ? 827 : platform.id === "android" ? 703 : 768;
    area.querySelector("img")?.replaceWith(image);
    repository.href = `https://github.com/ZarpVPN/${platform.repo}`;
    const label = repository.firstChild;
    if (label?.nodeType === Node.TEXT_NODE) label.textContent = `${localize(section.dataset.repositoryLabel, platform.label)} `;
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => select(index));
    tab.addEventListener("keydown", event => {
      const rtl = document.documentElement.dir === "rtl";
      let next = index;
      if (event.key === "ArrowRight") next = (index + (rtl ? tabs.length - 1 : 1)) % tabs.length;
      else if (event.key === "ArrowLeft") next = (index + (rtl ? 1 : tabs.length - 1)) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;
      else return;
      event.preventDefault();
      select(next);
      tabs[next].focus();
    });
  });
}

function initFaq() {
  document.querySelectorAll<HTMLButtonElement>(".faq-question").forEach(button => {
    const answer = document.getElementById(button.getAttribute("aria-controls") ?? "");
    if (!answer) return;
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      answer.classList.toggle("is-open", open);
      answer.setAttribute("aria-hidden", String(!open));
      answer.inert = !open;
    });
  });
}

function initDownloads() {
  const section = document.getElementById("download");
  if (!section) return;
  const agent = navigator.userAgent;
  const device: PlatformId | "" = /Android/i.test(agent) ? "android" : /Windows/i.test(agent) ? "windows" : /Macintosh/i.test(agent) ? "macos" : "";
  if (device) {
    const card = document.getElementById(`download-${device}`);
    const heading = card?.querySelector(".os-heading");
    const button = card?.querySelector(".download-button");
    if (card && heading && button) {
      card.classList.add("recommended");
      button.classList.remove("button-secondary");
      button.classList.add("button-primary");
      const tag = document.createElement("span");
      tag.className = "recommended-tag";
      tag.textContent = section.dataset.yourDevice ?? "";
      heading.append(tag);
    }
  }
  let started = false;
  const load = () => {
    if (started) return;
    started = true;
    observer?.disconnect();
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    void import("./releaseApi")
      .then(({ fetchLatestReleases }) => fetchLatestReleases(controller.signal))
      .then(values => {
        if (controller.signal.aborted) return;
        values.forEach(({ id, release }) => {
          const card = document.getElementById(`download-${id}`);
          if (!card) return;
          const version = card.querySelector(".release-version bdi");
          const download = card.querySelector<HTMLAnchorElement>(".download-button");
          const meta = card.querySelector(".download-meta bdi");
          const about = card.querySelector<HTMLAnchorElement>(".download-meta a");
          if (version) version.textContent = release.version;
          if (download) download.href = release.url;
          if (about) about.href = release.releaseUrl;
          if (meta) meta.textContent = `${card.dataset.format} · ${new Intl.NumberFormat(document.documentElement.lang, {
            minimumFractionDigits: 1, maximumFractionDigits: 1,
          }).format(release.size / 1024 / 1024)} ${card.dataset.sizeUnit}`;
        });
        if (values.length === platforms.length) {
          const note = section.querySelector<HTMLElement>(".download-footnote > span");
          const label = [...(note?.childNodes ?? [])].find(node => node.nodeType === Node.TEXT_NODE);
          if (label) label.textContent = note?.dataset.liveLabel ?? "";
        }
      })
      .catch(() => { /* Built-in release links remain available. */ })
      .finally(() => clearTimeout(timeout));
  };
  const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting)) load();
  }, { rootMargin: "400px 0px" });
  if (observer) observer.observe(section);
  else load();
}

export function initClient() {
  configurePageScrolling();
  installSmoothAnchors();
  initHeader();
  initLanguages();
  initProduct();
  initFaq();
  initDownloads();
  requestAnimationFrame(() => void import("./clientHero").then(({ initHero }) => initHero()));
}
