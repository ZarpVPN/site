import { memo, useState } from "react";
import type { KeyboardEvent } from "react";
import { useI18n } from "./i18n";
import { Icon } from "./Icons";
import { github, platforms } from "./data";
import { createProductSelection, ProductSelectionContext, usePlatformTab, useSelectedPlatform } from "./productSelection";
import { screenshotSources, screenshotSrcSet } from "./screenshotSources";

const ProductHeading = memo(function ProductHeading() {
  const { t } = useI18n();
  return (
    <div>
      <p className="eyebrow">{t("productEyebrow")}</p>
      <h2 className="section-heading">
        {t("productTitle")} <br />
        <span className="muted">{t("productSubtitle")}</span>
      </h2>
    </div>
  );
});

const PlatformTab = memo(function PlatformTab({ index }: { index: number }) {
  const { selected, onSelect } = usePlatformTab(index);
  const platform = platforms[index];
  const keys = (event: KeyboardEvent<HTMLButtonElement>) => {
    let next = index;
    const rtl = document.documentElement.dir === "rtl";
    if (event.key === "ArrowRight") next = (index + (rtl ? platforms.length - 1 : 1)) % platforms.length;
    else if (event.key === "ArrowLeft") next = (index + (rtl ? 1 : platforms.length - 1)) % platforms.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = platforms.length - 1;
    else return;
    event.preventDefault();
    onSelect(next);
    document.getElementById(`tab-${platforms[next].id}`)?.focus();
  };
  return (
    <button
      id={`tab-${platform.id}`}
      role="tab"
      aria-selected={selected}
      aria-controls="product-panel"
      tabIndex={selected ? 0 : -1}
      onKeyDown={keys}
      onClick={() => onSelect(index)}
    >
      <Icon name={platform.id} />
      {platform.label}
    </button>
  );
});

const PlatformTabs = memo(function PlatformTabs() {
  const { t } = useI18n();
  return (
    <div className="platform-tabs" role="tablist" aria-label={t("screenshots")}>
      {platforms.map((platform, index) => <PlatformTab key={platform.id} index={index} />)}
    </div>
  );
});

const ProductWindowTitle = memo(function ProductWindowTitle() {
  const { t } = useI18n();
  const platform = useSelectedPlatform();
  return <span id="product-window-title">{t("productFor", { platform: platform.label })}</span>;
});

const ProductScreenshot = memo(function ProductScreenshot() {
  const { t } = useI18n();
  const platform = useSelectedPlatform();
  const sources = screenshotSources[platform.id];
  const originalWidth = platform.id === "macos" ? 2000 : platform.id === "android" ? 1136 : 1252;
  return (
    <div className={`screenshot-area${platform.id === "android" ? " screenshot-android" : ""}`}>
      <img
        key={platform.id}
        src={`${import.meta.env.BASE_URL}assets/${platform.screenshot}`}
        srcSet={screenshotSrcSet(platform.id, originalWidth)}
        sizes={sources.sizes}
        alt={t("screenshotAlt", { platform: platform.label })}
        loading="lazy"
        width={originalWidth}
        height={platform.id === "macos" ? 827 : platform.id === "android" ? 703 : 768}
      />
    </div>
  );
});

const ScreenshotLabel = memo(function ScreenshotLabel() {
  const { t } = useI18n();
  return <span><span className="small-dot" /> {t("screenshotCaption")}</span>;
});

const ProductRepositoryLink = memo(function ProductRepositoryLink() {
  const { t } = useI18n();
  const platform = useSelectedPlatform();
  return (
    <a href={`${github}/${platform.repo}`} target="_blank" rel="noopener noreferrer">
      {t("platformRepository", { platform: platform.label })} <Icon name="up-right" />
    </a>
  );
});

const ProductPreview = memo(function ProductPreview() {
  return (
    <div className="product-window" role="tabpanel" id="product-panel" aria-labelledby="product-window-title" tabIndex={0}>
      <div className="window-toolbar">
        <span className="window-dots"><i /><i /><i /></span>
        <ProductWindowTitle />
      </div>
      <ProductScreenshot />
      <div className="screenshot-caption">
        <ScreenshotLabel />
        <ProductRepositoryLink />
      </div>
    </div>
  );
});

const ProductShowcase = memo(function ProductShowcase() {
  return (
    <>
      <div className="section-intro">
        <ProductHeading />
        <PlatformTabs />
      </div>
      <ProductPreview />
    </>
  );
});

const Product = memo(function Product() {
  const { t } = useI18n();
  const [selection] = useState(createProductSelection);
  return (
    <section
      className="product section-space container"
      data-window-title={t("productFor", { platform: "{platform}" })}
      data-screenshot-alt={t("screenshotAlt", { platform: "{platform}" })}
      data-repository-label={t("platformRepository", { platform: "{platform}" })}
    >
      <ProductSelectionContext value={selection}><ProductShowcase /></ProductSelectionContext>
    </section>
  );
});

export default Product;
