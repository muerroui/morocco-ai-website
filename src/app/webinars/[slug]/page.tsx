import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { client } from '@/lib/sanity'
import { getAllWebinars, getWebinarBySlug } from '@/lib/queries'
import type { Webinar } from '@/lib/types'
import { urlFor, extractYouTubeId, formatDate } from '@/lib/image'

export const revalidate = 3600

export async function generateStaticParams() {
  const webinars = await client.fetch<Webinar[]>(getAllWebinars)
  return webinars.map((w) => ({ slug: w.slug.current }))
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
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
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const webinar = await client.fetch<Webinar>(getWebinarBySlug, { slug })
  if (!webinar) notFound()

  const ytId = webinar.youtubeUrl ? extractYouTubeId(webinar.youtubeUrl) : null

  return (
    <div className="bg-ink min-h-screen">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-24 lg:pt-40">
        <Link href="/webinars"
          className="inline-flex items-center gap-2 text-bone/32 hover:text-bone/65 transition-colors text-xs font-semibold tracking-[0.15em] uppercase mb-12">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All Webinars
        </Link>

        {webinar.tags && webinar.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {webinar.tags.map((tag) => (
              <span key={tag} className="text-label text-[0.58rem] px-2.5 py-1 rounded-full border border-red/25 text-red/75">
                {tag}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-display-md text-bone mb-4 max-w-3xl">{webinar.title}</h1>
        <p className="text-bone/30 text-sm mb-12">{formatDate(webinar.date)}</p>

        {ytId ? (
          <div className="aspect-video w-full rounded-2xl overflow-hidden mb-12 border border-bone/[0.06]">
            <iframe src={`https://www.youtube.com/embed/${ytId}`} title={webinar.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen className="w-full h-full" />
          </div>
        ) : (
          <div className="aspect-video w-full rounded-2xl bg-[#111114] border border-bone/[0.06] flex items-center justify-center mb-12">
            <p className="text-bone/22 text-sm">Recording coming soon</p>
          </div>
        )}

        {webinar.description && (
          <div className="bg-[#111114] border border-bone/[0.06] rounded-2xl p-8 mb-6">
            <p className="text-label text-bone/28 text-[0.62rem] mb-4 flex items-center gap-3">
              <span className="w-6 h-px bg-red inline-block" />About this Webinar
            </p>
            <p className="text-bone/52 leading-relaxed">{webinar.description}</p>
          </div>
        )}

        <div className="bg-[#111114] border border-bone/[0.06] rounded-2xl p-8">
          <p className="text-label text-bone/28 text-[0.62rem] mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-red inline-block" />Speaker
          </p>
          <div className="flex items-start gap-5">
            <div className="relative w-14 h-14 rounded-full overflow-hidden bg-navy/20 border border-navy/30 shrink-0">
              {webinar.speakerImage ? (
                <Image src={urlFor(webinar.speakerImage).url()} alt={webinar.speakerName}
                  fill sizes="56px" className="object-cover" unoptimized />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="font-display font-light text-bone/45 text-xl">
                    {webinar.speakerName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-bone text-base">{webinar.speakerName}</h3>
              {webinar.speakerBio && (
                <p className="text-bone/40 text-sm mt-1 leading-relaxed">{webinar.speakerBio}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}