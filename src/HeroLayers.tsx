import { useI18n } from "./i18n";
import { Icon } from "./Icons";

export default function HeroLayers() {
  const { t } = useI18n();
  return (
    <div className="hero-layers" aria-hidden="true">
      <div className="parallax-layer sphere-layer">
        <div className="sphere-halo" />
        <div className="sphere-outline" />
        <canvas className="dotted-sphere" />
      </div>
      <div className="parallax-layer orbit-layer">
        <div className="scene-orbit" />
      </div>
      <div className="parallax-layer card-layer">
        <div className="visual-card">
          <div className="visual-card-top">
            <span className="visual-brand">
              <img src={`${import.meta.env.BASE_URL}assets/zarp-logo.jpg`} alt="" width="200" height="200" />{" "}
              Zarp
            </span>
            <span className="visual-tag">{t("visualSource")}</span>
          </div>
          <p className="visual-subtitle">Cloudflare WARP + zapret2</p>
          <div className="power-emblem">
            <svg className="power-emblem-ring" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
              <circle className="power-emblem-track" cx="50" cy="50" r="45" />
              <circle className="power-emblem-progress" cx="50" cy="50" r="45" strokeDasharray="86 283" />
            </svg>
            <span className="power-emblem-center"><Icon name="power" /></span>
          </div>
          <div className="visual-title"><span /> {t("visualTitle")} </div>
          <p className="visual-caption">{t("visualCaption")}</p>
          <div className="visual-card-bottom">
            <span><Icon name="shield" /> {t("visualDpi")} </span>
            <Icon name="check" />
          </div>
        </div>
      </div>
      <div className="parallax-layer label-layer">
        <div className="orbit-label orbit-label-top"><span /> {t("visualBypass")} </div>
        <div className="orbit-label orbit-label-bottom"><Icon name="code" /> {t("visualInternet")} </div>
      </div>
    </div>
  );
}
