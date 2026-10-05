import { useEffect, useState } from 'react'

const GITHUB_USERNAME = 'UniqCoder'

// Repos to hide
const HIDDEN = ['sih-frontend', 'PathPilot', 'argus', 'UniqCoder.github.io', 'NEXTGEN', 'DEMO']

// Override or fill in descriptions
const DESCRIPTIONS = {
  'argus': 'Real-time blockchain intelligence system built for SIH2026. Traces on-chain money movement, identifies exchanges involved in crypto fraud and builds attribution cases for law enforcement.',
  'AWAZ-voice-enabled-rag-model': 'A voice-activated RAG (Retrieval-Augmented Generation) model that lets you query documents and knowledge bases using natural speech. Built with Python.',
  'ruomai': 'A TypeScript project exploring AI-driven interactions and intelligent response generation.',
}

export default function Works() {
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`)
      .then((r) => {
        if (!r.ok) throw new Error('fetch failed')
        return r.json()
      })
      .then((data) => {
        const filtered = Array.isArray(data)
          ? data.filter(
              (r) =>
                !r.fork &&
                r.name.toLowerCase() !== GITHUB_USERNAME.toLowerCase() &&
                !HIDDEN.includes(r.name)
            )
          : []
        setRepos(filtered)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (loading) return
    const els = document.querySelectorAll('#works .reveal-up')
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        }),
      { threshold: 0.08 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [loading])

  return (
    <section id="works" className="bg-transparent py-28 px-4 sm:px-[15px]" aria-label="Projects">
      <div className="max-w-[1340px] mx-auto">

        {/* Header */}
        <div className="reveal-up flex items-baseline justify-between border-b border-white/10 pb-8">
          <h2 className="text-[11px] uppercase tracking-[0.18em] font-medium text-white/40">
            Projects
          </h2>
          {!loading && !error && (
            <span className="text-[11px] uppercase tracking-[0.18em] font-medium text-white/40">
              {repos.length} repos
            </span>
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-20 flex items-center gap-3">
            <span
              className="w-[5px] h-[5px] rounded-full bg-white/30"
              style={{ animation: 'dotPulse 1s ease-in-out infinite' }}
            />
            <span className="text-xs text-white/30 font-medium uppercase tracking-[0.1em]">
              Loading from GitHub
            </span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="py-20">
            <p className="text-sm text-white/30 font-medium">
              Could not load repos. Check your connection or{' '}
              <a
                href={`https://github.com/${GITHUB_USERNAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 underline underline-offset-4"
              >
                visit GitHub directly
              </a>
              .
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && repos.length === 0 && (
          <div className="py-20">
            <p className="text-sm text-white/30 font-medium">No public repos found.</p>
          </div>
        )}

        {/* Repo rows */}
        {repos.map((repo, i) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card block py-7 group"
            aria-label={`${String(i + 1).padStart(2, '0')} ${repo.name}`}
          >
            <div
              className="reveal-up flex items-start justify-between gap-8 flex-col sm:flex-row"
              style={{ transitionDelay: `${i * 55}ms` }}
            >
              {/* Left */}
              <div className="flex items-start gap-6 flex-1">
                <span className="project-number text-[11px] font-medium text-white/25 mt-[6px] tabular-nums shrink-0 w-5">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h3 className="text-2xl sm:text-[28px] leading-none tracking-[-0.05em] font-medium mb-2 capitalize">
                    {repo.name.replace(/-/g, ' ').replace(/_/g, ' ')}
                    <span className="project-arrow inline-block ml-3 text-lg" aria-hidden="true">↗</span>
                  </h3>
                  <p className="text-sm leading-6 text-white/45 font-medium max-w-[520px]">
                    {DESCRIPTIONS[repo.name] || repo.description || 'No description.'}
                  </p>
                </div>
              </div>

              {/* Right: lang + stars */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-2 shrink-0 pl-9 sm:pl-0">
                {repo.stargazers_count > 0 && (
                  <span className="text-[11px] text-white/30 font-medium">
                    ★ {repo.stargazers_count}
                  </span>
                )}
                {repo.language && (
                  <span className="text-[10px] uppercase tracking-[0.1em] font-medium border border-white/15 px-2 py-[3px] text-white/45">
                    {repo.language}
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
