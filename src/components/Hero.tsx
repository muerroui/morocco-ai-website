'use client'
import { useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

/* ─── Neural Particle Canvas ──────────────────────────────────── */

interface Particle {
  x:    number
  y:    number
  ox:   number  // origin x (for spring return)
  oy:   number  // origin y
  vx:   number
  vy:   number
  r:    number
  isRed: boolean
  alpha: number
}

function gaussianRandom(mean: number, std: number): number {
  let u = 0, v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return mean + std * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function NeuralCanvas() {
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const particles   = useRef<Particle[]>([])
  const mouse       = useRef({ x: -1000, y: -1000 })
  const rafRef      = useRef<number>(0)

  const initParticles = useCallback((W: number, H: number) => {
    const COUNT = Math.min(180, Math.floor((W * H) / 5000))
    particles.current = []
    for (let i = 0; i < COUNT; i++) {
      const isRed = Math.random() < 0.14
      // Gaussian cluster biased toward center-right (echoes logo's right-hemisphere brain)
      const ox = gaussianRandom(W * 0.58, W * 0.22)
      const oy = gaussianRandom(H * 0.50, H * 0.22)
      particles.current.push({
        x: ox, y: oy, ox, oy,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: isRed ? 2.5 + Math.random() * 1.8 : 1.4 + Math.random() * 2.0,
        isRed,
        alpha: 0.35 + Math.random() * 0.65,
      })
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
      initParticles(canvas.offsetWidth, canvas.offsetHeight)
    }
    resize()

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.current.x = e.clientX - rect.left
      mouse.current.y = e.clientY - rect.top
    }
    const onLeave = () => { mouse.current.x = -1000; mouse.current.y = -1000 }

    window.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', resize)

    const SCATTER_R    = 110
    const CONNECT_DIST = 75
    const SPRING       = 0.012
    const DAMPEN       = 0.88

    const animate = () => {
      const W = canvas.offsetWidth
      const H = canvas.offsetHeight
      ctx.clearRect(0, 0, W, H)

      const pts = particles.current
      const mx  = mouse.current.x
      const my  = mouse.current.y

      /* Update positions */
      for (const p of pts) {
        if (!mediaQuery.matches) {
          // Mouse scatter
          const dx = p.x - mx
          const dy = p.y - my
          const d2 = dx * dx + dy * dy
          if (d2 < SCATTER_R * SCATTER_R) {
            const d    = Math.sqrt(d2)
            const force = (SCATTER_R - d) / SCATTER_R * 1.8
            p.vx += (dx / d) * force
            p.vy += (dy / d) * force
          }
          // Spring return
          p.vx += (p.ox - p.x) * SPRING
          p.vy += (p.oy - p.y) * SPRING
          // Dampen
          p.vx *= DAMPEN
          p.vy *= DAMPEN
          p.x  += p.vx
          p.y  += p.vy
        }

        /* Draw dot */
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.isRed ? `rgba(200,32,47,${p.alpha})` : `rgba(245,241,234,${p.alpha * 0.75})`
        ctx.fill()
      }

      /* Draw connections */
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x
          const dy = pts[i].y - pts[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < CONNECT_DIST) {
            const opacity = (1 - d / CONNECT_DIST) * 0.12
            ctx.beginPath()
            ctx.moveTo(pts[i].x, pts[i].y)
            ctx.lineTo(pts[j].x, pts[j].y)
            ctx.strokeStyle = `rgba(245,241,234,${opacity})`
            ctx.lineWidth   = 0.5
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('resize', resize)
    }
  }, [initParticles])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      aria-hidden="true"
    />
  )
}

/* ─── Stagger reveal ────────────────────────────────────────────── */
const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const fadeUp = {
  hidden:  { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.7, ease: EXPO },
  }),
}

