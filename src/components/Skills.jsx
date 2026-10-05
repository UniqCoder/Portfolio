import { useEffect, useRef, useState } from 'react'

const skills = [
  { name: 'React / Next.js',   level: 88 },
  { name: 'Node.js / Express', level: 82 },
  { name: 'Python',            level: 85 },
  { name: 'TypeScript',        level: 78 },
  { name: 'DSA & Algorithms',  level: 80 },
  { name: 'UI / Tailwind CSS', level: 90 },
]

const tools = [
  'VS Code', 'Git', 'Claude', 'Supabase', 'Vercel', 'Redis',
]

function SkillBar({ name, level, index }) {
  const wrapRef = useRef(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={wrapRef} className="reveal-up" style={{ transitionDelay: `${index * 60}ms` }}>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-sm font-medium tracking-[-0.02em]">{name}</span>
        <span className="text-[11px] text-white/40 font-medium tabular-nums">{level}%</span>
      </div>
      <div className="h-px bg-white/10 relative overflow-hidden">
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundColor: '#fff',
            transformOrigin: 'left',
            transform: active ? `scaleX(${level / 100})` : 'scaleX(0)',
            transition: active
              ? `transform ${0.9 + index * 0.04}s cubic-bezier(0.16,1,0.3,1) ${index * 80}ms`
              : 'none',
          }}
        />
      </div>
    </div>
  )
}

export default function Skills() {
  useEffect(() => {
    const els = document.querySelectorAll('#skills .reveal-up, #skills .reveal-right')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target) }
        })
      },
      { threshold: 0.1 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="skills" className="bg-transparent py-28 px-4 sm:px-[15px]" aria-label="Skills">
      <div className="max-w-[1340px] mx-auto">
        <div className="flex items-start gap-16 flex-col sm:flex-row">

          {/* Left */}
          <div className="flex-1 w-full">
            <div className="reveal-up mb-10">
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-white/40 block mb-4">
                Skills
              </span>
              <h2 className="text-[36px] sm:text-[48px] leading-[1.05] tracking-[-0.05em] font-medium">
                Tools I build<br />
                <span style={{ color: '#F598F2' }}>with.</span>
              </h2>
            </div>
            <div className="flex flex-col gap-5">
              {skills.map((s, i) => <SkillBar key={s.name} {...s} index={i} />)}
            </div>
          </div>

          {/* Right */}
          <div className="flex-1 w-full">
            <div className="reveal-right mb-10">
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-white/40 block mb-4">
                Currently studying
              </span>
              <p className="text-base leading-7 text-white/60 font-medium max-w-[420px]">
                3rd year B.Tech. Building real-world projects while going deep on
                AI, systems design and whatever's worth understanding.
              </p>
            </div>
            <div className="reveal-right" style={{ transitionDelay: '120ms' }}>
              <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-white/40 block mb-4">
                Tools &amp; environment
              </span>
              <div className="flex flex-wrap gap-2">
                {tools.map((t) => (
                  <span
                    key={t}
                    className="text-[11px] uppercase tracking-[0.08em] font-medium border border-white/15 px-3 py-1 text-white/60 hover:border-white/40 hover:text-white transition-colors duration-200"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
