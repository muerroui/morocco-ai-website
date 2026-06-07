import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { getAllEvents } from '@/lib/queries'
import type { Event } from '@/lib/types'
import EventCard from '@/components/EventCard'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Events',
  description: 'Upcoming and past Morocco.AI events including conferences, workshops, and hackathons.',
}

export default async function EventsPage() {
  const events = await client.fetch<Event[]>(getAllEvents)

  const now = new Date()
  const upcoming = events.filter((e) => new Date(e.date) >= now)
  const past = events.filter((e) => new Date(e.date) < now)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <p className="text-sm font-semibold text-red uppercase tracking-widest mb-2">Community</p>
        <h1 className="text-4xl font-extrabold text-navy mb-3">Events</h1>
        <p className="text-gray-500 max-w-xl">
          Conferences, hackathons, workshops, and networking events across Morocco and Africa.
        </p>
      </div>

      {events.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              _id: 'p1',
              title: 'Morocco.AI Annual Conference',
              slug: { current: '#' },
              date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              location: 'Rabat, Morocco',
              description: 'The premier AI event in Morocco. Details coming soon.',
            },
            {
              _id: 'p2',
              title: 'AI Workshop — Getting Started',
              slug: { current: '#' },
              date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
              location: 'Casablanca, Morocco',
              description: 'Hands-on workshop for AI beginners. Stay tuned for registration.',
            },
          ].map((e) => (
            <EventCard key={e._id} event={e as Event} />
          ))}
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-14">
              <h2 className="text-2xl font-bold text-navy mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcoming.map((e) => (
                  <EventCard key={e._id} event={e} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-navy mb-6">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {past.map((e) => (
                  <EventCard key={e._id} event={e} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
