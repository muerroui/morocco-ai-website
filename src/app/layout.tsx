import type { Metadata } from 'next'
import { Inter, Fraunces, IBM_Plex_Sans_Arabic } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LenisProvider from '@/components/LenisProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
})

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Morocco.AI',
    default: 'Morocco.AI — Building AI for Morocco. Building AI from Morocco.',
  },
  description:
    'MoroccoAI is Morocco\'s leading non-profit AI community — advancing AI education, research, and innovation through world-class conferences, webinars, and a growing ecosystem of practitioners.',
  keywords: ['Morocco AI', 'MoroccoAI', 'artificial intelligence Morocco', 'Africa AI', 'machine learning', 'deep learning', 'AI conference'],
  openGraph: {
    siteName: 'Morocco.AI',
    locale: 'en_US',
    type: 'website',
    title: 'Morocco.AI — Building AI for Morocco. Building AI from Morocco.',
    description: 'Morocco\'s leading non-profit AI community. Annual conference with keynotes from Hinton, Bengio, Jordan, Russell and more.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Morocco.AI',
    description: 'Morocco\'s largest professional AI community.',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${ibmPlexArabic.variable}`}
    >
      <body className="bg-ink text-bone font-sans antialiased overflow-x-hidden">
        <LenisProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </LenisProvider>
      </body>
    </html>
  )
}
