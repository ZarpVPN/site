import { useEffect } from "react";

export function useSmoothAnchors() {
  useEffect(() => {
    let frame = 0;
    const cancel = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };
    const navigate = (event: MouseEvent) => {
      if (
        event.defaultPrevented || event.button !== 0 || event.ctrlKey ||
        event.metaKey || event.shiftKey || event.altKey
      ) return;
      const link = event.target instanceof Element
        ? event.target.closest<HTMLAnchorElement>('a[href^="#"]')
        : null;
      if (!link || link.target === "_blank" || link.hasAttribute("download")) return;
      const hash = link.getAttribute("href")!;
      let target: HTMLElement | null = null;
      if (hash !== "#") {
        try {
          target = document.getElementById(decodeURIComponent(hash.slice(1)));
        } catch {
          return;
        }
        if (!target) return;
      }
      event.preventDefault();
      cancel();
      const start = window.scrollY;
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const margin = target ? parseFloat(getComputedStyle(target).scrollMarginTop) || 0 : 0;
      const destination = target ? start + target.getBoundingClientRect().top - padding - margin : 0;
      const end = Math.max(0, Math.min(destination, document.documentElement.scrollHeight - window.innerHeight));
      const distance = end - start;
      const duration = Math.min(1000, Math.max(450, Math.abs(distance) * 0.12));
      let startTime: number | null = null;
      if (window.location.hash !== hash) history.pushState(history.state, "", hash);
      const animate = (time: number) => {
        startTime ??= time;
        const progress = Math.min(1, (time - startTime) / duration);
        const eased = progress < 0.5
          ? 4 * progress ** 3
          : 1 - (-2 * progress + 2) ** 3 / 2;
        window.scrollTo({ top: start + distance * eased, behavior: "instant" });
        if (progress < 1) {
          frame = requestAnimationFrame(animate);
        } else {
          frame = 0;
          if (target) {
            const temporaryTabIndex = !target.hasAttribute("tabindex");
            if (temporaryTabIndex) target.setAttribute("tabindex", "-1");
            target.focus({ preventScroll: true });
            if (temporaryTabIndex) {
              target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
            }
          }
        }
      };
      frame = requestAnimationFrame(animate);
    };
    const onKey = (event: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) cancel();
    };
    document.addEventListener("click", navigate);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      cancel();
      document.removeEventListener("click", navigate);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", onKey);
    };
  }, []);
}
