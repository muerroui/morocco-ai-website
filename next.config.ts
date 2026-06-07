import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  async redirects() {
    return [
      { source: '/webinars21/', destination: '/webinars', permanent: true },
      { source: '/webinars22/', destination: '/webinars', permanent: true },
      { source: '/webinars23/', destination: '/webinars', permanent: true },
      { source: '/webinars24/', destination: '/webinars', permanent: true },
      { source: '/webinars-register/', destination: '/webinars', permanent: true },
      { source: '/event/:slug*', destination: '/webinars/:slug*', permanent: true },
      { source: '/blog-sidebar/', destination: '/ai-insights', permanent: true },
      { source: '/home-morocco-ai/', destination: '/', permanent: true },
      { source: '/search-home/', destination: '/', permanent: true },
      { source: '/search-result/', destination: '/', permanent: true },
      { source: '/add-listing/', destination: '/', permanent: true },
      { source: '/all-listings/', destination: '/', permanent: true },
      { source: '/single-category/', destination: '/ai-insights', permanent: true },
      { source: '/single-tag/', destination: '/ai-insights', permanent: true },
      { source: '/dashboard/', destination: '/', permanent: true },
      { source: '/registration/', destination: '/', permanent: true },
      { source: '/login/', destination: '/', permanent: true },
      { source: '/author-profile/', destination: '/', permanent: true },
    ]
  },
}

export default nextConfig
