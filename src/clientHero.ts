export function initHero() {
  const element = document.querySelector<HTMLElement>(".hero-layers");
  const hero = element?.closest<HTMLElement>(".hero");
  const canvas = element?.querySelector<HTMLCanvasElement>(".dotted-sphere");
  const context = canvas?.getContext("2d");
  if (!element || !hero || !canvas || !context) return;

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const points = Array.from({ length: 2200 }, (_, i) => {
    const y = 1 - (2 * (i + 0.5)) / 2200;
    const ring = Math.sqrt(1 - y * y);
    const angle = i * 2.399963;
    return { y, x: Math.cos(angle) * ring, z: Math.sin(angle) * ring };
  });
  const position = { x: 0, y: 0 };
  const target = { x: 0, y: 0 };
  let size = 0;
  let phase = 0.35;
  let sphereFrame = 0;
  let pointerFrame = 0;
  let lastSphereTime = 0;
  let lastPointerTime = 0;
  let visible = false;

  const draw = () => {
    if (!size) return;
    context.clearRect(0, 0, size, size);
    const radius = size * 0.445;
    const yaw = phase + position.x * 0.22;
    const pitch = position.y * 0.16;
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
  const animateSphere = (time: number) => {
    sphereFrame = 0;
    if (lastSphereTime) phase += Math.min((time - lastSphereTime) / 1000, 0.05) * 0.075;
    lastSphereTime = time;
    draw();
    if (visible && !document.hidden && !motion.matches)
      sphereFrame = requestAnimationFrame(animateSphere);
  };
  const sync = () => {
    cancelAnimationFrame(sphereFrame);
    sphereFrame = 0;
    lastSphereTime = 0;
    draw();
    if (visible && !document.hidden && !motion.matches)
      sphereFrame = requestAnimationFrame(animateSphere);
  };
  const resize = () => {
    size = canvas.getBoundingClientRect().width;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    sync();
  };
  const sphereResize = new ResizeObserver(resize);
  const sphereIntersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  sphereResize.observe(canvas);
  sphereIntersection.observe(canvas);
  motion.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  resize();

  const applyPointer = (time: number) => {
    pointerFrame = 0;
    const delta = lastPointerTime ? Math.min((time - lastPointerTime) / 1000, 0.05) : 1 / 60;
    lastPointerTime = time;
    const blend = 1 - Math.exp(-delta / 0.16);
    position.x += (target.x - position.x) * blend;
    position.y += (target.y - position.y) * blend;
    const settled = Math.abs(target.x - position.x) + Math.abs(target.y - position.y) < 0.001;
    if (settled) {
      position.x = target.x;
      position.y = target.y;
    }
    element.style.setProperty("--pointer-x", position.x.toFixed(4));
    element.style.setProperty("--pointer-y", position.y.toFixed(4));
    if (motion.matches && visible && !document.hidden) draw();
    if (!settled) pointerFrame = requestAnimationFrame(applyPointer);
    else lastPointerTime = 0;
  };
  const schedule = () => {
    if (!pointerFrame) pointerFrame = requestAnimationFrame(applyPointer);
  };
  const reset = () => {
    target.x = 0;
    target.y = 0;
    schedule();
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const heroBounds = hero.getBoundingClientRect();
    if (heroBounds.bottom <= 0 || heroBounds.top >= window.innerHeight) return;
    const bounds = element.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    target.x = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
    target.y = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
    schedule();
  };
  window.addEventListener("pointermove", move, { passive: true });
  document.documentElement.addEventListener("pointerleave", reset);
  window.addEventListener("blur", reset);
}
