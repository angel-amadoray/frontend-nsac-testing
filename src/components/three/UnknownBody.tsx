import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

interface UnknownBodyProps {
  color: string
}

export function UnknownBody({ color }: UnknownBodyProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const pointsRef = useRef<THREE.Points>(null)

  // Nube de partículas alrededor (misterio)
  const particles = useMemoParticles()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.3
      meshRef.current.rotation.y = t * 0.4
    }
    if (pointsRef.current) {
      pointsRef.current.rotation.y = -t * 0.1
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.6} />
      </mesh>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={0.04}
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

function useMemoParticles() {
  // 200 partículas en una esfera de radio 1.8
  const count = 200
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 1.6 + Math.random() * 0.4
    positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r
    positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r
    positions[i * 3 + 2] = Math.cos(phi) * r
  }
  return positions
}