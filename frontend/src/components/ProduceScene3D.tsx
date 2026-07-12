import { Suspense, useRef, useState, Component } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sphere, Cylinder, Cone, Environment } from "@react-three/drei";
import * as THREE from "three";

class Canvas3DBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

/** A single apple: body + short stem + a small leaf. */
function Apple({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <Sphere args={[0.5, 32, 32]}>
        <meshPhysicalMaterial color="#D6391F" roughness={0.25} clearcoat={0.6} clearcoatRoughness={0.3} />
      </Sphere>
      <Cylinder args={[0.035, 0.05, 0.22, 8]} position={[0.02, 0.48, 0]} rotation={[0, 0, -0.15]}>
        <meshStandardMaterial color="#5B3A22" roughness={0.8} />
      </Cylinder>
      <mesh position={[0.14, 0.55, 0]} rotation={[0.3, 0.5, 0.4]}>
        <sphereGeometry args={[0.12, 12, 12]} />
        <meshStandardMaterial color="#4C9A2A" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** A citrus fruit (orange/lemon), smooth sphere with a small dimple. */
function Citrus({ position, color, scale = 1 }: { position: [number, number, number]; color: string; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <Sphere args={[0.42, 32, 32]}>
        <meshPhysicalMaterial color={color} roughness={0.45} clearcoat={0.3} />
      </Sphere>
    </group>
  );
}

/** A small cluster of grapes made from tiny spheres. */
function GrapeCluster({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  const offsets: [number, number, number][] = [
    [0, 0.18, 0], [-0.16, 0.05, 0.05], [0.16, 0.05, -0.05],
    [0, -0.05, 0.16], [-0.1, -0.15, -0.05], [0.1, -0.18, 0.08], [0, -0.3, 0],
  ];
  return (
    <group position={position} scale={scale}>
      {offsets.map((o, i) => (
        <Sphere key={i} args={[0.15, 16, 16]} position={o}>
          <meshPhysicalMaterial color="#6B3FA0" roughness={0.3} clearcoat={0.7} />
        </Sphere>
      ))}
    </group>
  );
}

function WovenBasket() {
  return (
    <group position={[0, -1.2, 0]}>
      <Cylinder args={[1.35, 0.9, 0.75, 24]}>
        <meshStandardMaterial color="#9C6B3F" roughness={0.85} />
      </Cylinder>
      {Array.from({ length: 10 }).map((_, i) => {
        const y = -0.3 + i * 0.07;
        const r = 1.35 - i * 0.045;
        return (
          <Cylinder key={i} args={[r, r, 0.03, 24]} position={[0, y, 0]}>
            <meshStandardMaterial color={i % 2 === 0 ? "#8A5A34" : "#A9764A"} roughness={0.9} />
          </Cylinder>
        );
      })}
      <Cylinder args={[1.38, 1.38, 0.1, 24]} position={[0, 0.4, 0]}>
        <meshStandardMaterial color="#7A4F2B" roughness={0.8} />
      </Cylinder>
    </group>
  );
}

function ProduceGroup() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.getElapsedTime() * 0.12;
  });

  return (
    <group ref={group} rotation={[0, 0.3, 0]}>
      <WovenBasket />

      <Float speed={1.3} rotationIntensity={0.25} floatIntensity={0.6}>
        <Apple position={[-0.45, 0.25, 0.3]} scale={1.05} />
      </Float>

      <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.7}>
        <Citrus position={[0.5, 0.35, -0.1]} color="#F0972B" scale={1} />
      </Float>

      <Float speed={1.1} rotationIntensity={0.3} floatIntensity={0.5}>
        <Citrus position={[0.05, -0.05, 0.55]} color="#E4D04A" scale={0.9} />
      </Float>

      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.65}>
        <GrapeCluster position={[-0.2, 0.55, -0.35]} scale={1.1} />
      </Float>

      <Float speed={1.7} rotationIntensity={0.2} floatIntensity={0.5}>
        <Apple position={[0.55, -0.1, 0.4]} scale={0.8} />
      </Float>
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 3]} intensity={1.6} castShadow />
      <directionalLight position={[-4, 1, -2]} intensity={0.4} color="#FFDDB0" />
      <Environment preset="apartment" />
      <ProduceGroup />
    </>
  );
}

function StaticFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center text-[7rem] select-none animate-float-slow">
      🧺
    </div>
  );
}

function ProduceScene3D() {
  const [failed, setFailed] = useState(false);

  if (failed) return <StaticFallback />;

  return (
    <Canvas3DBoundary fallback={<StaticFallback />}>
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0.4, 0.5, 4.2], fov: 38 }}
        onCreated={({ gl }) => {
          if (!gl.getContext()) setFailed(true);
        }}
        gl={{ antialias: true, alpha: true }}
      >
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </Canvas3DBoundary>
  );
}

export default ProduceScene3D;
