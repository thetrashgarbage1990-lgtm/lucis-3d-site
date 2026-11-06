import { useEffect, useRef } from 'react'

export function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const trail = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMove = (e: MouseEvent) => {
      if (ring.current) {
        ring.current.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`
      }
      if (trail.current) {
        trail.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`
        trail.current.style.opacity = '0.6'
        clearTimeout((trail.current as any)._t)
        ;(trail.current as any)._t = setTimeout(() => {
          if (trail.current) trail.current.style.opacity = '0'
        }, 80)
      }
    }

    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div
        ref={ring}
        className="pointer-events-none fixed top-0 left-0 z-[100] hidden md:block w-6 h-6 rounded-full border border-tiger mix-blend-difference"
        style={{ transition: 'transform 0.08s ease-out' }}
      />
      <div
        ref={trail}
        className="pointer-events-none fixed top-0 left-0 z-[99] hidden md:block w-2 h-2 rounded-full bg-tiger/80"
        style={{ opacity: 0, transition: 'opacity 0.15s' }}
      />
    </>
  )
}
