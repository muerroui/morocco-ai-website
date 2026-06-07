/**
 * Scrape all events via wp/v2/tribe_events REST API + import to Sanity.
 * Usage: npx tsx scripts/scrape-events.ts
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
}
loadEnv()

const sanity = createClient({
  projectId: '5vfa1g0e', dataset: 'production',
  apiVersion: '2024-01-01', token: process.env.SANITY_API_TOKEN, useCdn: false,
})

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
}

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'events')
fs.mkdirSync(IMAGES_DIR, { recursive: true })

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function slugify(str: string): string {
  return str.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 96)
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#8211;/g, '–')
    .replace(/\s+/g, ' ').trim()
}

interface WpEvent {
  id: number
  slug: string
  title: { rendered: string }
  content: { rendered: string }
  date: string
  link: string
  featured_media: number
  meta?: Record<string, unknown>
  acf?: Record<string, unknown>
}

interface WpMedia {
  source_url: string
  media_details?: { sizes?: Record<string, { source_url: string }> }
}

// Cache media URL lookups
const mediaCache = new Map<number, string>()

async function getMediaUrl(mediaId: number): Promise<string> {
  if (!mediaId) return ''
  if (mediaCache.has(mediaId)) return mediaCache.get(mediaId)!
  try {
    const res = await fetch(`https://morocco.ai/wp-json/wp/v2/media/${mediaId}`, { headers: HEADERS })
    if (!res.ok) return ''
    const m: WpMedia = await res.json()
    // Prefer large or medium size
    const url = m.media_details?.sizes?.large?.source_url
      || m.media_details?.sizes?.medium_large?.source_url
      || m.media_details?.sizes?.medium?.source_url
      || m.source_url
      || ''
    mediaCache.set(mediaId, url)
    return url
  } catch {
    return ''
  }
}

async function fetchAllEvents(): Promise<WpEvent[]> {
  const all: WpEvent[] = []
  let page = 1

  while (true) {
    const url = `https://morocco.ai/wp-json/wp/v2/tribe_events?per_page=100&page=${page}&status=publish&_fields=id,slug,title,content,date,link,featured_media`
    console.log(`  Page ${page}...`)
    const res = await fetch(url, { headers: HEADERS })

    if (res.status === 400) break  // no more pages
    if (!res.ok) { console.log(`  HTTP ${res.status}`); break }

    const totalPages = parseInt(res.headers.get('X-WP-TotalPages') || '1')
    const total = parseInt(res.headers.get('X-WP-Total') || '0')
    const events: WpEvent[] = await res.json()

    if (!events.length) break
    all.push(...events)
    console.log(`    ${events.length} events (total: ${total}, pages: ${totalPages})`)

    if (page >= totalPages) break
    page++
    await sleep(300)
  }

  return all
}

async function downloadImage(imageUrl: string, destPath: string): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': HEADERS['User-Agent'] },
      redirect: 'follow',
    })
    clearTimeout(timer)
    if (!res.ok) return false
    const buf = await res.arrayBuffer()
    fs.writeFileSync(destPath, Buffer.from(buf))
    return true
  } catch {
    clearTimeout(timer)
    try { fs.unlinkSync(destPath) } catch {}
    return false
  }
}

async function uploadImageToSanity(filePath: string, filename: string): Promise<string | null> {
  try {
    const buffer = fs.readFileSync(filePath)
    const ext = path.extname(filename).slice(1).toLowerCase()
    const ct = ext === 'png' ? 'image/png' : ext === 'gif' ? 'image/gif' : 'image/jpeg'
    const asset = await sanity.assets.upload('image', buffer, { filename, contentType: ct })
    return asset._id
  } catch (err: any) {
    console.warn(`  ⚠  Upload failed: ${err.message}`)
    return null
  }
}

async function documentExists(slug: string): Promise<boolean> {
  const r = await sanity.fetch(`*[_type == "event" && slug.current == $slug][0]._id`, { slug })
  return !!r
}

async function main() {
  console.log('\n🇲🇦  Morocco.AI — Scrape & Import Events\n')

  // ── STEP 1: Fetch all events ───────────────────────────────────────────────
  console.log('═══ STEP 1: Fetching from wp/v2/tribe_events ═══')
  const events = await fetchAllEvents()
  console.log(`\n  Total: ${events.length} events`)

  // Split: webinars vs non-webinars
  const webinarEvents = events.filter(e => e.slug.includes('webinar') || e.title.rendered.toLowerCase().includes('webinar'))
  const nonWebinarEvents = events.filter(e => !e.slug.includes('webinar') && !e.title.rendered.toLowerCase().includes('webinar'))
  console.log(`  Webinars (skip): ${webinarEvents.length}`)
  console.log(`  Non-webinar events: ${nonWebinarEvents.length}`)
  nonWebinarEvents.forEach(e => console.log(`    • ${stripHtml(e.title.rendered).slice(0, 70)}`))

  fs.writeFileSync('scripts/scraped-events.json', JSON.stringify(events, null, 2))

  // ── STEP 2: Resolve + download images ─────────────────────────────────────
  console.log('\n═══ STEP 2: Downloading event images ═══')
  const assetIds: Record<number, string> = {}

  for (const event of nonWebinarEvents) {
    if (!event.featured_media) { console.log(`  —  No image: ${stripHtml(event.title.rendered).slice(0, 50)}`); continue }

    const imgUrl = await getMediaUrl(event.featured_media)
    if (!imgUrl) { console.log(`  ⚠  Can't resolve media ${event.featured_media}`); continue }

    const ext = imgUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${event.slug.slice(0, 60)}.${ext}`
    const destPath = path.join(IMAGES_DIR, filename)

    if (fs.existsSync(destPath)) {
      console.log(`  ↩  ${filename} (cached)`)
    } else {
      console.log(`  ↓  ${filename}`)
      const ok = await downloadImage(imgUrl, destPath)
      if (!ok) { console.warn(`  ⚠  Download failed`); continue }
    }

    const assetId = await uploadImageToSanity(destPath, filename)
    if (assetId) {
      assetIds[event.id] = assetId
      console.log(`  ↑  → ${assetId.slice(0, 45)}...`)
    }
    await sleep(200)
  }

  console.log(`  ✓ ${Object.keys(assetIds).length} images uploaded`)

  // ── STEP 3: Import to Sanity ───────────────────────────────────────────────
  console.log('\n═══ STEP 3: Importing events ═══')
  let imported = 0
  let skipped = 0

  for (const event of nonWebinarEvents) {
    const slug = event.slug
    const exists = await documentExists(slug)
    if (exists) { console.log(`  ↩  Exists: ${slug}`); skipped++; continue }

    const title = stripHtml(event.title.rendered)
    const description = stripHtml(event.content.rendered).slice(0, 800)

    const doc: Record<string, unknown> = {
      _type: 'event',
      title,
      slug: { _type: 'slug', current: slug },
      date: event.date,
      description: description || undefined,
      registrationUrl: event.link || undefined,
    }

    if (assetIds[event.id]) {
      doc.image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetIds[event.id] },
      }
    }

    try {
      await sanity.create(doc)
      const img = assetIds[event.id] ? '📸' : '  '
      console.log(`  ✓${img} ${title.slice(0, 70)}`)
      imported++
    } catch (err: any) {
      console.error(`  ❌  ${title}: ${err.message}`)
    }
    await sleep(150)
  }

  console.log(`\n  Imported: ${imported} | Skipped: ${skipped}`)
  console.log('\n✅  Done. Check Sanity Studio → Events')
}

main().catch(console.error)
