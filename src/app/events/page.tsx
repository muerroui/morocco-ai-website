import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { getAllEvents } from '@/lib/queries'
import type { Event } from '@/lib/types'
import EventsContent from './EventsContent'

export const metadata: Metadata = {
  title: 'Events',
  description: 'MoroccoAI conferences, workshops, hackathons, and community meetups across Morocco and the diaspora.',
}

export default async function EventsPage() {
  const events: Event[] = await client.fetch(getAllEvents)
  return <EventsContent events={events} />
}
