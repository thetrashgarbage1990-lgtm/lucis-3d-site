# LUCIS — Grip like you mean it.

Immersive single-page 3D scroll-driven product experience for **Lucis**, a premium tyre brand.

The visual story is built around an original stylized tiger whose stripes morph conceptually into tyre tread. Every scroll position drives the camera, tyre, tiger, and lighting on a master timeline.

**Tagline options**
1. **Grip like you mean it.** (primary)
2. Born to hold the road.
3. Light on the surface. Fierce on the turn.

## Design rationale

Tiger stripes are nature’s high-contrast, directional pattern optimized for power and stealth. Lucis translates that pattern into a functional tread geometry: continuous circumferential channels inspired by stripe flow, combined with lateral bite blocks. The orange emissive sidewall stripe is the brand’s signature “eye glow” carried onto the product. The result is a tyre that looks like it was grown from the same hunter logic that keeps a tiger on its prey.

## Tech stack

- Vite + React 18 + TypeScript
- three.js via `@react-three/fiber` + `@react-three/drei`
- GSAP + ScrollTrigger for scroll choreography
- Lenis for smooth scrolling (synced to GSAP ticker)
- Tailwind CSS
- Zustand for scroll progress store

## Setup

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  components/     # Loader, Cursor, ProgressRail, Overlay (HTML copy)
  scenes/         # Scene, Tyre, Tiger (procedural 3D)
  hooks/          # useSmoothScroll
  store/          # scrollStore (progress + section)
  App.tsx
  main.tsx
  index.css
public/
  favicon.svg
  robots.txt
  sitemap.xml
```

## How to edit copy

All marketing text lives in `src/components/Overlay.tsx` as real HTML. Change headlines, body, and CTA labels there. The four range cards and dealer form are also in that file.

## How to tune the scroll timeline

Scroll progress (0–1) is written to Zustand by a master ScrollTrigger in `App.tsx`. The 3D objects read `useScrollStore(s => s.progress)` and map ranges:

| Progress | Chapter        |
|----------|----------------|
| 0–0.12   | Hero           |
| 0.12–0.25| Tiger appears  |
| 0.25–0.45| Anatomy        |
| 0.45–0.60| Wet grip       |
| 0.60–0.75| The turn       |
| 0.75–0.90| Range          |
| 0.90–1.0 | CTA            |

Adjust the thresholds inside `Tyre.tsx`, `Tiger.tsx`, and `Scene.tsx` camera logic.

## How to swap 3D models

The current tyre and tiger are **procedural** (original geometry, no third-party model license issues).

To replace with a GLB:

1. Place the file in `public/models/` (Draco-compressed preferred).
2. In `Tyre.tsx` or `Tiger.tsx`, replace the primitive meshes with:
   ```tsx
   const { scene } = useGLTF('/models/your-tyre.glb')
   return <primitive object={scene} />
   ```
3. Keep the same `useFrame` position/rotation logic so the scroll choreography continues to work.

## Placeholder claims

All performance numbers (e.g. “18% shorter braking”) are **placeholders**. Legal and marketing must verify before public launch.

## Accessibility & fallbacks

- `prefers-reduced-motion`: loader still works; 3D is replaced by a static notice.
- WebGL unavailable: same 2D fallback.
- Overlay copy is real DOM text (selectable, screen-reader friendly).
- Keyboard focus styles on interactive elements.
- Custom cursor disabled on touch devices.

## Performance notes

- DPR capped at 1.5.
- PerformanceMonitor from drei is present for future dynamic quality.
- Initial procedural assets are extremely light; target < 8 MB even after real GLBs are added.
- Lazy-load heavier sections after hero by splitting the Canvas or using `useProgress` if needed.

## Credits & licenses

- All 3D geometry in this repo is original procedural work created for Lucis.
- Fonts: Bebas Neue & Inter (Google Fonts, open licenses).
- three.js, R3F, drei, GSAP, Lenis, Tailwind — see their respective licenses.

## Known limitations

- No real GLB tyre/tiger yet (procedural stand-ins).
- No particle systems (embers/rain/smoke) in v1 — easy to add with drei `Points` or custom shaders.
- No audio toggle implemented yet.
- Dealer locator is a non-functional UI stub.
- GitHub Pages / Vercel deployment config not yet committed (base is set for relative paths).

## Deploy

Vercel is recommended for React + Vite:

```bash
npx vercel
```

Or enable GitHub Pages with a workflow that runs `npm run build` and publishes `dist/`.

---

**Live site:** (deploy after merge)  
**Repo:** https://github.com/thetrashgarbage1990-lgtm/lucis-3d-site
