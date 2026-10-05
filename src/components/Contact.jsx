import { useEffect, useState } from 'react'

const EMAIL = 'zenonx128@gmail.com'

const socials = [
  { label: 'GitHub',   href: 'https://github.com/UniqCoder' },
  { label: 'LinkedIn', href: 'https://linkedin.com/' },
]

export default function Contact() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const els = document.querySelectorAll('#contact .reveal-up, #contact .reveal-left')
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        }),
      { threshold: 0.1 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <section
      id="contact"
      className="bg-transparent py-28 px-4 sm:px-[15px] border-t border-white/10"
      aria-label="Contact"
    >
      <div className="max-w-[1340px] mx-auto">

        <div className="reveal-up mb-16">
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-white/40 block mb-8">
            Let's connect
          </span>
          <h2
            className="font-medium leading-[1.0] tracking-[-0.05em] mb-8"
            style={{ fontSize: 'clamp(36px, 7vw, 96px)' }}
          >
            Got a project{' '}
            <span style={{ color: '#F598F2' }}>in mind?</span>
          </h2>
          <p className="text-base leading-7 text-white/50 font-medium max-w-[480px]">
            Send me a message. I'll get back to you.
          </p>
        </div>

        <div
          className="reveal-left flex items-end justify-between flex-col sm:flex-row gap-8 sm:gap-0"
          style={{ transitionDelay: '100ms' }}
        >
          {/* Email copy */}
          <button
            onClick={copyEmail}
            aria-label="Copy email address"
            className="group flex items-baseline gap-3"
          >
            <span
              className="font-medium tracking-[-0.04em] underline underline-offset-4 decoration-white/20 group-hover:decoration-white/60 transition-all"
              style={{ fontSize: 'clamp(20px, 3.5vw, 40px)' }}
            >
              {EMAIL}
            </span>
            <span
              className="text-[11px] uppercase tracking-[0.1em] text-white/40 font-medium"
              aria-live="polite"
            >
              {copied ? '✓ copied' : 'copy'}
            </span>
          </button>

          {/* Socials */}
          <div className="flex items-center gap-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link-underline text-[11px] uppercase tracking-[0.1em] font-medium text-white/50 hover:text-white transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className="reveal-up mt-20 pt-8 border-t border-white/10 flex items-center justify-between flex-col sm:flex-row gap-3 sm:gap-0"
          style={{ transitionDelay: '200ms' }}
        >
          <span className="text-[11px] text-white/25 font-medium tracking-[0.04em]">
            © 2026 Om Bhirud
          </span>
          <span className="text-[11px] text-white/25 font-medium tracking-[0.04em]">
            Nashik, India · B.Tech 3rd Year
          </span>
        </div>
      </div>
    </section>
  )
}
