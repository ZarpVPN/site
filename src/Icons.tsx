import { memo } from "react";

export type IconName =
  | "arrow"
  | "up-right"
  | "download"
  | "github"
  | "windows"
  | "android"
  | "macos"
  | "shield"
  | "refresh"
  | "bolt"
  | "check"
  | "power"
  | "menu"
  | "close"
  | "plus"
  | "code"
  | "route";
export const Icon = memo(function Icon({
  name,
  className = "",
}: {
  name: IconName;
  className?: string;
}) {
  const source = `url("${import.meta.env.BASE_URL}assets/icons/${name}.svg")`;
  return (
    <span
      className={`icon ${className}`}
      style={{ maskImage: source, WebkitMaskImage: source }}
      aria-hidden="true"
    />
  );
});
export const Logo = memo(function Logo() {
  return (
    <span className="logo">
      <img
        src={`${import.meta.env.BASE_URL}assets/zarp-logo.jpg`}
        alt=""
        width="200"
        height="200"
      />
      <span>Zarp</span>
    </span>
  );
});
