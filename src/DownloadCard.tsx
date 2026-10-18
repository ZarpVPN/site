import { useI18n } from "./i18n";
import { memo } from "react";
import { Icon } from "./Icons";
import { github } from "./data";
import type { platforms, Release } from "./data";

const external = { target: "_blank", rel: "noopener noreferrer" };

export const DownloadCard = memo(function DownloadCard({
  platform: p, release: r, recommended,
}: {
  platform: (typeof platforms)[number];
  release: Release;
  recommended: boolean;
}) {
  const { t, locale } = useI18n();
  return (
    <article
      className={`download-card ${recommended ? "recommended" : ""}`}
      id={`download-${p.id}`}
      data-format={p.format}
      data-size-unit={t("megabytes")}
    >
      <div className="download-card-top">
        <span className="os-icon">
          <Icon name={p.id} />
        </span>
        <span className="release-version"><bdi>{r.version}</bdi></span>
      </div>
      <div className="os-heading">
        <h3>{p.label}</h3>
        {recommended && (
          <span className="recommended-tag">{t("yourDevice")}</span>
        )}
      </div>
      <p className="os-requirements">{t(p.requirements)}</p>
      <p className="os-description">{t(p.description)}</p>
      <a
        className={`button ${recommended ? "button-primary" : "button-secondary"} download-button`}
        href={r.url}
      >
        <Icon name="download" />
        {t("downloadFor", { platform: p.label })}
        <Icon name="arrow" className="directional-arrow" />
      </a>
      <div className="download-meta">
        <span>
          <bdi>{p.format} · {new Intl.NumberFormat(locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(r.size / 1024 / 1024)} {t("megabytes")}</bdi>
        </span>
        <a href={r.releaseUrl} {...external}>
          {t("aboutRelease")} <Icon name="up-right" />
        </a>
      </div>
      <a
        className="install-guide"
        href={`${github}/${p.repo}#${p.id === "macos" ? "first-launch" : "usage"}`}
        {...external}
      >
        {t("installGuide")} <Icon name="up-right" />
      </a>
    </article>
  );
});
