import { github } from "./data";

export const linuxPackages = [
  { name: "Ubuntu", requirement: "26.04 · x86_64", format: "DEB", file: "zarp-ubuntu-amd64.deb" },
  { name: "Debian", requirement: "13 · x86_64", format: "DEB", file: "zarp-debian-amd64.deb" },
  { name: "Fedora", requirement: "44 · x86_64", format: "RPM", file: "zarp-fedora-x86_64.rpm" },
  { name: "Arch Linux", requirement: "x86_64 · systemd", format: "PKG.TAR.ZST", file: "zarp-arch-x86_64.pkg.tar.zst" },
] as const;

export const linuxPackageUrl = (file: string) =>
  `${github}/Zarp-Linux/releases/latest/download/${file}`;

export function initLinuxPackages(section: HTMLElement) {
  const trigger = section.querySelector<HTMLAnchorElement>('[aria-controls="linux-packages"]');
  const dialog = section.querySelector<HTMLDialogElement>("#linux-packages");
  if (!trigger || !dialog) return;

  const open = (event: MouseEvent) => {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (!dialog.open) dialog.showModal();
  };
  const dismiss = (event: MouseEvent) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  };
  trigger.addEventListener("click", open);
  dialog.addEventListener("click", dismiss);
  return () => {
    trigger.removeEventListener("click", open);
    dialog.removeEventListener("click", dismiss);
    if (dialog.open) dialog.close();
  };
}
