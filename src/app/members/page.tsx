import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { getAllMembers } from '@/lib/queries'
import type { Member } from '@/lib/types'
import MemberCard from '@/components/MemberCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Members',
  description: 'Meet the MoroccoAI community — researchers, engineers, and AI enthusiasts from across Africa and the diaspora.',
}

export default async function MembersPage() {
  const members = await client.fetch<Member[]>(getAllMembers)

  return (
    <>
      {/* Hero */}
      <section className="relative bg-ink overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
        <div className="absolute inset-0 zellige-pattern opacity-[0.016]" />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(31,42,92,0.12), transparent 65%)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 text-center">
          <p className="text-label text-bone/40 mb-8 flex items-center justify-center gap-3">
            <span className="w-6 h-px bg-red inline-block" />Community
          </p>
          <h1 className="text-display-xl text-bone mb-8 max-w-3xl mx-auto">
            5,000+ builders<br />
            <em className="not-italic font-light italic" style={{ color: '#C8202F' }}>across Africa.</em>
          </h1>
          <p className="text-bone/42 text-base leading-relaxed max-w-xl mx-auto">
            Researchers, engineers, entrepreneurs, and AI enthusiasts united by a shared
            ambition for Africa&apos;s AI future.
          </p>
        </div>
      </section>

      {/* Members grid */}
      <section className="bg-[#0D0D10] py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {members.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-label text-bone/22 text-[0.62rem]">Member profiles coming soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {members.map((m) => (
                <MemberCard key={m._id} member={m} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-ink border-t border-bone/[0.05] py-20">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
            <div>
              <p className="text-label text-bone/35 mb-3 flex items-center gap-3">
                <span className="w-6 h-px bg-red inline-block" />Join the community
              </p>
              <p className="text-bone/45 max-w-sm leading-relaxed">
                Join 5,000+ AI researchers, engineers, and enthusiasts across Africa and the diaspora.
              </p>
            </div>
            <a href="https://slack.moroccoai.org" target="_blank" rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 bg-red text-bone px-7 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-red-900 transition-colors duration-300">
              Join on Slack
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
