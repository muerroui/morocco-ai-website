'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { extractYouTubeId } from '@/lib/image'
import type { Webinar } from '@/lib/types'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const TOPIC_COLORS: string[] = [
  '#C8202F', '#1F2A5C', '#C8202F', '#1F2A5C',
  '#C8202F', '#1F2A5C', '#C8202F', '#1F2A5C',
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

function getYear(dateStr: string) {
  return new Date(dateStr).getUTCFullYear().toString()
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
  })
}

export default function WebinarsContent({ webinars }: { webinars: Webinar[] }) {
  // Derive filter options from real data
  const allYears  = ['All', ...Array.from(new Set(webinars.map(w => getYear(w.date)))).sort((a, b) => b.localeCompare(a))]
  const allTopics = ['All', ...Array.from(new Set(webinars.flatMap(w => w.tags ?? [])))]

  const [year,  setYear]  = useState('All')
  const [topic, setTopic] = useState('All')

  const filtered = webinars.filter(w => {
    const matchYear  = year  === 'All' || getYear(w.date) === year
    const matchTopic = topic === 'All' || (w.tags ?? []).includes(topic)
    return matchYear && matchTopic
  })

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
                style={{ fontSize: '4.5rem', letterSpacing: '-0.04em' }}>{webinars.length}+</span>
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
              {allYears.map((y) => (
                <button key={y} onClick={() => setYear(y)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                    year === y ? 'bg-navy text-bone/90' : 'text-bone/30 hover:text-bone/60 hover:bg-bone/[0.04]'
                  }`}>{y}</button>
              ))}
            </div>
            <div className="w-px h-5 bg-bone/[0.08] hidden sm:block" />
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-label text-bone/28 text-[0.62rem] me-1">Topic</span>
              {allTopics.map((t) => (
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
                {filtered.map((w, i) => {
                  const ytId       = w.youtubeUrl ? extractYouTubeId(w.youtubeUrl) : null
                  const thumbUrl   = ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : null
                  const primaryTag = w.tags?.[0]
                  const tagColor   = TOPIC_COLORS[i % TOPIC_COLORS.length]

                  return (
                    <motion.article key={w._id} layout
                      initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.4, delay: i * 0.04, ease: EXPO }}
                      className="group relative bg-[#111114] border border-bone/[0.06] rounded-2xl overflow-hidden transition-all duration-500 hover:border-bone/14 flex flex-col"
                    >
                      {/* YouTube thumbnail */}
                      {thumbUrl && (
                        <div className="relative w-full aspect-video overflow-hidden">
                          <Image
                            src={thumbUrl}
                            alt={w.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#111114] via-transparent to-transparent opacity-60" />
                          {w.youtubeUrl && (
                            <a href={w.youtubeUrl} target="_blank" rel="noopener noreferrer"
                              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              aria-label="Watch on YouTube">
                              <div className="w-12 h-12 rounded-full bg-red/90 flex items-center justify-center shadow-lg">
                                <svg className="w-5 h-5 text-bone ms-0.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                              </div>
                            </a>
                          )}
                        </div>
                      )}

                      <div className="p-7 flex flex-col flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          {primaryTag && (
                            <span className="text-label text-[0.58rem] px-2.5 py-1 rounded-full border"
                              style={{ color: tagColor, borderColor: `${tagColor}30` }}>
                              {primaryTag}
                            </span>
                          )}
                          <span className="text-bone/22 text-xs">{formatDate(w.date)}</span>
                        </div>
                        <h2 className="font-semibold text-bone text-base leading-snug mb-4 group-hover:text-bone/90 transition-colors">
                          {w.title}
                        </h2>
                        <div className="mt-auto pt-5 border-t border-bone/[0.06]">
                          <p className="text-bone/72 text-sm font-medium">{w.speakerName}</p>
                          {w.speakerBio && (
                            <p className="text-bone/32 text-xs mt-0.5 line-clamp-1">{w.speakerBio}</p>
                          )}
                          {w.youtubeUrl && !thumbUrl && (
                            <div className="mt-4 flex justify-end">
                              <a href={w.youtubeUrl} target="_blank" rel="noopener noreferrer"
                                className="w-8 h-8 rounded-full border border-bone/10 flex items-center justify-center text-bone/25 hover:border-red/40 hover:text-red/70 transition-all duration-300"
                                aria-label="Watch recording">
                                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                </svg>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.article>
                  )
                })}
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
