/**
 * Fix migration:
 *  1. Scrape homepage swiper → name:imageUrl map
 *  2. Delete garbage members in Sanity
 *  3. Import real members (name + image)
 *  4. Patch existing webinars with matched speaker images
 *
 * Usage: npx tsx scripts/fix-migration.ts
 */

import * as cheerio from 'cheerio'
import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'

// ─── Config ──────────────────────────────────────────────────────────────────

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
  console.error('❌  SANITY_API_TOKEN not found in .env.local')
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

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ─── Name normalization ────────────────────────────────────────────────────────
// Strips honorifics and normalizes for fuzzy matching

function normalizeName(name: string): string {
  return name
    .replace(/^(Prof\.|Dr\.|Pr\.|Mr\.|Ms\.|Mrs\.|Ing\.)\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

// Score how well two names match (0=no match, 1=exact)
function nameMatchScore(a: string, b: string): number {
  const na = normalizeName(a)
  const nb = normalizeName(b)
  if (na === nb) return 1.0

  // Check if one contains the other
  if (na.includes(nb) || nb.includes(na)) return 0.9

  // Word overlap (last name is most important)
  const wa = na.split(' ')
  const wb = nb.split(' ')
  const lastName_a = wa[wa.length - 1]
  const lastName_b = wb[wb.length - 1]

  if (lastName_a === lastName_b) {
    // Same last name — check first name overlap
    const firstWords_a = wa.slice(0, -1)
    const firstWords_b = wb.slice(0, -1)
    const overlap = firstWords_a.filter((w) => firstWords_b.includes(w)).length
    return 0.7 + 0.3 * (overlap / Math.max(firstWords_a.length, 1))
  }

  // Partial last name match
  if (lastName_a.startsWith(lastName_b.slice(0, 4)) || lastName_b.startsWith(lastName_a.slice(0, 4))) {
    return 0.5
  }

  return 0
}

// ─── Image helpers ─────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[àáâãäå]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    .slice(0, 96)
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
    const contentType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg'
      : ext === 'png' ? 'image/png'
      : 'image/jpeg'
    const asset = await sanity.assets.upload('image', buffer, { filename, contentType })
    return asset._id
  } catch (err: any) {
    console.warn(`  ⚠  Upload failed for ${filename}: ${err.message}`)
    return null
  }
}

// ─── Scrape swiper ─────────────────────────────────────────────────────────────

interface SwiperPerson {
  name: string
  imageUrl: string
}

