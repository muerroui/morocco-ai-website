import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Morocco.AI',
    default: 'Morocco.AI — Advancing AI in Morocco & Africa',
  },
  description:
    'Morocco.AI is a community advancing artificial intelligence in Morocco and Africa through webinars, conferences, research, and networking.',
  keywords: ['Morocco AI', 'artificial intelligence', 'Africa AI', 'machine learning', 'deep learning'],
  openGraph: {
    siteName: 'Morocco.AI',
    locale: 'en_US',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#0A0A0A] text-[#374151] font-sans antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
