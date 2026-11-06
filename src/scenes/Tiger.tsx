import { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollStore } from '../store/scrollStore'

/**
 * Higher-fidelity original stylized tiger (still original design).
 * Drop a real GLB at /models/tiger.glb to replace automatically.
 * Recommended: CC0 models only.
 */
function ProceduralTiger() {
  const group = useRef<THREE.Group>(null)
  const head = useRef<THREE.Group>(null)
  const progress = useScrollStore((s) => s.progress)

  const mats = useMemo(() => ({
    fur: new THREE.MeshStandardMaterial({
      color: '#E07A2F',
      roughness: 0.78,
      metalness: 0.05,
    }),
    stripe: new THREE.MeshStandardMaterial({
      color: '#1a120c',
      roughness: 0.85,
    }),
    cream: new THREE.MeshStandardMaterial({
      color: '#F5E6D3',
      roughness: 0.7,
    }),
    eye: new THREE.MeshStandardMaterial({
      color: '#FF7A1A',
      emissive: '#FF7A1A',
      emissiveIntensity: 2.4,
      toneMapped: false,
    }),
    nose: new THREE.MeshStandardMaterial({
      color: '#2a1810',
      roughness: 0.4,
    }),
    black: new THREE.MeshStandardMaterial({
      color: '#0a0a0a',
      roughness: 0.6,
    }),
  }), [])

  useFrame((state) => {
    if (!group.current) return
    const p = progress
    const t = state.clock.elapsedTime

    if (p < 0.12) {
      group.current.visible = false
    } else if (p < 0.25) {
      group.current.visible = true
      const local = (p - 0.12) / 0.13
      group.current.position.set(THREE.MathUtils.lerp(5.5, 0.2, local), -0.55, 0.3)
      group.current.rotation.y = -Math.PI * 0.2
      group.current.scale.setScalar(THREE.MathUtils.lerp(0.7, 1, local))
    } else if (p < 0.75) {
      group.current.visible = true
      group.current.position.set(-2.8, -0.55, -0.8)
      group.current.rotation.y = Math.PI * 0.25
      group.current.scale.setScalar(0.95)
    } else {
      group.current.visible = true
      group.current.position.set(-1.4, -0.45, 0.6)
      group.current.rotation.y = Math.PI * 0.08
      group.current.scale.setScalar(1.05)
    }

    // Idle breathing + subtle weight shift
    group.current.position.y += Math.sin(t * 1.4) * 0.012
    group.current.rotation.z = Math.sin(t * 0.8) * 0.015

    // Head tracks pointer in hero / CTA
    if (head.current && (p < 0.28 || p > 0.88)) {
      const mx = state.pointer.x * 0.35
      const my = state.pointer.y * 0.18
      head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, mx, 0.06)
      head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -my, 0.06)
    }
  })

  return (
    <group ref={group}>
      {/* Torso */}
      <mesh position={[0, 0.55, 0]} material={mats.fur} castShadow>
        <capsuleGeometry args={[0.42, 1.05, 12, 24]} />
      </mesh>

      {/* Belly cream */}
      <mesh position={[0, 0.35, 0.15]} material={mats.cream}>
        <capsuleGeometry args={[0.28, 0.7, 8, 16]} />
      </mesh>

      {/* Stripe set — denser, more natural placement */}
      {[
        [0.38, 0.7, -0.35], [0.4, 0.55, -0.15], [0.4, 0.65, 0.05],
        [0.38, 0.5, 0.25], [0.36, 0.75, 0.4],
        [-0.38, 0.7, -0.35], [-0.4, 0.55, -0.15], [-0.4, 0.65, 0.05],
        [-0.38, 0.5, 0.25], [-0.36, 0.75, 0.4],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} material={mats.stripe}>
          <boxGeometry args={[0.1, 0.55, 0.09]} />
        </mesh>
      ))}

      {/* Head */}
      <group ref={head} position={[0, 1.05, 0.62]}>
        <mesh material={mats.fur} castShadow>
          <sphereGeometry args={[0.38, 24, 20]} />
        </mesh>
        {/* Muzzle */}
        <mesh position={[0, -0.08, 0.32]} material={mats.cream}>
          <sphereGeometry args={[0.2, 16, 12]} />
        </mesh>
        {/* Nose */}
        <mesh position={[0, -0.02, 0.48]} material={mats.nose}>
          <sphereGeometry args={[0.07, 12, 8]} />
        </mesh>
        {/* Eyes — glowing Lucis orange */}
        <mesh position={[-0.14, 0.1, 0.3]} material={mats.eye}>
          <sphereGeometry args={[0.055, 12, 12]} />
        </mesh>
        <mesh position={[0.14, 0.1, 0.3]} material={mats.eye}>
          <sphereGeometry args={[0.055, 12, 12]} />
        </mesh>
        {/* Pupils */}
        <mesh position={[-0.14, 0.1, 0.35]} material={mats.black}>
          <sphereGeometry args={[0.025, 8, 8]} />
        </mesh>
        <mesh position={[0.14, 0.1, 0.35]} material={mats.black}>
          <sphereGeometry args={[0.025, 8, 8]} />
        </mesh>
        {/* Ears */}
        <mesh position={[-0.24, 0.3, 0.05]} rotation={[0.2, 0, -0.3]} material={mats.fur}>
          <coneGeometry args={[0.1, 0.18, 8]} />
        </mesh>
        <mesh position={[0.24, 0.3, 0.05]} rotation={[0.2, 0, 0.3]} material={mats.fur}>
          <coneGeometry args={[0.1, 0.18, 8]} />
        </mesh>
        {/* Inner ear */}
        <mesh position={[-0.24, 0.28, 0.08]} rotation={[0.2, 0, -0.3]} material={mats.cream}>
          <coneGeometry args={[0.05, 0.1, 6]} />
        </mesh>
        <mesh position={[0.24, 0.28, 0.08]} rotation={[0.2, 0, 0.3]} material={mats.cream}>
          <coneGeometry args={[0.05, 0.1, 6]} />
        </mesh>
        {/* Jaw stripe marks */}
        <mesh position={[-0.22, -0.05, 0.25]} material={mats.stripe}>
          <boxGeometry args={[0.04, 0.2, 0.04]} />
        </mesh>
        <mesh position={[0.22, -0.05, 0.25]} material={mats.stripe}>
          <boxGeometry args={[0.04, 0.2, 0.04]} />
        </mesh>
      </group>

      {/* Neck */}
      <mesh position={[0, 0.85, 0.35]} material={mats.fur}>
        <capsuleGeometry args={[0.22, 0.2, 6, 12]} />
      </mesh>

      {/* Legs — more natural stance */}
      {[
        { pos: [-0.28, 0.05, 0.4], rot: [0.1, 0, 0] },
        { pos: [0.28, 0.05, 0.4], rot: [0.1, 0, 0] },
        { pos: [-0.3, 0.05, -0.4], rot: [-0.05, 0, 0] },
        { pos: [0.3, 0.05, -0.4], rot: [-0.05, 0, 0] },
      ].map((leg, i) => (
        <group key={i} position={leg.pos as [number, number, number]} rotation={leg.rot as [number, number, number]}>
          <mesh material={mats.fur} castShadow>
            <capsuleGeometry args={[0.12, 0.45, 6, 12]} />
          </mesh>
          {/* Paw */}
          <mesh position={[0, -0.38, 0.04]} material={mats.black}>
            <sphereGeometry args={[0.13, 10, 8]} />
          </mesh>
        </group>
      ))}

      {/* Tail with stripes */}
      <group position={[0, 0.65, -0.75]} rotation={[0.5, 0, 0]}>
        <mesh material={mats.fur}>
          <capsuleGeometry args={[0.07, 0.75, 6, 10]} />
        </mesh>
        {[0.15, 0.35, 0.55].map((z, i) => (
          <mesh key={i} position={[0, 0, -z]} material={mats.stripe}>
            <torusGeometry args={[0.08, 0.025, 6, 12]} />
          </mesh>
        ))}
        {/* Tip */
        <mesh position={[0, 0, -0.85]} material={mats.black}>
          <sphereGeometry args={[0.08, 8, 8]} />
        </mesh>
      </group>
    </group>
  )
}

