import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface StarBodyProps {
  color: string;
  emissiveIntensity: number;
}

export function StarBody({ color, emissiveIntensity }: StarBodyProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) coreRef.current.rotation.y = t * 0.15;
    if (haloRef.current) {
      const scale = 1.5 + Math.sin(t * 2) * 0.12;
      haloRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Núcleo emisivo */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={emissiveIntensity}
          toneMapped={false}
          roughness={0.05}
          metalness={0}
        />
      </mesh>

      {/* Halo exterior (glow falso) */}
      <mesh ref={haloRef}>
        <sphereGeometry args={[0.8, 64, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.35}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
