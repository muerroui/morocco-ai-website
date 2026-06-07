import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Podcasts',
  description: 'Morocco.AI podcasts — in-depth conversations on AI, research, careers, and technology in Morocco and Africa.',
}

const EPISODES = [
  { id: 1, title: 'The State of AI in Morocco: Challenges and Opportunities', description: 'A deep dive into the current AI landscape in Morocco, the talent ecosystem, and what needs to happen to accelerate adoption across industries.', duration: '52 min', date: 'Feb 10, 2025', guests: ['Dr. Nadia Benchekroun', 'Karim Tazi'] },
  { id: 2, title: 'Building NLP for Arabic and Darija', description: 'The technical and cultural challenges of building natural language processing systems for Moroccan Darija and Modern Standard Arabic.', duration: '45 min', date: 'Jan 20, 2025', guests: ['Prof. Abdelhak Mouradi'] },
  { id: 3, title: 'AI for Healthcare in Africa: A Conversation with Pioneers', description: 'How AI is being used to improve diagnostics, drug discovery, and healthcare access across the African continent.', duration: '58 min', date: 'Dec 5, 2024', guests: ['Dr. Soukaina El Alami', 'Yassine Benali'] },
  { id: 4, title: 'From Student to AI Engineer: Navigating the Path', description: 'Career advice, learning resources, and personal stories from Moroccan AI engineers who built careers in AI from scratch.', duration: '41 min', date: 'Nov 15, 2024', guests: ['Zineb Hajji', 'Omar Fakhreddine'] },
  { id: 5, title: 'AI Policy and Ethics in the Arab World', description: 'Exploring AI governance frameworks, ethical considerations, and policy recommendations relevant to Morocco and the MENA region.', duration: '49 min', date: 'Oct 28, 2024', guests: ['Prof. Mohammed Benbrahim'] },
]

const PLATFORMS = ['Spotify', 'Apple Podcasts', 'YouTube', 'Google Podcasts']

export default function PodcastsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
        <div className="absolute inset-0 zellige-pattern opacity-[0.016]" />
        <div className="absolute bottom-0 start-0 w-[500px] h-[500px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 0% 100%, rgba(31,42,92,0.12), transparent 65%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <p className="text-label text-bone/40 mb-8 flex items-center gap-3">
            <span className="w-6 h-px bg-red inline-block" />Podcasts
          </p>
          <h1 className="text-display-xl text-bone mb-8 max-w-3xl">
            Conversations at the<br />
            <em className="not-italic font-light italic" style={{ color: '#C8202F' }}>edge</em> of African AI.
          </h1>
          <p className="text-bone/42 text-base leading-relaxed max-w-xl">
            In-depth conversations with researchers, engineers, and entrepreneurs shaping
            the AI landscape across Morocco and Africa.
          </p>

          {/* Platform badges */}
          <div className="flex flex-wrap items-center gap-6 mt-10">
            <span className="text-label text-bone/22 text-[0.6rem]">Available on</span>
            {PLATFORMS.map((p) => (
              <span key={p} className="text-bone/35 text-xs font-semibold hover:text-bone/65 transition-colors cursor-default">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Episodes */}
      <section className="bg-[#0D0D10] py-28 lg:py-36">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12">
          <p className="text-label text-bone/40 mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-red inline-block" />Episodes
          </p>
          <h2 className="text-display-md text-bone mb-16">Latest episodes.</h2>

          <div className="space-y-4">
            {EPISODES.map((ep, i) => (
              <div key={ep.id}
                className="group bg-[#111114] border border-bone/[0.06] hover:border-bone/14 rounded-2xl p-7 transition-all duration-300 overflow-hidden relative">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse 60% 60% at 0% 50%, rgba(31,42,92,0.06), transparent)' }} />

                <div className="flex items-start gap-6">
                  {/* Episode number */}
                  <div className="shrink-0 pt-0.5">
                    <span className="font-display font-light text-bone/10 text-5xl leading-none"
                      style={{ letterSpacing: '-0.04em' }}>
                      {String(ep.id).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="text-bone/22 text-xs">{ep.date}</span>
                      <span className="w-0.5 h-0.5 rounded-full bg-bone/20" />
                      <span className="text-bone/22 text-xs">{ep.duration}</span>
                    </div>
                    <h3 className="text-bone font-semibold text-base leading-snug mb-3 group-hover:text-bone/90 transition-colors">
                      {ep.title}
                    </h3>
                    <p className="text-bone/35 text-sm leading-relaxed mb-4">{ep.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {ep.guests.map((g) => (
                        <span key={g}
                          className="text-bone/45 text-xs border border-bone/[0.08] px-3 py-1 rounded-full">{g}</span>
                      ))}
                    </div>
                  </div>

                  {/* Play button */}
                  <button className="shrink-0 w-11 h-11 rounded-full border border-bone/10 flex items-center justify-center text-bone/25 hover:border-red/40 hover:text-red/70 transition-all duration-300 group-hover:border-bone/20 group-hover:text-bone/45"
                    aria-label={`Listen to episode ${ep.id}`}>
                    <svg className="w-4 h-4 ms-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Suggest CTA */}
      <section className="bg-ink border-t border-bone/[0.05] py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <p className="text-label text-bone/35 mb-3 flex items-center gap-3">
                <span className="w-6 h-px bg-red inline-block" />Want to collaborate?
              </p>
              <p className="text-bone/45 max-w-sm leading-relaxed">
                Have an idea for an episode or want to be a guest? We&apos;d love to hear from you.
              </p>
            </div>
            <Link href="/newsletter"
              className="shrink-0 inline-flex items-center gap-2 bg-red text-bone px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-red-900 transition-colors duration-300">
              Get in Touch
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
