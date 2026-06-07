/**
 * Morocco.AI — WordPress scrape & Sanity import script
 *
 * Usage:
 *   1. Add SANITY_API_TOKEN to .env.local
 *      (sanity.io/manage → project 5vfa1g0e → API → Tokens → Editor token)
 *   2. npx tsx scripts/scrape-and-import.ts
 */

import * as cheerio from 'cheerio'
import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

// ─── Config ──────────────────────────────────────────────────────────────────

// Load .env.local manually (tsx doesn't auto-load it)
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
if (!SANITY_TOKEN) {
  console.error('\n❌  SANITY_API_TOKEN not found in .env.local')
  console.error('   Go to: https://www.sanity.io/manage/project/5vfa1g0e/api')
  console.error('   Create an Editor token, then add to .env.local:\n')
  console.error('   SANITY_API_TOKEN=sk...\n')
  process.exit(1)
}

const sanity = createClient({
  projectId: '5vfa1g0e',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: SANITY_TOKEN,
  useCdn: false,
})

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'speakers')
fs.mkdirSync(IMAGES_DIR, { recursive: true })

const DELAY_MS = 600

// ─── Helpers ─────────────────────────────────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Upgrade-Insecure-Requests': '1',
}

async function fetchPage(url: string, timeoutMs = 20000): Promise<string> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: BROWSER_HEADERS,
      redirect: 'follow',
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    return await res.text()
  } finally {
    clearTimeout(timer)
  }
}

async function fetchWithRetry(url: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchPage(url)
    } catch (err: any) {
      if (attempt < retries) {
        console.log(`  ↻  Retry ${attempt}/${retries - 1}: ${url}`)
        await sleep(1500 * attempt)
      } else {
        throw err
      }
    }
  }
  throw new Error('unreachable')
}

async function downloadImage(imageUrl: string, destPath: string): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
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
    const asset = await sanity.assets.upload('image', buffer, {
      filename,
      contentType: 'image/jpeg',
    })
    return asset._id
  } catch (err: any) {
    console.warn(`  ⚠  Upload failed for ${filename}: ${err.message}`)
    return null
  }
}

// Check if a document with this slug already exists
async function documentExists(type: string, slug: string): Promise<boolean> {
  const result = await sanity.fetch(
    `*[_type == $type && slug.current == $slug][0]._id`,
    { type, slug }
  )
  return !!result
}

// ─── Scrapers ─────────────────────────────────────────────────────────────────

interface ScrapedWebinar {
  title: string
  slug: string
  date: string
  speakerName: string
  speakerBio: string
  speakerImageUrl: string
  description: string
  youtubeUrl: string
  tags: string[]
  sourceUrl: string
}

interface ScrapedMember {
  name: string
  role: string
  imageUrl: string
}

function parseDate(raw: string): string {
  // Try various date formats from WordPress
  const cleaned = raw.replace(/\s+/g, ' ').trim()
  // e.g. "April 15, 2023" / "15 April 2023" / "2023-04-15"
  const d = new Date(cleaned)
  if (!isNaN(d.getTime())) return d.toISOString()
  // Fallback: current date
  return new Date().toISOString()
}

