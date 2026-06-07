import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { getAllWebinars } from '@/lib/queries'
import type { Webinar } from '@/lib/types'
import WebinarCard from '@/components/WebinarCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Webinars',
  description: 'Browse all Morocco.AI webinars on artificial intelligence, machine learning, and more.',
}

const YEARS = ['2025', '2024', '2023', '2022', '2021']

export default async function WebinarsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>
}) {
  const { year } = await searchParams
  const webinars = await client.fetch<Webinar[]>(getAllWebinars)

  const filtered = year
    ? webinars.filter((w) => new Date(w.date).getFullYear().toString() === year)
    : webinars

  return (
    <div className="min-h-screen bg-[#0A0A0A] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <p className="text-xs font-bold text-[#C0272D] uppercase tracking-[0.3em] mb-3">Learn &amp; Grow</p>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 uppercase tracking-tight">Webinars</h1>
          <p className="text-gray-500 max-w-xl text-sm leading-relaxed">
            Expert-led sessions on AI, machine learning, and technology for Morocco and Africa.
          </p>
        </div>

        {/* Year filter */}
        <div className="flex flex-wrap gap-2 mb-10">
          <a
            href="/webinars"
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
              !year
                ? 'bg-[#C0272D] text-white'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            All
          </a>
          {YEARS.map((y) => (
            <a
              key={y}
              href={`/webinars?year=${y}`}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                year === y
                  ? 'bg-[#C0272D] text-white'
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/30 hover:text-white'
              }`}
            >
              {y}
            </a>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-sm uppercase tracking-widest">
              No webinars found{year ? ` for ${year}` : ''}.
            </p>
            {year && (
              <a href="/webinars" className="mt-4 inline-block text-[#C0272D] text-xs font-bold uppercase tracking-widest hover:opacity-80">
                View all webinars →
              </a>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-600 uppercase tracking-widest mb-8">
              {filtered.length} webinar{filtered.length !== 1 ? 's' : ''}
              {year ? ` in ${year}` : ''}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((w) => (
                <WebinarCard key={w._id} webinar={w} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
