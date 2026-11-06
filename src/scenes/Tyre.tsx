import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '../store/scrollStore'

export function Tyre() {
  const group = useRef<THREE.Group>(null)
  const progress = useScrollStore((s) => s.progress)

  // Procedural tyre geometry (torus + sidewall details)
  const { tyreGeo, rimGeo } = useMemo(() => {
    const tyre = new THREE.TorusGeometry(1.2, 0.38, 24, 64)
    const rim = new THREE.CylinderGeometry(0.85, 0.85, 0.25, 32, 1, true)
    return { tyreGeo: tyre, rimGeo: rim }
  }, [])

  useFrame((_, delta) => {
    if (!group.current) return
    // Continuous slow roll + scroll influence
    group.current.rotation.x += delta * 0.4
    const p = progress

    // Position choreography
    if (p < 0.12) {
      group.current.position.set(0, 0, 0)
      group.current.scale.setScalar(1.4)
    } else if (p < 0.25) {
      const t = (p - 0.12) / 0.13
      group.current.position.x = THREE.MathUtils.lerp(0, -4, t)
      group.current.scale.setScalar(THREE.MathUtils.lerp(1.4, 0.9, t))
    } else if (p < 0.45) {
      const t = (p - 0.25) / 0.2
      group.current.position.set(THREE.MathUtils.lerp(-4, 0, t), 0.3, 0)
      group.current.scale.setScalar(1.1)
      group.current.rotation.y = t * Math.PI * 0.5
    } else if (p < 0.6) {
      group.current.position.set(0, -0.2, 0)
      group.current.rotation.z = Math.sin(p * 20) * 0.05
    } else if (p < 0.75) {
      const t = (p - 0.6) / 0.15
      group.current.position.set(t * 2, 0.2, -1)
      group.current.rotation.z = -t * 0.4
    } else {
      group.current.position.set(1.5, -0.4, 0)
      group.current.scale.setScalar(0.9)
    }
  })

  return (
    <group ref={group}>
      {/* Main tyre body */}
      <mesh geometry={tyreGeo} castShadow receiveShadow>
        <meshStandardMaterial
          color="#111111"
          roughness={0.85}
          metalness={0.05}
          emissive="#FF7A1A"
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* Sidewall stripe glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.15]}>
        <torusGeometry args={[1.2, 0.04, 8, 48]} />
        <meshStandardMaterial color="#FF7A1A" emissive="#FF7A1A" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.15]}>
        <torusGeometry args={[1.2, 0.04, 8, 48]} />
        <meshStandardMaterial color="#FF7A1A" emissive="#FF7A1A" emissiveIntensity={1.2} toneMapped={false} />
      </mesh>
      {/* Rim */}
      <mesh geometry={rimGeo} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#2a2a2e" metalness={0.9} roughness={0.25} />
      </mesh>
      {/* Center cap */}
      <mesh position={[0, 0, 0.13]}>
        <circleGeometry args={[0.25, 32]} />
        <meshStandardMaterial color="#0B0B0D" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}
