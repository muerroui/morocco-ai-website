/**
 * Diagnostic: inspect swiper slides + conference speaker pages
 * Usage: npx tsx scripts/inspect-html.ts
 */

import * as cheerio from 'cheerio'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
}

async function fetchHtml(url: string): Promise<string> {
  const res = await fetch(url, { headers: HEADERS, redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`)
  return res.text()
}

async function inspectHomepageSwiper() {
  console.log('=== HOMEPAGE SWIPER SLIDES ===')
  const html = await fetchHtml('https://morocco.ai/')
  const $ = cheerio.load(html)

  // Print full HTML of each swiper-slide to see the complete structure
  $('.swiper-slide').each((i, el) => {
    const img = $(el).find('img').first()
    const src = img.attr('src') || ''
    const alt = img.attr('alt') || ''

    // Get all text content in the slide
    const allText = $(el).text().replace(/\s+/g, ' ').trim()

    // Get all elements with text
    const tags: string[] = []
    $(el).find('*').each((_, child) => {
      const tagName = (child as any).tagName
      const text = $(child).clone().children().remove().end().text().trim()
      if (text.length > 1 && text.length < 100 && !['script','style'].includes(tagName)) {
        tags.push(`<${tagName} class="${$(child).attr('class') || ''}">${text}</${tagName}>`)
      }
    })

    if (src || alt) {
      console.log(`\n[Slide ${i}]`)
      console.log(`  img src: ${src}`)
      console.log(`  img alt: "${alt}"`)
      console.log(`  all text: "${allText.slice(0, 150)}"`)
      console.log(`  elements: ${tags.slice(0, 5).join(' | ')}`)
    }
  })
}

async function inspectConferencePage(url: string) {
  console.log(`\n=== CONFERENCE: ${url} ===`)
  try {
    const html = await fetchHtml(url)
    const $ = cheerio.load(html)

    // All images with person names
    $('img').each((_, el) => {
      const src = $(el).attr('src') || ''
      const alt = $(el).attr('alt') || ''
      if (alt.match(/[A-Z][a-z]+ [A-Z]/) && src) {
        const parent = $(el).parent()
        const grandparent = parent.parent()
        const closestText = grandparent.text().replace(/\s+/g, ' ').trim().slice(0, 150)
        console.log(`  NAME: "${alt}"`)
        console.log(`  SRC: ${src}`)
        console.log(`  CONTEXT: "${closestText}"`)
        console.log()
      }
    })
  } catch (err: any) {
    console.log(`  FAILED: ${err.message}`)
  }
}

async function main() {
  await inspectHomepageSwiper()
  await inspectConferencePage('https://morocco.ai/events/conferences/MoroccoAI-Conference-2023/pages/speakers.html')
  await inspectConferencePage('https://morocco.ai/events/conferences/MoroccoAI-Conference-2022/pages/speakers.html')
}

main().catch(console.error)
