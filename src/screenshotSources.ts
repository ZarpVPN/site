import type { PlatformId } from "./data";

// Match the rendered width at each layout breakpoint. The full screenshots
// remain available for wide and high-density displays.
export const screenshotSources: Record<PlatformId, { widths: readonly number[]; sizes: string }> = {
  windows: {
    widths: [640, 1252],
    sizes: "(min-width: 2820px) 1252px, (min-width: 1440px) 44.4vw, (min-width: 1051px) 639px, (min-width: 851px) 558px, (min-width: 701px) 476px, (min-width: 466px) 385px, calc(100vw - 81px)",
  },
  android: {
    widths: [640, 1136],
    sizes: "(min-width: 2820px) 1136px, (min-width: 1440px) 43.3vw, (min-width: 1051px) 633px, (min-width: 851px) 546px, (min-width: 701px) 467px, (min-width: 527px) 446px, calc(100vw - 81px)",
  },
  macos: {
    widths: [720, 960, 1400, 2000],
    sizes: "(min-width: 2920px) 1896px, (min-width: 1440px) 65.1vw, (min-width: 1051px) 948px, (min-width: 851px) 818px, (min-width: 701px) 632px, (min-width: 652px) 571px, calc(100vw - 81px)",
  },
};

export const screenshotUrl = (platform: PlatformId, width: number, originalWidth: number) =>
  `${import.meta.env.BASE_URL}assets/${platform}-app${width === originalWidth ? "" : `-${width}`}.webp`;

export const screenshotSrcSet = (platform: PlatformId, originalWidth: number) =>
  screenshotSources[platform].widths.map(width => `${screenshotUrl(platform, width, originalWidth)} ${width}w`).join(", ");
