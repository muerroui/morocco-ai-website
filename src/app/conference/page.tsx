'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const CONFERENCES = [
  {
    year: '2024',
    edition: '4th',
    date: 'November 2024',
    location: 'Casablanca, Morocco',
    theme: 'Generative AI & The African Opportunity',
    description: 'The fourth edition brought together leading AI researchers, practitioners, and industry leaders. Topics spanned Generative AI, LLMs, AI for healthcare, and the role of AI in African development.',
    stats: [{ label: 'Attendees', value: '900+' }, { label: 'Speakers', value: '30+' }, { label: 'Workshops', value: '3' }, { label: 'Countries', value: '12+' }],
    featured: true,
  },
  {
    year: '2023',
    edition: '3rd',
    date: 'November 2023',
    location: 'Casablanca, Morocco',
    theme: 'AI in Industry & Society',
    description: 'NLP, computer vision, AI ethics, and applications in healthcare, agriculture, and fintech across Africa. Panel discussions on AI policy in Morocco and the MENA region.',
    stats: [{ label: 'Attendees', value: '700+' }, { label: 'Speakers', value: '25+' }, { label: 'Panels', value: '4' }, { label: 'Countries', value: '10' }],
    featured: false,
  },
  {
    year: '2022',
    edition: '2nd',
    date: 'October 2022',
    location: 'Casablanca, Morocco',
    theme: 'NLP, Computer Vision & AI for Africa',
    description: 'NLP in Arabic and Darija, computer vision, reinforcement learning, and AI talent development. A career fair connected attendees with AI-focused companies hiring in Morocco.',
    stats: [{ label: 'Attendees', value: '500+' }, { label: 'Speakers', value: '20+' }, { label: 'Workshops', value: '2' }, { label: 'Countries', value: '8' }],
    featured: false,
  },
  {
    year: '2021',
    edition: '1st',
    date: 'November 2021',
    location: 'Casablanca (Hybrid)',
    theme: 'Launching the Moroccan AI Community',
    description: 'The inaugural edition launched a new tradition of bringing the Moroccan and African AI community together. The hybrid format allowed both in-person and remote participation.',
    stats: [{ label: 'Viewers', value: '1,200+' }, { label: 'Speakers', value: '20+' }, { label: 'Countries', value: '15+' }, { label: 'Format', value: 'Hybrid' }],
    featured: false,
  },
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

export default function ConferencePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
        <div className="absolute inset-0 zellige-pattern opacity-[0.016]" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(31,42,92,0.15), transparent 70%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-label text-bone/40 mb-8 flex items-center justify-center gap-3">
            <span className="w-6 h-px bg-red inline-block" />Annual Conference
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: EXPO }}
            className="text-display-xl text-bone max-w-4xl mx-auto">
            MoroccoAI<br />
            Annual<br />
            <em className="not-italic font-light italic" style={{ color: '#C8202F' }}>Conference</em>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="text-bone/42 text-base leading-relaxed mt-8 max-w-2xl mx-auto">
            The premier AI conference in North Africa — connecting researchers, practitioners,
            entrepreneurs, and policymakers to advance AI in Morocco and beyond.
          </motion.p>
        </div>
      </section>

      {/* 2025 teaser */}
      <section className="bg-red/[0.08] border-y border-navy/20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-7">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <p className="text-label text-red/80 text-[0.62rem] mb-1">Save the date</p>
              <p className="text-bone/80 font-semibold">MoroccoAI Annual Conference 2025 — October 2025, Rabat</p>
              <p className="text-bone/35 text-sm mt-0.5">Speaker announcements and registration opening soon.</p>
            </div>
            <Link href="/newsletter"
              className="shrink-0 inline-flex items-center gap-2 border border-bone/20 text-bone/55 px-6 py-3 rounded-full text-xs font-bold tracking-[0.18em] uppercase hover:border-bone/45 hover:text-bone transition-all duration-300">
              Get Notified
            </Link>
          </div>
        </div>
      </section>

      {/* Conference history */}
      <section className="bg-[#0D0D10] py-28 lg:py-36">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <p className="text-label text-bone/40 mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-red inline-block" />History
            </p>
            <h2 className="text-display-md text-bone mb-20">Four editions.<br />One community.</h2>
          </FadeUp>

          <div className="space-y-8">
            {CONFERENCES.map((conf, i) => (
              <FadeUp key={conf.year} delay={i * 0.07}>
                <div className={`relative bg-[#111114] border rounded-2xl overflow-hidden transition-all duration-300 hover:border-bone/14 ${
                  conf.featured ? 'border-red/20' : 'border-bone/[0.06]'
                }`}>
                  {conf.featured && <div className="h-0.5 bg-gradient-to-r from-red/60 via-red/20 to-transparent" />}

                  <div className="grid lg:grid-cols-[auto_1fr] gap-0">
                    {/* Year column */}
                    <div className="lg:border-e border-bone/[0.06] px-8 py-8 lg:py-10 flex items-start">
                      <div>
                        <span className="font-display font-light text-bone/10 leading-none block"
                          style={{ fontSize: 'clamp(3rem, 5vw, 6rem)', letterSpacing: '-0.04em' }}>
                          {conf.year}
                        </span>
                        <span className="text-label text-bone/28 text-[0.62rem] mt-1 block">{conf.edition} edition</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-8 py-8 lg:py-10">
                      <div className="flex flex-wrap gap-3 items-center mb-4">
                        <span className="text-label text-[0.58rem] text-red/70">{conf.date}</span>
                        <span className="w-1 h-1 rounded-full bg-bone/20" />
                        <span className="text-label text-[0.58rem] text-bone/28">{conf.location}</span>
                      </div>

                      <h3 className="text-bone font-semibold text-lg leading-snug mb-3">{conf.theme}</h3>
                      <p className="text-bone/42 text-sm leading-relaxed mb-7 max-w-2xl">{conf.description}</p>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-6">
                        {conf.stats.map((s) => (
                          <div key={s.label}>
                            <span className="font-display font-light text-bone/65 text-2xl block tracking-tight"
                              style={{ letterSpacing: '-0.02em' }}>{s.value}</span>
                            <span className="text-bone/25 text-[0.62rem] font-semibold uppercase tracking-wide">{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink border-t border-bone/[0.05] py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div>
                <p className="text-label text-bone/35 mb-3 flex items-center gap-3">
                  <span className="w-6 h-px bg-red inline-block" />Be part of it
                </p>
                <p className="text-bone/45 max-w-sm leading-relaxed">
                  Want to attend, speak, or partner for the 2025 conference? Subscribe to be the first to know.
                </p>
              </div>
              <div className="flex gap-4 shrink-0">
                <Link href="/newsletter"
                  className="inline-flex items-center gap-2 bg-red text-bone px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-red-900 transition-colors duration-300">
                  Get Notified
                </Link>
                <Link href="/about"
                  className="inline-flex items-center gap-2 border border-bone/20 text-bone/55 px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:border-bone/45 hover:text-bone transition-all duration-300">
                  About Us
                </Link>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>
    </>
  )
}
