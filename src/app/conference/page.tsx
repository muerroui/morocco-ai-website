import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Conference',
  description: 'MoroccoAI Annual Conference — the premier AI event in North Africa.',
}

const CONFERENCES = [
  {
    year: '2024',
    title: 'MoroccoAI Annual Conference 2024',
    date: 'November 2024',
    location: 'Casablanca, Morocco',
    description:
      'The fourth edition of the MoroccoAI Annual Conference brought together leading AI researchers, practitioners, and industry leaders. Topics included Generative AI, Large Language Models, AI for healthcare, and the role of AI in African development. The event featured keynote speakers from top research institutions and global tech companies alongside local innovators.',
    highlights: ['900+ Attendees', '30+ Speakers', '3 Workshops', '12+ Countries'],
    link: null,
  },
  {
    year: '2023',
    title: 'MoroccoAI Annual Conference 2023',
    date: 'November 2023',
    location: 'Casablanca, Morocco',
    description:
      'The third edition explored AI in industry and society: NLP, computer vision, AI ethics, and applications in healthcare, agriculture, and fintech across Africa. The conference featured panel discussions on AI policy in Morocco and the MENA region, and workshops on applied machine learning.',
    highlights: ['700+ Attendees', '25+ Speakers', '4 Panels', '10 Countries'],
    link: null,
  },
  {
    year: '2022',
    title: 'MoroccoAI Annual Conference 2022',
    date: 'October 2022',
    location: 'Casablanca, Morocco',
    description:
      'The second in-person edition drew an international audience to explore NLP in Arabic and Darija, computer vision, reinforcement learning, and AI talent development in Africa. The conference included a career fair connecting attendees with AI-focused companies hiring in Morocco.',
    highlights: ['500+ Attendees', '20+ Speakers', '2 Workshops', '8 Countries'],
    link: null,
  },
  {
    year: '2021',
    title: 'MoroccoAI Annual Conference 2021',
    date: 'November 2021',
    location: 'Casablanca, Morocco (Hybrid)',
    description:
      'The inaugural edition of the MoroccoAI Annual Conference launched a new tradition of bringing the Moroccan and African AI community together. The hybrid format allowed both in-person and remote participation. Topics spanned AI fundamentals, research frontiers, machine learning applications, and building Morocco\'s AI ecosystem.',
    highlights: ['1,200+ Viewers', '20+ Speakers', '15+ Countries', 'Hybrid Format'],
    link: null,
  },
]

export default function ConferencePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-red uppercase tracking-widest mb-3">Annual Event</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
            MoroccoAI Annual Conference
          </h1>
          <p className="text-xl text-navy-tint leading-relaxed">
            The premier AI conference in North Africa — connecting researchers, practitioners,
            entrepreneurs, and policymakers to advance AI in Morocco and beyond.
          </p>
        </div>
      </section>

      {/* 2025 Coming Soon */}
      <section className="bg-red-tint border-y border-red border-opacity-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-navy">MoroccoAI Annual Conference 2025 — Coming Soon</p>
            <p className="text-sm text-gray-600">
              Stay tuned for dates, venue, and speaker announcements.
            </p>
          </div>
          <Link
            href="/newsletter"
            className="shrink-0 bg-navy text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-navy-light transition-colors"
          >
            Get Notified
          </Link>
        </div>
      </section>

      {/* Past conferences */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-12">
          <p className="text-sm font-semibold text-red uppercase tracking-widest mb-2">History</p>
          <h2 className="text-3xl font-extrabold text-navy">Past Conferences</h2>
        </div>

        <div className="space-y-8">
          {CONFERENCES.map((conf) => (
            <div key={conf.year} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <div className="bg-navy text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">{conf.title}</h3>
                  <p className="text-navy-tint text-sm mt-0.5">
                    {conf.date} &mdash; {conf.location}
                  </p>
                </div>
                <span className="text-3xl font-extrabold text-white opacity-20">{conf.year}</span>
              </div>
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed mb-5">{conf.description}</p>
                <div className="flex flex-wrap gap-2">
                  {conf.highlights.map((h) => (
                    <span key={h} className="text-xs font-semibold bg-navy-tint text-navy px-3 py-1 rounded-full">
                      {h}
                    </span>
                  ))}
                </div>
                {conf.link && (
                  <a href={conf.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-red hover:underline">
                    View recordings →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