/* ─── Hero ─────────────────────────────────────────────────────── */
export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-ink">

      {/* Particle canvas — fills full hero */}
      <div className="absolute inset-0">
        <NeuralCanvas />
      </div>

      {/* Radial vignette — centres attention on left-side text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 80% at 60% 50%, transparent 20%, #0A0A0B 90%)',
        }}
      />

      {/* Navy glow — bottom-left warmth */}
      <div
        className="absolute bottom-0 start-0 w-[500px] h-[380px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(31,42,92,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Red glow — top-right */}
      <div
        className="absolute top-0 end-0 w-[400px] h-[320px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(200,32,47,0.06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Zellige rosette — bottom-left decorative */}
      <div className="absolute bottom-0 start-0 pointer-events-none" style={{ zIndex: 0 }}>
        <motion.svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          aria-hidden="true"
          animate={{ rotate: 360 }}
          transition={{ duration: 1200, repeat: Infinity, ease: 'linear' }}
          style={{ opacity: 0.12 }}
        >
          <motion.path
            d="M 160,5 L 184.9,99.9 L 269.6,50.4 L 220.1,135.1 L 315,160 L 220.1,184.9 L 269.6,269.6 L 184.9,220.1 L 160,315 L 135.1,220.1 L 50.4,269.6 L 99.9,184.9 L 5,160 L 99.9,135.1 L 50.4,50.4 L 135.1,99.9 Z"
            fill="none"
            stroke="#D4A574"
            strokeWidth="1.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 8, ease: 'easeInOut' }}
          />
        </motion.svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12 pt-28 pb-20">

        {/* Eyebrow */}
        <motion.p
          custom={0}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-label text-bone/50 mb-8 flex items-center gap-3"
        >
          <span className="inline-block w-8 h-px bg-red" />
          MoroccoAI — Non-Profit AI Community
        </motion.p>

        {/* Display headline */}
        <div className="overflow-hidden">
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-display-xl text-bone leading-[0.95] mb-4 max-w-4xl"
          >
            Building AI
            <br />
            <em className="not-italic text-red">for</em>{' '}<span style={{ color: '#D4A574' }}>Morocco.</span>
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="text-display-xl text-bone/25 leading-[0.95] mb-12 max-w-4xl"
          >
            Building AI{' '}
            <em className="not-italic text-bone/40">from</em> Morocco.
          </motion.h1>
        </div>

        {/* Sub-copy + CTAs */}
        <motion.div
          custom={3}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-16"
        >
          <p className="text-bone/45 text-base leading-relaxed max-w-md">
            Morocco's largest professional AI community — advancing education,
            research, and innovation through world-class events, webinars, and
            an open knowledge ecosystem.
          </p>

          <div className="flex flex-wrap gap-4 shrink-0">
            <Link
              href="/newsletter"
              className="group inline-flex items-center gap-3 bg-red text-bone px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-red-900 transition-colors duration-300"
            >
              Join Community
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/webinars"
              className="group inline-flex items-center gap-3 border border-bone/20 text-bone/55 px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:border-bone/50 hover:text-bone transition-all duration-300"
            >
              Explore Webinars
              <svg className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="absolute bottom-10 start-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-bone/20"
        >
          <span className="text-label text-[0.55rem]">Scroll</span>
          <div className="w-px h-10 bg-gradient-to-b from-bone/20 to-transparent" />
        </motion.div>

        {/* Brand accent — bottom right — geometric hex */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="absolute bottom-16 end-8 lg:end-12 hidden md:block"
        >
          <svg width="64" height="64" viewBox="0 0 80 80" fill="none" aria-hidden="true">
            <polygon points="40,2 78,21 78,59 40,78 2,59 2,21"
              stroke="#1F2A5C" strokeWidth="0.8" opacity="0.5" />
            <polygon points="40,14 66,27 66,53 40,66 14,53 14,27"
              stroke="#1F2A5C" strokeWidth="0.5" opacity="0.3" />
            <circle cx="40" cy="40" r="5" stroke="#C8202F" strokeWidth="0.8" opacity="0.6" />
          </svg>
        </motion.div>
      </div>

      {/* Arabic flourish — right edge */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 1.2 }}
        className="absolute top-1/2 end-0 -translate-y-1/2 pe-6 hidden xl:block"
        aria-hidden="true"
      >
        <p
          className="text-bone/[0.05] text-[4rem] font-arabic font-light select-none"
          style={{ writingMode: 'vertical-rl', direction: 'rtl' }}
        >
          المغرب والذكاء الاصطناعي
        </p>
      </motion.div>
    </section>
  )
}