function GLBTiger() {
  const { scene } = useGLTF('/models/tiger.glb')
  const group = useRef<THREE.Group>(null)
  const progress = useScrollStore((s) => s.progress)

  useFrame((state) => {
    if (!group.current) return
    const p = progress
    const t = state.clock.elapsedTime

    if (p < 0.12) {
      group.current.visible = false
    } else if (p < 0.25) {
      group.current.visible = true
      const local = (p - 0.12) / 0.13
      group.current.position.set(THREE.MathUtils.lerp(5.5, 0.2, local), -0.55, 0.3)
      group.current.rotation.y = -Math.PI * 0.2
      group.current.scale.setScalar(THREE.MathUtils.lerp(0.5, 0.85, local))
    } else if (p < 0.75) {
      group.current.visible = true
      group.current.position.set(-2.8, -0.55, -0.8)
      group.current.rotation.y = Math.PI * 0.25
      group.current.scale.setScalar(0.8)
    } else {
      group.current.visible = true
      group.current.position.set(-1.4, -0.45, 0.6)
      group.current.rotation.y = Math.PI * 0.08
      group.current.scale.setScalar(0.9)
    }
    group.current.position.y += Math.sin(t * 1.4) * 0.01
  })

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene.clone()} />
      </Center>
    </group>
  )
}

export function Tiger() {
  return (
    <Suspense fallback={<ProceduralTiger />}>
      <GLBTiger />
    </Suspense>
  )
}

try {
  useGLTF.preload('/models/tiger.glb')
} catch {
  /* no-op */
}
