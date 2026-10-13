import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { Icon, Logo } from "./Icons";
import type { IconName } from "./Icons";
import { faqs, github, platforms } from "./data";
import { useReleases } from "./useReleases";
import "./App.css";
import "./motion.css";
import HeroLayers from "./HeroLayers";

const copyrightYear = new Date().getFullYear();

const asset = (file: string) => `${import.meta.env.BASE_URL}assets/${file}`;
const external = { target: "_blank", rel: "noopener noreferrer" };
const nav = [
  { href: "#features", label: "Возможности" },
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#faq", label: "Вопросы" },
];
function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
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
    <header className="header">
      <div className="container header-inner">
        <a href="#" aria-label="Zarp — на главную">
          <Logo />
        </a>
        <nav
          className={open ? "navigation is-open" : "navigation"}
          id="main-nav"
          aria-label="Главная навигация"
        >
          {nav.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
              {item.label}
            </a>
          ))}
          <a href={github} {...external} onClick={() => setOpen(false)}>
            GitHub <Icon name="up-right" />
          </a>
        </nav>
        <a className="button header-download" href="#download">
          Скачать Zarp <Icon name="download" />
        </a>
        <button
          ref={toggle}
          className="menu-toggle"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
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
  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <div className="hero-badge">
          <span /> СВОБОДНЫЙ ИНТЕРНЕТ НАЧИНАЕТСЯ ЗДЕСЬ
        </div>
        <h1 id="hero-title">
          Интернет без
          <br />
          лишних <span>преград</span>
        </h1>
        <p className="hero-description">
          Ваша сеть блокирует WARP? Zarp найдёт рабочий путь.
          <br className="desktop-break" /> Автоматический обход DPI. Одно
          нажатие.
          <br className="desktop-break" /> Без ручной настройки.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#download">
            Скачать бесплатно <Icon name="arrow" />
          </a>
          <a className="button button-secondary" href={github} {...external}>
            <Icon name="github" /> Открытый код
          </a>
        </div>
        <div className="hero-platforms">
          {platforms.map((p) => (
            <a href={`#download-${p.id}`} key={p.id}>
              <Icon name={p.id} />
              <span>{p.label}</span>
            </a>
          ))}
          <span className="platform-divider" />
          <span className="no-account">Без аккаунта Zarp</span>
        </div>
      </div>
      <div className="hero-visual">
        <HeroLayers />
      </div>
      <div className="hero-baseline">
        <span>МЕНЬШЕ НАСТРОЕК · БОЛЬШЕ ИНТЕРНЕТА</span>
        <a href="#features" aria-label="Перейти к возможностям">
          <Icon name="arrow" />
        </a>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section className="features section-space container" id="features">
      <div className="section-intro">
        <div>
          <p className="eyebrow">Продумано внутри</p>
          <h2 className="section-heading">
            Сложная технология
            <br />
            <span className="muted">Простой опыт</span>
          </h2>
        </div>
        <p className="section-description">
          Zarp берёт настройку соединения на себя.
          <br />
          Вы просто пользуетесь интернетом.
        </p>
      </div>
      <div className="feature-grid">
        <article className="feature-card feature-scan">
          <div className="feature-icon">
            <Icon name="route" />
          </div>
          <h3>
            Находит путь,
            <br />
            который работает
          </h3>
          <p>
            Подбирает стратегию обхода DPI для вашей сети. Каждый кандидат
            проходит две проверки. Рабочий вариант сохраняется для следующих
            подключений.
          </p>
          <div className="scan-visual" aria-hidden="true">
            <div className="scan-row">
              <span className="scan-number">01</span>
              <span>MASQUE / HTTP3</span>
              <span className="scan-result muted">проверка</span>
            </div>
            <div className="scan-row">
              <span className="scan-number">02</span>
              <span>TLS / HTTP2</span>
              <span className="scan-result muted">проверка</span>
            </div>
            <div className="scan-row scan-success">
              <span className="scan-number">03</span>
              <span>Рабочая стратегия</span>
              <span className="scan-result">
                <Icon name="check" />
                <Icon name="check" />
              </span>
            </div>
          </div>
          <span className="visual-note">Схема автоматического подбора</span>
        </article>
        <article className="feature-card feature-privacy">
          <div className="feature-icon">
            <Icon name="shield" />
          </div>
          <h3>
            Открытый код
            <br />
            Без телеметрии
          </h3>
          <p>
            В Zarp нет сбора персональных данных. Настройки остаются на
            устройстве, а код доступен для проверки.
          </p>
          <div className="privacy-visual" aria-hidden="true">
            <div className="shield-ring ring-outer" />
            <div className="shield-ring ring-inner" />
            <Icon name="shield" />
            <span className="privacy-badge">
              <Icon name="check" /> No telemetry
            </span>
          </div>
          <a
            className="text-link"
            href={`${github}/Zarp#privacy`}
            {...external}
          >
            Как устроена приватность <Icon name="up-right" />
          </a>
        </article>
        <article className="feature-card compact-card">
          <div className="feature-icon">
            <Icon name="refresh" />
          </div>
          <div>
            <h3>Восстанавливает связь</h3>
            <p>
              Если сохранённая стратегия перестала работать, Zarp пробует другие
              проверенные варианты.
            </p>
          </div>
        </article>
        <article className="feature-card compact-card">
          <div className="feature-icon">
            <Icon name="bolt" />
          </div>
          <div>
            <h3>Без лишней нагрузки</h3>
            <p>
              Обход DPI нацелен на установление соединения. Сам трафик туннеля
              не изменяется стратегией.
            </p>
          </div>
        </article>
      </div>
      <div className="facts-row">
        <span>
          <b>3</b> платформы
        </span>
        <span>
          <b>8</b> языков интерфейса
        </span>
        <span>
          <Icon name="code" /> публичные исходники
        </span>
        <span>
          <Icon name="check" /> бесплатные приложения
        </span>
      </div>
    </section>
  );
}

