export type PlatformId = "windows" | "android" | "macos" | "linux";
export type Release = {
  version: string;
  size: number | null;
  url: string;
  releaseUrl: string;
};
export const github = "https://github.com/ZarpVPN";
export type DownloadPlatform = {
  id: PlatformId;
  label: string;
  repo: string;
  format: string;
  requirements: string;
  description: string;
  release: Release;
};
export const platforms: (DownloadPlatform & {
  screenshot: string;
})[] = [
  {
    id: "windows",
    label: "Windows",
    repo: "Zarp",
    format: "EXE",
    requirements: "Windows 10 / 11 · x64",
    description:
      "windowsDescription",
    screenshot: "windows-app.webp",
    release: {
      version: "v1.5.0",
      size: 32550400,
      url: `${github}/Zarp/releases/download/v1.5.0/Zarp.exe`,
      releaseUrl: `${github}/Zarp/releases/tag/v1.5.0`,
    },
  },
  {
    id: "macos",
    label: "macOS",
    repo: "Zarp-MacOS",
    format: "DMG",
    requirements: "macosRequirements",
    description:
      "macosDescription",
    screenshot: "macos-app.webp",
    release: {
      version: "v0.2.0",
      size: 11128210,
      url: `${github}/Zarp-MacOS/releases/download/v0.2.0/Zarp-0.2.0-arm64.dmg`,
      releaseUrl: `${github}/Zarp-MacOS/releases/tag/v0.2.0`,
    },
  },
  {
    id: "linux",
    label: "Linux",
    repo: "Zarp-Linux",
    format: "DEB · RPM · PKG",
    requirements: "linuxRequirements",
    description: "linuxDescription",
    screenshot: "linux-app.png",
    release: {
      version: "v0.3.5",
      size: null,
      url: `${github}/Zarp-Linux/releases/tag/v0.3.5`,
      releaseUrl: `${github}/Zarp-Linux/releases/tag/v0.3.5`,
    },
  },
  {
    id: "android",
    label: "Android",
    repo: "Zarp-Android",
    format: "APK",
    requirements: "Android 8.0+ · arm64 / armv7 / x86_64",
    description: "androidDescription",
    screenshot: "android-app.webp",
    release: {
      version: "v1.1.1",
      size: 52102257,
      url: `${github}/Zarp-Android/releases/download/v1.1.1/Zarp-v1.1.1.apk`,
      releaseUrl: `${github}/Zarp-Android/releases/tag/v1.1.1`,
    },
  },
];
export const downloadPlatforms: DownloadPlatform[] = platforms;

export const upcomingPlatforms = [
  { id: "ios", label: "iOS", requirements: "iPhone · iPad", description: "iosDescription" },
  { id: "routers", label: "routers", requirements: "routersRequirements", description: "routersDescription" },
] as const;

export const faqs = [
  {
    q: "faqWhatQuestion",
    a: "faqWhatAnswer",
  },
  {
    q: "faqFreeQuestion",
    a: "faqFreeAnswer",
  },
  {
    q: "faqProviderQuestion",
    a: "faqProviderAnswer",
  },
  {
    q: "faqDataQuestion",
    a: "faqDataAnswer",
    link: "https://www.cloudflare.com/application/privacypolicy/",
    label: "cloudflarePrivacy",
  },
  {
    q: "faqWarningsQuestion",
    a: "faqWarningsAnswer",
    link: `${github}/Zarp-MacOS#why-wont-zarp-open`,
    label: "macosGuide",
  },
  {
    q: "faqCountryQuestion",
    a: "faqCountryAnswer",
  },
  {
    q: "faqIssueQuestion",
    a: "faqIssueAnswer",
    link: github,
    label: "openRepositories",
  },
];
