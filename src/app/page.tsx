import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/lib/sanity'
import { getAllWebinars, getAllEvents, getAllMembers } from '@/lib/queries'
import type { Webinar, Event, Member } from '@/lib/types'
import WebinarCard from '@/components/WebinarCard'
import { urlFor } from '@/lib/image'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Morocco.AI — Advancing AI in Morocco & Africa',
  description:
    'Join Morocco.AI, the leading community advancing artificial intelligence across Morocco and Africa through webinars, conferences, and research.',
}

const PLACEHOLDER_WEBINARS: Webinar[] = [
  {
    _id: 'p1',
    title: 'Introduction to Large Language Models',
    slug: { current: '#' },
    date: '2025-03-15',
    speakerName: 'Dr. Ahmed Benali',
    tags: ['NLP', 'LLMs', 'AI'],
  },
  {
    _id: 'p2',
    title: 'AI for Agriculture in Africa',
    slug: { current: '#' },
    date: '2025-04-20',
    speakerName: 'Fatima Zahra Alami',
    tags: ['AgriTech', 'Machine Learning'],
  },
  {
    _id: 'p3',
    title: 'Computer Vision Applications in Healthcare',
    slug: { current: '#' },
    date: '2025-05-10',
    speakerName: 'Youssef El Mansouri',
    tags: ['Computer Vision', 'Healthcare'],
  },
]

const PLACEHOLDER_EVENTS: Event[] = [
  {
    _id: 'e1',
    title: 'Morocco.AI Annual Conference 2025',
    slug: { current: '#' },
    date: '2025-10-15',
    location: 'Rabat, Morocco',
    description: 'The premier AI conference in Morocco.',
  },
]

const STATS = [
  { value: '500+', label: 'Members' },
  { value: '27', label: 'Webinars' },
  { value: '6', label: 'Conferences' },
  { value: '15+', label: 'Countries' },
]

const CONFERENCES = [
  { year: '2024', title: 'Morocco.AI Annual Conference', location: 'Rabat, Morocco' },
  { year: '2023', title: 'AI & Society Forum', location: 'Casablanca, Morocco' },
  { year: '2022', title: 'North Africa AI Summit', location: 'Marrakech, Morocco' },
  { year: '2021', title: 'Inaugural AI Gathering', location: 'Rabat, Morocco' },
]

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Community',
    desc: 'Connect with 500+ AI researchers, engineers, and enthusiasts across Africa.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Education',
    desc: 'World-class AI webinars, workshops, and learning resources in Arabic, French & English.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Research',
    desc: 'Promoting AI research and innovation relevant to Morocco and African challenges.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Impact',
    desc: 'Driving AI adoption and creating opportunities across 15+ African countries.',
  },
]

