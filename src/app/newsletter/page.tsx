import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Newsletter',
  description: 'Subscribe to the Morocco.AI newsletter — AI news, webinar announcements, and community updates.',
}

const ARCHIVES = [
  { issue: 18, title: 'Generative AI Adoption in Moroccan Enterprises', date: 'May 2025' },
  { issue: 17, title: 'Highlights from Morocco.AI Conference 2024', date: 'December 2024' },
  { issue: 16, title: 'NLP for Arabic: State of the Art in 2024', date: 'November 2024' },
  { issue: 15, title: 'AI Startups in Morocco: A Growing Ecosystem', date: 'October 2024' },
  { issue: 14, title: 'Understanding Transformer Architectures', date: 'September 2024' },
  { issue: 13, title: 'AI for Climate: Applications in Africa', date: 'August 2024' },
]

const BENEFITS = [
  { icon: '📬', title: 'Monthly Deep Dives', desc: 'Curated AI research and news relevant to Morocco and Africa.' },
  { icon: '🎤', title: 'Webinar Previews', desc: 'Early access to webinar announcements and speaker reveals.' },
  { icon: '💼', title: 'Opportunities', desc: 'Jobs, grants, fellowships, and calls for papers in AI.' },
  { icon: '🌍', title: 'Community Spotlights', desc: 'Stories from Morocco.AI members building the AI ecosystem.' },
]

export default function NewsletterPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-red uppercase tracking-widest mb-3">Stay Connected</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-5">
            The Morocco.AI Newsletter
          </h1>
          <p className="text-xl text-navy-tint leading-relaxed mb-10">
            AI news, community updates, and opportunities — delivered to your inbox once a month.
            No spam. Unsubscribe anytime.
          </p>

          {/* Signup form */}
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
          >
            <input
              type="text"
              placeholder="Your full name"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red text-sm"
              required
            />
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-red text-sm"
              required
            />
            <button
              type="submit"
              className="bg-red text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity whitespace-nowrap text-sm"
            >
              Subscribe Free
            </button>
          </form>
          <p className="text-xs text-navy-tint opacity-60 mt-3">
            Joining 500+ subscribers across Africa and the diaspora.
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-navy">What You&apos;ll Get</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
              <div className="text-3xl mb-3">{b.icon}</div>
              <h3 className="font-bold text-navy mb-2">{b.title}</h3>
              <p className="text-sm text-gray-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Archives */}
      <section className="bg-navy-tint py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-sm font-semibold text-red uppercase tracking-widest mb-2">Archives</p>
            <h2 className="text-3xl font-extrabold text-navy">Past Issues</h2>
          </div>

          <div className="space-y-3">
            {ARCHIVES.map((issue) => (
              <div
                key={issue.issue}
                className="bg-white rounded-xl px-6 py-4 shadow-sm border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-red bg-red-tint px-2.5 py-0.5 rounded-full">
                    #{issue.issue}
                  </span>
                  <div>
                    <p className="font-semibold text-navy text-sm">{issue.title}</p>
                    <p className="text-xs text-gray-400">{issue.date}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-300 font-medium">Coming soon</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
