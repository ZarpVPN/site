import { useI18n } from "./i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useEffect, useRef, useState } from "react";
import { Icon, Logo } from "./Icons";
import type { IconName } from "./Icons";
import { github, platforms } from "./data";
import { useReleases } from "./useReleases";
import { useSmoothAnchors } from "./useSmoothAnchors";
import HeroLayers from "./HeroLayers";
import Product from "./Product";
import FAQ from "./FAQ";
import { DownloadCard } from "./DownloadCard";

const copyrightYear = new Date().getFullYear();

const external = { target: "_blank", rel: "noopener noreferrer" };
const nav = [
  { href: "#features", label: "features" },
  { href: "#how-it-works", label: "howItWorks" },
  { href: "#faq", label: "questions" },
];
function Header() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const element = header.current;
    if (!element) return;
    const measure = () =>
      document.documentElement.style.setProperty(
        "--header-height",
        `${element.getBoundingClientRect().height}px`,
      );
    const observer = new ResizeObserver(measure);
    observer.observe(element, { box: "border-box" });
    measure();
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty("--header-height");
    };
  }, []);
  useEffect(() => {
    const close = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    if (open) document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="header" ref={header}>
      <div className="container header-inner">
        <a href="#" aria-label={t("home")}>
          <Logo />
        </a>
        <nav
          className={open ? "navigation is-open" : "navigation"}
          id="main-nav"
          aria-label={t("navigation")}
        >
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {t(item.label)}
            </a>
          ))}
          <a href={github} {...external} onClick={() => setOpen(false)}>
            GitHub <Icon name="up-right" />
          </a>
          <LanguageSwitcher />
        </nav>
        <a className="button header-download" href="#download">
          {t("downloadZarp")} <Icon name="download" />
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? t("closeMenu") : t("openMenu")}
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} />
        </button>
      </div>
    </header>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="hero-badge">
          <span /> {t("heroBadge")} </div>
        <h1 id="hero-title">
          {t("heroTitle")} <br />
          {t("heroTitleMiddle")} <span>{t("heroTitleAccent")}</span>
        </h1>
        <p className="hero-description">
          {t("heroDescription")} <br className="desktop-break" /> {t("heroDescriptionSecond")} <br className="desktop-break" /> {t("heroDescriptionThird")} </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#download">
            {t("downloadFree")} <Icon name="arrow" className="directional-arrow" />
          </a>
          <a className="button button-secondary" href={github} {...external}>
            <Icon name="github" /> {t("openSource")} </a>
        </div>
        <div className="hero-platforms">
          {platforms.map((p) => (
            <a href={`#download-${p.id}`} key={p.id}>
              <Icon name={p.id} />
              <span>{p.label}</span>
            </a>
          ))}
          <span className="platform-divider" />
          <span className="no-account">{t("noRegistration")}</span>
        </div>
      </div>
      <div className="hero-visual">
        <HeroLayers />
      </div>
      <div className="hero-baseline">
        <span>{t("heroBaseline")}</span>
      </div>
    </section>
  );
}

function Features() {
  const { t } = useI18n();
  return (
    <section className="features section-space container" id="features">
      <div className="section-intro">
        <div>
          <p className="eyebrow">{t("featuresEyebrow")}</p>
          <h2 className="section-heading">
            {t("featuresTitle")} <br />
            <span className="muted">{t("featuresSubtitle")}</span>
          </h2>
        </div>
        <p className="section-description">
          {t("featuresDescription")} <br />
          {t("featuresDescriptionSecond")} </p>
      </div>
      <div className="feature-grid">
        <article className="feature-card feature-scan">
          <div className="feature-icon">
            <Icon name="route" />
          </div>
          <h3>
            {t("scanTitle")} <br />
            {t("scanSubtitle")} </h3>
          <p>
            {t("scanDescription")} </p>
          <div className="scan-visual" aria-hidden="true">
            <div className="scan-row">
              <span className="scan-number">01</span>
              <span>MASQUE / HTTP3</span>
              <span className="scan-result muted">{t("checking")}</span>
            </div>
            <div className="scan-row">
              <span className="scan-number">02</span>
              <span>TLS / HTTP2</span>
              <span className="scan-result muted">{t("checking")}</span>
            </div>
            <div className="scan-row scan-success">
              <span className="scan-number">03</span>
              <span>{t("workingStrategy")}</span>
              <span className="scan-result">
                <Icon name="check" />
                <Icon name="check" />
              </span>
            </div>
          </div>
          <span className="visual-note">{t("scanNote")}</span>
        </article>
        <article className="feature-card feature-privacy">
          <div className="feature-icon">
            <Icon name="shield" />
          </div>
          <h3>
            {t("openSource")} <br />
            {t("noTelemetry")} </h3>
          <p>
            {t("privacyDescription")} </p>
          <div className="privacy-visual" aria-hidden="true">
            <div className="shield-ring ring-outer" />
            <div className="shield-ring ring-inner" />
            <Icon name="shield" />
            <span className="privacy-badge">
              <Icon name="check" /> {t("noTelemetry")}
            </span>
          </div>
          <a
            className="text-link"
            href={`${github}/Zarp#privacy`}
            {...external}
          >
            {t("privacyLink")} <Icon name="up-right" />
          </a>
        </article>
        <article className="feature-card compact-card">
          <div className="feature-icon">
            <Icon name="refresh" />
          </div>
          <div>
            <h3>{t("restoreTitle")}</h3>
            <p>
              {t("restoreDescription")} </p>
          </div>
        </article>
        <article className="feature-card compact-card">
          <div className="feature-icon">
            <Icon name="bolt" />
          </div>
          <div>
            <h3>{t("lightweightTitle")}</h3>
            <p>
              {t("lightweightDescription")} </p>
          </div>
        </article>
      </div>
      <div className="facts-row">
        <span>
          <b>3</b> {t("platforms")} </span>
        <span>
          <b>8</b> {t("interfaceLanguages")} </span>
        <span>
          <Icon name="code" /> {t("publicSource")} </span>
        <span>
          <Icon name="check" /> {t("freeApps")} </span>
      </div>
    </section>
  );
}

