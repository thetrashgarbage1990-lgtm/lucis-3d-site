import { useEffect, useState } from 'react'

interface Props {
  onComplete: () => void
}

export function Loader({ onComplete }: Props) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let p = 0
    const id = setInterval(() => {
      p += Math.random() * 18 + 4
      if (p >= 100) {
        p = 100
        clearInterval(id)
        setTimeout(onComplete, 400)
      }
      setProgress(Math.min(100, Math.floor(p)))
    }, 120)
    return () => clearInterval(id)
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-jet">
      <div className="mb-8 text-center">
        <h1 className="font-display text-6xl md:text-8xl tracking-widest text-tiger">LUCIS</h1>
        <p className="mt-2 text-bone/50 text-sm tracking-[0.3em] uppercase">Loading grip</p>
      </div>
      <div className="w-48 h-1 bg-bone/10 overflow-hidden rounded-full">
        <div
          className="h-full bg-tiger transition-all duration-200"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="mt-3 font-mono text-xs text-bone/40">{progress}%</p>
      <div className="absolute bottom-12 left-0 right-0 h-0.5 stripe-divider opacity-40" />
    </div>
  )
}
