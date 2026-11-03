import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, type ReactNode } from 'react'

export function Scene({ children }: { children: ReactNode }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#050810']} />

      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.3} />
      <directionalLight position={[-5, -3, -5]} intensity={0.4} color="#6b7cff" />
      <pointLight position={[0, 0, 4]} intensity={0.5} color="#ffffff" />

      <Suspense fallback={null}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
        />
        {children}
      </Suspense>
    </Canvas>
  )
}