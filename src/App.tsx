import { useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { Scene } from './scenes/Scene'
import { Overlay } from './components/Overlay'
import { Loader } from './components/Loader'
import { Cursor } from './components/Cursor'
import { ProgressRail } from './components/ProgressRail'
import { useScrollStore } from './store/scrollStore'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function App() {
  useSmoothScroll()
  const [ready, setReady] = useState(false)
  const [webglOk, setWebglOk] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const setProgress = useScrollStore((s) => s.setProgress)
  const setSection = useScrollStore((s) => s.setSection)

  useEffect(() => {
    // Detect WebGL
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (!gl) setWebglOk(false)
    } catch {
      setWebglOk(false)
    }
  }, [])

  useEffect(() => {
    if (!ready) return

    const sections = gsap.utils.toArray<HTMLElement>('[data-section]')
    const total = sections.length

    const master = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          setProgress(self.progress)
          const idx = Math.min(total - 1, Math.floor(self.progress * total))
          setSection(idx)
        },
      },
    })

    // Placeholder markers for timeline control (scene reads progress)
    master.to({}, { duration: 1 })

    return () => {
      master.kill()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [ready, setProgress, setSection])

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div ref={containerRef} className="relative w-full">
      {!ready && <Loader onComplete={() => setReady(true)} />}

      {webglOk && !reducedMotion ? (
        <div className="fixed inset-0 z-0">
          <Canvas
            camera={{ position: [0, 1.2, 6], fov: 45, near: 0.1, far: 100 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, powerPreference: 'high-performance', alpha: false }}
            style={{ background: '#0B0B0D' }}
          >
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </div>
      ) : (
        <div className="fixed inset-0 z-0 bg-jet flex items-center justify-center">
          <p className="text-bone/60 font-body text-sm">2D fallback mode</p>
        </div>
      )}

      <Overlay />
      <ProgressRail />
      <Cursor />
    </div>
  )
}

export default App
