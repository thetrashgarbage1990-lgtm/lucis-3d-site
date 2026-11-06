import { useRef, useMemo, Suspense } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, Center } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollStore } from '../store/scrollStore'

/**
 * Realistic procedural Lucis tyre.
 * Drop a real GLB at /models/tyre.glb to replace automatically.
 */
function ProceduralTyre() {
  const group = useRef<THREE.Group>(null)
  const progress = useScrollStore((s) => s.progress)

  const { tyreMesh, rimMesh, treadRings, sidewallText } = useMemo(() => {
    // High-segment torus for the main carcass
    const tyre = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.42, 48, 96),
      new THREE.MeshStandardMaterial({
        color: '#0d0d0d',
        roughness: 0.92,
        metalness: 0.02,
        envMapIntensity: 0.3,
      })
    )

    // Tread blocks — circumferential + angled grooves (stripe motif)
    const rings: THREE.Mesh[] = []
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2
      const block = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.08, 0.22),
        new THREE.MeshStandardMaterial({
          color: '#111',
          roughness: 0.95,
          metalness: 0,
        })
      )
      block.position.set(Math.cos(a) * 1.52, Math.sin(a) * 1.52, 0)
      block.rotation.z = a
      // Slight angular offset for directional tread look
      block.rotation.y = (i % 2 === 0 ? 0.15 : -0.15)
      rings.push(block)
    }

    // Secondary shoulder blocks
    for (let i = 0; i < 32; i++) {
      const a = (i / 32) * Math.PI * 2
      const shoulder = new THREE.Mesh(
        new THREE.BoxGeometry(0.1, 0.06, 0.14),
        new THREE.MeshStandardMaterial({ color: '#0a0a0a', roughness: 0.9 })
      )
      shoulder.position.set(Math.cos(a) * 1.48, Math.sin(a) * 1.48, 0.28)
      shoulder.rotation.z = a
      rings.push(shoulder)
      const shoulder2 = shoulder.clone()
      shoulder2.position.z = -0.28
      rings.push(shoulder2)
    }

    // Alloy rim
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.82, 0.28, 64, 1, true),
      new THREE.MeshStandardMaterial({
        color: '#c0c4cc',
        metalness: 0.95,
        roughness: 0.18,
        envMapIntensity: 1.2,
      })
    )
    rim.rotation.x = Math.PI / 2

    // Spokes
    const spokeMat = new THREE.MeshStandardMaterial({
      color: '#a8adb8',
      metalness: 0.9,
      roughness: 0.22,
    })
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.7, 0.08), spokeMat)
      spoke.position.set(Math.cos(a) * 0.38, Math.sin(a) * 0.38, 0)
      spoke.rotation.z = a + Math.PI / 2
      rim.add(spoke)
    }

    // Centre cap with LUCIS colour
    const cap = new THREE.Mesh(
      new THREE.CircleGeometry(0.22, 32),
      new THREE.MeshStandardMaterial({
        color: '#0B0B0D',
        metalness: 0.8,
        roughness: 0.25,
      })
    )
    cap.position.z = 0.15
    rim.add(cap)

    // Orange emissive sidewall stripe (brand signature)
    const stripeGeo = new THREE.TorusGeometry(1.15, 0.035, 12, 64)
    const stripeMat = new THREE.MeshStandardMaterial({
      color: '#FF7A1A',
      emissive: '#FF7A1A',
      emissiveIntensity: 1.8,
      toneMapped: false,
      roughness: 0.4,
    })
    const stripe1 = new THREE.Mesh(stripeGeo, stripeMat)
    stripe1.rotation.x = Math.PI / 2
    stripe1.position.z = 0.18
    const stripe2 = stripe1.clone()
    stripe2.position.z = -0.18

    // Simulated sidewall lettering band
    const letterBand = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.06, 8, 64),
      new THREE.MeshStandardMaterial({
        color: '#1a1a1a',
        roughness: 0.7,
        metalness: 0.1,
      })
    )
    letterBand.rotation.x = Math.PI / 2
    letterBand.position.z = 0.32

    return {
      tyreMesh: tyre,
      rimMesh: rim,
      treadRings: rings,
      sidewallText: [stripe1, stripe2, letterBand],
    }
  }, [])

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.x += delta * 0.55
    const p = progress

    if (p < 0.12) {
      group.current.position.set(0, 0.15, 0)
      group.current.scale.setScalar(1.35)
      group.current.rotation.y = 0
    } else if (p < 0.25) {
      const t = (p - 0.12) / 0.13
      group.current.position.x = THREE.MathUtils.lerp(0, -4.2, t)
      group.current.scale.setScalar(THREE.MathUtils.lerp(1.35, 0.85, t))
    } else if (p < 0.45) {
      const t = (p - 0.25) / 0.2
      group.current.position.set(THREE.MathUtils.lerp(-4.2, 0, t), 0.35, 0)
      group.current.scale.setScalar(1.05)
      group.current.rotation.y = t * Math.PI * 0.6
    } else if (p < 0.6) {
      group.current.position.set(0, -0.15, 0)
      group.current.rotation.z = Math.sin(p * 22) * 0.04
      group.current.scale.setScalar(1.1)
    } else if (p < 0.75) {
      const t = (p - 0.6) / 0.15
      group.current.position.set(t * 2.2, 0.25, -0.8)
      group.current.rotation.z = -t * 0.45
      group.current.scale.setScalar(1.0)
    } else {
      group.current.position.set(1.6, -0.35, 0.2)
      group.current.scale.setScalar(0.85)
      group.current.rotation.y = 0.3
    }
  })

  return (
    <group ref={group}>
      <primitive object={tyreMesh} />
      {treadRings.map((m, i) => (
        <primitive key={i} object={m} />
      ))}
      <primitive object={rimMesh} />
      {sidewallText.map((m, i) => (
        <primitive key={`s${i}`} object={m} />
      ))}
    </group>
  )
}