async function scrapeSwiperPersons(): Promise<SwiperPerson[]> {
  console.log('  Fetching homepage...')
  const res = await fetch('https://morocco.ai/', { headers: HEADERS, redirect: 'follow' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const html = await res.text()
  const $ = cheerio.load(html)

  const persons: SwiperPerson[] = []
  const seen = new Set<string>()

  $('.swiper-slide').each((_, el) => {
    const img = $(el).find('img.swiper-slide-image').first()
    const src = img.attr('src') || ''
    const alt = img.attr('alt') || ''

    if (src && alt && alt.length > 2 && !seen.has(alt)) {
      seen.add(alt)
      persons.push({ name: alt, imageUrl: src })
    }
  })

  // Also check for lazy-loaded images with data-src
  if (persons.length === 0) {
    $('img[data-src][alt]').each((_, el) => {
      const src = $(el).attr('data-src') || ''
      const alt = $(el).attr('alt') || ''
      if (src && alt.match(/[A-Z][a-z]+ [A-Z]/) && !seen.has(alt)) {
        seen.add(alt)
        persons.push({ name: alt, imageUrl: src })
      }
    })
  }

  return persons
}

// ─── Sanity queries ─────────────────────────────────────────────────────────────

async function getAllWebinars() {
  return sanity.fetch<Array<{ _id: string; speakerName: string; title: string; speakerImage?: unknown }>>(
    `*[_type == "webinar"]{ _id, title, speakerName, speakerImage }`
  )
}

async function getAllMembers() {
  return sanity.fetch<Array<{ _id: string; name: string; slug: { current: string } }>>(
    `*[_type == "member"]{ _id, name, slug }`
  )
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🇲🇦  Morocco.AI — Fix Migration\n')

  // ── STEP 1: Scrape swiper ──────────────────────────────────────────────────
  console.log('═══ STEP 1: Scraping homepage swiper ═══')
  const persons = await scrapeSwiperPersons()
  console.log(`  Found ${persons.length} persons in swiper`)
  persons.forEach((p) => console.log(`    "${p.name}" → ${p.imageUrl.split('/').pop()}`))

  // ── STEP 2: Download all images ───────────────────────────────────────────
  console.log('\n═══ STEP 2: Downloading images ═══')
  const localPaths: Record<string, string> = {}

  for (const person of persons) {
    const ext = person.imageUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${slugify(person.name)}.${ext}`
    const destPath = path.join(IMAGES_DIR, filename)

    if (fs.existsSync(destPath)) {
      console.log(`  ↩  ${filename} (cached)`)
      localPaths[person.imageUrl] = destPath
      continue
    }

    console.log(`  ↓  ${filename}`)
    const ok = await downloadImage(person.imageUrl, destPath)
    if (ok) localPaths[person.imageUrl] = destPath
    else console.warn(`  ⚠  Failed to download: ${person.imageUrl}`)
    await sleep(200)
  }

  console.log(`  ✓ ${Object.keys(localPaths).length} images downloaded`)

  // ── STEP 3: Upload images to Sanity ───────────────────────────────────────
  console.log('\n═══ STEP 3: Uploading to Sanity ═══')
  const assetIds: Record<string, string> = {}

  for (const [imgUrl, localPath] of Object.entries(localPaths)) {
    const filename = path.basename(localPath)
    const assetId = await uploadImageToSanity(localPath, filename)
    if (assetId) {
      assetIds[imgUrl] = assetId
      console.log(`  ↑  ${filename} → ${assetId}`)
    }
    await sleep(150)
  }

  console.log(`  ✓ ${Object.keys(assetIds).length} assets uploaded`)

  // Build name → assetId map
  const nameToAssetId = new Map<string, string>()
  for (const person of persons) {
    if (assetIds[person.imageUrl]) {
      nameToAssetId.set(person.name, assetIds[person.imageUrl])
    }
  }

  // ── STEP 4: Patch webinars with speaker images ─────────────────────────────
  console.log('\n═══ STEP 4: Patching webinar speaker images ═══')
  const webinars = await getAllWebinars()
  console.log(`  ${webinars.length} webinars in Sanity`)

  let patched = 0
  let notFound = 0

  for (const webinar of webinars) {
    if (webinar.speakerImage) {
      console.log(`  ↩  Already has image: ${webinar.speakerName}`)
      continue
    }

    // Find best matching person from swiper
    let bestPerson: SwiperPerson | null = null
    let bestScore = 0

    for (const person of persons) {
      const score = nameMatchScore(webinar.speakerName, person.name)
      if (score > bestScore) {
        bestScore = score
        bestPerson = person
      }
    }

    if (bestPerson && bestScore >= 0.5) {
      const assetId = assetIds[bestPerson.imageUrl]
      if (assetId) {
        await sanity
          .patch(webinar._id)
          .set({
            speakerImage: {
              _type: 'image',
              asset: { _type: 'reference', _ref: assetId },
            },
          })
          .commit()
        console.log(`  ✓  "${webinar.speakerName}" → matched "${bestPerson.name}" (score ${bestScore.toFixed(2)})`)
        patched++
      } else {
        console.log(`  ⚠  "${webinar.speakerName}" → matched "${bestPerson.name}" but no Sanity asset`)
        notFound++
      }
    } else {
      console.log(`  ✗  "${webinar.speakerName}" → no match (best: "${bestPerson?.name}" score ${bestScore.toFixed(2)})`)
      notFound++
    }

    await sleep(100)
  }

  console.log(`\n  Patched: ${patched} | No match: ${notFound}`)

  // ── STEP 5: Delete garbage members ────────────────────────────────────────
  console.log('\n═══ STEP 5: Cleaning garbage members ═══')
  const existingMembers = await getAllMembers()

  // Garbage if name looks like a policy/nav text (not a person name)
  const garbageNames = new Set([
    'Excellence & Continuous Improvement',
    'Stakeholder Satisfaction',
    'Compliance & Integrity',
    'Contact US',
    'Events',
    'Welcome to login system',
  ])

  let deleted = 0
  for (const member of existingMembers) {
    if (garbageNames.has(member.name) || member.name.length > 60) {
      await sanity.delete(member._id)
      console.log(`  ✗  Deleted: "${member.name}"`)
      deleted++
      await sleep(100)
    }
  }
  console.log(`  ✓ Deleted ${deleted} garbage members`)

  // ── STEP 6: Import real members ────────────────────────────────────────────
  console.log('\n═══ STEP 6: Importing real members ═══')

  // Get current member names to avoid duplicates
  const currentMembers = await getAllMembers()
  const currentMemberNames = new Set(currentMembers.map((m) => normalizeName(m.name)))

  let imported = 0
  let skipped = 0

  for (const person of persons) {
    const normalizedName = normalizeName(person.name)

    if (currentMemberNames.has(normalizedName)) {
      console.log(`  ↩  Already exists: ${person.name}`)
      skipped++
      continue
    }

    const slug = slugify(normalizeName(person.name))
    const assetId = assetIds[person.imageUrl]

    const doc: Record<string, unknown> = {
      _type: 'member',
      name: person.name,
      slug: { _type: 'slug', current: slug },
    }

    if (assetId) {
      doc.image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      }
    }

    try {
      await sanity.create(doc)
      console.log(`  ✓  ${person.name}`)
      imported++
      currentMemberNames.add(normalizedName)
    } catch (err: any) {
      if (err.statusCode === 409 || err.message?.includes('already exists')) {
        console.log(`  ↩  Conflict (slug taken): ${person.name}`)
        skipped++
      } else {
        console.error(`  ❌  ${person.name}: ${err.message}`)
      }
    }

    await sleep(150)
  }

  console.log(`  ✓ Imported ${imported} members (${skipped} skipped)`)

  // ── Summary ────────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════')
  console.log('✅  Fix complete!')
  console.log(`   Persons scraped:   ${persons.length}`)
  console.log(`   Images uploaded:   ${Object.keys(assetIds).length}`)
  console.log(`   Webinars patched:  ${patched}`)
  console.log(`   Members imported:  ${imported}`)
  console.log('\n   Sanity Studio: http://localhost:3333')
  console.log('══════════════════════════════════════\n')
}

main().catch((err) => {
  console.error('\n💥 Fatal:', err)
  process.exit(1)
})
