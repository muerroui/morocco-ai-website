'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const TOPICS = ['All', 'LLMs', 'Computer Vision', 'NLP & Arabic', 'AI Safety', 'Healthcare', 'Research']
const YEARS  = ['All', '2025', '2024', '2023', '2022']

const WEBINARS = [
  { id: 'w1', year: '2025', topic: 'LLMs',            title: 'LLMs for Low-Resource Languages: Darija and Amazigh',        speaker: 'Dr. Samia Touileb',          role: 'Research Scientist, University of Oslo', date: 'Jul 12, 2025', duration: '55 min', attendees: 320,  featured: true  },
  { id: 'w2', year: '2025', topic: 'AI Safety',        title: 'Alignment Techniques for African-Context AI Systems',         speaker: 'Dr. Meredith Ringel Morris',  role: 'Principal Researcher, Google DeepMind',  date: 'May 28, 2025', duration: '48 min', attendees: 410,  featured: false },
  { id: 'w3', year: '2024', topic: 'LLMs',            title: 'Scaling Laws and Emergent Abilities in Large Language Models', speaker: 'Samy Bengio',                role: 'Distinguished Researcher, Apple',        date: 'Oct 14, 2024', duration: '62 min', attendees: 890,  featured: true  },
  { id: 'w4', year: '2024', topic: 'NLP & Arabic',    title: 'Arabic NLP: From Classical Models to GPT-Era',                speaker: 'Prof. Kareem Darwish',        role: 'AI Research Lead, HBKU',                 date: 'Sep 10, 2024', duration: '50 min', attendees: 640,  featured: false },
  { id: 'w5', year: '2024', topic: 'Computer Vision', title: 'Vision Transformers and the Future of Perception',            speaker: 'Dr. Moustapha Cisse',         role: 'Head of Google AI Africa',               date: 'Jun 22, 2024', duration: '58 min', attendees: 520,  featured: false },
  { id: 'w6', year: '2024', topic: 'Healthcare',      title: 'AI Diagnostics in Resource-Constrained Settings',             speaker: 'Dr. Alaa Abd-Almageed',       role: 'Director, IVCIS USC',                    date: 'Mar  5, 2024', duration: '52 min', attendees: 380,  featured: false },
  { id: 'w7', year: '2023', topic: 'LLMs',            title: 'Generative AI: Opportunities for the African Continent',       speaker: 'Dr. Abeba Birhane',           role: 'Faculty Fellow, Mozilla Foundation',      date: 'Nov 18, 2023', duration: '60 min', attendees: 730,  featured: false },
  { id: 'w8', year: '2023', topic: 'Research',        title: 'Publishing AI Research from the Global South',                 speaker: 'Prof. Yoshua Bengio',         role: 'Turing Award Laureate, Mila',            date: 'Apr  8, 2023', duration: '75 min', attendees: 1200, featured: true  },
  { id: 'w9', year: '2022', topic: 'NLP & Arabic',    title: 'CAMeL: Arabic NLP Toolkit at Scale',                          speaker: 'Prof. Nizar Habash',          role: 'NYU Abu Dhabi',                          date: 'Oct  3, 2022', duration: '55 min', attendees: 490,  featured: false },
]

const TOPIC_ACCENT: Record<string, string> = {
  'LLMs': '#C8202F', 'Computer Vision': '#1F2A5C', 'NLP & Arabic': '#C8202F',
  'AI Safety': '#1F2A5C', 'Healthcare': '#1F2A5C', 'Research': '#C8202F',
}

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

