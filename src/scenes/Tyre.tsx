import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useScrollStore } from '../store/scrollStore'

/**
 * Realistic procedural Lucis tyre with directional tread (stripe motif),
 * alloy rim, and signature orange emissive sidewall.
 *
 * To use a real GLB instead:
 * 1. Put the file at public/models/tyre.glb
 * 2. Swap this component for a useGLTF version (see CREDITS.md)
 */
export function Tyre() {
  const group = useRef<THREE.Group>(null)
  const progress = useScrollStore((s) => s.progress)

  const parts = useMemo(() => {
    const root = new THREE.Group()

    // Main carcass — high segment count for smooth silhouette
    const carcass = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.42, 48, 96),
      new THREE.MeshStandardMaterial({
        color: '#0c0c0c',
        roughness: 0.93,
        metalness: 0.02,
        envMapIntensity: 0.25,
      })
    )
    carcass.castShadow = true
    carcass.receiveShadow = true
    root.add(carcass)

    // Directional tread blocks (tiger-stripe inspired)
    const treadMat = new THREE.MeshStandardMaterial({
      color: '#101010',
      roughness: 0.96,
      metalness: 0,
    })
    for (let i = 0; i < 56; i++) {
      const a = (i / 56) * Math.PI * 2
      const block = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.09, 0.24), treadMat)
      block.position.set(Math.cos(a) * 1.53, Math.sin(a) * 1.53, 0)
      block.rotation.z = a
      block.rotation.y = i % 2 === 0 ? 0.18 : -0.18
      block.castShadow = true
      root.add(block)
    }

    // Shoulder blocks
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2
      for (const z of [0.3, -0.3]) {
        const s = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.15), treadMat)
        s.position.set(Math.cos(a) * 1.48, Math.sin(a) * 1.48, z)
        s.rotation.z = a
        root.add(s)
      }
    }

    // Alloy rim
    const rimMat = new THREE.MeshStandardMaterial({
      color: '#b8bdc8',
      metalness: 0.96,
      roughness: 0.16,
      envMapIntensity: 1.3,
    })
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.78, 0.82, 0.28, 64, 1, true),
      rimMat
    )
    rim.rotation.x = Math.PI / 2
    root.add(rim)

    // 5 double-spoke design
    const spokeMat = new THREE.MeshStandardMaterial({
      color: '#9aa0ac',
      metalness: 0.92,
      roughness: 0.2,
    })
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.72, 0.07), spokeMat)
      spoke.position.set(Math.cos(a) * 0.38, Math.sin(a) * 0.38, 0)
      spoke.rotation.z = a + Math.PI / 2
      root.add(spoke)
      // secondary thinner spoke
      const spoke2 = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.65, 0.05), spokeMat)
      spoke2.position.set(Math.cos(a + 0.12) * 0.36, Math.sin(a + 0.12) * 0.36, 0)
      spoke2.rotation.z = a + 0.12 + Math.PI / 2
      root.add(spoke2)
    }

    // Centre hub
    const hub = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32),
      new THREE.MeshStandardMaterial({ color: '#0B0B0D', metalness: 0.85, roughness: 0.25 })
    )
    hub.rotation.x = Math.PI / 2
    hub.position.z = 0.08
    root.add(hub)

    // Orange emissive sidewall stripe — brand signature
    const stripeMat = new THREE.MeshStandardMaterial({
      color: '#FF7A1A',
      emissive: '#FF7A1A',
      emissiveIntensity: 2.0,
      toneMapped: false,
      roughness: 0.35,
    })
    for (const z of [0.2, -0.2]) {
      const stripe = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.038, 12, 64), stripeMat)
      stripe.rotation.x = Math.PI / 2
      stripe.position.z = z
      root.add(stripe)
    }

    // Sidewall lettering band (dark raised ring)
    const band = new THREE.Mesh(
      new THREE.TorusGeometry(1.15, 0.055, 8, 64),
      new THREE.MeshStandardMaterial({ color: '#151515', roughness: 0.65, metalness: 0.1 })
    )
    band.rotation.x = Math.PI / 2
    band.position.z = 0.34
    root.add(band)

    return root
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

  return <primitive ref={group} object={parts} />
}
