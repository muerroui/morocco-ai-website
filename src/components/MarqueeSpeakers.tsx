'use client'
import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import type { Member } from '@/lib/types'
import { urlFor } from '@/lib/image'

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')
}

function SpeakerCard({ s }: { s: Member }) {
  return (
    <div className="group relative flex-shrink-0 w-52 sm:w-60 border border-bone/[0.07] rounded-2xl p-6 mx-3 overflow-hidden hover:border-bone/18 transition-all duration-500 cursor-default">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 110%, rgba(31,42,92,0.12), transparent)' }} />

      {/* Avatar */}
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-navy/20 to-navy/05 border border-bone/10 mb-5 group-hover:border-navy/40 transition-colors duration-300">
        {s.image ? (
          <Image
            src={urlFor(s.image).url()}
            alt={s.name}
            fill
            sizes="48px"
            className="object-cover"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <span className="font-display text-base font-light text-bone/55 group-hover:text-bone/80 transition-colors duration-300">
              {initials(s.name)}
            </span>
          </div>
        )}
      </div>

      <h3 className="text-bone text-sm font-semibold leading-tight mb-1.5">
        {s.name}
      </h3>
      {s.role && <p className="text-bone/32 text-xs leading-relaxed">{s.role}</p>}
    </div>
  )
}

export default function MarqueeSpeakers({ members }: { members: Member[] }) {
  const ALL = [...members, ...members]
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
