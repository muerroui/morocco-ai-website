'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const SPEAKERS = [
  { name: 'Geoffrey Hinton',    role: 'Nobel Laureate · University of Toronto',  initials: 'GH', year: '2023' },
  { name: 'Yoshua Bengio',      role: 'Turing Award · Université de Montréal',    initials: 'YB', year: '2022' },
  { name: 'Michael I. Jordan',  role: 'UC Berkeley · EECS & Statistics',           initials: 'MJ', year: '2024' },
  { name: 'Stuart Russell',     role: 'AI Safety · UC Berkeley',                   initials: 'SR', year: '2023' },
  { name: 'Samy Bengio',        role: 'Apple Research · Former Google Brain',      initials: 'SB', year: '2022' },
  { name: 'Bernhard Schölkopf', role: 'Max Planck Institute',                      initials: 'BS', year: '2024' },
  { name: 'Moustapha Cissé',    role: 'Google DeepMind · African AI Leader',       initials: 'MC', year: '2023' },
  { name: 'Nada Matta',         role: 'Université de Troyes · AI & Knowledge',    initials: 'NM', year: '2022' },
]

const ALL = [...SPEAKERS, ...SPEAKERS]

function SpeakerCard({ s }: { s: typeof SPEAKERS[0] }) {
  return (
    <div className="group relative flex-shrink-0 w-52 sm:w-60 border border-bone/[0.07] rounded-2xl p-6 mx-3 overflow-hidden hover:border-bone/18 transition-all duration-500 cursor-default">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(31,42,92,0.12), transparent)' }} />

      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-navy/20 to-navy/05 border border-bone/10 flex items-center justify-center mb-5 group-hover:border-navy/40 transition-colors duration-300">
        <span className="font-display text-base font-light text-bone/55 group-hover:text-bone/80 transition-colors duration-300">
          {s.initials}
        </span>
      </div>

      <span className="text-label text-[0.58rem] text-red/70 mb-3 block">{s.year}</span>
      <h3 className="text-bone text-sm font-semibold leading-tight mb-1.5">
        {s.name}
      </h3>
      <p className="text-bone/32 text-xs leading-relaxed">{s.role}</p>
    </div>
  )
}

export default function MarqueeSpeakers() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section ref={ref} className="relative bg-ink py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 mb-14">
        <div className="flex flex-col sm:flex-row sm:items-end gap-6 justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-label text-bone/40 mb-5 flex items-center gap-3"
            >
              <span className="w-6 h-px bg-red inline-block" />
              Past Keynotes
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-display-md text-bone"
            >
              The world's best<br />minds, in Morocco.
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-bone/32 text-sm max-w-xs leading-relaxed self-end"
          >
            Seven editions. Keynotes from Turing Award winners, Nobel Laureates, and AI pioneers.
          </motion.p>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="absolute start-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, #0A0A0B, transparent)' }} />
        <div className="absolute end-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #0A0A0B, transparent)' }} />

        <div className="flex animate-marquee hover:[animation-play-state:paused]">
          {ALL.map((s, i) => (
            <SpeakerCard key={`${s.name}-${i}`} s={s} />
          ))}
        </div>
      </div>
    </section>
  )
}
