import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Podcasts',
  description: 'Morocco.AI podcasts — conversations on AI, technology, and innovation in Africa.',
}

const EPISODES = [
  {
    id: 1,
    title: 'The State of AI in Morocco: Challenges and Opportunities',
    description:
      'A deep dive into the current AI landscape in Morocco, the talent ecosystem, and what needs to happen to accelerate adoption across industries.',
    duration: '52 min',
    date: '2025-02-10',
    guests: ['Dr. Nadia Benchekroun', 'Karim Tazi'],
    listenUrl: null,
  },
  {
    id: 2,
    title: 'Building NLP for Arabic and Darija',
    description:
      'The technical and cultural challenges of building natural language processing systems for Moroccan Darija and Modern Standard Arabic.',
    duration: '45 min',
    date: '2025-01-20',
    guests: ['Prof. Abdelhak Mouradi'],
    listenUrl: null,
  },
  {
    id: 3,
    title: 'AI for Healthcare in Africa: A Conversation with Pioneers',
    description:
      'How AI is being used to improve diagnostics, drug discovery, and healthcare access across the African continent.',
    duration: '58 min',
    date: '2024-12-05',
    guests: ['Dr. Soukaina El Alami', 'Yassine Benali'],
    listenUrl: null,
  },
  {
    id: 4,
    title: 'From Student to AI Engineer: Navigating the Path',
    description:
      'Career advice, learning resources, and personal stories from Moroccan AI engineers who built careers in AI from scratch.',
    duration: '41 min',
    date: '2024-11-15',
    guests: ['Zineb Hajji', 'Omar Fakhreddine'],
    listenUrl: null,
  },
  {
    id: 5,
    title: 'AI Policy and Ethics in the Arab World',
    description:
      'Exploring AI governance frameworks, ethical considerations, and policy recommendations relevant to Morocco and the MENA region.',
    duration: '49 min',
    date: '2024-10-28',
    guests: ['Prof. Mohammed Benbrahim'],
    listenUrl: null,
  },
]

function formatPodcastDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function PodcastsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-red py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-red uppercase tracking-widest mb-3">Listen</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">Morocco.AI Podcasts</h1>
          <p className="text-xl text-navy-tint">
            In-depth conversations on AI, research, careers, and technology in Morocco and Africa.
          </p>
        </div>
      </section>

      {/* Platforms */}
      <section className="bg-red-tint border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-center gap-6">
          <span className="text-sm font-medium text-gray-500">Available on:</span>
          {['Spotify', 'Apple Podcasts', 'YouTube', 'Google Podcasts'].map((platform) => (
            <span key={platform} className="text-sm font-semibold text-navy opacity-60">
              {platform}
            </span>
          ))}
        </div>
      </section>

      {/* Episodes */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-navy">Episodes</h2>
        </div>

        <div className="space-y-6">
          {EPISODES.map((ep) => (
            <div key={ep.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-red bg-red-tint px-2.5 py-0.5 rounded-full">
                      EP {String(ep.id).padStart(2, '0')}
                    </span>
                    <span className="text-xs text-gray-400">{formatPodcastDate(ep.date)}</span>
                    <span className="text-xs text-gray-400">·</span>
                    <span className="text-xs text-gray-400">{ep.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2 leading-snug">{ep.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{ep.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {ep.guests.map((g) => (
                      <span key={g} className="text-xs bg-red-tint text-navy px-2 py-0.5 rounded-full font-medium">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  className="shrink-0 w-12 h-12 bg-red rounded-full flex items-center justify-center hover:bg-red-light transition-colors"
                  aria-label={`Listen to ${ep.title}`}
                >
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-red rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Suggest a Topic or Guest</h3>
          <p className="text-navy-tint text-sm mb-5">
            Have an idea for an episode or want to be featured? We&apos;d love to hear from you.
          </p>
          <Link
            href="/newsletter"
            className="inline-block bg-red text-white px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </>
  )
}
