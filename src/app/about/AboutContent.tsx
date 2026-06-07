'use client'
import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const MILESTONES = [
  { year: '2019', title: 'Founded', text: 'A group of Moroccan AI researchers and practitioners launch MoroccoAI to democratize AI education across Africa.' },
  { year: '2020', title: 'First Webinars', text: 'During COVID-19 we pivot online. The MoroccoAI webinar series connects global Moroccan talent in real time.' },
  { year: '2021', title: '1st Conference', text: 'The MoroccoAI Annual Conference launches — the largest AI event in North Africa, with 1,200+ participants from 15+ countries.' },
  { year: '2022', title: '2nd Conference', text: '500+ attendees, first career fair, NLP/Arabic workshops. Community doubles to 300+ members across the diaspora.' },
  { year: '2023', title: '3rd Conference', text: '700+ attendees, AI policy panels, international university partnerships forged. Research tracks launched.' },
  { year: '2024', title: 'AI Strategy Report', text: 'MoroccoAI co-authors Morocco\'s national AI strategy. 4th conference draws 900+ attendees, 30+ speakers, 12+ countries.' },
]

const PILLARS = [
  {
    label: 'Conference',
    accent: '#C8202F',
    title: 'World-Class Events',
    body: 'Annual conference in Casablanca with keynotes from Geoffrey Hinton, Yoshua Bengio, Michael I. Jordan, Stuart Russell, and more.',
  },
  {
    label: 'Education',
    accent: '#1F2A5C',
    title: 'Webinars & Learning',
    body: 'Monthly webinars covering research frontiers — LLMs, computer vision, Arabic NLP, AI safety — led by top practitioners.',
  },
  {
    label: 'Research',
    accent: '#C8202F',
    title: 'Policy & Research',
    body: 'Co-authoring national AI strategy, supporting papers on African language models, and building the continent\'s AI research base.',
  },
  {
    label: 'Community',
    accent: '#1F2A5C',
    title: '5,000+ Members',
    body: 'A global network of engineers, scientists, entrepreneurs, and students united by a shared ambition for Africa\'s AI future.',
  },
]

const PARTNERS = ['Google', 'Nvidia', 'INPT', 'UM6P', 'ENSIAS']

function FadeUp({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref   = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: EXPO }}
    >
      {children}
    </motion.div>
  )
}

