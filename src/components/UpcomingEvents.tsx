'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const EVENTS = [
  {
    date:     { day: '18', month: 'OCT', year: '2025' },
    title:    'MoroccoAI Annual Conference 2025',
    location: 'Rabat, Morocco',
    type:     'Conference',
    href:     '/conference',
    featured: true,
  },
  {
    date:     { day: '12', month: 'JUL', year: '2025' },
    title:    'Webinar: LLMs for Low-Resource Languages',
    location: 'Online',
    type:     'Webinar',
    href:     '/webinars',
    featured: false,
  },
  {
    date:     { day: '28', month: 'AUG', year: '2025' },
    title:    'AI in Healthcare — Casablanca Meetup',
    location: 'Casablanca, Morocco',
    type:     'Community',
    href:     '/events',
    featured: false,
  },
]

const TYPE_COLOR: Record<string, string> = {
  Conference: '#C8202F',
  Webinar:    '#1F2A5C',
  Community:  '#F5F1EA',
}

export default function UpcomingEvents() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="relative bg-[#111114] py-28 lg:py-36 overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-label text-bone/40 mb-5 flex items-center gap-3"
            >
              <span className="w-6 h-px bg-red inline-block" />
              Upcoming
            </motion.p>
            <p style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#D4A574', marginBottom: 8 }}>[ 03 / EVENTS ]</p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.7 }}
              className="text-display-md text-bone"
            >
              Mark your calendar.
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Link
              href="/events"
              className="group inline-flex items-center gap-2 text-bone/32 hover:text-bone/65 transition-colors text-xs font-semibold tracking-[0.18em] uppercase"
            >
              All events
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        </div>

        <div className="space-y-4">
          {EVENTS.map((event, i) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.12 + i * 0.1, duration: 0.7, ease: EXPO }}
            >
              <Link
                href={event.href}
                className={`group relative flex flex-col sm:flex-row sm:items-center gap-6 p-6 sm:p-8 rounded-2xl border transition-all duration-500 overflow-hidden ${
                  event.featured
                    ? 'border-red/25 bg-red/[0.02] hover:border-red/45'
                    : 'border-bone/[0.06] hover:border-bone/14'
                }`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(31,42,92,0.06), transparent)' }} />

                {/* Date block */}
                <div className="shrink-0 flex flex-row sm:flex-col items-baseline sm:items-start gap-3 sm:gap-0 sm:w-20">
                  <span className="font-display text-[2.8rem] sm:text-[3.5rem] font-light text-bone leading-none tracking-tight">
                    {event.date.day}
                  </span>
                  <div className="flex sm:flex-col gap-1.5 sm:gap-0">
                    <span className="text-label text-bone/38 text-[0.6rem]">{event.date.month}</span>
                    <span className="text-label text-bone/22 text-[0.6rem] sm:mt-0.5">{event.date.year}</span>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-16 bg-bone/10 shrink-0" />

                <div className="flex-1 min-w-0">
                  <span
                    className="text-label text-[0.58rem] mb-2 block"
                    style={{ color: TYPE_COLOR[event.type], opacity: event.type === 'Community' ? 0.55 : 0.85 }}
                  >
                    {event.type}
                  </span>
                  <h3 className="text-bone font-semibold text-base sm:text-lg leading-snug mb-1.5">
                    {event.title}
                  </h3>
                  <p className="text-bone/32 text-sm flex items-center gap-1.5">
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {event.location}
                  </p>
                </div>

                {/* Arrow button */}
                <div className="shrink-0 w-10 h-10 rounded-full border border-bone/10 flex items-center justify-center text-bone/22 group-hover:border-bone/28 group-hover:text-bone/55 transition-all duration-300">
                  <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
