import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { platforms } from "./data";
import type { PlatformId, Release } from "./data";

const fallback = Object.fromEntries(
  platforms.map(platform => [platform.id, platform.release]),
) as Record<PlatformId, Release>;

export function useReleases(section: RefObject<HTMLElement | null>) {
  const [releases, setReleases] = useState(fallback);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const element = section.current;
    if (!element) return;
    let observer: IntersectionObserver | undefined;
    let controller: AbortController | undefined;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    let started = false;

    const load = () => {
      if (started) return;
      started = true;
      observer?.disconnect();
      controller = new AbortController();
      const signal = controller.signal;
      timeout = setTimeout(() => controller?.abort(), 8000);

      void import("./releaseApi")
        .then(({ fetchLatestReleases }) => fetchLatestReleases(signal))
        .then(values => {
          if (signal.aborted) return;
          setReleases(current => {
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
        .catch(() => { /* Built-in release links remain available. */ })
        .finally(() => clearTimeout(timeout));
    };

    if (typeof IntersectionObserver === "undefined") load();
    else {
      observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) load();
      }, { rootMargin: "400px 0px" });
      observer.observe(element);
    }

    return () => {
      observer?.disconnect();
      controller?.abort();
      clearTimeout(timeout);
    };
  }, [section]);

  return { releases, live };
}
