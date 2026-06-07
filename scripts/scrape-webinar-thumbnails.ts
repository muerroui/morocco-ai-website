/**
 * Scrape webinar thumbnails from listing pages and patch existing Sanity docs.
 * Strategy: extract (speakerName, thumbnailImg) pairs from DOM order on each listing page,
 * then match speakerName → Sanity webinar → patch thumbnail.
 *
 * Usage: npx tsx scripts/scrape-webinar-thumbnails.ts
 */

import * as cheerio from 'cheerio'
import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

// ── Config ───────────────────────────────────────────────────────────────────

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

const SANITY_TOKEN = process.env.SANITY_API_TOKEN
if (!SANITY_TOKEN) { console.error('❌  SANITY_API_TOKEN missing'); process.exit(1) }

const sanity = createClient({
  projectId: '5vfa1g0e', dataset: 'production', apiVersion: '2024-01-01',
  token: SANITY_TOKEN, useCdn: false,
})

const THUMBS_DIR = path.join(process.cwd(), 'public', 'images', 'webinar-thumbs')
fs.mkdirSync(THUMBS_DIR, { recursive: true })

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
const DELAY_MS = 500

const LISTING_PAGES = [
  'https://morocco.ai/webinars21/',
  'https://morocco.ai/webinars22/',
  'https://morocco.ai/webinars23/',
  'https://morocco.ai/webinars24/',
]

// ── Helpers ──────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function slugify(s: string): string {
  return s.toLowerCase()
    .replace(/[àáâãäå]/g,'a').replace(/[èéêë]/g,'e').replace(/[ìíîï]/g,'i')
    .replace(/[òóôõö]/g,'o').replace(/[ùúûü]/g,'u').replace(/[ç]/g,'c')
    .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,96)
}

function normalize(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g,' ').trim()
}

function nameSimilarity(a: string, b: string): number {
  const wa = new Set(normalize(a).split(' ').filter(w => w.length > 2))
  const wb = normalize(b).split(' ').filter(w => w.length > 2)
  if (wa.size === 0) return 0
  return wb.filter(w => wa.has(w)).length / Math.max(wa.size, wb.length)
}

async function fetchPage(url: string): Promise<string> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 20000)
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': UA }, redirect: 'follow' })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    return await r.text()
  } finally { clearTimeout(t) }
}

async function downloadImage(url: string, dest: string): Promise<boolean> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 15000)
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { 'User-Agent': UA }, redirect: 'follow' })
    clearTimeout(t)
    if (!r.ok) return false
    fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()))
    return true
  } catch { clearTimeout(t); try { fs.unlinkSync(dest) } catch {}; return false }
}

async function uploadToSanity(filePath: string, filename: string): Promise<string | null> {
  try {
    const ext = path.extname(filename).slice(1).toLowerCase()
    const ct = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
    const asset = await sanity.assets.upload('image', fs.readFileSync(filePath), { filename, contentType: ct })
    return asset._id
  } catch (err: any) { console.warn(`  ⚠  Upload failed ${filename}: ${err.message}`); return null }
}

// ── Scrape one listing page ───────────────────────────────────────────────────

interface SpeakerThumb { speakerName: string; imageUrl: string }

