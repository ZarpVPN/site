import { Component, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MathUtils, Shape } from "three";
import type { Group } from "three";
import "./HeroScene.css";

const tileOptions = {
  depth: 0.24,
  bevelEnabled: true,
  bevelSegments: 4,
  steps: 1,
  bevelSize: 0.055,
  bevelThickness: 0.055,
  curveSegments: 16,
};
const boltOptions = {
  depth: 0.045,
  bevelEnabled: true,
  bevelSegments: 2,
  bevelSize: 0.009,
  bevelThickness: 0.009,
};

function roundedSquare(size: number, radius: number) {
  const shape = new Shape();
  const h = size / 2;
  shape.moveTo(-h + radius, -h);
  shape.lineTo(h - radius, -h);
  shape.quadraticCurveTo(h, -h, h, -h + radius);
  shape.lineTo(h, h - radius);
  shape.quadraticCurveTo(h, h, h - radius, h);
  shape.lineTo(-h + radius, h);
  shape.quadraticCurveTo(-h, h, -h, h - radius);
  shape.lineTo(-h, -h + radius);
  shape.quadraticCurveTo(-h, -h, -h + radius, -h);
  return shape;
}

function Network({
  reduced,
  pointerInside,
}: {
  reduced: boolean;
  pointerInside: RefObject<boolean>;
}) {
  const composition = useRef<Group>(null);
  const orbit = useRef<Group>(null);
  const elapsed = useRef(0);
  const shapes = useMemo(() => {
    const bolt = new Shape();
    bolt.moveTo(0.27, 1);
    bolt.lineTo(-0.7, -0.15);
    bolt.lineTo(-0.08, -0.15);
    bolt.lineTo(-0.28, -1);
    bolt.lineTo(0.7, 0.3);
    bolt.lineTo(0.1, 0.3);
    bolt.closePath();
    return { tile: roundedSquare(2.55, 0.48), bolt };
  }, []);
  const particles = useMemo(() => {
    const points = new Float32Array(180 * 3);
    for (let i = 0; i < 180; i++) {
      // A deterministic distribution prevents changes on React re-renders.
      const angle = i * 2.399963;
      const radius = 2.1 + (((i * 73) % 97) / 97) * 1.05;
      points[i * 3] = Math.cos(angle) * radius;
      points[i * 3 + 1] = Math.sin(angle) * radius;
      points[i * 3 + 2] = -1.1 + Math.sin(i * 1.7) * 0.5;
    }
    return points;
  }, []);

  useFrame(({ pointer }, frameDelta) => {
    if (reduced || !composition.current || !orbit.current) return;
    const delta = Math.min(frameDelta, 0.05);
    elapsed.current += delta;
    const object = composition.current;
    object.rotation.x = MathUtils.damp(
      object.rotation.x,
      pointerInside.current ? pointer.y * 0.12 : 0,
      3.5,
      delta,
    );
    object.rotation.y = MathUtils.damp(
      object.rotation.y,
      pointerInside.current ? pointer.x * 0.2 : 0,
      3.5,
      delta,
    );
    object.position.y = Math.sin(elapsed.current * 0.5) * 0.06;
    orbit.current.rotation.z = elapsed.current * 0.025;
  });

  return (
    <>
      <ambientLight intensity={1.6} />
      <directionalLight position={[-3, 5, 6]} intensity={4} color="#fff0dc" />
      <pointLight position={[3, -2, 4]} intensity={18} color="#ff7620" />
      <group ref={composition}>
        <group ref={orbit}>
          <mesh rotation={[0.8, -0.38, -0.5]} position={[0, 0, -0.65]}>
            <torusGeometry args={[2.85, 0.015, 8, 160]} />
            <meshStandardMaterial
              color="#a55a2a"
              metalness={0.7}
              roughness={0.45}
            />
          </mesh>
          <mesh rotation={[-0.45, 0.8, 0.7]} position={[0, 0, -0.6]}>
            <torusGeometry args={[2.5, 0.024, 8, 160]} />
            <meshStandardMaterial
              color="#bf6225"
              metalness={0.65}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[0, 0, -1.5]}>
            <torusGeometry args={[3, 0.007, 6, 160]} />
            <meshBasicMaterial color="#5b3523" />
          </mesh>
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[particles, 3]}
              />
            </bufferGeometry>
            <pointsMaterial color="#bd6b36" size={0.026} sizeAttenuation />
          </points>
          {[
            [-2.4, 0.8, 0.2],
            [2.25, -0.9, 0.4],
            [1.8, 2, -0.5],
            [-1.4, -2.1, -0.4],
          ].map((position, i) => (
            <mesh key={i} position={position as [number, number, number]}>
              <sphereGeometry args={[i === 1 ? 0.13 : 0.08, 20, 20]} />
              <meshStandardMaterial
                color={i % 2 ? "#ff842b" : "#979592"}
                metalness={0.7}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
        <group rotation={[0.12, -0.28, -0.12]} position={[0, 0, 0.55]}>
          <mesh position={[0, 0, -0.12]}>
            <extrudeGeometry args={[shapes.tile, tileOptions]} />
            <meshStandardMaterial
              color="#fc7020"
              metalness={0.12}
              roughness={0.34}
            />
          </mesh>
          <mesh position={[0, 0, 0.19]}>
            <extrudeGeometry args={[shapes.bolt, boltOptions]} />
            <meshStandardMaterial
              color="#ffffff"
              roughness={0.4}
              metalness={0.08}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}

function StaticScene() {
  return (
    <div className="scene-static">
      <span className="scene-static-orbit" />
      <span className="scene-static-orbit second" />
      <img
        src={`${import.meta.env.BASE_URL}assets/zarp-logo.jpg`}
        alt=""
        width="200"
        height="200"
      />
    </div>
  );
}

class SceneBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <StaticScene /> : this.props.children;
  }
}

export default function HeroScene() {
  const container = useRef<HTMLDivElement>(null);
  const pointerInside = useRef(false);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReduced(media.matches);
    let intersecting = false;
    const updateVisibility = () => setActive(intersecting && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting;
      updateVisibility();
    });
    if (container.current) observer.observe(container.current);
    media.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      observer.disconnect();
      media.removeEventListener("change", updateMotion);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);
  return (
    <div
      className={`network-scene ${ready ? "is-ready" : ""}`}
      ref={container}
      aria-hidden="true"
      onPointerEnter={() => {
        pointerInside.current = true;
      }}
      onPointerLeave={() => {
        pointerInside.current = false;
      }}
    >
      <div className="scene-halo" />
      <SceneBoundary>
        <Canvas
          camera={{ position: [0, 0, 9.5], fov: 40 }}
          dpr={[1, 1.5]}
          frameloop={active && !reduced ? "always" : "demand"}
          gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
          fallback={<StaticScene />}
          onCreated={() => setReady(true)}
        >
          <Network reduced={reduced} pointerInside={pointerInside} />
        </Canvas>
      </SceneBoundary>
      <div className="scene-caption">
        <span /> WARP + DPI BYPASS
      </div>
    </div>
  );
}
