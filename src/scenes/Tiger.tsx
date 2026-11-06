import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '../store/scrollStore'

/** Original low-poly stylized tiger built from primitives. Not based on any existing brand. */
export function Tiger() {
  const group = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const progress = useScrollStore((s) => s.progress)

  const materials = useMemo(() => ({
    body: new THREE.MeshStandardMaterial({ color: '#E dig 85 20', roughness: 0.7 }),
    stripe: new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.6 }),
    eye: new THREE.MeshStandardMaterial({ color: '#FF7A1A', emissive: '#FF7A1A', emissiveIntensity: 2, toneMapped: false }),
    white: new THREE.MeshStandardMaterial({ color: '#F5EFE6', roughness: 0.8 }),
  }), [])

  useFrame((state) => {
    if (!group.current) return
    const p = progress
    const t = state.clock.elapsedTime

    // Visibility & position by section
    if (p < 0.12) {
      group.current.visible = false
    } else if (p < 0.25) {
      group.current.visible = true
      const local = (p - 0.12) / 0.13
      group.current.position.set(THREE.MathUtils.lerp(5, 0, local), -0.6, 0)
      group.current.rotation.y = -Math.PI * 0.15
    } else if (p < 0.75) {
      group.current.visible = true
      group.current.position.set(-2.5, -0.6, -1)
      group.current.rotation.y = Math.PI * 0.2
    } else {
      group.current.visible = true
      group.current.position.set(-1.2, -0.5, 0.5)
      group.current.rotation.y = Math.PI * 0.05
    }

    // Subtle idle breathing
    group.current.position.y += Math.sin(t * 1.5) * 0.01

    // Head tracks pointer in certain sections
    if (head.current && (p < 0.25 || p > 0.9)) {
      const mx = state.pointer.x * 0.3
      const my = state.pointer.y * 0.15
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, mx, 0.05)
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -my, 0.05)
    }
  })

  return (
    <group ref={group} scale={0.85}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]} material={materials.body}>
        <capsuleGeometry args={[0.35, 0.9, 8, 16]} />
      </mesh>
      {/* Stripes on body (simple boxes) */}
      {[ -0.3, -0.1, 0.1, 0.3 ].map((z, i) => (
        <mesh key={i} position={[0.32, 0.45, z]} rotation={[0, 0, 0.1]} material={materials.stripe}>
          <boxGeometry args={[0.08, 0.5, 0.12]} />
        </mesh>
      ))}

      {/* Head group */}
      <group ref={head} position={[0, 0.85, 0.55]}>
        <mesh material={materials.body}>
          <sphereGeometry args={[0.32, 16, 12]} />
        </mesh>
        {/* Snout */}
        <mesh position={[0, -0.05, 0.28]} material={materials.white}>
          <sphereGeometry args={[0.16, 12, 8]} />
        </mesh>
        {/* Eyes */}
        <mesh position={[-0.12, 0.08, 0.26]} material={materials.eye}>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>
        <mesh position={[0.12, 0.08, 0.26]} material={materials.eye}>
          <sphereGeometry args={[0.05, 8, 8]} />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.2, 0.25, 0]} material={materials.body}>
          <coneGeometry args={[0.08, 0.15, 6]} />
        </mesh>
        <mesh position={[0.2, 0.25, 0]} material={materials.body}>
          <coneGeometry args={[0.08, 0.15, 6]} />
        </mesh>
      </group>

      {/* Legs */}
      {[
        [-0.25, 0, 0.35],
        [0.25, 0, 0.35],
        [-0.25, 0, -0.35],
        [0.25, 0, -0.35],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} material={materials.body}>
          <capsuleGeometry args={[0.1, 0.35, 4, 8]} />
        </mesh>
      ))}

      {/* Tail */}
      <mesh position={[0, 0.5, -0.7]} rotation={[0.6, 0, 0]} material={materials.body}>
        <capsuleGeometry args={[0.06, 0.6, 4, 8]} />
      </mesh>
    </group>
  )
}
