import Link from 'next/link'
import Image from 'next/image'

const year = new Date().getFullYear()

const SOCIALS = [
  {
    href: 'https://linkedin.com/company/morocco-ai',
    label: 'LinkedIn',
    icon: <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />,
  },
  {
    href: 'https://twitter.com/moroccoai',
    label: 'X (Twitter)',
    icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />,
  },
  {
    href: 'https://youtube.com/@moroccoai',
    label: 'YouTube',
    icon: <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />,
  },
  {
    href: 'https://instagram.com/moroccoai',
    label: 'Instagram',
    icon: <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />,
  },
  {
    href: 'https://slack.moroccoai.org',
    label: 'Slack',
    icon: (
      <>
        <path d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313zm2.521-10.123a2.528 2.528 0 01-2.521-2.52A2.528 2.528 0 018.834 0a2.528 2.528 0 012.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 012.521 2.521 2.528 2.528 0 01-2.521 2.521H2.522A2.528 2.528 0 010 8.834a2.528 2.528 0 012.522-2.521h6.312zm10.122 2.521a2.528 2.528 0 012.522-2.521A2.528 2.528 0 0124 8.834a2.528 2.528 0 01-2.522 2.521h-2.522V8.834zm-1.268 0a2.528 2.528 0 01-2.523 2.521 2.527 2.527 0 01-2.52-2.521V2.522A2.527 2.527 0 0115.165 0a2.528 2.528 0 012.523 2.522v6.312zm-2.523 10.122a2.528 2.528 0 012.523 2.522A2.528 2.528 0 0115.165 24a2.527 2.527 0 01-2.52-2.522v-2.522h2.52zm0-1.268a2.527 2.527 0 01-2.52-2.523 2.526 2.526 0 012.52-2.52h6.313A2.527 2.527 0 0124 15.165a2.528 2.528 0 01-2.522 2.523h-6.313z" />
      </>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="relative bg-ink text-bone/38 overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-bone/10 to-transparent" />

      {/* Oversized wordmark watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-display font-light text-bone whitespace-nowrap leading-none tracking-tight"
          style={{ fontSize: 'clamp(80px, 18vw, 220px)', opacity: 0.015 }}
        >
          MoroccoAI
        </span>
      </div>

      <div className="absolute inset-0 zellige-pattern opacity-[0.015]" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Manifesto strip */}
        <div className="py-16 lg:py-20 border-b border-bone/[0.05]">
          <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
            <div>
              {/* Logo — dark bg: invert to white */}
              <Image
                src="/logo.png"
                alt="Morocco.AI"
                width={148}
                height={40}
                className="h-8 w-auto brightness-0 invert opacity-55 mb-6"
              />
              <p
                className="font-display font-light text-bone/48 leading-tight"
                style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', letterSpacing: '-0.015em' }}
              >
                Building AI for Morocco.<br />
                Building AI from Morocco.
              </p>
            </div>
            <div className="flex items-center gap-5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-bone/22 hover:text-bone/65 transition-colors duration-300"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 py-14">
          <div>
            <h4 className="text-label text-bone/22 mb-6">Community</h4>
            <ul className="space-y-3">
              {[
                { href: '/about',      label: 'About Us'   },
                { href: '/conference', label: 'Conference' },
                { href: '/events',     label: 'Events'     },
                { href: '/newsletter', label: 'Join'       },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-bone/32 hover:text-bone/72 transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label text-bone/22 mb-6">Learning</h4>
            <ul className="space-y-3">
              {[
                { href: '/webinars',    label: 'Webinars'    },
                { href: '/ai-insights', label: 'AI Insights' },
                { href: '/podcasts',    label: 'Podcasts'    },
                { href: '/newsletter',  label: 'Newsletter'  },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-bone/32 hover:text-bone/72 transition-colors text-sm">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-label text-bone/22 mb-6">Partners</h4>
            <ul className="space-y-3 text-sm text-bone/30">
              <li>Google</li>
              <li>Nvidia</li>
              <li>INPT</li>
              <li>UM6P</li>
              <li>ENSIAS</li>
            </ul>
          </div>

          <div>
            <h4 className="text-label text-bone/22 mb-6">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@morocco.ai" className="text-bone/32 hover:text-bone/72 transition-colors text-sm">
                  contact@morocco.ai
                </a>
              </li>
              <li>
                <a href="https://slack.moroccoai.org" target="_blank" rel="noopener noreferrer"
                   className="text-bone/32 hover:text-bone/72 transition-colors text-sm">
                  Slack Community
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-bone/[0.04] flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-bone/18">© {year} MoroccoAI. Non-profit AI community.</p>
          <p className="text-xs text-bone/12 uppercase tracking-[0.2em]">Morocco · Africa · AI</p>
        </div>
      </div>
    </footer>
  )
}
