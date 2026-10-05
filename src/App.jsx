import { lazy, Suspense, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Works from './components/Works'
import Skills from './components/Skills'
import About from './components/About'
import Contact from './components/Contact'

// three.js (~630 kB) lives in its own chunk — never blocks first paint.
// It's only visible below the hero, so fetch it after the page is
// interactive (idle) or on first scroll, whichever comes first.
const PixelFluidBg = lazy(() => import('./components/PixelFluidBg'))

export default function App() {
  const [showFluid, setShowFluid] = useState(false)

  useEffect(() => {
    let cancelled = false
    const load = () => {
      if (!cancelled) setShowFluid(true)
      cleanup()
    }
    const onScroll = () => {
      if (window.scrollY > 10) load()
    }
    const cleanup = () => {
      window.removeEventListener('scroll', onScroll)
      if (idleId) window.clearTimeout?.(idleId)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    const idleId =
      'requestIdleCallback' in window
        ? requestIdleCallback(load, { timeout: 4000 })
        : setTimeout(load, 2500)
    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <div className="font-figtree min-h-screen text-white">
      {/* NOTE: no bg-black here — a background on this unpositioned wrapper
          would paint over the fixed -z-10 shader canvas below */}
      {/* Navbar sits above hero via absolute positioning */}
      <Navbar />

      {/* Hero fullscreen — video background, no shader here */}
      <Hero />

      {/* Fixed fluid-shader backdrop (viewport-sized, paused while hero covers it) */}
      {showFluid && (
        <Suspense fallback={null}>
          <PixelFluidBg />
        </Suspense>
      )}

      {/* Scroll sections above the shader backdrop */}
      <div className="relative z-10">
        <Works />
        <Skills />
        <About />
        <Contact />
      </div>
    </div>
  )
}