/* ── Hero visual — Moroccan arch + AI overlay ── */
function HeroVisual() {
  return (
    <div className="relative w-full h-full min-h-[420px] lg:min-h-0 overflow-hidden rounded-2xl">
      {/* Base dark panel */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D0D1A] via-[#111827] to-[#0A0A0A]" />

      {/* Moroccan geometric zellige pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        viewBox="0 0 400 400"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="zellige" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
            <polygon points="40,0 80,20 80,60 40,80 0,60 0,20" fill="none" stroke="white" strokeWidth="0.8" />
            <polygon points="40,16 64,28 64,52 40,64 16,52 16,28" fill="none" stroke="white" strokeWidth="0.5" />
            <circle cx="40" cy="40" r="6" fill="none" stroke="white" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#zellige)" />
      </svg>

      {/* Moroccan arch silhouette */}
      <svg
        className="absolute bottom-0 right-0 w-3/4 h-auto opacity-20"
        viewBox="0 0 300 350"
        fill="none"
      >
        <path
          d="M60 350 L60 180 Q60 80 150 80 Q240 80 240 180 L240 350 Z"
          stroke="white"
          strokeWidth="1.5"
          fill="rgba(255,255,255,0.03)"
        />
        <path
          d="M80 350 L80 185 Q80 100 150 100 Q220 100 220 185 L220 350 Z"
          stroke="white"
          strokeWidth="0.8"
          fill="none"
          opacity="0.5"
        />
        {/* Inner arch detail */}
        <path
          d="M100 350 L100 195 Q100 125 150 125 Q200 125 200 195 L200 350 Z"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.5"
          fill="rgba(27,42,107,0.2)"
        />
        {/* Arch crown decoration */}
        <circle cx="150" cy="80" r="12" stroke="rgba(192,39,45,0.6)" strokeWidth="1" fill="none" />
        <circle cx="150" cy="80" r="5" fill="rgba(192,39,45,0.4)" />
      </svg>

      {/* Neural network dots overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-60"
        viewBox="0 0 400 400"
        fill="none"
      >
        {/* Nodes */}
        {[
          [40, 60], [80, 140], [50, 220], [100, 300],
          [160, 40], [180, 120], [200, 200], [170, 290],
          [280, 80], [300, 160], [270, 240], [310, 330],
          [360, 120], [350, 220],
        ].map(([cx, cy], i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={i % 3 === 0 ? 3 : 2}
            fill={i % 4 === 0 ? '#C0272D' : 'rgba(255,255,255,0.5)'}
          />
        ))}
        {/* Connection lines */}
        {[
          [40,60,160,40], [80,140,180,120], [50,220,200,200],
          [160,40,280,80], [180,120,300,160], [200,200,270,240],
          [280,80,360,120], [300,160,350,220],
          [80,140,160,40], [180,120,160,40], [200,200,180,120],
        ].map(([x1,y1,x2,y2], i) => (
          <line
            key={i}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="0.8"
          />
        ))}
      </svg>

      {/* Red orb — top right */}
      <div
        className="absolute top-[-60px] right-[-60px] w-48 h-48 rounded-full"
        style={{
          background: 'radial-gradient(circle, #C0272D 0%, rgba(192,39,45,0.3) 50%, transparent 70%)',
          filter: 'blur(2px)',
        }}
      />
      <div
        className="absolute top-[-20px] right-[-20px] w-32 h-32 rounded-full border border-[#C0272D]/40"
      />

      {/* Navy glow bottom-left */}
      <div
        className="absolute bottom-[-40px] left-[-40px] w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #1B2A6B, transparent 70%)',
          filter: 'blur(60px)',
          opacity: 0.7,
        }}
      />

      {/* Corner bracket accents */}
      <div className="absolute top-5 left-5 w-8 h-8 border-t-2 border-l-2 border-[#C0272D]/70 rounded-tl" />
      <div className="absolute top-5 right-5 w-8 h-8 border-t-2 border-r-2 border-[#C0272D]/70 rounded-tr" />
      <div className="absolute bottom-5 left-5 w-8 h-8 border-b-2 border-l-2 border-[#C0272D]/70 rounded-bl" />
      <div className="absolute bottom-5 right-5 w-8 h-8 border-b-2 border-r-2 border-[#C0272D]/70 rounded-br" />

      {/* Floating label */}
      <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-sm border border-white/10 rounded-lg px-3 py-2">
        <p className="text-[10px] text-white/60 uppercase tracking-widest">Powered by Community</p>
        <p className="text-xs text-white font-semibold mt-0.5">Morocco × Africa × AI</p>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-[#C0272D] uppercase tracking-[0.3em] mb-4">{children}</p>
  )
}

