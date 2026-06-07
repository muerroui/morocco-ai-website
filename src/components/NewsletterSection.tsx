'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function NewsletterSection() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'sent'>('idle')
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('sent')
  }

  return (
    <section ref={ref} className="relative bg-bone overflow-hidden py-28 lg:py-40">
      {/* Zellige on light bg */}
      <div className="absolute inset-0 zellige-pattern opacity-[0.035]"
        style={{ filter: 'invert(1)' }} />

      {/* Navy radial — right corner */}
      <div className="absolute top-0 end-0 w-64 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 100% 0%, rgba(31,42,92,0.06), transparent 70%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-label text-red mb-8 inline-flex items-center gap-3"
        >
          <span className="w-6 h-px bg-red inline-block" />
          Newsletter
          <span className="w-6 h-px bg-red inline-block" />
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.9, ease: EXPO }}
          className="text-display-lg text-ink leading-[0.96] mb-8 max-w-3xl mx-auto"
        >
          Stay at the<br />
          <em className="not-italic text-red">frontier</em> of AI<br />
          in Africa.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-ink/48 text-base leading-relaxed mb-12 max-w-md mx-auto"
        >
          Curated insights, upcoming events, research highlights, and community news — delivered bi-monthly.
        </motion.p>

        {status === 'idle' ? (
          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              aria-label="Email address"
              className="flex-1 px-5 py-4 rounded-full bg-ink/[0.05] border border-ink/12 text-ink placeholder-ink/28 focus:outline-none focus:border-navy/40 text-sm font-medium"
            />
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 bg-navy text-bone px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-navy-900 transition-colors duration-300 shrink-0"
            >
              Subscribe
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </motion.form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-ink/55 text-sm font-semibold tracking-wide"
          >
            <span className="text-red mr-2">✓</span>You're on the list. Welcome to MoroccoAI.
          </motion.div>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-ink/22 text-xs mt-5 tracking-wide"
        >
          No spam. Unsubscribe anytime.
        </motion.p>
      </div>
    </section>
  )
}