function scrapePage(html: string): SpeakerThumb[] {
  const $ = cheerio.load(html)

  // ── Find webinar thumbnail URLs anywhere in the HTML (img src OR background-image) ──
  // Extract all unique wp-content image URLs that look like webinar thumbnails
  const SKIP_PATTERNS = [
    /Logo|logo|icon|cropped|banner|Banner|bgk\.png|dsa\.png|elementor\/thumbs|MoroccoAI_Logo_alt/i,
    /placeholder/i,
  ]
  const allWpUrls = [...new Set(
    (html.match(/https?:\/\/morocco\.ai\/wp-content\/uploads\/[^\s"'\\)>]+/gi) || [])
      .map(u => u.replace(/[\\'")\s>]+$/, ''))
      .filter(u => /\.(jpg|jpeg|png|webp)(\?|$)/i.test(u))
      .filter(u => !SKIP_PATTERNS.some(p => p.test(u)))
  )]

  console.log(`  All WP images: ${allWpUrls.map(u => u.split('/').pop()).join(', ')}`)

  // ── Find each image's position in the raw HTML, pair with nearest h3 ──
  // Build a map: image URL → char position in HTML
  const imgPositions: Array<{ url: string; pos: number }> = []
  for (const url of allWpUrls) {
    const pos = html.indexOf(url)
    if (pos >= 0) imgPositions.push({ url, pos })
  }
  imgPositions.sort((a, b) => a.pos - b.pos)

  // Build h3 name positions
  const speakerNames: Array<{ name: string; pos: number }> = []
  const skipWords = ['Contact', 'Events', 'Welcome', 'login', 'Morocco', 'Webinar', 'Previous', 'Register']
  $('h3, h4').each((_, el) => {
    const text = $(el).text().trim()
    if (skipWords.some(w => text.includes(w))) return
    if (text.length < 4 || text.length > 120) return
    if (!/[A-Z][a-z]/.test(text)) return
    // Find position in HTML
    const tagHtml = $.html(el) || ''
    const pos = html.indexOf(tagHtml.substring(0, 40))
    if (pos >= 0) speakerNames.push({ name: text, pos })
  })
  speakerNames.sort((a, b) => a.pos - b.pos)

  console.log(`  Names (${speakerNames.length}): ${speakerNames.map(s => s.name).join(', ')}`)
  console.log(`  Thumb images (${imgPositions.length}): ${imgPositions.map(i => i.url.split('/').pop()).join(', ')}`)

  if (imgPositions.length === 0 || speakerNames.length === 0) return []

  // ── Pair each speaker to nearest image (by char position) ──
  const pairs: SpeakerThumb[] = []
  const usedImgs = new Set<string>()

  for (const speaker of speakerNames) {
    // Find closest unused image
    let best: { url: string; dist: number } | null = null
    for (const img of imgPositions) {
      if (usedImgs.has(img.url)) continue
      const dist = Math.abs(img.pos - speaker.pos)
      if (!best || dist < best.dist) best = { url: img.url, dist }
    }
    if (best && best.dist < 50000) { // within ~50KB of context
      pairs.push({ speakerName: speaker.name, imageUrl: best.url })
      usedImgs.add(best.url)
    }
  }

  return pairs
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🇲🇦  Morocco.AI — Scrape Webinar Thumbnails\n')

  // STEP 1: Fetch Sanity webinars
  console.log('═══ STEP 1: Fetching Sanity webinars ═══')
  const sanityWebinars: Array<{ _id: string; title: string; speakerName: string; slug: string; thumbnail?: unknown }> =
    await sanity.fetch(`*[_type == "webinar"] { _id, title, speakerName, "slug": slug.current, thumbnail }`)
  console.log(`  Found ${sanityWebinars.length} webinars`)

  // STEP 2: Scrape listing pages
  console.log('\n═══ STEP 2: Scraping listing pages ═══')
  const allPairs: SpeakerThumb[] = []

  for (const url of LISTING_PAGES) {
    console.log(`\n  ${url}`)
    try {
      const html = await fetchPage(url)
      const pairs = scrapePage(html)
      console.log(`  ✓ ${pairs.length} pairs`)
      allPairs.push(...pairs)
    } catch (err: any) {
      console.error(`  ❌ ${err.message}`)
    }
    await sleep(DELAY_MS)
  }

  fs.writeFileSync('scripts/scraped-webinar-thumbs.json', JSON.stringify(allPairs, null, 2))
  console.log(`\n  Total pairs: ${allPairs.length}`)

  // STEP 3: Match to Sanity webinars by speakerName
  console.log('\n═══ STEP 3: Matching speaker names → Sanity ═══')

  interface Match { sanityId: string; sanityTitle: string; speakerName: string; imageUrl: string; score: number }
  const matches: Match[] = []

  for (const pair of allPairs) {
    // First try exact match on speakerName
    let best: { w: typeof sanityWebinars[0]; score: number } | null = null

    for (const w of sanityWebinars) {
      if (w.thumbnail) continue // already has one
      const score = nameSimilarity(pair.speakerName, w.speakerName)
      if (!best || score > best.score) best = { w, score }
    }

    if (best && best.score >= 0.4) {
      matches.push({
        sanityId: best.w._id,
        sanityTitle: best.w.title,
        speakerName: best.w.speakerName,
        imageUrl: pair.imageUrl,
        score: best.score,
      })
      console.log(`  ✓ [${(best.score*100).toFixed(0)}%] "${pair.speakerName}" → "${best.w.speakerName}"`)
      console.log(`       img: ${pair.imageUrl.split('/').pop()}`)
    } else {
      console.log(`  ✗ No match: "${pair.speakerName}" (best: ${best ? `${(best.score*100).toFixed(0)}% ${best.w.speakerName}` : 'none'})`)
    }
  }

  console.log(`\n  Matched: ${matches.length} / ${allPairs.length}`)

  if (matches.length === 0) {
    console.log('\n  ⚠  0 matches. Check scripts/scraped-webinar-thumbs.json')
    return
  }

  // STEP 4: Download
  console.log('\n═══ STEP 4: Downloading thumbnails ═══')
  const localPaths: Record<string, string> = {}
  const seen = new Set<string>()

  for (const m of matches) {
    if (seen.has(m.imageUrl)) { localPaths[m.imageUrl] = localPaths[m.imageUrl] || ''; continue }
    seen.add(m.imageUrl)

    const ext = m.imageUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'png'
    const filename = `${slugify(m.speakerName)}.${ext}`
    const dest = path.join(THUMBS_DIR, filename)

    if (fs.existsSync(dest)) {
      console.log(`  ↩  ${filename} (cached)`)
      localPaths[m.imageUrl] = dest
      continue
    }

    console.log(`  ↓  ${filename}`)
    if (await downloadImage(m.imageUrl, dest)) localPaths[m.imageUrl] = dest
    else console.warn(`  ⚠  Failed: ${m.imageUrl}`)
    await sleep(300)
  }

  // STEP 5: Upload to Sanity
  console.log('\n═══ STEP 5: Uploading to Sanity ═══')
  const assetIds: Record<string, string> = {}

  for (const [url, localPath] of Object.entries(localPaths)) {
    if (!localPath) continue
    const filename = path.basename(localPath)
    console.log(`  ↑  ${filename}`)
    const id = await uploadToSanity(localPath, filename)
    if (id) assetIds[url] = id
    await sleep(200)
  }

  console.log(`  ✓ Uploaded ${Object.keys(assetIds).length} assets`)

  // STEP 6: Patch
  console.log('\n═══ STEP 6: Patching Sanity webinars ═══')
  let patched = 0

  for (const m of matches) {
    const assetId = assetIds[m.imageUrl]
    if (!assetId) { console.warn(`  ⚠  No asset for: ${m.sanityTitle.slice(0,50)}`); continue }

    try {
      await sanity.patch(m.sanityId).set({
        thumbnail: { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
      }).commit()
      console.log(`  ✓  ${m.sanityTitle.slice(0, 60)}`)
      patched++
    } catch (err: any) {
      console.error(`  ❌  ${m.sanityTitle}: ${err.message}`)
    }
    await sleep(150)
  }

  console.log(`\n══════════════════════════════════════`)
  console.log(`✅  Done! Patched ${patched}/${matches.length} webinars`)
  console.log(`   Check: https://morocco-ai.sanity.studio/`)
  console.log(`══════════════════════════════════════\n`)
}

main().catch(err => { console.error('\n💥', err); process.exit(1) })
