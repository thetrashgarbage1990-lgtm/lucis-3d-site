import { useScrollStore } from '../store/scrollStore'

export function Overlay() {
  const progress = useScrollStore((s) => s.progress)

  return (
    <div className="relative z-10 pointer-events-none">
      {/* Spacer sections drive scroll height */}
      <section data-section="0" className="h-[120vh] relative flex flex-col items-center justify-end pb-24">
        <div className="pointer-events-auto text-center px-6 max-w-4xl">
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider text-bone leading-none">
            GRIP LIKE<br />YOU MEAN IT
          </h1>
          <p className="mt-6 text-bone/60 text-sm md:text-base tracking-widest uppercase">
            Scroll to enter the hunt
          </p>
          <div className="mt-10 animate-bounce opacity-70">
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" className="mx-auto">
              <path d="M12 0v28M4 20l8 8 8-8" stroke="#FF7A1A" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </section>

      <section data-section="1" className="h-[100vh] flex items-center justify-center px-6">
        <div className="pointer-events-auto max-w-xl text-center md:text-left md:ml-auto md:mr-24">
          <p className="font-display text-4xl md:text-6xl text-tiger tracking-wide">Built from the hunter.</p>
          <p className="mt-4 text-bone/70 text-lg">Stripes that grip. Power that holds.</p>
        </div>
      </section>

      <section data-section="2" className="h-[140vh] flex items-center px-6">
        <div className="pointer-events-auto max-w-md">
          <h2 className="font-display text-4xl md:text-5xl text-bone">Anatomy of a Lucis</h2>
          <ul className="mt-8 space-y-4 text-sm text-bone/80">
            <li><span className="text-tiger font-semibold">Stripe-Lock Tread</span> — 18% shorter braking <span className="text-bone/40">(placeholder)</span></li>
            <li><span className="text-tiger font-semibold">Steel Belts</span> — high-speed stability</li>
            <li><span className="text-tiger font-semibold">Body Plies</span> — impact resistance</li>
            <li><span className="text-tiger font-semibold">Inner Liner</span> — air retention</li>
            <li><span className="text-tiger font-semibold">Bead</span> — rim lock under load</li>
          </ul>
        </div>
      </section>

      <section data-section="3" className="h-[100vh] flex items-center justify-end px-6 md:px-24">
        <div className="pointer-events-auto max-w-md text-right">
          <h2 className="font-display text-4xl md:text-5xl text-rain">Rain is just another surface.</h2>
          <p className="mt-4 text-bone/70">Channels that eject water. Confidence when the road disappears.</p>
        </div>
      </section>

      <section data-section="4" className="h-[100vh] flex items-center px-6">
        <div className="pointer-events-auto max-w-lg">
          <h2 className="font-display text-5xl md:text-6xl text-tiger">Hold the line.</h2>
          <p className="mt-4 text-bone/70 text-lg">Lateral force. Zero compromise.</p>
        </div>
      </section>

      <section data-section="5" className="h-[120vh] flex items-center px-6">
        <div className="pointer-events-auto w-full max-w-5xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl text-center mb-12">Find yours</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {['Urban', 'Performance', 'Off-Road', 'Winter'].map((name) => (
              <div
                key={name}
                className="bg-bone/5 border border-bone/10 p-6 rounded-sm hover:border-tiger/50 transition-colors pointer-events-auto"
              >
                <h3 className="font-display text-2xl text-tiger">{name}</h3>
                <p className="mt-2 text-xs text-bone/50">Key spec placeholder</p>
                <button className="mt-6 text-sm uppercase tracking-widest text-bone hover:text-tiger transition-colors">
                  Find yours →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section data-section="6" className="h-[100vh] flex flex-col items-center justify-center px-6 pb-20">
        <div className="pointer-events-auto text-center max-w-xl">
          <h2 className="font-display text-5xl md:text-7xl text-bone">Find a Lucis dealer</h2>
          <form
            className="mt-10 flex flex-col sm:flex-row gap-3"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              placeholder="City or postcode"
              className="flex-1 bg-bone/5 border border-bone/20 px-4 py-3 text-bone placeholder:text-bone/30 focus:border-tiger outline-none"
              aria-label="Dealer location search"
            />
            <button
              type="submit"
              className="bg-tiger text-jet font-semibold px-8 py-3 uppercase tracking-wider hover:bg-ember transition-colors"
            >
              Locate
            </button>
          </form>
          <button className="mt-6 text-sm uppercase tracking-widest text-bone/60 hover:text-tiger transition-colors">
            Request a quote
          </button>
        </div>

        <footer className="absolute bottom-8 left-0 right-0 text-center text-xs text-bone/40 space-x-6 pointer-events-auto">
          <a href="#" className="hover:text-tiger">Privacy</a>
          <a href="#" className="hover:text-tiger">Terms</a>
          <a href="#" className="hover:text-tiger">Contact</a>
          <span>© 2026 Lucis</span>
        </footer>
      </section>

      {/* Progress debug (remove in prod) */}
      <div className="fixed bottom-4 left-4 text-[10px] text-bone/20 font-mono z-50">
        {(progress * 100).toFixed(0)}%
      </div>
    </div>
  )
}
