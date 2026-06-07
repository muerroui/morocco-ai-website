import Image from 'next/image'
import Link from 'next/link'
import type { Webinar } from '@/lib/types'
import { urlFor, extractYouTubeId, formatDate } from '@/lib/image'

export default function WebinarCard({ webinar }: { webinar: Webinar }) {
  const ytId = webinar.youtubeUrl ? extractYouTubeId(webinar.youtubeUrl) : null
  const sanityThumb = webinar.thumbnail ? urlFor(webinar.thumbnail).url() : null
  const thumbUrl = sanityThumb ?? (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null)

  return (
    <article className="bg-[#1A1A2E] border border-white/5 rounded-xl overflow-hidden hover:border-white/20 hover:shadow-2xl hover:shadow-[#C0272D]/10 transition-all duration-300 flex flex-col group">
      {/* Red gradient top bar */}
      <div className="h-[3px] bg-gradient-to-r from-[#C0272D] via-[#E03030] to-[#1B2A6B]" />

      <div className="relative h-44 bg-[#0D0D1A] overflow-hidden">
        {thumbUrl ? (
          <>
            <Image
              src={thumbUrl}
              alt={webinar.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover duotone opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              unoptimized={!!sanityThumb}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-transparent to-transparent" />
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-dot-pattern">
            <svg className="w-12 h-12 text-[#1B2A6B] opacity-40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-sm font-bold text-white leading-snug mb-3 line-clamp-2 uppercase tracking-wide">
          {webinar.title}
        </h3>
        <p className="text-xs text-gray-400 mb-1 font-medium">{webinar.speakerName}</p>
        <p className="text-xs text-gray-600 mb-4">{formatDate(webinar.date)}</p>

        {webinar.tags && webinar.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {webinar.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-[#1B2A6B]/40 text-[#C0272D] border border-[#1B2A6B]/60 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex gap-2">
          <Link
            href={`/webinars/${webinar.slug.current}`}
            className="flex-1 text-center text-xs font-bold text-white/70 border border-white/15 rounded-lg py-2.5 hover:text-white hover:border-white/40 transition-all uppercase tracking-widest"
          >
            Details
          </Link>
          {webinar.youtubeUrl && (
            <a
              href={webinar.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-xs font-bold text-white bg-[#C0272D] rounded-lg py-2.5 hover:opacity-90 transition-opacity uppercase tracking-widest"
            >
              WATCH →
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
