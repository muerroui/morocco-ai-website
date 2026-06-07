/**
 * Inspect morocco.ai event listing pages to find event images + data
 */
import * as cheerio from 'cheerio'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

async function fetch_(url: string) {
  const res = await fetch(url, { headers: HEADERS, redirect: 'follow' })
  console.log(`  ${res.status} ${url}`)
  if (!res.ok) return null
  return res.text()
}

async function inspectPage(url: string) {
  const html = await fetch_(url)
  if (!html) return

  const $ = cheerio.load(html)

  // Event cards: tribe plugin or similar
  const eventSelectors = [
    '.tribe-event', '.tribe-events-calendar', '.tribe-events-list',
    '.type-tribe_events', '[class*="event-card"]', '[class*="event-item"]',
    '.elementor-posts--skin-cards article',
  ]

  for (const sel of eventSelectors) {
    const found = $(sel)
    if (found.length > 0) {
      console.log(`\n  Selector "${sel}" found ${found.length} items`)
      found.first().find('*').each((_, el) => {
        const tag = (el as any).tagName
        const cls = $(el).attr('class') || ''
        const text = $(el).clone().children().remove().end().text().trim()
        const src = $(el).attr('src') || $(el).attr('href') || ''
        if (text || src) console.log(`    <${tag} class="${cls.slice(0,40)}">${text.slice(0,60)}${src ? ` src=${src.slice(0,80)}` : ''}</${tag}>`)
      })
    }
  }

  // All images on the page
  console.log('\n  All non-logo images:')
  $('img').each((_, el) => {
    const src = $(el).attr('src') || ''
    const alt = $(el).attr('alt') || ''
    if (src && !src.includes('Logo') && !src.includes('logo') && !src.includes('favicon') && !src.includes('pixel')) {
      console.log(`    ${src.slice(0, 100)} alt="${alt}"`)
    }
  })

  // Links to individual events
  console.log('\n  Event links:')
  $('a[href*="/event/"]').each((_, el) => {
    const href = $(el).attr('href') || ''
    const text = $(el).text().trim()
    console.log(`    ${href} — "${text.slice(0,50)}"`)
  })
}

async function main() {
  const urls = [
    'https://morocco.ai/events/',
    'https://morocco.ai/events/conferences/',
    'https://morocco.ai/?post_type=tribe_events',
    'https://morocco.ai/wp-json/tribe/events/v1/events?per_page=20',
  ]

  for (const url of urls) {
    console.log(`\n${'='.repeat(60)}`)
    await inspectPage(url)
  }
}

main().catch(console.error)
