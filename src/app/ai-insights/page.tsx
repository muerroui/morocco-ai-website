'use client'
import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const TAGS = ['All', 'LLMs', 'Computer Vision', 'NLP & Arabic', 'AI Safety', 'Research', 'Career']

const ARTICLES = [
  { id: 'a1', slug: '#', tag: 'LLMs',            featured: true,  date: 'May 2025',   title: 'How Moroccan Companies Are Deploying LLMs in Production', author: 'Khalid Benali',        readTime: '8 min', excerpt: 'From customer service chatbots to internal knowledge bases — an audit of real LLM deployments across Moroccan enterprises.' },
  { id: 'a2', slug: '#', tag: 'NLP & Arabic',     featured: false, date: 'Apr 2025',   title: 'ArabiGPT: Benchmarking Arabic Language Models in 2025',   author: 'Dr. Fatima Zahra El Idrissi', readTime: '12 min', excerpt: 'A comprehensive evaluation of current Arabic LLMs on reasoning, instruction-following, and Darija comprehension.' },
  { id: 'a3', slug: '#', tag: 'Research',         featured: false, date: 'Mar 2025',   title: 'Getting Your First AI Paper Accepted at a Top Venue',     author: 'Prof. Youssef Mrabet',       readTime: '10 min', excerpt: 'Practical advice for researchers in Africa and the Global South on writing, positioning, and submitting AI research.' },
  { id: 'a4', slug: '#', tag: 'Career',           featured: false, date: 'Feb 2025',   title: 'Breaking into AI Engineering from a Non-CS Background',   author: 'Imane Chakir',               readTime: '7 min',  excerpt: 'How three Moroccan engineers switched to ML/AI roles — their paths, resources, and lessons learned.' },
  { id: 'a5', slug: '#', tag: 'AI Safety',        featured: false, date: 'Jan 2025',   title: 'AI Alignment Matters for Africa Too',                     author: 'Dr. Amine Kadi',             readTime: '9 min',  excerpt: 'Why AI safety research is not just a Western concern, and what African researchers can contribute to alignment.' },
  { id: 'a6', slug: '#', tag: 'Computer Vision',  featured: false, date: 'Dec 2024',   title: 'Vision Models for African Agriculture: Promises and Gaps', author: 'Sara Hmimou',                readTime: '11 min', excerpt: 'Assessing where CV models help and fail for crop disease detection, soil analysis, and yield prediction across African contexts.' },
  { id: 'a7', slug: '#', tag: 'LLMs',             featured: false, date: 'Nov 2024',   title: 'Prompting in Darija: Tips for Better Results',            author: 'Mehdi Lahlou',               readTime: '6 min',  excerpt: 'Practical prompting strategies for getting useful outputs from LLMs when working in Moroccan Darija.' },
]

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

export default function AIInsightsPage() {
  const [activeTag, setActiveTag] = useState('All')
  const filtered = ARTICLES.filter((a) => activeTag === 'All' || a.tag === activeTag)
  const [featured, ...rest] = filtered

  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
        <div className="absolute inset-0 zellige-pattern opacity-[0.016]" />
        <div className="absolute top-0 end-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 100% 0%, rgba(200,32,47,0.05), transparent 65%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-label text-bone/40 mb-8 flex items-center gap-3">
            <span className="w-6 h-px bg-red inline-block" />AI Insights
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.9, ease: EXPO }} className="text-display-xl text-bone max-w-3xl mb-8">
            Ideas from the<br />
            <em className="not-italic font-light italic" style={{ color: '#C8202F' }}>Moroccan AI</em> community.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="text-bone/42 text-base leading-relaxed max-w-xl">
            Research summaries, tutorials, opinion pieces, and perspectives from
            MoroccoAI contributors and the broader AI community.
          </motion.p>
        </div>
      </section>

      {/* Tag filter */}
      <section className="bg-[#0D0D10] border-y border-bone/[0.06] sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-4">
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button key={t} onClick={() => setActiveTag(t)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                  activeTag === t ? 'bg-red/90 text-bone' : 'text-bone/30 hover:text-bone/60 hover:bg-bone/[0.04]'
                }`}>{t}</button>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-ink py-20 min-h-[40vh]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <p className="text-bone/30 text-sm py-20 text-center">No articles in this category yet.</p>
            ) : (
              <motion.div layout>
                {/* Featured */}
                {featured && (
                  <motion.div layout key={featured.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EXPO }}
                    className="mb-8">
                    <Link href={featured.slug}
                      className="group relative flex flex-col lg:flex-row gap-0 bg-[#111114] border border-bone/[0.08] hover:border-bone/16 rounded-2xl overflow-hidden transition-all duration-500">
                      {/* Featured accent strip */}
                      <div className="h-0.5 lg:h-auto lg:w-0.5 bg-red/50 shrink-0" />
                      <div className="p-8 lg:p-12 flex-1">
                        <div className="flex items-center gap-3 mb-5">
                          <span className="text-label text-[0.58rem] text-red/75 border border-red/25 px-2.5 py-1 rounded-full">{featured.tag}</span>
                          <span className="text-label text-[0.58rem] text-bone/25">Featured</span>
                          <span className="text-bone/20 text-xs ms-auto">{featured.date}</span>
                        </div>
                        <h2 className="text-display-md text-bone mb-4 max-w-2xl group-hover:text-bone/90 transition-colors">
                          {featured.title}
                        </h2>
                        <p className="text-bone/42 text-base leading-relaxed mb-6 max-w-2xl">{featured.excerpt}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-bone/45 text-sm font-medium">{featured.author}</span>
                          <span className="text-bone/22 text-xs">{featured.readTime} read</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}

                {/* Grid */}
                {rest.length > 0 && (
                  <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {rest.map((a, i) => (
                      <motion.article key={a.id} layout
                        initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.4, delay: i * 0.04, ease: EXPO }}
                        className="group bg-[#111114] border border-bone/[0.06] hover:border-bone/14 rounded-2xl p-7 transition-all duration-500 flex flex-col">
                        <div className="flex items-center gap-3 mb-5">
                          <span className="text-label text-[0.58rem] border border-bone/[0.1] text-bone/40 px-2.5 py-1 rounded-full">
                            {a.tag}
                          </span>
                          <span className="text-bone/20 text-xs ms-auto">{a.date}</span>
                        </div>
                        <Link href={a.slug}>
                          <h3 className="text-bone font-semibold text-base leading-snug mb-3 group-hover:text-bone/90 transition-colors">
                            {a.title}
                          </h3>
                        </Link>
                        <p className="text-bone/35 text-sm leading-relaxed mb-5 flex-1">{a.excerpt}</p>
                        <div className="flex items-center gap-3 pt-4 border-t border-bone/[0.06]">
                          <span className="text-bone/45 text-xs font-medium flex-1">{a.author}</span>
                          <span className="text-bone/22 text-xs">{a.readTime}</span>
                        </div>
                      </motion.article>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  )
}
