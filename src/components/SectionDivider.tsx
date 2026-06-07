'use client'
import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function SectionDivider({ className = '' }: { className?: string }) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <div ref={ref} className={`relative h-px overflow-visible ${className}`} aria-hidden="true">
      <motion.svg
        viewBox="0 0 1200 24"
        fill="none"
        className="w-full h-6 absolute top-1/2 -translate-y-1/2"
        preserveAspectRatio="none"
      >
        <motion.rect
          x="0" y="11.5" width="1200" height="0.7"
          fill="url(#div-grad)"
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.4, ease: EXPO }}
          style={{ transformOrigin: '0 50%' }}
        />

        {/* Centre geometric ornament — navy/red brand mark */}
        <motion.g
          initial={{ opacity: 0, scale: 0.6 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          transform="translate(600, 12)"
        >
          <polygon points="0,-6 5.2,3 -5.2,3"
            stroke="#1F2A5C" strokeWidth="0.7" fill="none" opacity="0.6" />
          <polygon points="0,6 5.2,-3 -5.2,-3"
            stroke="#1F2A5C" strokeWidth="0.7" fill="none" opacity="0.6" />
          <circle cx="0" cy="0" r="2" fill="#C8202F" opacity="0.7" />
        </motion.g>

        <defs>
          <linearGradient id="div-grad" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#F5F1EA" stopOpacity="0" />
            <stop offset="25%"  stopColor="#F5F1EA" stopOpacity="0.1" />
            <stop offset="50%"  stopColor="#1F2A5C" stopOpacity="0.35" />
            <stop offset="75%"  stopColor="#F5F1EA" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#F5F1EA" stopOpacity="0" />
          </linearGradient>
        </defs>
      </motion.svg>
    </div>
  )
}
