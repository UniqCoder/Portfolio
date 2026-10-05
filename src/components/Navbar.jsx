import { useState, useEffect, useRef } from 'react'

const navItems = [
  { index: '01', label: 'Works',   href: '#works' },
  { index: '02', label: 'Skills',  href: '#skills' },
  { index: '03', label: 'About',   href: '#about' },
  { index: '04', label: 'Contact', href: '#contact' },
]

function LiveClock() {
  const [time, setTime] = useState('')
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <span
      role="status"
      aria-live="off"
      className="text-[10px] leading-4 tracking-[0.04em] font-medium uppercase tabular-nums text-white/50"
    >
      IST {time}
    </span>
  )
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setMobileOpen(false)
      }
    }
    if (mobileOpen) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [mobileOpen])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-10" role="banner">
      <div className="max-w-[1340px] mx-auto py-9 px-[15px] sm:py-9 flex items-center justify-between">

        {/* ── Desktop Nav (≥ 810px) ── */}
        <nav
          aria-label="Primary navigation"
          className="hidden sm:flex items-center gap-8"
        >
          {navItems.map(({ index, label, href }) => (
            <a
              key={label}
              href={href}
              onClick={(e) => { e.preventDefault(); scrollTo(href) }}
              className="nav-link-underline flex items-center gap-[5px] group"
            >
              <span className="text-[8px] leading-3 tracking-[-0.08px] font-medium uppercase text-white/40 group-hover:text-white/60 transition-colors">
                {index} /
              </span>
              <span className="text-xs leading-4 tracking-[-0.12px] font-medium uppercase">
                {label}
              </span>
            </a>
          ))}
        </nav>

        {/* ── Desktop Right: Email + Clock ── */}
        <div className="hidden sm:flex items-center gap-6 ml-auto">
          <a
            href="mailto:zenonx128@gmail.com"
            className="nav-link-underline text-[11px] leading-4 tracking-[0.02em] font-medium"
          >
            zenonx128@gmail.com
          </a>
          <LiveClock />
        </div>

        {/* ── Mobile header ── */}
        <div className="flex sm:hidden items-center justify-between w-full">
          <span className="text-sm font-semibold tracking-[-0.04em] uppercase">Om Bhirud</span>
          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="flex flex-col gap-[5px] p-1"
          >
            <span className={`block h-px w-6 bg-white transition-all duration-300 origin-center ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-px w-6 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-px w-6 bg-white transition-all duration-300 origin-center ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Panel ── */}
      <div
        ref={panelRef}
        className="sm:hidden overflow-hidden"
        style={{
          maxHeight: mobileOpen ? '480px' : '0px',
          transition: 'max-height 420ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <nav
          aria-label="Mobile navigation"
          className="px-[18px] pb-8 pt-2 flex flex-col gap-5 bg-black/95 backdrop-blur-sm"
        >
          {navItems.map(({ index, label, href }) => (
            <button
              key={label}
              onClick={() => { setMobileOpen(false); setTimeout(() => scrollTo(href), 420) }}
              className="flex items-baseline gap-3 text-left"
            >
              <span className="text-[10px] font-medium uppercase text-white/40">{index}</span>
              <span className="text-[28px] leading-8 tracking-[-0.84px] font-medium uppercase nav-link-underline">
                {label}
              </span>
            </button>
          ))}
          <div className="mt-3 pt-4 border-t border-white/10 flex flex-col gap-2">
            <a href="mailto:zenonx128@gmail.com" className="text-xs text-white/50">
              zenonx128@gmail.com
            </a>
            <LiveClock />
          </div>
        </nav>
      </div>
    </header>
  )
}
