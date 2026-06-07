/**
 * Fix Members in Sanity
 *
 * 1. Deletes the 6 garbage member docs (footer/values text)
 * 2. Creates real members from webinar speakers (real people with real roles)
 * 3. Updates webinars with YouTube URLs from RSS feed
 *
 * Usage: npx tsx scripts/fix-members.ts
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
}
loadEnv()

const sanity = createClient({
  projectId: '5vfa1g0e',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

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

// ── Step 1: Delete garbage members ─────────────────────────────────────────────

const GARBAGE_NAMES = [
  'Excellence & Continuous Improvement',
  'Stakeholder Satisfaction',
  'Compliance & Integrity',
  'Contact US',
  'Events',
  'Welcome to login system',
]

async function deleteGarbageMembers() {
  console.log('\n── Deleting garbage member docs...')
  let deleted = 0

  for (const name of GARBAGE_NAMES) {
    const slug = slugify(name)
    const id = await sanity.fetch<string>(
      `*[_type == "member" && slug.current == $slug][0]._id`,
      { slug }
    )
    if (id) {
      await sanity.delete(id)
      console.log(`  ✓ Deleted: ${name}`)
      deleted++
    } else {
      // Try by name directly
      const id2 = await sanity.fetch<string>(
        `*[_type == "member" && name == $name][0]._id`,
        { name }
      )
      if (id2) {
        await sanity.delete(id2)
        console.log(`  ✓ Deleted (by name): ${name}`)
        deleted++
      } else {
        console.log(`  ↩ Not found: ${name}`)
      }
    }
  }

  console.log(`  Total deleted: ${deleted}`)
}

// ── Step 2: Fetch YouTube URLs from RSS ────────────────────────────────────────

async function fetchYouTubeRSS(): Promise<Map<string, string>> {
  const map = new Map<string, string>() // normalized title → watch URL
  try {
    const res = await fetch(
      'https://www.youtube.com/feeds/videos.xml?channel_id=UCS9NQGwx4ASydsKZBZ5wFrw',
      {
        headers: { 'User-Agent': 'Mozilla/5.0 Chrome/124', 'Accept': 'application/xml' },
        signal: AbortSignal.timeout(15000),
      }
    )
    const xml = await res.text()
    const entryRe = /<entry>([\s\S]*?)<\/entry>/g
    let m: RegExpExecArray | null
    while ((m = entryRe.exec(xml)) !== null) {
      const titleM = m[1].match(/<title>([^<]+)<\/title>/)
      const idM = m[1].match(/<yt:videoId>([^<]+)<\/yt:videoId>/)
      if (titleM && idM) {
        const norm = titleM[1].toLowerCase().replace(/&amp;/g, '&').replace(/[^a-z0-9\s]/g, '').trim()
        map.set(norm, `https://www.youtube.com/watch?v=${idM[1]}`)
      }
    }
    console.log(`  ✓ Found ${map.size} videos in RSS feed`)
  } catch (err: any) {
    console.warn(`  ⚠ YouTube RSS failed: ${err.message}`)
  }
  return map
}

// Words too common across all webinar titles to be useful for matching
const YT_STOPWORDS = new Set(['moroccoai', 'webinar', 'webinars', 'machine', 'learning', 'deep', 'from', 'with', 'using', 'based', 'model', 'models', 'data', 'neural', 'network', 'artificial', 'intelligence'])

function matchYouTubeUrl(title: string, map: Map<string, string>): string {
  if (map.size === 0) return ''
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
  const wNorm = norm(title)

  // Exact
  if (map.has(wNorm)) return map.get(wNorm)!

  // Word overlap — exclude stopwords so common tokens don't inflate score
  const significant = (w: string) => w.length > 3 && !YT_STOPWORDS.has(w)
  const wWords = new Set(wNorm.split(/\s+/).filter(significant))
  if (wWords.size < 2) return '' // not enough signal

  let bestUrl = ''
  let bestScore = 0
  for (const [vtitle, vurl] of map) {
    const vWords = vtitle.split(/\s+/).filter(significant)
    const hits = vWords.filter((w) => wWords.has(w)).length
    const score = hits / Math.max(wWords.size, 1)
    if (score > bestScore && score >= 0.5) { // require ≥50% significant word overlap
      bestScore = score
      bestUrl = vurl
    }
  }
  return bestUrl
}

// ── Step 3: Import members from webinar speakers ───────────────────────────────

interface WebinarRecord {
  title: string
  slug: string
  date: string
  speakerName: string
  speakerBio: string
  speakerImageUrl: string
  tags: string[]
  youtubeUrl: string
}

async function importSpeakersAsMembers(webinars: WebinarRecord[]) {
  console.log('\n── Importing webinar speakers as community members...')

  // Deduplicate by speaker name
  const seen = new Set<string>()
  const speakers: { name: string; role: string; tags: string[] }[] = []

  for (const w of webinars) {
    const name = w.speakerName.trim()
    if (!name || name === 'Morocco.AI Speaker' || seen.has(name)) continue
    seen.add(name)

    // Clean up bio — strip leading &nbsp; and whitespace
    const rawBio = w.speakerBio || ''
    const cleanBio = rawBio
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    // Extract role (first sentence / up to 120 chars)
    const role = cleanBio.slice(0, 120).split(/\.\s/)[0].trim()

    speakers.push({ name, role, tags: w.tags })
  }

  console.log(`  ${speakers.length} unique speakers to import`)
  let imported = 0

  for (const sp of speakers) {
    const slug = slugify(sp.name)
    const existing = await sanity.fetch<string>(
      `*[_type == "member" && slug.current == $slug][0]._id`,
      { slug }
    )
    if (existing) {
      console.log(`  ↩ Exists: ${sp.name}`)
      continue
    }

    const doc: Record<string, unknown> = {
      _type: 'member',
      name: sp.name,
      slug: { _type: 'slug', current: slug },
      role: sp.role || undefined,
    }

    try {
      await sanity.create(doc)
      console.log(`  ✓ ${sp.name}${sp.role ? ' — ' + sp.role.slice(0, 50) : ''}`)
      imported++
    } catch (err: any) {
      console.error(`  ❌ ${sp.name}: ${err.message}`)
    }

    await new Promise((r) => setTimeout(r, 150))
  }

  console.log(`  ✓ Imported ${imported} members`)
  return imported
}

// ── Step 4: Update webinars with YouTube URLs ──────────────────────────────────

async function updateWebinarYouTubeUrls(webinars: WebinarRecord[], ytMap: Map<string, string>) {
  console.log('\n── Updating webinar YouTube URLs from RSS...')
  let updated = 0

  for (const w of webinars) {
    const ytUrl = matchYouTubeUrl(w.title, ytMap)
    if (!ytUrl) continue

    // Get the Sanity doc id
    const id = await sanity.fetch<string>(
      `*[_type == "webinar" && slug.current == $slug][0]._id`,
      { slug: w.slug }
    )
    if (!id) continue

    try {
      await sanity.patch(id).set({ youtubeUrl: ytUrl }).commit()
      console.log(`  ✓ ${w.title.slice(0, 55)} → ${ytUrl.split('v=')[1]}`)
      updated++
    } catch (err: any) {
      console.warn(`  ⚠ ${w.slug}: ${err.message}`)
    }

    await new Promise((r) => setTimeout(r, 150))
  }

  console.log(`  ✓ Updated ${updated} webinars with YouTube URLs`)
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🇲🇦  Morocco.AI — Fix Members & YouTube\n')

  // Delete garbage
  await deleteGarbageMembers()

  // Load scraped webinars
  const webinarsPath = path.join(process.cwd(), 'scripts', 'scraped-webinars.json')
  if (!fs.existsSync(webinarsPath)) {
    console.error('❌ scraped-webinars.json not found. Run the main scrape script first.')
    process.exit(1)
  }
  const webinars: WebinarRecord[] = JSON.parse(fs.readFileSync(webinarsPath, 'utf8'))
  console.log(`\n  Loaded ${webinars.length} webinars from scraped-webinars.json`)

  // YouTube RSS
  console.log('\n── Fetching YouTube RSS...')
  const ytMap = await fetchYouTubeRSS()

  // Update webinars with any YouTube URLs we can match
  if (ytMap.size > 0) {
    await updateWebinarYouTubeUrls(webinars, ytMap)
  }

  // Import speakers as members
  await importSpeakersAsMembers(webinars)

  console.log('\n══════════════════════════════════════')
  console.log('✅  Fix complete!')
  console.log('   → http://localhost:3333 (Sanity Studio)')
  console.log('   → http://localhost:3000/members')
  console.log('══════════════════════════════════════\n')
}

main().catch((err) => {
  console.error('\n💥 Fatal:', err)
  process.exit(1)
})