function Product() {
  const [selected, setSelected] = useState(0);
  const current = platforms[selected];
  const keys = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % platforms.length;
    else if (event.key === "ArrowLeft")
      next = (index + platforms.length - 1) % platforms.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = platforms.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    document.getElementById(`tab-${platforms[next].id}`)?.focus();
  };
  return (
    <section className="product section-space container">
      <div className="section-intro">
        <div>
          <p className="eyebrow">Никакой магии. Просто Zarp</p>
          <h2 className="section-heading">
            Одна кнопка
            <br />
            <span className="muted">На ваших устройствах</span>
          </h2>
        </div>
        <div
          className="platform-tabs"
          role="tablist"
          aria-label="Скриншоты приложений"
        >
          {platforms.map((p, i) => (
            <button
              key={p.id}
              id={`tab-${p.id}`}
              role="tab"
              aria-selected={selected === i}
              aria-controls="product-panel"
              tabIndex={selected === i ? 0 : -1}
              onKeyDown={(e) => keys(e, i)}
              onClick={() => setSelected(i)}
            >
              <Icon name={p.id} />
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div
        className={`product-window product-${current.id}`}
        role="tabpanel"
        id="product-panel"
        aria-labelledby={`tab-${current.id}`}
        tabIndex={0}
      >
        <div className="window-toolbar">
          <span className="window-dots">
            <i />
            <i />
            <i />
          </span>
          <span>Zarp для {current.label}</span>
          <a
            href={asset(current.screenshot)}
            {...external}
            aria-label={`Открыть скриншот ${current.label} в полном размере`}
          >
            <Icon name="up-right" />
          </a>
        </div>
        <div className="screenshot-area">
          {platforms.map((p, i) => (
            <img
              key={p.id}
              className={selected === i ? "is-active" : ""}
              src={asset(p.screenshot)}
              alt={`Официальный скриншот Zarp для ${p.label}: главный экран, стратегии и настройки`}
              aria-hidden={selected !== i}
              loading="lazy"
              width={p.id === "macos" ? 2000 : p.id === "android" ? 1136 : 1252}
              height={p.id === "macos" ? 827 : p.id === "android" ? 704 : 768}
            />
          ))}
        </div>
        <div className="screenshot-caption">
          <span>
            <span className="small-dot" /> Реальный интерфейс приложения
          </span>
          <a href={`${github}/${current.repo}`} {...external}>
            Репозиторий {current.label} <Icon name="up-right" />
          </a>
        </div>
      </div>
    </section>
  );
}

function GettingStarted() {
  return (
    <section
      className="getting-started section-space container"
      id="how-it-works"
    >
      <div className="section-intro">
        <div>
          <p className="eyebrow">От загрузки до подключения</p>
          <h2 className="section-heading">
            Начать проще,
            <br />
            <span className="muted">чем кажется</span>
          </h2>
        </div>
        <p className="section-description">
          Первая проверка может занять минуту-две.
          <br />
          Дальше Zarp использует сохранённую стратегию.
        </p>
      </div>
      <div className="steps">
        {[
          {
            n: "01",
            icon: "download",
            title: "Скачайте приложение",
            text: "Выберите свою платформу. Все файлы — из официальных релизов на GitHub.",
          },
          {
            n: "02",
            icon: "power",
            title: "Нажмите подключить",
            text: "Пройдите первый запуск по инструкции платформы и отключите другие VPN перед поиском.",
          },
          {
            n: "03",
            icon: "check",
            title: "Zarp найдёт стратегию",
            text: "Приложение проверит варианты, сохранит рабочий и подключится. Результат зависит от вашей сети.",
          },
        ].map((step) => (
          <article className="step" key={step.n}>
            <div className="step-top">
              <span>{step.n}</span>
              <Icon name={step.icon as IconName} />
            </div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Advanced() {
  return (
    <section className="advanced container">
      <div className="advanced-copy">
        <p className="eyebrow">Для тех, кто хочет больше</p>
        <h2>
          Ваш сервер
          <br />
          <span className="muted">Тот же умный подход</span>
        </h2>
        <p>
          На Windows и Android можно подключить собственный сервер или
          HTTPS-подписку. Zarp подберёт рабочую пару «стратегия + сервер».
        </p>
        <a
          className="text-link"
          href={`${github}/Zarp/blob/main/docs/connection-settings.md`}
          {...external}
        >
          Подробнее о настройке <Icon name="up-right" />
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
            <h3>Гибкая маршрутизация</h3>
            <p>Direct, Proxy и Block. Правила для доменов и IP.</p>
          </div>
        </div>
        <div className="route-item">
          <Icon name="windows" />
          <div>
            <h3>Выбор приложений</h3>
            <p>Решайте, какие программы используют туннель.</p>
          </div>
        </div>
        <span className="advanced-note">
          Поддержка зависит от платформы и параметров сервера.
        </span>
      </div>
    </section>
  );
}

function Downloads() {
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
        <p className="eyebrow">Готовы подключиться?</p>
        <h2 className="section-heading">
          Ваш интернет
          <br />
          <span className="accent">В одном скачивании</span>
        </h2>
        <p>Выберите платформу. Установите Zarp. Найдите свой путь.</p>
      </div>
      <div className="download-grid">
        {platforms.map((p) => {
          const r = releases[p.id];
          return (
            <article
              className={`download-card ${detected === p.id ? "recommended" : ""}`}
              id={`download-${p.id}`}
              key={p.id}
            >
              <div className="download-card-top">
                <span className="os-icon">
                  <Icon name={p.id} />
                </span>
                <span className="release-version">{r.version}</span>
              </div>
              <div className="os-heading">
                <h3>{p.label}</h3>
                {detected === p.id && (
                  <span className="recommended-tag">Ваше устройство</span>
                )}
              </div>
              <p className="os-requirements">{p.requirements}</p>
              <p className="os-description">{p.description}</p>
              <a
                className={`button ${detected === p.id ? "button-primary" : "button-secondary"} download-button`}
                href={r.url}
              >
                <Icon name="download" />
                Скачать для {p.label}
                <Icon name="arrow" />
              </a>
              <div className="download-meta">
                <span>
                  {p.format} · {(r.size / 1024 / 1024).toFixed(1)} МБ
                </span>
                <a href={r.releaseUrl} {...external}>
                  О релизе <Icon name="up-right" />
                </a>
              </div>
              <a
                className="install-guide"
                href={`${github}/${p.repo}#${p.id === "macos" ? "first-launch" : "usage"}`}
                {...external}
              >
                Инструкция по установке <Icon name="up-right" />
              </a>
            </article>
          );
        })}
      </div>
      <div className="download-footnote">
        <span>
          <Icon name="github" />
          {live
            ? "Последние релизы проверены на GitHub"
            : "Релизы проверены 13 октября 2026 · при доступности GitHub обновляются автоматически"}
        </span>
        <a href={github} {...external}>
          Все репозитории <Icon name="up-right" />
        </a>
      </div>
    </section>
  );
}

function FAQ() {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const toggle = (index: number) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  return (
    <section className="faq section-space container" id="faq">
      <div className="faq-heading">
        <p className="eyebrow">Без недосказанности</p>
        <h2 className="section-heading">
          Хорошие
          <br />
          вопросы
        </h2>
        <p>
          То, что полезно знать
          <br />
          до первого подключения.
        </p>
        <a className="text-link" href={github} {...external}>
          Спросить на GitHub <Icon name="up-right" />
        </a>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <article className="faq-item" key={faq.q}>
            <h3>
              <button
                className="faq-question"
                aria-expanded={expanded.has(index)}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
                onClick={() => toggle(index)}
              >
                {faq.q}
                <Icon name="plus" />
              </button>
            </h3>
            <div
              className={`faq-answer-shell ${expanded.has(index) ? "is-open" : ""}`}
              id={`faq-answer-${index}`}
              role="region"
              aria-labelledby={`faq-question-${index}`}
              aria-hidden={!expanded.has(index)}
              inert={!expanded.has(index)}
            >
              <div className="faq-answer-inner">
                <div className="faq-answer">
                  <p>{faq.a}</p>
                  {faq.link && (
                    <a className="text-link" href={faq.link} {...external}>
                      {faq.label} <Icon name="up-right" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <a href="#" aria-label="Zarp — на главную">
              <Logo />
            </a>
            <p>
              Меньше преград
              <br />
              Больше возможностей
            </p>
          </div>
          <div className="footer-links">
            <div>
              <span>ПРИЛОЖЕНИЯ</span>
              {platforms.map((p) => (
                <a key={p.id} href={`#download-${p.id}`}>
                  {p.label}
                </a>
              ))}
            </div>
            <div>
              <span>ПРОЕКТ</span>
              <a href={github} {...external}>
                Исходный код <Icon name="up-right" />
              </a>
              <a href={`${github}/Zarp/issues`} {...external}>
                Обратная связь <Icon name="up-right" />
              </a>
              <a href={`${github}/Zarp#privacy`} {...external}>
                Приватность <Icon name="up-right" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {copyrightYear} Zarp · Open source</span>
          <p>
            Zarp — независимый проект. Не связан с Cloudflare и не одобрен ею.
            <br />
            Cloudflare и WARP — товарные знаки Cloudflare, Inc.
          </p>
          <a href="#" className="back-top" aria-label="Наверх">
            <Icon name="arrow" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">
        К содержимому
      </a>
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
