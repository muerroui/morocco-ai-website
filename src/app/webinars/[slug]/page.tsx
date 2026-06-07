import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity'
import { getAllWebinars, getWebinarBySlug } from '@/lib/queries'
import type { Webinar } from '@/lib/types'
import { urlFor, extractYouTubeId, formatDate } from '@/lib/image'
import Link from 'next/link'

export const revalidate = 3600

export async function generateStaticParams() {
  const webinars = await client.fetch<Webinar[]>(getAllWebinars)
  return webinars.map((w) => ({ slug: w.slug.current }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const webinar = await client.fetch<Webinar>(getWebinarBySlug, { slug })
  if (!webinar) return { title: 'Webinar Not Found' }
  return {
    title: webinar.title,
    description: webinar.description ?? `A webinar by ${webinar.speakerName}`,
  }
}

export default async function WebinarDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const webinar = await client.fetch<Webinar>(getWebinarBySlug, { slug })
  if (!webinar) notFound()

  const ytId = webinar.youtubeUrl ? extractYouTubeId(webinar.youtubeUrl) : null

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <Link href="/webinars" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-navy transition-colors mb-8">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        All Webinars
      </Link>

      {/* Tags */}
      {webinar.tags && webinar.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {webinar.tags.map((tag) => (
            <span key={tag} className="text-xs bg-navy-tint text-navy px-3 py-1 rounded-full font-medium">
              {tag}
            </span>
          ))}
        </div>
      )}

      <h1 className="text-3xl sm:text-4xl font-extrabold text-navy mb-4 leading-tight">
        {webinar.title}
      </h1>
      <p className="text-gray-400 text-sm mb-10">{formatDate(webinar.date)}</p>

      {/* YouTube embed */}
      {ytId ? (
        <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg mb-10">
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            title={webinar.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      ) : (
        <div className="aspect-video w-full rounded-2xl bg-navy-tint flex items-center justify-center mb-10">
          <p className="text-gray-400">Video not available yet</p>
        </div>
      )}

      {/* Description */}
      {webinar.description && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-10">
          <h2 className="text-lg font-bold text-navy mb-3">About this Webinar</h2>
          <p className="text-gray-600 leading-relaxed">{webinar.description}</p>
        </div>
      )}

      {/* Speaker */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-navy mb-4">Speaker</h2>
        <div className="flex items-start gap-5">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-navy-tint shrink-0">
            {webinar.speakerImage ? (
              <Image
                src={urlFor(webinar.speakerImage).url()}
                alt={webinar.speakerName}
                fill
                sizes="64px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="text-xl font-bold text-navy">
                  {webinar.speakerName.charAt(0)}
                </span>
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-navy text-lg">{webinar.speakerName}</h3>
            {webinar.speakerBio && (
              <p className="text-gray-600 text-sm mt-1 leading-relaxed">{webinar.speakerBio}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
