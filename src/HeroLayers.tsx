import { useCallback, useEffect, useRef } from "react";
import type { RefObject } from "react";
import { Icon } from "./Icons";
import "./HeroLayers.css";

type PointerPosition = { x: number; y: number };

function DottedSphere({
  pointer,
  onReady,
}: {
  pointer: RefObject<PointerPosition>;
  onReady: (draw: (() => void) | null) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const element = canvas.current;
    if (!element) return;
    const context = element.getContext("2d");
    if (!context) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const points = Array.from({ length: 2200 }, (_, i) => {
      const y = 1 - (2 * (i + 0.5)) / 2200;
      const ring = Math.sqrt(1 - y * y);
      const angle = i * 2.399963;
      return { y, x: Math.cos(angle) * ring, z: Math.sin(angle) * ring };
    });
    let size = 0;
    let phase = 0.35;
    let frame = 0;
    let lastTime = 0;
    let visible = false;
    const draw = () => {
      if (!size) return;
      context.clearRect(0, 0, size, size);
      const radius = size * 0.445;
      const yaw = phase + pointer.current.x * 0.22;
      const pitch = pointer.current.y * 0.16;
      const cosine = Math.cos(yaw);
      const sine = Math.sin(yaw);
      const pitchCosine = Math.cos(pitch);
      const pitchSine = Math.sin(pitch);
      const paths = Array.from({ length: 8 }, () => new Path2D());
      for (const point of points) {
        const x = point.x * cosine - point.z * sine;
        const depth = point.x * sine + point.z * cosine;
        const y = point.y * pitchCosine - depth * pitchSine;
        const z = point.y * pitchSine + depth * pitchCosine;
        const px = size / 2 + x * radius;
        const py = size / 2 + y * radius;
        const dot = Math.max(0.7, size / 520) * (0.7 + (z + 1) * 0.15);
        const path = paths[Math.min(7, Math.floor((z + 1) * 4))];
        path.moveTo(px + dot, py);
        path.arc(px, py, dot, 0, Math.PI * 2);
      }
      paths.forEach((path, index) => {
        context.fillStyle = `rgba(255, 130, 39, ${0.15 + (index / 7) * 0.24})`;
        context.fill(path);
      });
    };
    const animate = (time: number) => {
      frame = 0;
      if (lastTime) phase += Math.min((time - lastTime) / 1000, 0.05) * 0.075;
      lastTime = time;
      draw();
      if (visible && !document.hidden && !motion.matches)
        frame = requestAnimationFrame(animate);
    };
    // Keep pointer feedback available while reduced motion pauses idle rotation.
    onReady(() => {
      if (motion.matches && visible && !document.hidden) draw();
    });
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
      draw();
      if (visible && !document.hidden && !motion.matches)
        frame = requestAnimationFrame(animate);
    };
    const resize = () => {
      size = element.getBoundingClientRect().width;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      element.width = Math.round(size * dpr);
      element.height = Math.round(size * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      sync();
    };
    const observer = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    intersection.observe(element);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    resize();
    return () => {
      onReady(null);
      cancelAnimationFrame(frame);
      observer.disconnect();
      intersection.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [pointer, onReady]);
  return <canvas className="dotted-sphere" ref={canvas} />;
}

export default function HeroLayers() {
  const container = useRef<HTMLDivElement>(null);
  const pointerPosition = useRef<PointerPosition>({ x: 0, y: 0 });
  const redrawSphere = useRef<(() => void) | null>(null);
  const registerRedraw = useCallback((draw: (() => void) | null) => {
    redrawSphere.current = draw;
  }, []);
  useEffect(() => {
    const element = container.current;
    const hero = element?.closest(".hero");
    if (!element || !hero) return;
    let frame = 0;
    let lastTime = 0;
    const target = { x: 0, y: 0 };
    const apply = (time: number) => {
      frame = 0;
      const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 1 / 60;
      lastTime = time;
      const blend = 1 - Math.exp(-delta / 0.16);
      const position = pointerPosition.current;
      position.x += (target.x - position.x) * blend;
      position.y += (target.y - position.y) * blend;
      const settled = Math.abs(target.x - position.x) + Math.abs(target.y - position.y) < 0.001;
      if (settled) {
        position.x = target.x;
        position.y = target.y;
      }
      element.style.setProperty("--pointer-x", position.x.toFixed(4));
      element.style.setProperty("--pointer-y", position.y.toFixed(4));
      redrawSphere.current?.();
      if (!settled) frame = requestAnimationFrame(apply);
      else lastTime = 0;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const reset = () => {
      target.x = 0;
      target.y = 0;
      schedule();
    };
    const move = (event: Event) => {
      const pointer = event as PointerEvent;
      if (pointer.pointerType === "touch") return;
      const heroBounds = hero.getBoundingClientRect();
      if (heroBounds.bottom <= 0 || heroBounds.top >= window.innerHeight) return;
      const bounds = element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      target.x = Math.max(
        -1,
        Math.min(1, ((pointer.clientX - bounds.left) / bounds.width - 0.5) * 2),
      );
      target.y = Math.max(
        -1,
        Math.min(1, ((pointer.clientY - bounds.top) / bounds.height - 0.5) * 2),
      );
      schedule();
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    window.addEventListener("blur", reset);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", reset);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return (
    <div className="hero-layers" ref={container} aria-hidden="true">
      <div className="parallax-layer sphere-layer">
        <div className="sphere-halo" />
        <div className="sphere-outline" />
        <DottedSphere pointer={pointerPosition} onReady={registerRedraw} />
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
            <span /> Одно нажатие - и вперёд
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
