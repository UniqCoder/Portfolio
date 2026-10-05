import { useState, useEffect, useRef } from 'react'

const VIDEOS = [
  { url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_030107_874273ea-684a-4e90-bb96-8fdfde48d53d.mp4' },
  { url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260629_032424_3c9c2a9d-807b-4482-80e6-dd6d9dfd4545.mp4' },
  { url: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260627_094019_4214ea73-b963-46a4-8327-61489192de99.mp4' },
]

// Respect data-saver users and very slow connections: no autoplay video
const skipVideo =
  typeof navigator !== 'undefined' &&
  (navigator.connection?.saveData ||
    /(^|\b)2g(\b|$)/i.test(navigator.connection?.effectiveType || ''))

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [mounted, setMounted] = useState(false)
  // Videos are multi-MB: only fetch a slide's video once its dot is used
  const [visited, setVisited] = useState(() => {
    if (skipVideo) return []
    const v = [false, false, false]
    v[0] = true
    return v
  })
  const [ready, setReady] = useState({})
  const videoRefs = useRef([])

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100)
    return () => clearTimeout(t)
  }, [])

  const selectSlide = (i) => {
    setActiveIndex(i)
    setVisited((v) => (v[i] ? v : v.map((x, j) => (j === i ? true : x))))
  }

  // Only the active video decodes/plays — hidden ones stay paused so we
  // never run three concurrent video decoders (big win on mobile)
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === activeIndex && visited[i]) {
        v.preload = 'auto'
        const p = v.play()
        if (p && typeof p.catch === 'function') p.catch(() => {})
      } else {
        v.pause()
      }
    })
  }, [activeIndex, visited])

  // Fully stop video decoding once the hero is scrolled out of view
  useEffect(() => {
    let offscreen = false
    const onScroll = () => {
      const off = window.scrollY > window.innerHeight * 1.2
      if (off === offscreen) return
      offscreen = off
      const v = videoRefs.current[activeIndex]
      if (!v) return
      if (off) {
        v.pause()
      } else {
        const p = v.play()
        if (p && typeof p.catch === 'function') p.catch(() => {})
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [activeIndex])

  const isSlide1 = activeIndex === 0
  const accentColor = isSlide1 ? '#F598F2' : '#ffffff'
  const dotGlow = isSlide1
    ? '0 0 8px 3px rgba(245,152,242,0.7)'
    : '0 0 8px 3px rgba(255,255,255,0.5)'

  return (
    <main className="relative w-full h-screen-svh overflow-hidden" aria-label="Hero section">

      {/* Video Background — dark by default, video fades in once buffered */}
      <div className="absolute inset-0 z-0 bg-black" aria-hidden="true">
        {VIDEOS.map((v, i) => (
          <video
            key={v.url}
            ref={(el) => { videoRefs.current[i] = el }}
            src={visited[i] ? v.url : undefined}
            autoPlay={visited[i]}
            muted
            loop
            playsInline
            preload={i === 0 ? 'auto' : 'none'}
            disablePictureInPicture
            disableRemotePlayback
            onCanPlay={() => setReady((r) => (r[i] ? r : { ...r, [i]: true }))}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: i === activeIndex && ready[i] ? 1 : 0,
              transition: 'opacity 1200ms ease-in-out',
            }}
          />
        ))}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.08) 45%, rgba(0,0,0,0.0) 100%)',
          }}
        />
      </div>

      {/* Hero Content */}
      <div
        className="relative z-[2] h-full max-w-[1340px] mx-auto flex flex-col justify-end items-end gap-[70px] sm:gap-[150px] pt-[120px] sm:pt-[190px] px-5 sm:px-[15px]"
        style={{ paddingBottom: 0 }}
      >
        {/* Dot switcher + availability */}
        <section aria-label="Video switcher" className="w-full flex items-end gap-8">
          <div className="flex-[4] flex items-center gap-[10px]">
            {VIDEOS.map((_, i) => (
              <button
                key={i}
                onClick={() => selectSlide(i)}
                aria-label={`Video ${i + 1}`}
                aria-pressed={i === activeIndex}
                style={{
                  width: i === activeIndex ? '32px' : '8px',
                  height: '2px',
                  borderRadius: '2px',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  backgroundColor: i === activeIndex ? accentColor : 'rgba(255,255,255,0.30)',
                  transition: 'width 0.45s cubic-bezier(0.16,1,0.3,1), background-color 0.4s ease',
                }}
              />
            ))}
          </div>

          {/* Hide availability on slide 3 */}
          {activeIndex !== 2 ? (
            <div className="flex-1 flex items-center gap-2" role="status">
              <span
                className="w-[7px] h-[7px] rounded-full flex-shrink-0"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: dotGlow,
                  animation: 'dotPulse 1.6s ease-in-out infinite',
                  transition: 'background-color 0.6s ease, box-shadow 0.6s ease',
                }}
              />
              <span className="text-xs font-medium tracking-[-0.01em]">Available</span>
            </div>
          ) : (
            <div className="flex-1" />
          )}
        </section>

        {/* Name + CTA — stacked full-width on mobile, side-by-side on desktop */}
        <section aria-label="Introduction" className="w-full flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:gap-8 pb-[60px]">
          <div className="w-full sm:flex-[2]">
            <h1
              className="font-medium uppercase"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(40px, 8.5vw, 130px)',
                lineHeight: '88%',
                letterSpacing: '-0.04em',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0)' : 'translateY(80px)',
                transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              Om Bhirud
              <span style={{ color: accentColor, transition: 'color 0.6s ease' }}>.</span>
            </h1>
          </div>

          <div className="w-full sm:flex-1 sm:pl-[50px] flex flex-col gap-6">
            <p
              className="text-base leading-6 tracking-[-0.01em] font-medium"
              style={{
                color: 'rgba(255,255,255,0.80)',
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(60px)',
                transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s',
              }}
            >
              B.Tech 3rd year building things that actually work. Into AI, systems and whatever problem catches my attention next.
            </p>

            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="cta-btn inline-flex items-center border border-white px-6 py-3 text-sm font-medium tracking-[-0.02em] w-fit"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateX(0)' : 'translateX(60px)',
                transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s',
              }}
            >
              <span>get in touch</span>
            </a>
          </div>
        </section>
      </div>

      {/* Scroll indicator — desktop only (collides with the name on phones) */}
      <div
        className="absolute bottom-8 left-1/2 z-[3] hidden sm:flex flex-col items-center gap-2 scroll-indicator"
        style={{ transform: 'translateX(-50%)' }}
        aria-hidden="true"
      >
        <span
          className="text-[9px] uppercase tracking-[0.15em] font-medium"
          style={{ color: 'rgba(255,255,255,0.4)' }}
        >
          scroll
        </span>
        <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
          <rect x="0.5" y="0.5" width="15" height="23" rx="7.5" stroke="white" strokeOpacity="0.3" />
          <rect x="7" y="4" width="2" height="5" rx="1" fill="white" fillOpacity="0.5" />
        </svg>
      </div>
    </main>
  )
}
