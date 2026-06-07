'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1]

const navLinks = [
  { href: '/about',      label: { en: 'About',      fr: 'À propos',     ar: 'عنّا'      } },
  { href: '/webinars',   label: { en: 'Webinars',   fr: 'Webinaires',   ar: 'ندوات'    } },
  { href: '/events',     label: { en: 'Events',     fr: 'Événements',   ar: 'فعاليات'  } },
  { href: '/conference', label: { en: 'Conference', fr: 'Conférence',   ar: 'مؤتمر'    } },
  { href: '/newsletter', label: { en: 'Newsletter', fr: "Lettre d'info", ar: 'نشرة'   } },
]

type Lang = 'en' | 'fr' | 'ar'

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [lang, setLang]             = useState<Lang>('en')
  const [langOpen, setLangOpen]     = useState(false)
  const pathname = usePathname()
  const ctaRef   = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  const handleCtaMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = ctaRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width  / 2)
    const dy = e.clientY - (rect.top  + rect.height / 2)
    el.style.transform = `translate(${dx * 0.25}px, ${dy * 0.25}px)`
  }, [])

  const handleCtaLeave = useCallback(() => {
    if (ctaRef.current) ctaRef.current.style.transform = 'translate(0,0)'
  }, [])

  const isRTL = lang === 'ar'

  return (
    <nav
      dir={isRTL ? 'rtl' : 'ltr'}
      className={`fixed top-0 start-0 end-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-ink/92 backdrop-blur-xl border-b border-bone/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo — SVG with CSS variant for dark bg */}
          <Link href="/" className="flex items-center shrink-0 group">
            <Image
              src="/logo.png"
              alt="Morocco.AI"
              width={148}
              height={40}
              className="h-8 w-auto brightness-0 invert opacity-85 group-hover:opacity-100 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-0">
            {navLinks.map((link) => {
              const active = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-[0.7rem] font-semibold tracking-[0.18em] uppercase transition-colors duration-200 ${
                    active ? 'text-bone' : 'text-bone/45 hover:text-bone/80'
                  } ${isRTL ? 'font-arabic' : ''}`}
                >
                  {link.label[lang]}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 start-4 end-4 h-px bg-red"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Right cluster */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-bone/45 hover:text-bone/80 transition-colors"
                aria-label="Switch language"
              >
                {lang.toUpperCase()}
                <svg className={`w-3 h-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-2 end-0 bg-[#111114] border border-bone/10 rounded-lg overflow-hidden min-w-[80px] shadow-2xl"
                  >
                    {(['en', 'fr', 'ar'] as Lang[]).map((l) => (
                      <button
                        key={l}
                        onClick={() => { setLang(l); setLangOpen(false) }}
                        className={`block w-full text-start px-4 py-2.5 text-[0.65rem] font-semibold tracking-widest uppercase transition-colors ${
                          lang === l
                            ? 'text-navy-50 bg-navy/10'
                            : 'text-bone/50 hover:text-bone hover:bg-bone/[0.04]'
                        }`}
                      >
                        {l === 'en' ? 'EN' : l === 'fr' ? 'FR' : 'عربي'}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Magnetic CTA */}
            <Link
              ref={ctaRef}
              href="/newsletter"
              onMouseMove={handleCtaMove}
              onMouseLeave={handleCtaLeave}
              className="inline-flex items-center gap-2 bg-red text-bone px-5 py-2.5 rounded-full text-[0.65rem] font-bold tracking-[0.2em] uppercase hover:bg-red-900 transition-colors duration-300"
              style={{ willChange: 'transform', transition: 'background-color 0.3s, transform 0.15s cubic-bezier(0.16,1,0.3,1)' }}
            >
              Join Community
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 text-bone/60 hover:text-bone transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <span className="sr-only">Menu</span>
            <div className="w-5 flex flex-col gap-1.5">
              <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px bg-current transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: EXPO }}
            className="lg:hidden overflow-hidden bg-ink border-t border-bone/[0.07]"
          >
            <div className="px-5 py-6 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04, duration: 0.2 }}
                >
                  <Link
                    href={link.href}
                    className={`block px-2 py-3 text-sm font-semibold tracking-[0.15em] uppercase border-b border-bone/[0.06] transition-colors ${
                      pathname === link.href ? 'text-bone' : 'text-bone/45 hover:text-bone/80'
                    }`}
                  >
                    {link.label[lang]}
                  </Link>
                </motion.div>
              ))}

              <div className="flex items-center gap-3 pt-4">
                {(['en', 'fr', 'ar'] as Lang[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`text-[0.65rem] font-bold tracking-widest uppercase transition-colors ${
                      lang === l ? 'text-red' : 'text-bone/30 hover:text-bone/60'
                    }`}
                  >
                    {l === 'en' ? 'EN' : l === 'fr' ? 'FR' : 'عربي'}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/newsletter"
                  className="block bg-red text-bone px-5 py-3 rounded-full text-xs font-bold tracking-[0.2em] uppercase text-center hover:bg-red-900 transition-colors"
                >
                  Join Community
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
