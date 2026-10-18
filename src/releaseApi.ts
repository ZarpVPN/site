import { github, platforms } from "./data";
import type { PlatformId, Release } from "./data";

type GitHubRelease = {
  tag_name: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  assets: { name: string; size: number; browser_download_url: string }[];
};

export async function fetchLatestReleases(signal: AbortSignal): Promise<{
  id: PlatformId;
  release: Release;
}[]> {
  const requests = platforms.map(async (platform) => {
    const response = await fetch(
      `https://api.github.com/repos/ZarpVPN/${platform.repo}/releases/latest`,
      { signal, headers: { Accept: "application/vnd.github+json" } },
    );
    if (!response.ok) throw new Error("Release unavailable");
    const data: GitHubRelease = await response.json();
    if (
      data.draft || data.prerelease ||
      typeof data.tag_name !== "string" || !Array.isArray(data.assets)
    ) throw new Error("Invalid release");
    const asset = data.assets.find(item =>
      platform.id === "windows"
        ? item.name === "Zarp.exe"
        : platform.id === "android"
          ? /^Zarp.*\.apk$/i.test(item.name)
          : /^Zarp.*arm64\.dmg$/i.test(item.name),
    );
    if (
      !asset || !Number.isFinite(asset.size) || asset.size <= 0 ||
      !asset.browser_download_url.startsWith(
        `${github}/${platform.repo}/releases/download/`,
      ) ||
      !data.html_url.startsWith(`${github}/${platform.repo}/releases/tag/`)
    ) throw new Error("Invalid asset");
    return {
      id: platform.id,
      release: {
        version: data.tag_name,
        size: asset.size,
        url: asset.browser_download_url,
        releaseUrl: data.html_url,
      },
    };
  });
  const results = await Promise.allSettled(requests);
  return results.flatMap(result => result.status === "fulfilled" ? [result.value] : []);
}
