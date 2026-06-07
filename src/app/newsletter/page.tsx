'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const ARCHIVES = [
  { issue: 18, title: 'Generative AI Adoption in Moroccan Enterprises', date: 'May 2025',      preview: 'How Moroccan enterprises are integrating LLMs into their workflows — real cases, real challenges.' },
  { issue: 17, title: 'Highlights from MoroccoAI Conference 2024',      date: 'December 2024', preview: 'Keynote recaps, talk highlights, and key takeaways from our largest conference to date.' },
  { issue: 16, title: 'NLP for Arabic: State of the Art in 2024',        date: 'November 2024', preview: 'A deep dive into the latest models, datasets, and benchmarks for Arabic NLP.' },
  { issue: 15, title: 'AI Startups in Morocco: A Growing Ecosystem',     date: 'October 2024',  preview: 'Profiling the Moroccan AI startup scene — founders, funding, and the road ahead.' },
  { issue: 14, title: 'Understanding Transformer Architectures',         date: 'September 2024',preview: 'From attention mechanisms to modern LLMs — a practical primer for practitioners.' },
  { issue: 13, title: 'AI for Climate: Applications in Africa',          date: 'August 2024',   preview: 'How AI is being applied to climate resilience, agriculture, and energy across the continent.' },
]

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: EXPO }}
    >{children}</motion.div>
  )
}

export default function NewsletterPage() {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('sent')
  }

  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
        <div className="absolute inset-0 zellige-pattern opacity-[0.016]" />
        <div className="absolute top-0 end-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 100% 0%, rgba(31,42,92,0.12), transparent 65%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1fr_420px] gap-16 lg:gap-20 items-center">
            <div>
              <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="text-label text-bone/40 mb-8 flex items-center gap-3">
                <span className="w-6 h-px bg-red inline-block" />Newsletter
              </motion.p>
              <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.9, ease: EXPO }} className="text-display-xl text-bone mb-8">
                Stay at the<br />
                <em className="not-italic font-light italic" style={{ color: '#C8202F' }}>frontier</em><br />
                of AI in Africa.
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.8 }}
                className="text-bone/42 text-base leading-relaxed max-w-xl">
                Curated AI research, upcoming events, community spotlights, and opportunities —
                delivered bi-monthly. 500+ readers across Africa and the diaspora. Free, no spam.
              </motion.p>
            </div>

            {/* Signup card */}
            <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.9, ease: EXPO }}
              className="relative bg-[#111114] border border-bone/[0.08] rounded-2xl p-8 overflow-hidden">
              <div className="absolute top-0 start-0 end-0 h-px bg-gradient-to-r from-navy/60 via-red/30 to-transparent" />

              {status === 'idle' ? (
                <>
                  <h2 className="font-display font-light text-bone text-2xl mb-2 tracking-tight">Subscribe</h2>
                  <p className="text-bone/35 text-sm mb-7">Bi-monthly. Unsubscribe anytime.</p>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      className="w-full px-4 py-3.5 rounded-xl bg-bone/[0.04] border border-bone/[0.08] text-bone placeholder-bone/25 focus:outline-none focus:border-navy/50 text-sm"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-bone/[0.04] border border-bone/[0.08] text-bone placeholder-bone/25 focus:outline-none focus:border-navy/50 text-sm"
                    />
                    <button type="submit"
                      className="w-full bg-navy text-bone py-4 rounded-xl text-xs font-bold tracking-[0.2em] uppercase hover:bg-navy-900 transition-colors duration-300 mt-2">
                      Subscribe Free
                    </button>
                  </form>

                  <div className="mt-6 pt-5 border-t border-bone/[0.06] grid grid-cols-3 gap-3">
                    {[['500+', 'subscribers'], ['Bi-monthly', 'cadence'], ['0', 'spam']].map(([num, label]) => (
                      <div key={label} className="text-center">
                        <span className="font-display font-light text-bone/55 text-xl block tracking-tight">{num}</span>
                        <span className="text-bone/22 text-[0.62rem] font-medium uppercase tracking-wide">{label}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-navy/20 border border-navy/30 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-5 h-5 text-bone/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-bone/65 font-medium mb-1">You're on the list.</p>
                  <p className="text-bone/30 text-sm">Welcome to MoroccoAI.</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits row */}
      <section className="bg-[#0D0D10] border-y border-bone/[0.05] py-12">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: 'Monthly Deep Dives',   body: 'Curated AI research and news relevant to Morocco and Africa.' },
              { label: 'Webinar Previews',      body: 'Early access to webinar announcements and speaker reveals.' },
              { label: 'Opportunities',         body: 'Jobs, grants, fellowships, and calls for papers in AI.' },
              { label: 'Community Spotlights',  body: 'Stories from MoroccoAI members building the AI ecosystem.' },
            ].map((b, i) => (
              <FadeUp key={b.label} delay={i * 0.06}>
                <div className="flex gap-4">
                  <span className="w-1 h-full bg-red/30 rounded-full shrink-0 mt-1" />
                  <div>
                    <p className="text-bone/72 text-sm font-semibold mb-1">{b.label}</p>
                    <p className="text-bone/32 text-xs leading-relaxed">{b.body}</p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Archives */}
      <section className="bg-ink py-28 lg:py-36">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <p className="text-label text-bone/40 mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-red inline-block" />Archives
            </p>
            <h2 className="text-display-md text-bone mb-16">Past issues.</h2>
          </FadeUp>

          <div className="space-y-3">
            {ARCHIVES.map((iss, i) => (
              <FadeUp key={iss.issue} delay={i * 0.05}>
                <div className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 py-6 border-b border-bone/[0.06] hover:border-bone/12 transition-colors duration-300 cursor-default">
                  <span className="font-display font-light text-red/40 text-[2.5rem] leading-none shrink-0 w-16 tabular-nums"
                    style={{ letterSpacing: '-0.04em' }}>
                    {iss.issue}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-bone/75 text-sm font-semibold mb-1 group-hover:text-bone/90 transition-colors leading-snug">
                      {iss.title}
                    </p>
                    <p className="text-bone/28 text-xs leading-relaxed line-clamp-1">{iss.preview}</p>
                  </div>
                  <span className="text-bone/20 text-xs shrink-0">{iss.date}</span>
                  <span className="text-bone/20 text-xs shrink-0 hidden sm:block">Coming soon</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
