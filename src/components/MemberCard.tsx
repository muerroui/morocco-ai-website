import Image from 'next/image'
import type { Member } from '@/lib/types'
import { urlFor } from '@/lib/image'

export default function MemberCard({ member }: { member: Member }) {
  return (
    <div className="group relative bg-[#1A1A2E] border border-white/5 rounded-xl overflow-hidden p-6 flex flex-col items-center text-center hover:border-white/20 hover:shadow-xl hover:shadow-[#C0272D]/10 transition-all duration-300">
      {/* Gradient top bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C0272D] to-[#1B2A6B]" />

      {/* Photo */}
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-[#0D0D1A] mb-4 ring-1 ring-white/10 group-hover:ring-[#C0272D]/60 transition-all duration-300">
        {member.image ? (
          <>
            <Image
              src={urlFor(member.image).width(160).height(160).url()}
              alt={member.name}
              fill
              sizes="80px"
              className="object-cover duotone group-hover:filter-none transition-all duration-400"
            />
            <div className="absolute inset-0 bg-[#1B2A6B]/50 group-hover:opacity-0 transition-opacity duration-300" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-[#1B2A6B] to-[#0D0D1A]">
            <span className="text-xl font-black text-white/80 select-none">
              {member.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')}
            </span>
          </div>
        )}
      </div>

      <h3 className="text-sm font-bold text-white mb-1 leading-tight">{member.name}</h3>

      {member.role && (
        <p className="text-xs font-semibold text-[#C0272D] uppercase tracking-wide mb-3 line-clamp-2">
          {member.role}
        </p>
      )}

      {member.bio && (
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">{member.bio}</p>
      )}

      {member.researchAreas && member.researchAreas.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mb-3">
          {member.researchAreas.slice(0, 3).map((area) => (
            <span
              key={area}
              className="text-[10px] bg-[#1B2A6B]/40 border border-[#1B2A6B]/60 text-gray-400 px-2 py-0.5 rounded-full"
            >
              {area}
            </span>
          ))}
        </div>
      )}

      {member.linkedinUrl && (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          className="text-gray-600 hover:text-[#C0272D] transition-colors mt-auto"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </a>
      )}
    </div>
  )
}
