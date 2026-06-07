import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { getAllMembers } from '@/lib/queries'
import type { Member } from '@/lib/types'
import MemberCard from '@/components/MemberCard'
import Link from 'next/link'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About',
  description:
    'Morocco.AI is a non-profit community advancing AI in Morocco and Africa through education, events, and research collaboration.',
}

const MILESTONES = [
  { year: '2019', text: 'Morocco.AI founded by a group of Moroccan AI researchers and practitioners passionate about democratizing AI education in Africa.' },
  { year: '2020', text: 'Launched our first webinar series during the COVID-19 pandemic, connecting Moroccan AI talent virtually across the globe.' },
  { year: '2021', text: 'Organized the 1st MoroccoAI Annual Conference — the largest AI event in North Africa, attracting 1,200+ participants from 15+ countries.' },
  { year: '2022', text: 'Expanded to 300+ members, held the 2nd Annual Conference in Casablanca, and launched structured webinar tracks covering NLP, CV, and ML theory.' },
  { year: '2023', text: 'Crossed 400+ community members, hosted the 3rd Annual Conference, and partnered with international AI labs and universities.' },
  { year: '2024', text: 'Reached 500+ members across 15+ countries. Held the 4th Annual Conference with 900+ attendees and launched the MoroccoAI Fellowship program.' },
]

export default async function AboutPage() {
  const members = await client.fetch<Member[]>(getAllMembers)
  const boardMembers = members.slice(0, 8)

  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-red uppercase tracking-widest mb-3">Our Story</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">About Morocco.AI</h1>
          <p className="text-xl text-navy-tint leading-relaxed">
            A non-profit community of AI researchers, engineers, and enthusiasts
            dedicated to advancing artificial intelligence in Morocco and across Africa.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-navy rounded-2xl p-8 text-white">
            <div className="w-12 h-12 bg-red rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-navy-tint leading-relaxed">
              Morocco.AI's mission is to build a vibrant AI ecosystem in Morocco and Africa by
              democratizing access to AI knowledge and education, fostering collaboration between
              local talent and the global research community, and driving AI adoption for
              socioeconomic development across the continent.
            </p>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
            <div className="w-12 h-12 bg-navy-tint rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-navy mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              We envision a future where Morocco and Africa are active contributors to —
              not just consumers of — the global AI revolution. A future where local researchers
              publish at top venues, where African AI startups solve African problems, and where
              every aspiring AI practitioner has access to world-class resources and mentorship,
              regardless of their background or location.
            </p>
          </div>
        </div>
      </section>

      {/* What we do */}
      <section className="bg-navy-tint py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-navy">What We Do</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🎓',
                title: 'Education',
                desc: 'Monthly webinars led by world-class researchers and practitioners on cutting-edge AI topics.',
              },
              {
                icon: '🏆',
                title: 'Conferences',
                desc: 'Annual conference bringing together the North African and global AI community in Casablanca.',
              },
              {
                icon: '🤝',
                title: 'Networking',
                desc: 'A growing network of 500+ AI professionals across Morocco, Africa, and the diaspora.',
              },
              {
                icon: '🔬',
                title: 'Research',
                desc: 'Supporting AI research addressing challenges relevant to Morocco and the African continent.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-bold text-navy mb-2">{item.title}</h4>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-red uppercase tracking-widest mb-2">Our Journey</p>
          <h2 className="text-3xl font-extrabold text-navy">History</h2>
        </div>
        <div className="space-y-6">
          {MILESTONES.map((m) => (
            <div key={m.year} className="flex gap-6 items-start">
              <div className="shrink-0 w-16 h-16 bg-navy rounded-xl flex items-center justify-center text-white font-bold text-sm">
                {m.year}
              </div>
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex-1">
                <p className="text-gray-700">{m.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Board / Team */}
      <section className="bg-navy-tint py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-red uppercase tracking-widest mb-2">People</p>
            <h2 className="text-3xl font-extrabold text-navy mb-3">Team &amp; Community</h2>
            <p className="text-gray-500">The people driving Morocco.AI forward.</p>
          </div>

          {boardMembers.length === 0 ? (
            <p className="text-center text-gray-400">
              Run the import script to load member profiles from Sanity.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {boardMembers.map((m) => (
                  <MemberCard key={m._id} member={m} />
                ))}
              </div>
              {members.length > 8 && (
                <div className="text-center mt-8">
                  <Link href="/members" className="text-navy font-semibold hover:text-navy-light transition-colors">
                    View all {members.length} members →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
