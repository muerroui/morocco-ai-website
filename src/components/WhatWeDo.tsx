'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

/* Alternate navy/red for pillar accents — navy is the structural color, red = CTA/highlight */
const PILLARS = [
  {
    num:    '01',
    title:  'Annual Conference',
    tagline: 'Where the frontier meets Morocco.',
    body:   'World-class keynotes from Geoffrey Hinton, Yoshua Bengio, Michael I. Jordan, Stuart Russell, and more — bringing global AI thought-leaders to Moroccan soil.',
    href:   '/conference',
    accent: '#1F2A5C',
  },
  {
    num:    '02',
    title:  'Webinars & Workshops',
    tagline: 'Knowledge, in three languages.',
    body:   'A growing library of 120+ webinars in Arabic, French, and English — from LLMs to computer vision, from theory to applied AI in African contexts.',
    href:   '/webinars',
    accent: '#C8202F',
  },
  {
    num:    '03',
    title:  'Research & Policy',
    tagline: 'Science with local stakes.',
    body:   'Promoting AI research relevant to Moroccan and African challenges. Authors of the National AI Strategy Report in collaboration with Moroccan universities and institutions.',
    href:   '/about',
    accent: '#1F2A5C',
  },
  {
    num:    '04',
    title:  'Community',
    tagline: '5,000+ builders and thinkers.',
    body:   'A thriving network spanning INPT, UM6P, ENSIAS, and universities across Africa — connecting students, researchers, engineers, and entrepreneurs.',
    href:   '/newsletter',
    accent: '#C8202F',
  },
]

export default function WhatWeDo() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="relative bg-[#111114] py-28 lg:py-36 overflow-hidden">
      <div className="absolute inset-0 zellige-pattern opacity-[0.015]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="grid lg:grid-cols-[1fr_2fr] gap-10 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <p className="text-label text-bone/40 mb-6 flex items-center gap-3">
              <span className="w-6 h-px bg-red inline-block" />
              What we do
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: '#D4A574', marginBottom: 8 }}>[ 01 / WHAT WE DO ]</p>
            <h2 className="text-display-md text-bone">
              Four pillars.<br />One mission.
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.7 }}
            className="text-bone/40 text-lg leading-relaxed self-end max-w-xl"
          >
            MoroccoAI advances artificial intelligence in Morocco and Africa — not just by talking about it, but by building the infrastructure, the community, and the culture for it to thrive.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {PILLARS.map((pillar, i) => (
            <motion.div
              key={pillar.num}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.7, ease: EXPO }}
            >
              <Link
                href={pillar.href}
                className="group relative flex flex-col h-full border border-bone/[0.07] rounded-2xl p-7 overflow-hidden hover:border-bone/18 transition-all duration-500"
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: `radial-gradient(ellipse 80% 60% at 50% 100%, ${pillar.accent}12, transparent)` }}
                />
                {/* Top accent line on hover */}
                <div
                  className="absolute top-0 start-7 end-7 h-px transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(to right, transparent, ${pillar.accent}70, transparent)` }}
                />

                {/* Number */}
                <span
                  className="font-display text-[5rem] font-light leading-none mb-4"
                  style={{ color: pillar.accent, opacity: 0.16 }}
                >
                  {pillar.num}
                </span>

                <h3 className="text-bone font-semibold text-base leading-snug mb-2 tracking-tight">
                  {pillar.title}
                </h3>
                <p
                  className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase mb-4"
                  style={{ color: pillar.accent, opacity: 0.8 }}
                >
                  {pillar.tagline}
                </p>
                <p className="text-bone/38 text-sm leading-relaxed flex-1 mb-6">
                  {pillar.body}
                </p>

                <div className="flex items-center gap-2 text-bone/28 group-hover:text-bone/65 transition-colors duration-300">
                  <span className="text-xs font-semibold tracking-widest uppercase">Explore</span>
                  <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
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
