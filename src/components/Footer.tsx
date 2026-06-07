import Link from 'next/link'
import Image from 'next/image'

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="relative bg-[#0A0A0A] text-gray-300 border-t border-[#C0272D]/40 overflow-hidden">
      {/* Watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-black text-white uppercase whitespace-nowrap leading-none tracking-tighter"
          style={{ fontSize: 'clamp(80px, 18vw, 200px)', opacity: 0.025 }}
        >
          MOROCCO AI
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Morocco.AI"
                width={130}
                height={38}
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              Advancing artificial intelligence in Morocco and Africa through community, education, and research.
            </p>
            <div className="flex gap-4">
              <a
                href="https://linkedin.com/company/morocco-ai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-gray-600 hover:text-[#C0272D] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://twitter.com/moroccoai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="text-gray-600 hover:text-[#C0272D] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://youtube.com/@moroccoai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-gray-600 hover:text-[#C0272D] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs mb-5">Community</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/about', label: 'About Us' },
                { href: '/members', label: 'Members' },
                { href: '/conference', label: 'Conferences' },
                { href: '/events', label: 'Events' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs mb-5">Resources</h4>
            <ul className="space-y-3 text-sm">
              {[
                { href: '/webinars', label: 'Webinars' },
                { href: '/ai-insights', label: 'AI Insights' },
                { href: '/podcasts', label: 'Podcasts' },
                { href: '/newsletter', label: 'Newsletter' },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-gray-500 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-[0.2em] text-xs mb-5">Connect</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:contact@morocco.ai" className="text-gray-500 hover:text-white transition-colors">
                  contact@morocco.ai
                </a>
              </li>
              <li>
                <Link href="/newsletter" className="text-gray-500 hover:text-white transition-colors">
                  Join Newsletter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-gray-700">© {year} Morocco.AI. All rights reserved.</p>
          <p className="text-xs text-gray-700 uppercase tracking-[0.2em]">Advancing AI in Morocco &amp; Africa</p>
        </div>
      </div>
    </footer>
  )
}
