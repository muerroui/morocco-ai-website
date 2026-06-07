import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { getAllWebinars } from '@/lib/queries'
import type { Webinar } from '@/lib/types'
import WebinarsContent from './WebinarsContent'

export const metadata: Metadata = {
  title: 'Webinars',
  description: 'Monthly AI webinars from world-class researchers — free, bilingual, and online. MoroccoAI webinar series.',
}

export default async function WebinarsPage() {
  const webinars: Webinar[] = await client.fetch(getAllWebinars)
  return <WebinarsContent webinars={webinars} />
}