function GettingStarted() {
  const { t } = useI18n();
  return (
    <section
      className="getting-started section-space container"
      id="how-it-works"
    >
      <div className="section-intro">
        <div>
          <p className="eyebrow">{t("stepsEyebrow")}</p>
          <h2 className="section-heading">
            {t("stepsTitle")} <br />
            <span className="muted">{t("stepsSubtitle")}</span>
          </h2>
        </div>
        <p className="section-description">
          {t("stepsDescription")} <br />
          {t("stepsDescriptionSecond")} </p>
      </div>
      <div className="steps">
        {[
          {
            n: "01",
            icon: "download",
            title: "stepDownload",
            text: "stepDownloadText",
          },
          {
            n: "02",
            icon: "power",
            title: "stepConnect",
            text: "stepConnectText",
          },
          {
            n: "03",
            icon: "check",
            title: "stepStrategy",
            text: "stepStrategyText",
          },
        ].map((step) => (
          <article className="step" key={step.n}>
            <div className="step-top">
              <span>{step.n}</span>
              <Icon name={step.icon as IconName} />
            </div>
            <h3>{t(step.title)}</h3>
            <p>{t(step.text)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Advanced() {
  const { t } = useI18n();
  return (
    <section className="advanced container">
      <div className="advanced-copy">
        <p className="eyebrow">{t("advancedEyebrow")}</p>
        <h2>
          {t("advancedTitle")} <br />
          <span className="muted">{t("advancedSubtitle")}</span>
        </h2>
        <p>
          {t("advancedDescription")} </p>
        <a
          className="text-link"
          href={`${github}/Zarp/blob/main/docs/connection-settings.md`}
          {...external}
        >
          {t("settingsLink")} <Icon name="up-right" />
        </a>
      </div>
      <div className="advanced-options">
        <div className="protocols">
          <span>VLESS</span>
          <span>Trojan</span>
          <span>Hysteria2</span>
          <span>XHTTP</span>
        </div>
        <div className="route-item">
          <Icon name="route" />
          <div>
            <h3>{t("routingTitle")}</h3>
            <p>{t("routingDescription")}</p>
          </div>
        </div>
        <div className="route-item">
          <Icon name="windows" />
          <div>
            <h3>{t("appSelection")}</h3>
            <p>{t("appSelectionText")}</p>
          </div>
        </div>
        <span className="advanced-note">
          {t("advancedNote")} </span>
      </div>
    </section>
  );
}

function Downloads() {
  const { t } = useI18n();
  const { releases, live } = useReleases();
  const [detected] = useState(() => {
    const agent = navigator.userAgent;
    if (/Android/i.test(agent)) return "android";
    if (/Windows/i.test(agent)) return "windows";
    if (/Macintosh/i.test(agent)) return "macos";
    return "";
  });
  return (
    <section className="downloads section-space container" id="download">
      <div className="download-heading">
        <p className="eyebrow">{t("downloadEyebrow")}</p>
        <h2 className="section-heading">
          {t("downloadTitle")} <br />
          <span className="accent">{t("downloadSubtitle")}</span>
        </h2>
        <p>{t("downloadDescription")}</p>
      </div>
      <div className="download-grid">
        {platforms.map(p => (
          <DownloadCard
            key={p.id}
            platform={p}
            release={releases[p.id]}
            recommended={detected === p.id}
          />
        ))}
      </div>
      <div className="download-footnote">
        <span>
          <Icon name="github" />
          {live
            ? t("releasesLive")
            : t("releasesFallback")}
        </span>
        <a href={github} {...external}>
          {t("allRepositories")} <Icon name="up-right" />
        </a>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <a href="#" aria-label={t("home")}>
              <Logo />
            </a>
            <p>{t("footerTagline")}</p>
          </div>
          <div className="footer-links">
            <div>
              <span>{t("apps")}</span>
              {platforms.map((p) => (
                <a key={p.id} href={`#download-${p.id}`}>
                  {p.label}
                </a>
              ))}
            </div>
            <div>
              <span>{t("project")}</span>
              <a href={github} {...external}>
                {t("sourceCode")} <Icon name="up-right" />
              </a>
              <a href={`${github}/Zarp/issues`} {...external}>
                {t("feedback")} <Icon name="up-right" />
              </a>
              <a href={`${github}/Zarp#privacy`} {...external}>
                {t("privacy")} <Icon name="up-right" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {copyrightYear} Zarp · {t("openSource")}</span>
          <p>
            {t("disclaimer")} <br />
            {t("trademarks")} </p>
          <a href="#" className="back-top" aria-label={t("backTop")}>
            <Icon name="arrow" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const { t } = useI18n();
  useSmoothAnchors();
  return (
    <>
      <a className="skip-link" href="#main">
        {t("skipContent")} </a>
      <Header />
      <main id="main">
        <Hero />
        <Features />
        <Product />
        <GettingStarted />
        <Advanced />
        <Downloads />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
