import type { Metadata } from 'next'
import Hero              from '@/components/Hero'
import StatsCounter      from '@/components/StatsCounter'
import SectionDivider    from '@/components/SectionDivider'
import WhatWeDo          from '@/components/WhatWeDo'
import MarqueeSpeakers   from '@/components/MarqueeSpeakers'
import UpcomingEvents    from '@/components/UpcomingEvents'
import ReportManifesto   from '@/components/ReportManifesto'
import NewsletterSection from '@/components/NewsletterSection'
import { client }        from '@/lib/sanity'
import { getAllMembers }  from '@/lib/queries'
import type { Member }   from '@/lib/types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Morocco.AI — Building AI for Morocco. Building AI from Morocco.',
  description:
    "MoroccoAI is Morocco's leading non-profit AI community — advancing AI education, research, and innovation through world-class conferences, webinars, and a growing ecosystem of practitioners.",
}

export default async function HomePage() {
  const members = await client.fetch<Member[]>(getAllMembers)

  return (
    <>
      <Hero />
      <StatsCounter />
      <SectionDivider className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12" />
      <WhatWeDo />
      <SectionDivider />
      <MarqueeSpeakers members={members} />
      <SectionDivider />
      <UpcomingEvents />
      <SectionDivider />
      <ReportManifesto />
      <NewsletterSection />
    </>
  )
}
