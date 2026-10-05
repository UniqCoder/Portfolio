import { useEffect } from 'react'

const stats = [
  { value: '2028', label: 'Graduating' },
  { value: 'AI',   label: 'Current obsession' },
]

export default function About() {
  useEffect(() => {
    const els = document.querySelectorAll(
      '#about .reveal-up, #about .reveal-left, #about .reveal-right'
    )
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

  return (
    <section id="about" className="bg-transparent py-28 px-4 sm:px-[15px]" aria-label="About">
      <div className="max-w-[1340px] mx-auto">

        <div className="reveal-up mb-16">
          <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-white/40">
            About
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 sm:gap-20">

          {/* Statement */}
          <div className="reveal-left">
            <h2
              className="font-medium leading-[1.08] tracking-[-0.04em]"
              style={{ fontSize: 'clamp(28px, 4vw, 54px)' }}
            >
              CS student who actually{' '}
              <span style={{ color: '#F598F2' }}>gives a damn</span>{' '}
              about what he builds.
            </h2>
          </div>

          {/* Bio */}
          <div className="reveal-right flex flex-col gap-5">
            <p className="text-base leading-7 text-white/60 font-medium">
              Third year B.Tech student from Nashik. Got into coding because I genuinely enjoy
              figuring things out and building stuff that works. Started with the basics,
              now I'm deep into AI, full-stack development and anything that looks interesting
              enough to keep me up at night.
            </p>
            <p className="text-base leading-7 text-white/60 font-medium">
              I use AI as a tool, not a crutch. I'll use it to move faster on something I
              already understand or to explore a concept I'm learning. I care about knowing
              why things work, not just that they do.
            </p>
            <p className="text-base leading-7 text-white/60 font-medium">
              My interests go wider than code. I'm into AI research, logical problems,
              systems thinking, and random topics that just seem worth going deep on.
              Physics, how things are designed, why systems work the way they do. I'll read about
              pretty much anything if it's interesting enough.
            </p>
            <p className="text-base leading-7 text-white/60 font-medium">
              Looking for internships and projects where I can actually contribute something
              real. If you have something interesting going on, reach out.
            </p>
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="reveal-up mt-20 grid grid-cols-2 border border-white/10"
          style={{ transitionDelay: '150ms' }}
        >
          {stats.map((s, i) => (
            <div
              key={s.label}
              className="px-5 sm:px-8 py-6 sm:py-8"
              style={{
                borderRight: i < stats.length - 1 ? '1px solid rgba(255,255,255,0.10)' : 'none',
              }}
            >
              <div
                className="text-[38px] sm:text-[52px] leading-none font-medium tracking-[-0.05em] mb-2"
                style={{ color: i === 0 ? '#F598F2' : '#fff' }}
              >
                {s.value}
              </div>
              <div className="text-[11px] uppercase tracking-[0.12em] text-white/40 font-medium">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
