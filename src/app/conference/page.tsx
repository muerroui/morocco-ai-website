'use client'
import { useRef } from 'react'
import Image from 'next/image'
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
    speakers: ['Geoffrey Hinton', 'Yoshua Bengio', 'Moustapha Cissé', 'Samy Bengio'],
    image: null as string | null,
    accent: '#C8202F',
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
    speakers: ['Michael I. Jordan', 'Stuart Russell', 'Bernhard Schölkopf'],
    image: null as string | null,
    accent: '#1F2A5C',
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
    speakers: ['Yann LeCun', 'Timnit Gebru', 'Nizar Habash'],
    image: null as string | null,
    accent: '#C8202F',
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
    speakers: ['Yoshua Bengio', 'Isabelle Guyon', 'Driss Haddou'],
    image: null as string | null,
    accent: '#1F2A5C',
    featured: false,
  },
]

type Conference = typeof CONFERENCES[0]

/** Stylised abstract "cover" shown when no real photo exists */
function ConferenceCover({ conf }: { conf: Conference }) {
  const isRed = conf.accent === '#C8202F'
  return (
    <div className="relative w-full h-full min-h-[240px] lg:min-h-0 overflow-hidden select-none">
      {/* Base gradient */}
      <div className="absolute inset-0"
        style={{
          background: isRed
            ? `radial-gradient(ellipse 120% 100% at 20% 60%, rgba(200,32,47,0.22) 0%, rgba(10,10,11,0.95) 65%),
               linear-gradient(135deg, #0D0D10 0%, #0A0A0B 100%)`
            : `radial-gradient(ellipse 120% 100% at 20% 60%, rgba(31,42,92,0.45) 0%, rgba(10,10,11,0.95) 65%),
               linear-gradient(135deg, #0D0D10 0%, #0A0A0B 100%)`,
        }}
      />

      {/* Zellige SVG overlay */}
      <div className="absolute inset-0 zellige-pattern opacity-[0.055]" />

      {/* Geometric ornament — concentric hexagons */}
      <svg
        className="absolute bottom-0 end-0 translate-x-1/4 translate-y-1/4 opacity-[0.18]"
        width="220" height="220" viewBox="0 0 120 120" fill="none" aria-hidden="true"
      >
        <polygon points="60,4 116,32 116,88 60,116 4,88 4,32"
          stroke={conf.accent} strokeWidth="0.6" />
        <polygon points="60,18 102,40 102,80 60,102 18,80 18,40"
          stroke={conf.accent} strokeWidth="0.5" />
        <polygon points="60,32 88,48 88,72 60,88 32,72 32,48"
          stroke={conf.accent} strokeWidth="0.4" />
        <circle cx="60" cy="60" r="10" stroke={conf.accent} strokeWidth="0.6" />
        <circle cx="60" cy="60" r="4"  fill={conf.accent} opacity="0.5" />
      </svg>

      {/* Year — oversized watermark */}
      <span
        className="absolute start-4 bottom-3 font-display font-light leading-none pointer-events-none"
        style={{
          fontSize: 'clamp(5rem, 10vw, 9rem)',
          letterSpacing: '-0.05em',
          color: conf.accent,
          opacity: 0.12,
        }}
        aria-hidden="true"
      >
        {conf.year}
      </span>

      {/* Edition badge — top-left */}
      <div className="absolute top-6 start-6">
        <span
          className="text-label text-[0.6rem] px-3 py-1.5 rounded-full border backdrop-blur-sm"
          style={{ color: conf.accent, borderColor: `${conf.accent}40`, background: `${conf.accent}10` }}
        >
          {conf.edition} Edition
        </span>
      </div>

      {/* Bottom overlay text */}
      <div className="absolute bottom-0 start-0 end-0 p-6 bg-gradient-to-t from-[#0A0A0B]/80 to-transparent">
        <p className="text-bone/28 text-xs font-medium">{conf.date}</p>
        <p className="text-bone/45 text-sm font-semibold mt-0.5">{conf.location}</p>
      </div>
    </div>
  )
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

          <div className="space-y-6">
            {CONFERENCES.map((conf, i) => (
              <FadeUp key={conf.year} delay={i * 0.07}>
                <div className={`group relative bg-[#111114] border rounded-2xl overflow-hidden transition-all duration-500 hover:border-bone/16 ${
                  conf.featured ? 'border-red/25' : 'border-bone/[0.06]'
                }`}>

                  {/* Split layout: cover image left, content right */}
                  <div className="grid lg:grid-cols-[380px_1fr]">

                    {/* ── Cover visual ── */}
                    <div className="relative lg:border-e border-bone/[0.06] overflow-hidden">
                      {conf.image ? (
                        <div className="relative w-full h-full min-h-[260px]">
                          <Image
                            src={conf.image}
                            alt={`MoroccoAI Conference ${conf.year}`}
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                            sizes="380px"
                          />
                          {/* overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0B]/60 to-transparent" />
                          {/* Edition badge */}
                          <div className="absolute top-5 start-5">
                            <span className="text-label text-[0.6rem] px-3 py-1.5 rounded-full border backdrop-blur-sm"
                              style={{ color: conf.accent, borderColor: `${conf.accent}40`, background: `${conf.accent}10` }}>
                              {conf.edition} Edition
                            </span>
                          </div>
                        </div>
                      ) : (
                        <ConferenceCover conf={conf} />
                      )}
                    </div>

                    {/* ── Content ── */}
                    <div className="flex flex-col justify-between p-8 lg:p-10">
                      <div>
                        {/* Theme */}
                        <h3
                          className="font-display font-light text-bone leading-tight mb-4"
                          style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', letterSpacing: '-0.02em' }}
                        >
                          {conf.theme}
                        </h3>
                        <p className="text-bone/42 text-sm leading-relaxed mb-7 max-w-xl">
                          {conf.description}
                        </p>

                        {/* Speakers chips */}
                        <div className="flex flex-wrap gap-2 mb-8">
                          {conf.speakers.map((name) => (
                            <span key={name}
                              className="text-xs text-bone/50 border border-bone/[0.08] px-3 py-1.5 rounded-full hover:border-bone/20 hover:text-bone/70 transition-colors">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Stats row */}
                      <div className="flex flex-wrap gap-x-8 gap-y-4 pt-6 border-t border-bone/[0.06]">
                        {conf.stats.map((s) => (
                          <div key={s.label}>
                            <span
                              className="font-display font-light block leading-none mb-1"
                              style={{ fontSize: '2rem', letterSpacing: '-0.03em', color: conf.accent, opacity: 0.9 }}
                            >
                              {s.value}
                            </span>
                            <span className="text-bone/28 text-[0.6rem] font-semibold uppercase tracking-[0.15em]">
                              {s.label}
                            </span>
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
