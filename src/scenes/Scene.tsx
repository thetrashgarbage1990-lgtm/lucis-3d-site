import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, ContactShadows, PerformanceMonitor } from '@react-three/drei'
import * as THREE from 'three'
import { Tyre } from './Tyre'
import { Tiger } from './Tiger'
import { useScrollStore } from '../store/scrollStore'

export function Scene() {
  const { camera } = useThree()
  const progress = useScrollStore((s) => s.progress)
  const lightRef = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    const p = progress

    // Camera path
    if (p < 0.12) {
      camera.position.lerp(new THREE.Vector3(0, 1.2, 5.5), 0.08)
      camera.lookAt(0, 0.3, 0)
    } else if (p < 0.25) {
      camera.position.lerp(new THREE.Vector3(1.5, 1.4, 4.5), 0.08)
      camera.lookAt(0, 0.2, 0)
    } else if (p < 0.45) {
      camera.position.lerp(new THREE.Vector3(2.5, 1.8, 3.5), 0.06)
      camera.lookAt(0, 0.2, 0)
    } else if (p < 0.6) {
      // Wet grip – lower, more dramatic
      camera.position.lerp(new THREE.Vector3(0, 0.9, 4), 0.08)
      camera.lookAt(0, -0.2, 0)
      if (lightRef.current) lightRef.current.color.set('#3B82F6')
    } else if (p < 0.75) {
      camera.position.lerp(new THREE.Vector3(-1, 1.5, 3.2), 0.07)
      camera.lookAt(1, 0, -1)
      if (lightRef.current) lightRef.current.color.set('#FF7A1A')
    } else {
      camera.position.lerp(new THREE.Vector3(0, 1.3, 5), 0.08)
      camera.lookAt(0, 0, 0)
      if (lightRef.current) lightRef.current.color.set('#FF7A1A')
    }
  })

  return (
    <>
      <color attach="background" args={['#0B0B0D']} />
      <fog attach="fog" args={['#0B0B0D', 8, 22]} />

      <ambientLight intensity={0.25} />
      <directionalLight
        ref={lightRef}
        position={[4, 6, 3]}
        intensity={1.4}
        color="#FF7A1A"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 2, -2]} intensity={0.6} color="#C2410C" />
      <spotLight position={[0, 5, 2]} intensity={0.8} angle={0.4} penumbra={0.5} color="#F5EFE6" />

      <Tyre />
      <Tiger />

      {/* Reflective floor for wet / studio */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#0a0a0c"
          metalness={0.85}
          roughness={0.15}
          envMapIntensity={0.6}
        />
      </mesh>

      <ContactShadows position={[0, -1.09, 0]} opacity={0.5} scale={12} blur={2.5} far={4} />

      <Environment preset="night" />

      <PerformanceMonitor
        onDecline={() => {
          // Could lower dpr or particle counts here
        }}
      />
    </>
  )
}
