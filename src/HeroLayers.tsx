import { useEffect, useRef } from "react";
import { Icon } from "./Icons";
import "./HeroLayers.css";

function DottedSphere() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext("2d");
    if (!context) return;
    const draw = () => {
      const size = element.getBoundingClientRect().width;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(size * dpr);
      element.height = Math.round(size * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      context.clearRect(0, 0, size, size);
      const radius = size * 0.445;
      for (let i = 0; i < 2200; i++) {
        const y = 1 - (2 * (i + 0.5)) / 2200;
        const ring = Math.sqrt(1 - y * y);
        const angle = i * 2.399963 + 0.35;
        const x = Math.cos(angle) * ring;
        const z = Math.sin(angle) * ring;
        context.fillStyle = `rgba(255, 130, 39, ${0.15 + (z + 1) * 0.12})`;
        context.beginPath();
        context.arc(
          size / 2 + x * radius,
          size / 2 + y * radius,
          Math.max(0.7, size / 520) * (0.7 + (z + 1) * 0.15),
          0,
          Math.PI * 2,
        );
        context.fill();
      }
    };
    const observer = new ResizeObserver(draw);
    observer.observe(element);
    draw();
    return () => observer.disconnect();
  }, []);
  return <canvas className="dotted-sphere" ref={canvas} />;
}

export default function HeroLayers() {
  const container = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = container.current;
    const hero = element?.closest(".hero");
    if (!element || !hero) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      frame = 0;
      element.style.setProperty("--pointer-x", x.toFixed(4));
      element.style.setProperty("--pointer-y", y.toFixed(4));
    };
    const reset = () => {
      x = 0;
      y = 0;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const move = (event: Event) => {
      if (motion.matches || !finePointer.matches) return;
      const pointer = event as PointerEvent;
      const bounds = hero.getBoundingClientRect();
      x = Math.max(
        -1,
        Math.min(1, ((pointer.clientX - bounds.left) / bounds.width - 0.5) * 2),
      );
      y = Math.max(
        -1,
        Math.min(1, ((pointer.clientY - bounds.top) / bounds.height - 0.5) * 2),
      );
      if (!frame) frame = requestAnimationFrame(apply);
    };
    hero.addEventListener("pointermove", move, { passive: true });
    hero.addEventListener("pointerleave", reset);
    motion.addEventListener("change", reset);
    finePointer.addEventListener("change", reset);
    window.addEventListener("blur", reset);
    return () => {
      cancelAnimationFrame(frame);
      hero.removeEventListener("pointermove", move);
      hero.removeEventListener("pointerleave", reset);
      motion.removeEventListener("change", reset);
      finePointer.removeEventListener("change", reset);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return (
    <div className="hero-layers" ref={container} aria-hidden="true">
      <div className="parallax-layer sphere-layer">
        <div className="sphere-halo" />
        <div className="sphere-outline" />
        <DottedSphere />
      </div>
      <div className="parallax-layer orbit-layer">
        <div className="scene-orbit" />
      </div>
      <div className="parallax-layer card-layer">
        <div className="visual-card">
          <div className="visual-card-top">
            <span className="visual-brand">
              <img
                src={`${import.meta.env.BASE_URL}assets/zarp-logo.jpg`}
                alt=""
                width="200"
                height="200"
              />{" "}
              Zarp
            </span>
            <span className="visual-tag">OPEN SOURCE</span>
          </div>
          <p className="visual-subtitle">Cloudflare WARP + zapret2</p>
          <div className="power-emblem">
            <span className="power-emblem-ring" />
            <span className="power-emblem-center">
              <Icon name="power" />
            </span>
          </div>
          <div className="visual-title">
            <span /> Одно нажатие — и вперёд
          </div>
          <p className="visual-caption">Без ручной настройки</p>
          <div className="visual-card-bottom">
            <span>
              <Icon name="shield" /> Автоподбор DPI
            </span>
            <Icon name="check" />
          </div>
        </div>
      </div>
      <div className="parallax-layer label-layer">
        <div className="orbit-label orbit-label-top">
          <span /> WARP + DPI BYPASS
        </div>
        <div className="orbit-label orbit-label-bottom">
          <Icon name="code" /> built for an open internet
        </div>
      </div>
    </div>
  );
}