function GLBTyre() {
  const { scene } = useGLTF('/models/tyre.glb')
  const group = useRef<THREE.Group>(null)
  const progress = useScrollStore((s) => s.progress)

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.x += delta * 0.55
    const p = progress
    if (p < 0.12) {
      group.current.position.set(0, 0.15, 0)
      group.current.scale.setScalar(1.8)
    } else if (p < 0.25) {
      const t = (p - 0.12) / 0.13
      group.current.position.x = THREE.MathUtils.lerp(0, -4.2, t)
      group.current.scale.setScalar(THREE.MathUtils.lerp(1.8, 1.1, t))
    } else if (p < 0.45) {
      const t = (p - 0.25) / 0.2
      group.current.position.set(THREE.MathUtils.lerp(-4.2, 0, t), 0.35, 0)
      group.current.scale.setScalar(1.4)
      group.current.rotation.y = t * Math.PI * 0.6
    } else if (p < 0.6) {
      group.current.position.set(0, -0.15, 0)
      group.current.scale.setScalar(1.4)
    } else if (p < 0.75) {
      const t = (p - 0.6) / 0.15
      group.current.position.set(t * 2.2, 0.25, -0.8)
      group.current.rotation.z = -t * 0.45
    } else {
      group.current.position.set(1.6, -0.35, 0.2)
      group.current.scale.setScalar(1.1)
    }
  })

  return (
    <group ref={group}>
      <Center>
        <primitive object={scene.clone()} />
      </Center>
    </group>
  )
}

export function Tyre() {
  // Try GLB first; fall back to procedural if missing
  return (
    <Suspense fallback={<ProceduralTyre />}>
      <GLBTyre />
    </Suspense>
  )
}

// Preload if present (silent fail is fine)
try {
  useGLTF.preload('/models/tyre.glb')
} catch {
  /* no-op */
}
