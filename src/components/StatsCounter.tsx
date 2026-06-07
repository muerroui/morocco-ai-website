'use client'
import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const STATS = [
  { value: 5000,  suffix: '+', label: 'Community Members' },
  { value: 7,     suffix: '',  label: 'Annual Conferences' },
  { value: 80,    suffix: '+', label: 'World-Class Speakers' },
  { value: 120,   suffix: '+', label: 'Webinars Hosted' },
]

function Counter({ end, suffix, duration = 1800 }: { end: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  useEffect(() => {
    if (!inView) return
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (mediaQuery.matches) { setCount(end); return }

    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed  = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const ease     = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(ease * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, end, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

export default function StatsCounter() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section ref={sectionRef} className="relative bg-ink overflow-hidden py-24 lg:py-32">
      <div className="absolute inset-0 zellige-pattern opacity-[0.02]" />

      <div className="absolute top-0 inset-x-0 h-px overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, ease: EXPO }}
          className="h-full bg-gradient-to-r from-transparent via-bone/15 to-transparent origin-left"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-label text-bone/40 mb-16 flex items-center gap-3"
        >
          <span className="w-6 h-px bg-red inline-block" />
          By the numbers
        </motion.p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-14 gap-x-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.7, ease: EXPO }}
              className="relative"
            >
              <div className="w-5 h-px bg-red mb-6" />
              <div className="font-display text-[3.2rem] sm:text-[4rem] lg:text-[4.5rem] font-light text-bone leading-none tracking-tight mb-3">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-bone/40 text-sm font-medium tracking-wide leading-snug">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 inset-x-0 h-px overflow-hidden">
        <motion.div
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: EXPO }}
          className="h-full bg-gradient-to-r from-transparent via-bone/8 to-transparent origin-right"
        />
      </div>
    </section>
  )
}
