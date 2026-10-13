export function configurePageScrolling() {
  const ios =
    /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const bridge = (window as Window & {
    TelegramWebviewProxy?: { postEvent?: unknown };
  }).TelegramWebviewProxy;

  // Telegram's iOS browser lets the outer WebView scroll paint above its frame.
  // Keep scrolling inside a clipped element only when its native bridge exists.
  if (ios && typeof bridge?.postEvent === "function") {
    document.documentElement.classList.add("telegram-ios");
  }
}

export function getPageScroller(): HTMLElement {
  if (document.documentElement.classList.contains("telegram-ios")) {
    return document.getElementById("root")!;
  }
  return (document.scrollingElement as HTMLElement | null) ?? document.documentElement;
}