export default async function HomePage() {
  const [webinarsRaw, eventsRaw, membersRaw] = await Promise.all([
    client.fetch<Webinar[]>(getAllWebinars),
    client.fetch<Event[]>(getAllEvents),
    client.fetch<Member[]>(getAllMembers),
  ])

  const webinars = webinarsRaw?.length ? webinarsRaw.slice(0, 3) : PLACEHOLDER_WEBINARS
  void eventsRaw
  const members = membersRaw?.length ? membersRaw.slice(0, 6) : []

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative bg-[#0A0A0A] overflow-hidden pt-20">
        {/* Subtle aurora background */}
        <div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #1B2A6B, transparent 65%)',
            filter: 'blur(100px)',
            opacity: 0.4,
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_1fr] gap-10 lg:gap-16 items-center min-h-[88vh] py-12 lg:py-20">

            {/* LEFT — content */}
            <div>
              <SectionLabel>Morocco.AI — AI Community</SectionLabel>

              <h1 className="text-[2.8rem] sm:text-[3.5rem] lg:text-[4rem] xl:text-[4.8rem] font-extrabold text-white leading-[1.08] tracking-tight mb-6">
                Building the AI future{' '}
                <span className="text-[#C0272D]">in Morocco</span>{' '}
                <br className="hidden sm:block" />
                &amp; Africa.
              </h1>

              <p className="text-gray-300 text-base leading-relaxed mb-3 max-w-lg">
                Morocco.AI is the leading community uniting AI builders, researchers, entrepreneurs,
                and enthusiasts across Morocco and Africa.
              </p>
              <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-lg">
                We connect, learn, and build solutions that create real impact — through webinars,
                conferences, and a growing open knowledge ecosystem.
              </p>

              <div className="flex flex-wrap gap-4 items-center">
                <Link
                  href="/newsletter"
                  className="bg-[#C0272D] text-white px-7 py-3.5 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  JOIN COMMUNITY
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/webinars"
                  className="border border-white/25 text-white px-7 py-3.5 rounded-lg text-sm font-bold hover:border-white/60 transition-colors flex items-center gap-2"
                >
                  Explore Webinars
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* RIGHT — visual */}
            <div className="h-[420px] lg:h-[560px]">
              <HeroVisual />
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="bg-[#0A0A0A] pb-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-6 flex gap-4 items-start hover:shadow-lg transition-shadow"
              >
                <div className="shrink-0 w-11 h-11 rounded-lg bg-[#FCEAEA] flex items-center justify-center text-[#C0272D]">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="text-center mb-14">
            <SectionLabel>Who we are</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
              A vibrant community{' '}
              <span className="text-[#C0272D]">across Africa</span>
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              From students to experts, startups to enterprises — we bring people together to learn,
              share, and build the future with AI.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-8 h-[2px] bg-[#C0272D] mx-auto mb-4" />
                <div className="text-4xl sm:text-5xl font-black text-[#1B2A6B] leading-none mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WEBINARS ── */}
      <section className="bg-[#111827] py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-6">
            <div>
              <SectionLabel>Latest Webinars</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Knowledge shared openly
              </h2>
            </div>
            <Link
              href="/webinars"
              className="hidden sm:inline-flex text-sm font-semibold text-white/50 hover:text-[#C0272D] transition-colors items-center gap-1.5"
            >
              View all webinars
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {webinars.map((w) => (
              <WebinarCard key={w._id} webinar={w} />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/webinars" className="text-sm font-semibold text-white/50 hover:text-[#C0272D] transition-colors">
              View all webinars →
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <SectionLabel>Our Mission</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">
                Building Africa&apos;s AI future,{' '}
                <span className="text-[#C0272D]">together.</span>
              </h2>
              <div className="w-12 h-1 bg-[#C0272D] mb-6 rounded-full" />
            </div>
            <div className="border-l-[3px] border-[#C0272D] pl-8">
              <p className="text-gray-600 leading-relaxed mb-5">
                Morocco.AI was founded to bridge the gap between cutting-edge AI research and its
                practical application across Morocco and Africa. We believe in democratizing access to
                artificial intelligence education and fostering a vibrant ecosystem of innovators.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                Through webinars, conferences, workshops, and a growing community of practitioners,
                we are positioning Morocco at the forefront of the global AI revolution.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#1B2A6B] text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-[#2D3E8E] transition-colors"
              >
                Our Story
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONFERENCES ── */}
      <section className="bg-[#0A0A0A] py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="mb-14">
            <SectionLabel>Editions</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Past Conferences</h2>
          </div>

          <div className="divide-y divide-white/8">
            {CONFERENCES.map((conf) => (
              <div key={conf.year} className="flex items-center gap-8 py-6 group cursor-default">
                <span
                  className="font-black text-white/10 group-hover:text-white/20 transition-colors leading-none shrink-0 select-none"
                  style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
                >
                  {conf.year}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white/80 group-hover:text-white transition-colors truncate">
                    {conf.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-0.5">{conf.location}</p>
                </div>
                <Link
                  href="/conference"
                  className="text-sm font-semibold text-[#C0272D] opacity-0 group-hover:opacity-100 transition-opacity shrink-0 flex items-center gap-1"
                >
                  View
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEMBERS ── */}
      {members.length > 0 && (
        <section className="bg-[#111827] py-24">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
              <div>
                <SectionLabel>Community</SectionLabel>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Our Members</h2>
              </div>
              <Link href="/members" className="hidden sm:inline-flex text-sm font-semibold text-white/50 hover:text-[#C0272D] transition-colors items-center gap-1.5">
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {members.map((member) => (
                <div
                  key={member._id}
                  className="group relative bg-[#1A1A2E] border border-white/5 rounded-xl overflow-hidden p-5 flex flex-col items-center text-center hover:border-white/20 transition-all duration-300"
                >
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#C0272D] to-[#1B2A6B]" />

                  <div className="relative w-16 h-16 rounded-full overflow-hidden bg-[#0D0D1A] mb-3 ring-1 ring-white/10 group-hover:ring-[#C0272D]/50 transition-all">
                    {member.image ? (
                      <>
                        <Image
                          src={urlFor(member.image).width(128).height(128).url()}
                          alt={member.name}
                          fill
                          sizes="64px"
                          className="object-cover duotone group-hover:filter-none transition-all duration-300"
                        />
                        <div className="absolute inset-0 bg-[#1B2A6B]/40 group-hover:opacity-0 transition-opacity duration-300" />
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full w-full bg-gradient-to-br from-[#1B2A6B] to-[#0D0D1A]">
                        <span className="text-base font-black text-white/80">
                          {member.name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-white leading-tight mb-1">{member.name}</h3>
                  {member.role && (
                    <p className="text-[10px] text-[#C0272D] font-semibold uppercase tracking-wide line-clamp-2">
                      {member.role}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER CTA ── */}
      <section className="bg-[#0A0A0A] py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div
            className="rounded-2xl px-8 sm:px-14 py-14 flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #111827 0%, #1B2A6B22 100%)' }}
          >
            {/* Border */}
            <div className="absolute inset-0 rounded-2xl border border-white/8 pointer-events-none" />
            {/* Red accent left border */}
            <div className="absolute left-0 top-8 bottom-8 w-1 bg-[#C0272D] rounded-r-full" />

            <div>
              <p className="text-xs font-bold text-[#C0272D] uppercase tracking-[0.3em] mb-3">Newsletter</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                Join a community shaping the<br className="hidden sm:block" />
                future of AI in Africa.
              </h2>
              <p className="text-gray-400 text-sm mt-2">Connect, learn, and build impact together.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
              <input
                type="email"
                placeholder="your@email.com"
                className="px-4 py-3 rounded-lg bg-white/8 border border-white/15 text-white placeholder-white/30 focus:outline-none focus:border-white/40 text-sm w-full sm:w-56"
              />
              <Link
                href="/newsletter"
                className="bg-[#C0272D] text-white px-6 py-3 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap flex items-center justify-center gap-2"
              >
                JOIN COMMUNITY
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
