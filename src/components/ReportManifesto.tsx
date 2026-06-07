'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function ReportManifesto() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <section ref={ref} className="relative bg-ink overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 zellige-pattern opacity-[0.018]" />

      {/* Navy radial — left side */}
      <div
        className="absolute start-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(31,42,92,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_auto] gap-12 lg:gap-20 items-center">

          <div>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-label text-bone/40 mb-8 flex items-center gap-3"
            >
              <span className="w-6 h-px bg-red inline-block" />
              Policy & Research
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1, duration: 0.8, ease: EXPO }}
              className="text-display-lg text-bone mb-8 max-w-2xl"
            >
              National AI<br />Strategy Report.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-bone/42 text-base leading-relaxed mb-10 max-w-lg"
            >
              MoroccoAI co-authored Morocco's national framework for artificial intelligence adoption —
              a comprehensive report covering AI readiness, infrastructure, talent, and an actionable
              roadmap for AI-led growth across sectors.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="#"
                className="group inline-flex items-center gap-3 bg-bone text-ink px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-mist transition-colors duration-300"
              >
                Download Report
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="group inline-flex items-center gap-3 border border-bone/20 text-bone/55 px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:border-bone/50 hover:text-bone transition-all duration-300"
              >
                About our research
                <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </motion.div>
          </div>

          {/* Abstract "report" document */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 20 }}
            animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.9, ease: EXPO }}
            className="hidden lg:block shrink-0"
          >
            <div className="relative w-64 h-80 rounded-2xl border border-bone/10 bg-[#111114] overflow-hidden">
              {/* Navy + red header bar */}
              <div className="h-1.5 bg-gradient-to-r from-navy via-red to-navy" />

              <div className="p-8 space-y-4 mt-2">
                <div className="space-y-2">
                  <div className="h-2 bg-bone/18 rounded-full w-4/5" />
                  <div className="h-2 bg-bone/18 rounded-full w-3/5" />
                </div>
                <div className="h-px bg-bone/8 my-4" />
                {[0.7, 0.9, 0.6, 0.8, 0.5, 0.75, 0.85, 0.55, 0.7].map((w, i) => (
                  <div
                    key={i}
                    className="h-1.5 bg-bone/8 rounded-full"
                    style={{ width: `${w * 100}%` }}
                  />
                ))}

                {/* Geometric ornament — navy hex */}
                <div className="absolute bottom-6 end-6">
                  <svg width="40" height="40" viewBox="0 0 60 60" fill="none" aria-hidden="true">
                    <polygon points="30,2 58,16 58,44 30,58 2,44 2,16"
                      stroke="#1F2A5C" strokeWidth="0.8" opacity="0.5" />
                    <polygon points="30,12 50,22 50,38 30,48 10,38 10,22"
                      stroke="#1F2A5C" strokeWidth="0.5" opacity="0.3" />
                    <circle cx="30" cy="30" r="5" stroke="#C8202F" strokeWidth="0.8" opacity="0.5" />
                  </svg>
                </div>
              </div>

              {/* Red bottom accent */}
              <div className="absolute bottom-0 start-0 end-0 h-px bg-red/30" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
