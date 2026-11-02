import type { PlatformId } from "./data";

// Match the rendered width at each layout breakpoint. The full screenshots
// remain available for wide and high-density displays.
export const screenshotSources: Record<PlatformId, {
  width: number;
  height: number;
  widths: readonly number[];
  sizes: string;
}> = {
  windows: {
    width: 1252,
    height: 768,
    widths: [640, 1252],
    sizes: "(min-width: 2820px) 1252px, (min-width: 1440px) 44.4vw, (min-width: 1051px) 639px, (min-width: 851px) 558px, (min-width: 701px) 476px, (min-width: 466px) 385px, calc(100vw - 81px)",
  },
  android: {
    width: 1136,
    height: 703,
    widths: [640, 1136],
    sizes: "(min-width: 2820px) 1136px, (min-width: 1440px) 43.3vw, (min-width: 1051px) 633px, (min-width: 851px) 546px, (min-width: 701px) 467px, (min-width: 527px) 446px, calc(100vw - 81px)",
  },
  macos: {
    width: 2000,
    height: 827,
    widths: [720, 960, 1400, 2000],
    sizes: "(min-width: 2920px) 1896px, (min-width: 1440px) 65.1vw, (min-width: 1051px) 948px, (min-width: 851px) 818px, (min-width: 701px) 632px, (min-width: 652px) 571px, calc(100vw - 81px)",
  },
  linux: {
    width: 1236,
    height: 796,
    widths: [1236],
    sizes: "(min-width: 2820px) 1236px, (min-width: 1440px) 42.7vw, (min-width: 1051px) 609px, (min-width: 851px) 531px, (min-width: 701px) 453px, (min-width: 435px) 366px, calc(100vw - 81px)",
  },
};

export const screenshotUrl = (platform: PlatformId, width: number, originalWidth: number) =>
  `${import.meta.env.BASE_URL}assets/${platform}-app${width === originalWidth ? "" : `-${width}`}.${platform === "linux" ? "png" : "webp"}`;

export const screenshotSrcSet = (platform: PlatformId, originalWidth: number) =>
  screenshotSources[platform].widths.map(width => `${screenshotUrl(platform, width, originalWidth)} ${width}w`).join(", ");
