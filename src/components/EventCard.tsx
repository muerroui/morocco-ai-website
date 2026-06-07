import Link from 'next/link'
import type { Event } from '@/lib/types'

function formatEventDate(dateString: string) {
  const d = new Date(dateString)
  return {
    day: d.toLocaleDateString('en-US', { day: '2-digit' }),
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    year: d.getFullYear(),
    full: d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  }
}

export default function EventCard({ event }: { event: Event }) {
  const date = formatEventDate(event.date)
  const isPast = new Date(event.date) < new Date()

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-0">
      <div className="bg-red text-white flex flex-col items-center justify-center px-5 py-4 min-w-[72px] shrink-0">
        <span className="text-2xl font-extrabold leading-none">{date.day}</span>
        <span className="text-xs font-semibold tracking-wider mt-1">{date.month}</span>
        <span className="text-xs opacity-75 mt-0.5">{date.year}</span>
      </div>

      <div className="p-5 flex flex-col flex-1 min-w-0">
        <h3 className="text-base font-bold text-navy leading-snug mb-1 line-clamp-2">
          {event.title}
        </h3>

        {event.location && (
          <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{event.location}</span>
          </div>
        )}

        {event.description && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{event.description}</p>
        )}

        <div className="mt-auto">
          {!isPast && event.registrationUrl ? (
            <a
              href={event.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-semibold text-white bg-red px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
            >
              Register
            </a>
          ) : (
            <Link
              href={`/events`}
              className="inline-block text-sm font-semibold text-navy border border-navy px-4 py-1.5 rounded-lg hover:bg-red-tint transition-colors"
            >
              {isPast ? 'View Details' : 'Learn More'}
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}