export default function WebinarsPage() {
  const [year,  setYear]  = useState('All')
  const [topic, setTopic] = useState('All')
  const filtered = WEBINARS.filter(
    (w) => (year === 'All' || w.year === year) && (topic === 'All' || w.topic === topic)
  )

  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
        <div className="absolute inset-0 zellige-pattern opacity-[0.016]" />
        <div className="absolute bottom-0 end-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 100% 100%, rgba(200,32,47,0.06), transparent 65%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-label text-bone/40 mb-8 flex items-center gap-3">
            <span className="w-6 h-px bg-red inline-block" />Webinars
          </motion.p>
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-end">
            <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.9, ease: EXPO }} className="text-display-xl text-bone">
              World-class AI<br />
              <em className="not-italic font-light italic" style={{ color: '#C8202F' }}>talks</em>, free.
            </motion.h1>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.7 }}
              className="hidden lg:flex flex-col items-end gap-2">
              <span className="font-display font-light text-bone/12 leading-none"
                style={{ fontSize: '4.5rem', letterSpacing: '-0.04em' }}>{WEBINARS.length}+</span>
              <span className="text-label text-bone/28 text-[0.62rem]">sessions recorded</span>
            </motion.div>
          </div>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="text-bone/42 text-base leading-relaxed mt-8 max-w-2xl">
            Monthly deep-dives on AI research and practice — delivered by the world's top researchers
            directly to the Moroccan and African AI community. Free, bilingual, online.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-[#0D0D10] border-y border-bone/[0.06] sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4">
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-label text-bone/28 text-[0.62rem] me-1">Year</span>
              {YEARS.map((y) => (
                <button key={y} onClick={() => setYear(y)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    year === y ? 'bg-navy text-bone/90' : 'text-bone/30 hover:text-bone/60 hover:bg-bone/[0.04]'
                  }`}>{y}</button>
              ))}
            </div>
            <div className="w-px h-5 bg-bone/[0.08] hidden sm:block" />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-label text-bone/28 text-[0.62rem] me-1">Topic</span>
              {TOPICS.map((t) => (
                <button key={t} onClick={() => setTopic(t)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    topic === t ? 'bg-red/90 text-bone' : 'text-bone/30 hover:text-bone/60 hover:bg-bone/[0.04]'
                  }`}>{t}</button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-ink py-20 min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {filtered.length === 0 ? (
            <p className="text-bone/30 text-sm py-20 text-center">No webinars match these filters.</p>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((w, i) => (
                  <motion.article key={w.id} layout
                    initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4, delay: i * 0.04, ease: EXPO }}
                    className={`group relative bg-[#111114] border rounded-2xl overflow-hidden transition-all duration-500 hover:border-bone/14 flex flex-col ${
                      w.featured ? 'border-red/20' : 'border-bone/[0.06]'
                    }`}
                  >
                    <div className="h-0.5" style={{ background: w.featured ? '#C8202F' : 'transparent', opacity: w.featured ? 0.6 : 1 }} />
                    <div className="p-7 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-5">
                        <span className="text-label text-[0.58rem] px-2.5 py-1 rounded-full border"
                          style={{ color: TOPIC_ACCENT[w.topic] ?? '#F5F1EA', borderColor: `${TOPIC_ACCENT[w.topic] ?? '#F5F1EA'}30` }}>
                          {w.topic}
                        </span>
                        <span className="text-bone/22 text-xs">{w.date}</span>
                        {w.featured && <span className="ms-auto text-label text-[0.58rem] text-red/70">Featured</span>}
                      </div>
                      <h2 className="font-semibold text-bone text-base leading-snug mb-4 group-hover:text-bone/90 transition-colors">
                        {w.title}
                      </h2>
                      <div className="mt-auto pt-5 border-t border-bone/[0.06]">
                        <p className="text-bone/72 text-sm font-medium">{w.speaker}</p>
                        <p className="text-bone/32 text-xs mt-0.5 mb-4">{w.role}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-bone/25 text-xs">
                            <span>{w.duration}</span>
                            <span>{w.attendees.toLocaleString()} attended</span>
                          </div>
                          <button className="w-8 h-8 rounded-full border border-bone/10 flex items-center justify-center text-bone/25 hover:border-bone/30 hover:text-bone/55 transition-all duration-300 group-hover:border-red/40 group-hover:text-red/70"
                            aria-label="Watch recording">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.84z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="bg-[#0D0D10] border-t border-bone/[0.05] py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div>
                <p className="text-label text-bone/35 mb-3 flex items-center gap-3">
                  <span className="w-6 h-px bg-red inline-block" />Never miss a session
                </p>
                <p className="text-bone/45 max-w-sm leading-relaxed">
                  New webinar announcements go out in the MoroccoAI newsletter. Subscribe to get notified first.
                </p>
              </div>
              <Link href="/newsletter"
                className="shrink-0 inline-flex items-center gap-2 bg-navy text-bone px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-navy-900 transition-colors duration-300">
                Subscribe Free
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
