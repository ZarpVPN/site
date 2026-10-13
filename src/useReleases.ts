import { useEffect, useState } from "react";
import { github, platforms } from "./data";
import type { PlatformId, Release } from "./data";

type GitHubRelease = {
  tag_name: string;
  html_url: string;
  draft: boolean;
  prerelease: boolean;
  assets: { name: string; size: number; browser_download_url: string }[];
};
const fallback = Object.fromEntries(
  platforms.map((p) => [p.id, p.release]),
) as Record<PlatformId, Release>;
export function useReleases() {
  const [releases, setReleases] = useState(fallback);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const requests = platforms.map(async (p) => {
      const response = await fetch(
        `https://api.github.com/repos/ZarpVPN/${p.repo}/releases/latest`,
        {
          signal: controller.signal,
          headers: { Accept: "application/vnd.github+json" },
        },
      );
      if (!response.ok) throw new Error("Release unavailable");
      const data: GitHubRelease = await response.json();
      if (
        data.draft ||
        data.prerelease ||
        typeof data.tag_name !== "string" ||
        !Array.isArray(data.assets)
      )
        throw new Error("Invalid release");
      const asset = data.assets.find((a) =>
        p.id === "windows"
          ? a.name === "Zarp.exe"
          : p.id === "android"
            ? /^Zarp.*\.apk$/i.test(a.name)
            : /^Zarp.*arm64\.dmg$/i.test(a.name),
      );
      if (
        !asset ||
        !Number.isFinite(asset.size) ||
        asset.size <= 0 ||
        !asset.browser_download_url.startsWith(
          `${github}/${p.repo}/releases/download/`,
        ) ||
        !data.html_url.startsWith(`${github}/${p.repo}/releases/tag/`)
      )
        throw new Error("Invalid asset");
      return {
        id: p.id,
        release: {
          version: data.tag_name,
          size: asset.size,
          url: asset.browser_download_url,
          releaseUrl: data.html_url,
        },
      };
    });
    void Promise.allSettled(requests)
      .then((results) => {
        if (controller.signal.aborted) return;
        const values = results.flatMap((result) =>
          result.status === "fulfilled" ? [result.value] : [],
        );
        setReleases((current) => {
          let next = current;
          for (const { id, release } of values) {
            const previous = current[id];
            if (
              previous.version === release.version && previous.size === release.size &&
              previous.url === release.url && previous.releaseUrl === release.releaseUrl
            ) continue;
            if (next === current) next = { ...current };
            next[id] = release;
          }
          return next;
        });
        setLive(values.length === platforms.length);
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, []);
  return { releases, live };
}
