import type { Metadata } from 'next'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'About',
  description: 'MoroccoAI is Morocco\'s largest non-profit AI community — connecting researchers, engineers, and practitioners across Africa and the global diaspora.',
}

export default function AboutPage() {
  return <AboutContent />
}
