import { useScrollStore } from '../store/scrollStore'

const chapters = [
  'Hero',
  'Tiger',
  'Anatomy',
  'Wet Grip',
  'The Turn',
  'Range',
  'CTA',
]

export function ProgressRail() {
  const progress = useScrollStore((s) => s.progress)
  const section = useScrollStore((s) => s.section)

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-center gap-3">
      <div className="relative h-48 w-1 bg-bone/10 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full bg-tiger origin-top transition-transform duration-150"
          style={{ height: '100%', transform: `scaleY(${progress})` }}
        />
      </div>
      <span className="text-[10px] tracking-widest text-bone/40 uppercase writing-vertical">
        {chapters[section] ?? ''}
      </span>
    </div>
  )
}