async function scrapeWebinarPage(url: string): Promise<ScrapedWebinar | null> {
  try {
    console.log(`  Scraping: ${url}`)
    const html = await fetchWithRetry(url)

    // ── Get full visible text ──────────────────────────────────────────────
    const visibleText = html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&laquo;|&raquo;|&times;|&ndash;|&#8211;/g, ' ')
      .replace(/&#0*(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      .replace(/\s+/g, ' ')
      .trim()

    const $ = cheerio.load(html)

    // ── Title ──────────────────────────────────────────────────────────────
    const title =
      $('h1.tribe-events-single-event-title').first().text().trim() ||
      $('h1.entry-title').first().text().trim() ||
      $('h1').first().text().trim() ||
      $('title').text().replace(/\s*[\|–-]\s*Morocco.AI.*$/i, '').trim()

    // ── Date ── "Date: February 22, 2023" or "February 22, 2023 @ ..."
    let dateStr = new Date().toISOString()
    const datePatterns = [
      /Date:\s*([A-Z][a-z]+ \d{1,2},\s*\d{4})/,
      /(\w+ \d{1,2},\s*\d{4})\s*@/,
      /(\d{4}-\d{2}-\d{2})/,
    ]
    for (const pat of datePatterns) {
      const m = visibleText.match(pat)
      if (m) { dateStr = parseDate(m[1]); break }
    }
    // Also try tribe datetime
    const tribeTime = $('time[datetime]').first().attr('datetime')
    if (tribeTime) dateStr = parseDate(tribeTime)

    // ── Speaker ── "Speaker: Name, Role at Org"
    let speakerName = ''
    let speakerBio = ''

    // "Speaker: Loubna Ben Allal, ML Engineer at HuggingFace" … "Google Calendar"
    const speakerLine = visibleText.match(
      /Speaker:\s*(.+?)(?=\s+Google\s+Calendar|\s+iCal\s+Export|\s+Website:\s*https|\s+Date:\s*[A-Z])/i
    )?.[1]?.trim() || ''

    if (speakerLine) {
      const parts = speakerLine.split(/,\s*/)
      speakerName = parts[0].trim()
      // Role/affiliation is rest (but not if it looks like a country/city only)
      if (parts.length > 1) {
        const role = parts.slice(1).join(', ').trim()
        // Drop if it's just a city / country
        if (role.length > 4 && !/^(France|Morocco|UK|USA|Canada|Germany|Spain)$/i.test(role)) {
          speakerBio = role
        }
      }
    }

    // Fallback: from title "Dr. X" / "Prof. X"
    if (!speakerName) {
      const m3 = title.match(/((?:Dr\.|Prof\.|Pr\.)\s+[A-Z][a-z]+(?:\s[A-Z][a-z]+)+)/i)
      if (m3) speakerName = m3[1].trim()
    }

    if (!speakerName) speakerName = 'Morocco.AI Speaker'

    // ── Description ── look for ABSTRACT in visible text (not modal ones)
    // The page may have the abstract in the event description block
    let description = ''
    const descEl = $('.tribe-events-single-description, .tribe-events-content').first()
    if (descEl.length) {
      description = descEl.text().replace(/\s+/g, ' ').trim().slice(0, 600)
    }

    // ── YouTube URL ── not on event pages, will be added via channel scrape
    let youtubeUrl = ''
    $('a[href*="watch?v="], a[href*="youtu.be/"]').each((_, el) => {
      const href = $(el).attr('href') || ''
      if (href.includes('watch?v=') || href.includes('youtu.be/')) {
        youtubeUrl = href
        return false as any
      }
    })

    // ── Auto-tags ──────────────────────────────────────────────────────────
    const tags: string[] = []
    const tagSource = title + ' ' + description
    const autoTagPatterns: [string, RegExp][] = [
      ['NLP', /\bnlp\b|natural language|language model|translation/i],
      ['Computer Vision', /computer vision|image recognition|vision transformer|radiology/i],
      ['Reinforcement Learning', /reinforcement learning/i],
      ['Machine Learning', /machine learning/i],
      ['Deep Learning', /deep learning/i],
      ['LLMs', /large language model|llm\b|open.*code.*model/i],
      ['Generative AI', /generative|diffusion model|gan\b|autoencoder/i],
      ['Healthcare', /health|medical|cancer|clinical|immunology/i],
      ['Theory', /mathematics|theoretical|theorem|probabilistic|adversarial|robustness/i],
      ['Privacy', /privacy|federated/i],
      ['Quantum', /quantum/i],
      ['Climate', /climate|weather|precipitation/i],
      ['Bias & Fairness', /bias|fairness|marginali/i],
      ['Code', /code|programming|software/i],
    ]
    for (const [tag, pat] of autoTagPatterns) {
      if (pat.test(tagSource)) tags.push(tag)
    }

    return {
      title,
      slug: slugify(title),
      date: dateStr,
      speakerName,
      speakerBio,
      speakerImageUrl: '',
      description,
      youtubeUrl,
      tags,
      sourceUrl: url,
    }
  } catch (err: any) {
    console.error(`  ❌  Failed to scrape ${url}: ${err.message}`)
    return null
  }
}

// ─── YouTube channel scraper ──────────────────────────────────────────────────
// Scrapes the Morocco.AI YouTube channel page for video IDs + titles
// then fuzzy-matches to webinar titles

async function scrapeYouTubeChannel(): Promise<Map<string, string>> {
  // Map: normalized title → youtube watch URL
  const videoMap = new Map<string, string>()
  console.log('  Scraping YouTube channel...')

  const urls = [
    'https://www.youtube.com/@MoroccoAI/videos',
    'https://www.youtube.com/channel/UCS9NQGwx4ASydsKZBZ5wFrw/videos',
  ]

  for (const channelUrl of urls) {
    try {
      const html = await fetchWithRetry(channelUrl)

      // YouTube loads videos via JSON embedded in the page
      // Find ytInitialData
      const match = html.match(/var ytInitialData\s*=\s*(\{.+?\});\s*<\/script>/s)
        || html.match(/ytInitialData\s*=\s*(\{.+?\})(?:;|<)/s)

      if (!match) continue

      try {
        const data = JSON.parse(match[1])
        // Navigate the YT data structure to find video items
        const items: any[] = []

        function findVideoRenderers(obj: any, depth = 0) {
          if (depth > 15 || !obj || typeof obj !== 'object') return
          if (obj.videoId && obj.title) {
            const titleText = obj.title?.runs?.[0]?.text || obj.title?.simpleText || ''
            if (titleText) {
              items.push({ id: obj.videoId, title: titleText })
            }
          }
          for (const val of Object.values(obj)) {
            findVideoRenderers(val, depth + 1)
          }
        }

        findVideoRenderers(data)

        for (const item of items) {
          const normalized = item.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
          videoMap.set(normalized, `https://www.youtube.com/watch?v=${item.id}`)
        }

        console.log(`  Found ${items.length} videos on channel`)
        break
      } catch {
        // JSON parse failed
      }
    } catch (err: any) {
      console.warn(`  ⚠  YouTube channel scrape failed: ${err.message}`)
    }
  }

  return videoMap
}

function matchYouTubeUrl(webinarTitle: string, videoMap: Map<string, string>): string {
  if (videoMap.size === 0) return ''

  const normalize = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
  const wNorm = normalize(webinarTitle)

  // Exact match
  if (videoMap.has(wNorm)) return videoMap.get(wNorm)!

  // Partial match: find the video whose title has the most words in common
  let bestUrl = ''
  let bestScore = 0

  const wWords = new Set(wNorm.split(/\s+/).filter((w) => w.length > 3))

  for (const [vtitle, vurl] of videoMap) {
    const vWords = vtitle.split(/\s+/).filter((w) => w.length > 3)
    const matches = vWords.filter((w) => wWords.has(w)).length
    const score = matches / Math.max(wWords.size, 1)
    if (score > bestScore && score > 0.4) {
      bestScore = score
      bestUrl = vurl
    }
  }

  return bestUrl
}

async function scrapeMembers(): Promise<ScrapedMember[]> {
  console.log('\n── Scraping members from homepage...')
  const members: ScrapedMember[] = []
  try {
    const html = await fetchWithRetry('https://morocco.ai/')
    const $ = cheerio.load(html)

    // Common patterns for team/speaker sections in WP themes
    $('[class*="team"] .team-member, [class*="speaker"], .member-card, .person').each((_, el) => {
      const name =
        $(el).find('h3, h4, .name, [class*="name"]').first().text().trim()
      const role =
        $(el).find('p, .role, .position, [class*="title"], [class*="role"]').first().text().trim()
      const img =
        $(el).find('img').first().attr('src') ||
        $(el).find('img').first().attr('data-src') ||
        ''

      if (name && name.length > 2) {
        members.push({ name, role, imageUrl: img })
      }
    })

    // Also try the about page for team members
    if (members.length === 0) {
      console.log('  No members on homepage, trying /about/...')
      const aboutHtml = await fetchWithRetry('https://morocco.ai/about/')
      const $a = cheerio.load(aboutHtml)
      $a('[class*="team"] .team-member, [class*="member"], [class*="person"], .elementor-widget-container').each((_, el) => {
        const name = $a(el).find('h3, h4').first().text().trim()
        const role = $a(el).find('p').first().text().trim()
        const img = $a(el).find('img').first().attr('src') || ''
        if (name && name.length > 2 && name.length < 60) {
          members.push({ name, role, imageUrl: img })
        }
      })
    }
  } catch (err: any) {
    console.error(`  ❌  Members scrape failed: ${err.message}`)
  }
  console.log(`  Found ${members.length} members`)
  return members
}

async function scrapeStaticContent() {
  console.log('\n── Scraping static page content...')
  const content: Record<string, string> = {}

  const pages = [
    { key: 'homepage', url: 'https://morocco.ai/' },
    { key: 'about', url: 'https://morocco.ai/about/' },
    { key: 'conference', url: 'https://morocco.ai/conference/' },
    { key: 'podcasts', url: 'https://morocco.ai/podcasts/' },
  ]

  for (const page of pages) {
    try {
      console.log(`  ${page.url}`)
      const html = await fetchWithRetry(page.url)
      content[page.key] = html
      await sleep(DELAY_MS)
    } catch (err: any) {
      console.error(`  ❌  ${page.url}: ${err.message}`)
    }
  }

  return content
}

// ─── Static page updaters ─────────────────────────────────────────────────────

function extractTextBlocks($: cheerio.CheerioAPI, selector: string, limit = 3): string[] {
  const texts: string[] = []
  $(selector).each((_, el) => {
    const t = $(el).text().trim()
    if (t.length > 40) texts.push(t)
    if (texts.length >= limit) return false
  })
  return texts
}

function updateConferencePage(html: string) {
  console.log('\n── Updating conference page...')
  const $ = cheerio.load(html)

  // Try to extract conference editions
  const conferences: Array<{ year: string; title: string; date: string; location: string; description: string }> = []

  // Look for year headings or conference blocks
  $('h2, h3').each((_, el) => {
    const heading = $(el).text().trim()
    const yearMatch = heading.match(/\b(202[0-9])\b/)
    if (yearMatch) {
      const year = yearMatch[1]
      const desc = $(el).next('p').text().trim() || $(el).nextAll('p').first().text().trim()
      conferences.push({
        year,
        title: heading,
        date: '',
        location: '',
        description: desc,
      })
    }
  })

  console.log(`  Found ${conferences.length} conference editions`)
  return conferences
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const WEBINAR_URLS = [
  'https://morocco.ai/event/moroccoai-webinar-8-boosting-language/',
  'https://morocco.ai/event/moroccoai-webinar-8-vision-transformer/',
  'https://morocco.ai/event/moroccoai-webinar-9-distributional-reinforcement-learning/',
  'https://morocco.ai/event/moroccoai-webinar-10-eagle-ai-leveraging-ai-ml-for-plastic-marine-debris/',
  'https://morocco.ai/event/moroccoai-webinar-11-human-body-and-face-generation-a-deep-learning-approach/',
  'https://morocco.ai/event/moroccoai-webinar-12-the-promises-and-pitfalls-of-the-marginal-majority/',
  'https://morocco.ai/event/moroccoai-webinar-13-ai-for-immunology/',
  'https://morocco.ai/event/moroccoai-webinar-14-scaling-human-centered-machine-translation/',
  'https://morocco.ai/event/moroccoai-webinar-15-how-to-build-machine-learning-collaboratively/',
  'https://morocco.ai/event/moroccoai-webinar-16-robust-machine-learning/',
  'https://morocco.ai/event/moroccoai-webinar-17-laion-5b-an-open-large-scale-dataset-for-training-next-generation-image-text-models/',
  'https://morocco.ai/event/moroccoai-webinar-18-building-open-large-language-models-for-code/',
  'https://morocco.ai/event/moroccoai-webinar-19-confidence-learning-with-conformal-prediction-application-to-multi-target-regression/',
  'https://morocco.ai/event/moroccoai-webinar-20-explainability-of-attention-based-models-the-oncall-assistant-use-case/',
  'https://morocco.ai/event/moroccoai-webinar-21-how-can-we-use-mathematics-to-improve-deep-learning/',
  'https://morocco.ai/event/moroccoai-webinar-22-narrowing-precipitation-uncertainty-over-high-mountain-asia-with-probabilistic-machine-learning/',
  'https://morocco.ai/event/moroccoai-webinar-23-homomorphism-autoencoder-learning-group-structured-representations-from-interaction/',
  'https://morocco.ai/event/moroccoai-webinar-24-trustworthy-machine-learning-robustness-and-privacy/',
  'https://morocco.ai/event/moroccoai-webinar-25-unlocking-generative-models-insights-from-random-matrix-theory/',
  'https://morocco.ai/event/moroccoai-webinar-26-half-quadratic-quantization-of-large-machine-learning-models/',
  'https://morocco.ai/event/moroccoai-webinar-19-theoretically-upper-bounding-the-expected-adversarial-robustness-of-gnns/',
  'https://morocco.ai/event/moroccoai-webinar-22-algorithms-with-untrusted-predictions/',
  'https://morocco.ai/event/moroccoai-webinar-20-dr-afaf-taik-bias-in-machine-learning-models/',
  'https://morocco.ai/event/moroccoai-webinar-21-multimodal-ai-for-radiology-applications/',
  'https://morocco.ai/event/moroccoai-webinar-23-from-qubits-to-clinics-enhancing-cancer-diagnosis-with-quantum-machine-learning/',
  'https://morocco.ai/event/moroccoai-webinar-25-machine-translation-hallucination-detection/',
]

async function main() {
  console.log('\n🇲🇦  Morocco.AI — Scrape & Import\n')

  // ── STEP 1: Scrape all webinar pages ───────────────────────────────────────
  console.log('═══ STEP 1: Scraping webinar pages ═══')
  const webinars: ScrapedWebinar[] = []

  for (const url of WEBINAR_URLS) {
    const w = await scrapeWebinarPage(url)
    if (w) webinars.push(w)
    await sleep(DELAY_MS)
  }

  console.log(`\n  ✓ Scraped ${webinars.length} webinars`)

  // ── Match YouTube URLs ─────────────────────────────────────────────────────
  console.log('\n── Matching YouTube videos...')
  const ytMap = await scrapeYouTubeChannel()
  let ytMatched = 0
  for (const w of webinars) {
    if (!w.youtubeUrl) {
      const matched = matchYouTubeUrl(w.title, ytMap)
      if (matched) { w.youtubeUrl = matched; ytMatched++ }
    }
  }
  console.log(`  ✓ Matched ${ytMatched} YouTube URLs from channel`)

  // Save scraped data as JSON for debugging
  fs.writeFileSync('scripts/scraped-webinars.json', JSON.stringify(webinars, null, 2))
  console.log('  ✓ Saved to scripts/scraped-webinars.json')

  // ── STEP 2: Scrape members ─────────────────────────────────────────────────
  console.log('\n═══ STEP 2: Scraping members ═══')
  const members = await scrapeMembers()
  fs.writeFileSync('scripts/scraped-members.json', JSON.stringify(members, null, 2))

  // ── STEP 3: Scrape static pages ────────────────────────────────────────────
  console.log('\n═══ STEP 3: Scraping static pages ═══')
  const staticContent = await scrapeStaticContent()

  // ── STEP 4: Download speaker images ───────────────────────────────────────
  console.log('\n═══ STEP 4: Downloading speaker images ═══')

  // Map: imageUrl → local path
  const imageLocalPaths: Record<string, string> = {}

  const allImageSources = [
    ...webinars
      .filter((w) => w.speakerImageUrl)
      .map((w) => ({ url: w.speakerImageUrl, name: slugify(w.speakerName) })),
    ...members
      .filter((m) => m.imageUrl)
      .map((m) => ({ url: m.imageUrl, name: slugify(m.name) })),
  ]

  // Deduplicate by URL
  const seen = new Set<string>()
  const uniqueImages = allImageSources.filter((i) => {
    if (seen.has(i.url)) return false
    seen.add(i.url)
    return true
  })

  for (const img of uniqueImages) {
    const ext = img.url.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${img.name}.${ext}`
    const destPath = path.join(IMAGES_DIR, filename)

    if (fs.existsSync(destPath)) {
      console.log(`  ↩  ${filename} (cached)`)
      imageLocalPaths[img.url] = destPath
      continue
    }

    console.log(`  ↓  ${filename}`)
    const ok = await downloadImage(img.url, destPath)
    if (ok) imageLocalPaths[img.url] = destPath
    await sleep(300)
  }

  console.log(`  ✓ Downloaded ${Object.keys(imageLocalPaths).length} images`)

  // ── STEP 5: Upload images to Sanity ───────────────────────────────────────
  console.log('\n═══ STEP 5: Uploading images to Sanity ═══')

  // Map: imageUrl → sanity asset _id
  const sanityAssetIds: Record<string, string> = {}

  for (const [imgUrl, localPath] of Object.entries(imageLocalPaths)) {
    const filename = path.basename(localPath)
    console.log(`  ↑  ${filename}`)
    const assetId = await uploadImageToSanity(localPath, filename)
    if (assetId) sanityAssetIds[imgUrl] = assetId
    await sleep(200)
  }

  console.log(`  ✓ Uploaded ${Object.keys(sanityAssetIds).length} assets to Sanity`)

  // ── STEP 6: Import webinars to Sanity ─────────────────────────────────────
  console.log('\n═══ STEP 6: Importing webinars to Sanity ═══')

  let importedWebinars = 0
  let skippedWebinars = 0

  for (const w of webinars) {
    if (!w.title) { skippedWebinars++; continue }

    // Ensure unique slug
    let slug = w.slug
    if (!slug) slug = slugify(w.title)

    const exists = await documentExists('webinar', slug)
    if (exists) {
      console.log(`  ↩  Webinar exists: ${slug}`)
      skippedWebinars++
      continue
    }

    const doc: Record<string, unknown> = {
      _type: 'webinar',
      title: w.title,
      slug: { _type: 'slug', current: slug },
      date: w.date,
      speakerName: w.speakerName,
      speakerBio: w.speakerBio || undefined,
      description: w.description || undefined,
      youtubeUrl: w.youtubeUrl || undefined,
      tags: w.tags.length > 0 ? w.tags : undefined,
    }

    if (w.speakerImageUrl && sanityAssetIds[w.speakerImageUrl]) {
      doc.speakerImage = {
        _type: 'image',
        asset: { _type: 'reference', _ref: sanityAssetIds[w.speakerImageUrl] },
      }
    }

    try {
      await sanity.create(doc)
      console.log(`  ✓  ${w.title.slice(0, 60)}`)
      importedWebinars++
    } catch (err: any) {
      if (err.message?.includes('Insufficient permissions')) {
        console.error('\n❌  SANITY TOKEN ERROR: Your token is read-only.')
        console.error('   Fix: Go to https://www.sanity.io/manage/project/5vfa1g0e/api')
        console.error('   → Tokens → Add API token → choose "Editor" role → copy the sk... token')
        console.error('   → Paste in .env.local as SANITY_API_TOKEN=sk...\n')
        process.exit(1)
      }
      console.error(`  ❌  ${w.title}: ${err.message}`)
    }

    await sleep(200)
  }

  console.log(`\n  ✓ Imported ${importedWebinars} webinars (${skippedWebinars} skipped)`)

  // ── STEP 7: Import members to Sanity ──────────────────────────────────────
  console.log('\n═══ STEP 7: Importing members to Sanity ═══')

  let importedMembers = 0

  for (const m of members) {
    if (!m.name || m.name.length < 2) continue

    const slug = slugify(m.name)
    const exists = await documentExists('member', slug)
    if (exists) {
      console.log(`  ↩  Member exists: ${m.name}`)
      continue
    }

    const doc: Record<string, unknown> = {
      _type: 'member',
      name: m.name,
      slug: { _type: 'slug', current: slug },
      role: m.role || undefined,
    }

    if (m.imageUrl && sanityAssetIds[m.imageUrl]) {
      doc.image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: sanityAssetIds[m.imageUrl] },
      }
    }

    try {
      await sanity.create(doc)
      console.log(`  ✓  ${m.name}`)
      importedMembers++
    } catch (err: any) {
      if (err.message?.includes('Insufficient permissions')) {
        console.error('\n❌  SANITY TOKEN ERROR — fix token then re-run.\n')
        process.exit(1)
      }
      console.error(`  ❌  ${m.name}: ${err.message}`)
    }

    await sleep(200)
  }

  console.log(`  ✓ Imported ${importedMembers} members`)

  // ── STEP 8: Extract and write conference data ──────────────────────────────
  if (staticContent['conference']) {
    console.log('\n═══ STEP 8: Conference data extracted ═══')
    const conferences = updateConferencePage(staticContent['conference'])
    fs.writeFileSync('scripts/scraped-conferences.json', JSON.stringify(conferences, null, 2))
    console.log('  ✓ Saved to scripts/scraped-conferences.json')
    console.log('  → Review and manually update src/app/conference/page.tsx if needed')
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════')
  console.log('✅  Import complete!')
  console.log(`   Webinars: ${importedWebinars} imported`)
  console.log(`   Members:  ${importedMembers} imported`)
  console.log(`   Images:   ${Object.keys(sanityAssetIds).length} in Sanity`)
  console.log('\n   Check Sanity Studio: http://localhost:3333')
  console.log('   Check Next.js site:  http://localhost:3000/webinars')
  console.log('══════════════════════════════════════\n')
}

main().catch((err) => {
  console.error('\n💥 Fatal error:', err)
  process.exit(1)
})
