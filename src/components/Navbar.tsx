'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/webinars', label: 'Webinars' },
  { href: '/events', label: 'Events' },
  { href: '/ai-insights', label: 'AI Insights' },
  { href: '/conference', label: 'Conference' },
  { href: '/podcasts', label: 'Podcasts' },
  { href: '/newsletter', label: 'Newsletter' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/10 shadow-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="Morocco.AI"
              width={140}
              height={40}
              className="h-9 w-auto brightness-0 invert"
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                  pathname === link.href
                    ? 'text-[#C0272D]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Link
              href="/newsletter"
              className="bg-[#C0272D] text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity"
            >
              JOIN
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-white hover:text-[#C0272D] transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-[#0A0A0A]/95 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2.5 text-xs font-semibold uppercase tracking-widest transition-colors ${
                pathname === link.href
                  ? 'text-[#C0272D]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3">
            <Link
              href="/newsletter"
              className="block bg-[#C0272D] text-white px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-[0.15em] text-center hover:opacity-90 transition-opacity"
            >
              JOIN
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
