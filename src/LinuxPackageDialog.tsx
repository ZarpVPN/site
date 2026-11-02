import { Icon } from "./Icons";
import { useI18n } from "./i18n";
import { linuxPackages, linuxPackageUrl } from "./linuxPackages";
import type { Release } from "./data";

export function LinuxPackageDialog({ release }: { release: Release }) {
  const { t } = useI18n();
  return (
    <dialog className="linux-package-dialog" id="linux-packages" aria-labelledby="linux-packages-title" aria-describedby="linux-packages-description">
      <div className="package-dialog-header">
        <div>
          <h3 id="linux-packages-title">{t("linuxPackagesTitle")}</h3>
          <p id="linux-packages-description">{t("linuxPackagesDescription")}</p>
        </div>
        <form method="dialog">
          <button className="package-dialog-close" aria-label={t("closeDialog")} type="submit"><Icon name="close" /></button>
        </form>
      </div>
      <div className="linux-package-list">
        {linuxPackages.map(pkg => (
          <a key={pkg.file} className="linux-package-option" href={linuxPackageUrl(release.releaseUrl, pkg.file)} data-linux-asset={pkg.file}>
            <span className="linux-package-system"><strong>{pkg.name}</strong><span>{pkg.requirement}</span></span>
            <span className="linux-package-format"><bdi>{pkg.format}</bdi><Icon name="download" /></span>
          </a>
        ))}
      </div>
      <a className="package-dialog-release" data-linux-release href={release.releaseUrl} target="_blank" rel="noopener noreferrer">
        {t("aboutRelease")} <Icon name="up-right" />
      </a>
    </dialog>
  );
}