export default function AboutContent() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative bg-ink overflow-hidden pt-32 pb-28 lg:pt-44 lg:pb-36">
        <div className="absolute inset-0 zellige-pattern opacity-[0.016]" />
        <div
          className="absolute top-0 end-0 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 100% 0%, rgba(31,42,92,0.14), transparent 65%)' }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-4xl">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-label text-bone/40 mb-8 flex items-center gap-3"
            >
              <span className="w-6 h-px bg-red inline-block" />
              About MoroccoAI
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 1, ease: EXPO }}
              className="text-display-xl text-bone mb-10"
            >
              Building<br />
              <em className="not-italic font-light italic" style={{ color: '#C8202F' }}>the AI ecosystem</em><br />
              Morocco deserves.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8 }}
              className="text-bone/48 text-lg leading-relaxed max-w-2xl"
            >
              MoroccoAI is Morocco's largest non-profit AI community — connecting researchers,
              engineers, and practitioners across Morocco, Africa, and the global diaspora.
              Founded in 2019, we believe the next generation of AI breakthroughs will come from Africa.
            </motion.p>
          </div>
        </div>
      </section>

      {/* ── Mission / Vision asymmetric grid ─────────── */}
      <section className="relative bg-[#0D0D10] py-28 lg:py-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-12">

            {/* Mission */}
            <FadeUp>
              <div className="relative bg-navy/10 border border-navy/20 rounded-2xl p-10 lg:p-14 overflow-hidden">
                <div className="absolute top-0 start-0 w-full h-px bg-gradient-to-r from-navy/60 via-navy/20 to-transparent" />
                <p className="text-label text-bone/28 mb-6 flex items-center gap-3">
                  <span className="w-6 h-px bg-red inline-block" />
                  Mission
                </p>
                <h2 className="text-display-md text-bone mb-6">Our<br /><em className="not-italic font-light italic">Mission</em></h2>
                <p className="text-bone/52 leading-relaxed text-base">
                  To democratize AI knowledge and build a vibrant ecosystem in Morocco and Africa —
                  connecting local talent with the global research community, driving adoption for
                  socioeconomic development, and ensuring Africa shapes its own AI future.
                </p>
              </div>
            </FadeUp>

            {/* Vision */}
            <FadeUp delay={0.15}>
              <div className="relative bg-[#111114] border border-bone/[0.06] rounded-2xl p-10 lg:p-12 overflow-hidden h-full">
                <p className="text-label text-bone/28 mb-6 flex items-center gap-3">
                  <span className="w-6 h-px bg-red inline-block" />
                  Vision
                </p>
                <h2 className="text-display-md text-bone mb-6">Our<br /><em className="not-italic font-light italic">Vision</em></h2>
                <p className="text-bone/52 leading-relaxed text-base">
                  A Morocco and Africa that are active contributors to — not just consumers of —
                  the global AI revolution. Where local researchers publish at top venues, African
                  startups solve African problems, and every practitioner has access to
                  world-class mentorship regardless of background.
                </p>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── 4 Pillars ─────────────────────────────────── */}
      <section className="bg-ink py-28 lg:py-36">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <div className="mb-16">
              <p className="text-label text-bone/40 mb-5 flex items-center gap-3">
                <span className="w-6 h-px bg-red inline-block" />
                What We Do
              </p>
              <h2 className="text-display-md text-bone max-w-lg">
                Four pillars,<br />one mission.
              </h2>
            </div>
          </FadeUp>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PILLARS.map((p, i) => (
              <FadeUp key={p.label} delay={i * 0.08}>
                <div className="group relative bg-[#111114] border border-bone/[0.07] rounded-2xl p-7 overflow-hidden h-full transition-all duration-500 hover:border-bone/14">
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse 80% 60% at 0% 100%, ${p.accent}12, transparent)` }}
                  />
                  <span
                    className="text-label text-[0.6rem] mb-5 block"
                    style={{ color: p.accent, opacity: 0.8 }}
                  >{p.label}</span>
                  <h3 className="font-semibold text-bone text-base mb-3 leading-snug">{p.title}</h3>
                  <p className="text-bone/40 text-sm leading-relaxed">{p.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────── */}
      <section className="bg-[#0D0D10] py-28 lg:py-36 overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <div className="mb-20">
              <p className="text-label text-bone/40 mb-5 flex items-center gap-3">
                <span className="w-6 h-px bg-red inline-block" />
                History
              </p>
              <h2 className="text-display-md text-bone">Five years<br />of momentum.</h2>
            </div>
          </FadeUp>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute start-[4.5rem] lg:start-[7.5rem] top-0 bottom-0 w-px bg-bone/[0.07] hidden sm:block" />

            <div className="space-y-12">
              {MILESTONES.map((m, i) => (
                <FadeUp key={m.year} delay={i * 0.06}>
                  <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-start">
                    {/* Year */}
                    <div className="shrink-0 relative z-10">
                      <span
                        className="font-display font-light text-bone/18 leading-none block"
                        style={{ fontSize: 'clamp(3rem, 5vw, 5.5rem)', letterSpacing: '-0.03em' }}
                      >
                        {m.year}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="sm:pt-4 flex-1 border-t border-bone/[0.06] sm:border-0 pt-4 sm:pt-0">
                      <p className="text-label text-red/80 text-[0.62rem] mb-2">{m.title}</p>
                      <p className="text-bone/55 leading-relaxed">{m.text}</p>
                    </div>
                  </div>
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Partners ─────────────────────────────────── */}
      <section className="bg-ink py-28 border-t border-bone/[0.05]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <FadeUp>
            <div className="flex flex-col lg:flex-row lg:items-end gap-12 lg:gap-20">
              <div className="shrink-0">
                <p className="text-label text-bone/40 mb-5 flex items-center gap-3">
                  <span className="w-6 h-px bg-red inline-block" />
                  Partners
                </p>
                <h2 className="text-display-md text-bone">
                  Backed by<br />leaders.
                </h2>
              </div>

              <div className="flex flex-wrap gap-px border border-bone/[0.06] rounded-2xl overflow-hidden">
                {PARTNERS.map((name) => (
                  <div
                    key={name}
                    className="flex-1 min-w-[100px] bg-[#111114] hover:bg-navy/10 transition-colors duration-300 px-8 py-7 flex items-center justify-center"
                  >
                    <span className="font-display font-light text-bone/38 hover:text-bone/65 transition-colors tracking-tight text-lg">
                      {name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── CTA strip ────────────────────────────────── */}
      <section className="bg-[#0D0D10] border-t border-bone/[0.05] py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <p className="text-bone/45 max-w-md leading-relaxed">
              Want to be part of Morocco's AI future? Join our community of 5,000+ members across Africa and the diaspora.
            </p>
            <div className="flex gap-4 shrink-0">
              <Link
                href="/newsletter"
                className="inline-flex items-center gap-2 bg-red text-bone px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-red-900 transition-colors duration-300"
              >
                Join the Community
              </Link>
              <Link
                href="/conference"
                className="inline-flex items-center gap-2 border border-bone/20 text-bone/55 px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:border-bone/45 hover:text-bone transition-all duration-300"
              >
                Conference
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
