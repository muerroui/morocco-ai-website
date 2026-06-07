'use client'
import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { urlFor } from '@/lib/image'
import type { Event } from '@/lib/types'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

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

function parseDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    day:   String(d.getUTCDate()).padStart(2, '0'),
    month: d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase(),
    year:  String(d.getUTCFullYear()),
    full:  d.toLocaleString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' }),
  }
}

export default function EventsContent({ events }: { events: Event[] }) {
  const now      = new Date()
  const upcoming = events.filter(e => new Date(e.date) >= now)
  const past     = events.filter(e => new Date(e.date) < now)

  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
        <div className="absolute inset-0 zellige-pattern opacity-[0.016]" />
        <div className="absolute top-0 start-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 0% 0%, rgba(31,42,92,0.14), transparent 65%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-label text-bone/40 mb-8 flex items-center gap-3">
            <span className="w-6 h-px bg-red inline-block" />Events
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: EXPO }} className="text-display-xl text-bone max-w-3xl">
            Where AI<br />
            <em className="not-italic font-light italic" style={{ color: '#C8202F' }}>connects</em><br />
            Morocco.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="text-bone/42 text-base leading-relaxed mt-8 max-w-2xl">
            Conferences, workshops, hackathons, and community meetups — bringing the Moroccan
            and African AI community together across Morocco and the diaspora.
          </motion.p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="bg-[#0D0D10] py-28 lg:py-36">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <p className="text-label text-bone/40 mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-red inline-block" />Upcoming
            </p>
            <h2 className="text-display-md text-bone mb-16">Mark your calendar.</h2>
          </FadeUp>

          {upcoming.length === 0 ? (
            <p className="text-bone/30 text-sm">No upcoming events at the moment.</p>
          ) : (
            <div className="space-y-4">
              {upcoming.map((ev, i) => {
                const d    = parseDate(ev.date)
                const href = ev.registrationUrl ?? (ev.slug?.current ? `/events/${ev.slug.current}` : '#')
                return (
                  <FadeUp key={ev._id} delay={i * 0.08}>
                    <Link href={href}
                      className="group relative flex flex-col sm:flex-row sm:items-center gap-6 p-6 sm:p-8 rounded-2xl border border-bone/[0.06] hover:border-bone/14 transition-all duration-500 overflow-hidden">
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse 60% 80% at 0% 50%, rgba(31,42,92,0.06), transparent)' }} />

                      {/* Cover image */}
                      {ev.image?.asset && (
                        <div className="shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                          <Image
                            src={urlFor(ev.image).url()}
                            alt={ev.title}
                            width={80} height={80}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      )}

                      {/* Date */}
                      <div className="shrink-0 flex flex-row sm:flex-col items-baseline sm:items-start gap-3 sm:gap-0 sm:w-20">
                        <span className="font-display text-[2.8rem] sm:text-[3.5rem] font-light text-bone leading-none tracking-tight">
                          {d.day}
                        </span>
                        <div className="flex sm:flex-col gap-1.5 sm:gap-0">
                          <span className="text-label text-bone/38 text-[0.6rem]">{d.month}</span>
                          <span className="text-label text-bone/22 text-[0.6rem] sm:mt-0.5">{d.year}</span>
                        </div>
                      </div>

                      <div className="hidden sm:block w-px h-16 bg-bone/10 shrink-0" />

                      <div className="flex-1 min-w-0">
                        <h3 className="text-bone font-semibold text-base sm:text-lg leading-snug mb-1.5">{ev.title}</h3>
                        {ev.location && (
                          <p className="text-bone/32 text-sm flex items-center gap-1.5">
                            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {ev.location}
                          </p>
                        )}
                        {ev.description && (
                          <p className="text-bone/28 text-sm mt-2 line-clamp-2">{ev.description}</p>
                        )}
                      </div>

                      <div className="shrink-0 w-10 h-10 rounded-full border border-bone/10 flex items-center justify-center text-bone/22 group-hover:border-bone/28 group-hover:text-bone/55 transition-all duration-300">
                        <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </Link>
                  </FadeUp>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      <section className="bg-ink py-28 lg:py-36 border-t border-bone/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <p className="text-label text-bone/40 mb-5 flex items-center gap-3">
              <span className="w-6 h-px bg-red inline-block" />Archive
            </p>
            <h2 className="text-display-md text-bone mb-16">Past events.</h2>
          </FadeUp>

          {past.length === 0 ? (
            <p className="text-bone/30 text-sm">No past events.</p>
          ) : (
            <div className="space-y-2">
              {past.map((ev, i) => {
                const d = parseDate(ev.date)
                return (
                  <FadeUp key={ev._id} delay={i * 0.05}>
                    <div className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 py-5 border-b border-bone/[0.06] hover:border-bone/12 transition-colors duration-300">
                      <span className="text-bone/22 text-xs font-medium tabular-nums shrink-0 w-24">{d.full}</span>
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {ev.image?.asset && (
                          <div className="shrink-0 w-8 h-8 rounded-lg overflow-hidden">
                            <Image
                              src={urlFor(ev.image).url()}
                              alt={ev.title}
                              width={32} height={32}
                              className="w-full h-full object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        <span className="flex-1 text-bone/65 text-sm font-medium group-hover:text-bone/90 transition-colors truncate">
                          {ev.title}
                        </span>
                      </div>
                      {ev.location && <span className="text-bone/22 text-xs shrink-0">{ev.location}</span>}
                    </div>
                  </FadeUp>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Conference CTA */}
      <section className="bg-[#0D0D10] border-t border-bone/[0.05] py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
              <div>
                <p className="text-label text-bone/35 mb-3 flex items-center gap-3">
                  <span className="w-6 h-px bg-red inline-block" />Annual Conference
                </p>
                <p className="text-bone/45 max-w-sm leading-relaxed">
                  The MoroccoAI Annual Conference is the largest AI event in North Africa. View the full history and upcoming edition.
                </p>
              </div>
              <Link href="/conference"
                className="shrink-0 inline-flex items-center gap-2 bg-red text-bone px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-red-900 transition-colors duration-300">
                Conference Page
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
