import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

interface RockyBodyProps {
  color: string
  roughness: number
  metalness: number
}

export function RockyBody({ color, roughness, metalness }: RockyBodyProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 5)
    const positions = geo.attributes.position
    const vec = new THREE.Vector3()

    for (let i = 0; i < positions.count; i++) {
      vec.fromBufferAttribute(positions, i)
      // Ruido pseudo-Perlin combinando senos en 3 ejes
      const n1 = Math.sin(vec.x * 3.7) * Math.cos(vec.y * 4.3) * Math.sin(vec.z * 5.1)
      const n2 = Math.sin(vec.x * 9.2 + 1.5) * Math.cos(vec.y * 8.1) * Math.sin(vec.z * 7.3)
      const n3 = Math.sin(vec.x * 15.1) * Math.cos(vec.y * 13.7) * Math.sin(vec.z * 11.9)
      const noise = (n1 * 0.18 + n2 * 0.08 + n3 * 0.04)
      vec.multiplyScalar(1 + noise)
      positions.setXYZ(i, vec.x, vec.y, vec.z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.15
  })

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        flatShading
      />
    </mesh>
  )
}