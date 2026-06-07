import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { getAllMembers } from '@/lib/queries'
import type { Member } from '@/lib/types'
import MemberCard from '@/components/MemberCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Members',
  description: 'Meet the Morocco.AI community members — researchers, engineers, and AI enthusiasts from across Africa.',
}

export default async function MembersPage() {
  const members = await client.fetch<Member[]>(getAllMembers)

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-14">
        <p className="text-xs font-bold text-[#C0272D] uppercase tracking-[0.3em] mb-3">Community</p>
        <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 uppercase tracking-tight">
          Our Members
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
          Researchers, engineers, entrepreneurs, and AI enthusiasts building Africa&apos;s AI future.
        </p>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-sm uppercase tracking-widest">Member profiles coming soon.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {members.map((m) => (
            <MemberCard key={m._id} member={m} />
          ))}
        </div>
      )}
    </div>
    </div>
  )
}
