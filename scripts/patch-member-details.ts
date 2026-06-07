/**
 * Patch member LinkedIn URLs, roles, and research areas from:
 *  1. Conference speaker pages (2021/2022/2023)
 *  2. Webinar scraped data (speakerBio + tags as fallback)
 *
 * Usage: npx tsx scripts/patch-member-details.ts
 */

import * as cheerio from 'cheerio'
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
  projectId: '5vfa1g0e',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

interface SpeakerData {
  name: string
  role: string
  linkedinUrl: string
  bio: string
  researchAreas: string[]
}

// Strip accents + honorifics, lowercase
function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')     // strip accents
    .replace(/^(Prof\.|Dr\.|Pr\.|Mr\.|Ms\.|Mrs\.)\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

function nameMatchScore(a: string, b: string): number {
  const na = normalizeName(a)
  const nb = normalizeName(b)
  if (na === nb) return 1.0
  if (na.includes(nb) || nb.includes(na)) return 0.9
  const wa = na.split(' ')
  const wb = nb.split(' ')
  const lastName_a = wa[wa.length - 1]
  const lastName_b = wb[wb.length - 1]
  if (lastName_a === lastName_b) {
    const firstWords_a = wa.slice(0, -1)
    const firstWords_b = wb.slice(0, -1)
    const overlap = firstWords_a.filter((w) => firstWords_b.includes(w)).length
    return 0.7 + 0.3 * (overlap / Math.max(firstWords_a.length, 1))
  }
  if (lastName_a.startsWith(lastName_b.slice(0, 4)) || lastName_b.startsWith(lastName_a.slice(0, 4))) {
    return 0.5
  }
  return 0
}

function detectResearchAreas(text: string): string[] {
  const areas: string[] = []
  const patterns: [string, RegExp][] = [
    ['NLP', /\bnlp\b|natural language|language model|machine translation/i],
    ['Computer Vision', /computer vision|image recognition|vision transformer|radiology/i],
    ['Reinforcement Learning', /reinforcement learning/i],
    ['Machine Learning', /machine learning/i],
    ['Deep Learning', /deep learning|neural network/i],
    ['LLMs', /large language model|llm\b|open.*code.*model/i],
    ['Generative AI', /generative|diffusion|gan\b|autoencoder/i],
    ['Healthcare', /health|medical|cancer|clinical|immunology/i],
    ['Privacy & Security', /privacy|federated|adversarial|security/i],
    ['Climate', /climate|weather|energy|power grid/i],
    ['Robotics', /robot/i],
    ['Signal Processing', /signal processing/i],
    ['Distributed Systems', /distributed/i],
    ['5G/6G', /\b5g\b|\b6g\b|wireless|radio/i],
    ['Quantum', /quantum/i],
    ['In-Memory Computing', /in-memory/i],
    ['Optimization', /optimiz/i],
  ]
  for (const [area, pat] of patterns) {
    if (pat.test(text)) areas.push(area)
  }
  return areas
}

// ─── Scrape conference pages using img[alt] as anchor ─────────────────────────

async function scrapeConferencePage(url: string): Promise<SpeakerData[]> {
  console.log(`  Fetching ${url}`)
  try {
    const res = await fetch(url, { headers: HEADERS, redirect: 'follow' })
    if (!res.ok) { console.log(`    HTTP ${res.status}`); return [] }
    const html = await res.text()
    const $ = cheerio.load(html)

    const speakers: SpeakerData[] = []

    // Anchor on <img> with person-name alt text
    $('img[alt]').each((_, imgEl) => {
      const alt = $(imgEl).attr('alt') || ''
      // Must look like a person name: "Firstname Lastname" or "Prof. X Y"
      if (!alt.match(/[A-Z][a-z].+[A-Z][a-z]/) || alt.length > 80) return
      if (alt.match(/^(logo|banner|icon|background)/i)) return

      // Walk forward from the img's parent to collect related elements
      // Strategy: find the nearest heading sibling or parent heading
      const parent = $(imgEl).parent()
      const grandparent = parent.parent()

      // Name from alt (most reliable)
      const name = alt

      // LinkedIn: nearest <a> after the image container
      let linkedinUrl = ''
      // Search in the enclosing section (up to 5 levels up)
      let container = grandparent
      for (let i = 0; i < 5; i++) {
        const links = container.find('a[href]')
        links.each((_, a) => {
          const href = $(a).attr('href') || ''
          if ((href.includes('linkedin.com') || href.includes('twitter.com') || href.includes('people.') || href.startsWith('https://')) && !linkedinUrl) {
            // Must be a social/profile link, not a navigation link
            if (href.includes('linkedin') || href.includes('twitter') || href.includes('people.eecs') || href.includes('cs.toronto')) {
              linkedinUrl = href
            }
          }
        })
        if (linkedinUrl) break
        container = container.parent()
      }

      // Role + bio: headings and paragraphs near the image
      let role = ''
      let bio = ''

      // Look for text in the same section as the image
      let textContainer = grandparent
      for (let i = 0; i < 4; i++) {
        const headings = textContainer.find('h2,h3,h4,h5,h6').map((_, h) => $(h).text().trim()).get()
        const paras = textContainer.find('p').map((_, p) => $(p).text().trim()).get()

        // Role: first heading that isn't the name itself and isn't too long (org/title)
        for (const h of headings) {
          if (h === name || normalizeName(h) === normalizeName(name)) continue
          if (h.length < 5 || h.length > 150) continue
          // Skip if it looks like a section header
          if (h.match(/^(Keynote|Speaker|Honorary|Special|Panel|Session|MoroccoAI)/i)) continue
          if (!role) { role = h; break }
        }

        // Bio: longest paragraph
        for (const p of paras) {
          if (p.length > bio.length && p.length > 50) bio = p
        }

        if (role && bio) break
        textContainer = textContainer.parent()
      }

      const researchAreas = detectResearchAreas(role + ' ' + bio)

      speakers.push({ name, role: role.slice(0, 200), linkedinUrl, bio: bio.slice(0, 500), researchAreas })
    })

    return speakers
  } catch (err: any) {
    console.log(`    Failed: ${err.message}`)
    return []
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🇲🇦  Patch member details (pass 2)\n')

  // Load webinar data as fallback for speaker roles/areas
  const webinarsRaw = JSON.parse(fs.readFileSync('scripts/scraped-webinars.json', 'utf8')) as Array<{
    title: string
    speakerName: string
    speakerBio: string
    tags: string[]
  }>

  // Map: normalized speaker name → webinar data
  const webinarMap = new Map<string, { role: string; researchAreas: string[] }>()
  for (const w of webinarsRaw) {
    if (w.speakerBio || w.tags.length > 0) {
      webinarMap.set(normalizeName(w.speakerName), {
        role: w.speakerBio.replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').trim(),
        researchAreas: w.tags,
      })
    }
  }
  console.log(`  ${webinarMap.size} webinar speakers with bio/tags data`)

  // Scrape conference pages
  console.log('\n═══ Scraping conference speaker pages ═══')
  const [speakers2023, speakers2022, speakers2021] = await Promise.all([
    scrapeConferencePage('https://morocco.ai/events/conferences/MoroccoAI-Conference-2023/pages/speakers.html'),
    scrapeConferencePage('https://morocco.ai/events/conferences/MoroccoAI-Conference-2022/pages/speakers.html'),
    scrapeConferencePage('https://www.morocco.ai/events/conferences/MoroccoAI-conf-2021/pages/speakers.html'),
  ])

  console.log(`  2023: ${speakers2023.length} speakers`)
  console.log(`  2022: ${speakers2022.length} speakers`)
  console.log(`  2021: ${speakers2021.length} speakers`)

  // Merge conference data — prefer later years
  const confMap = new Map<string, SpeakerData>()
  for (const s of [...speakers2021, ...speakers2022, ...speakers2023]) {
    const key = normalizeName(s.name)
    const existing = confMap.get(key)
    if (!existing) {
      confMap.set(key, s)
    } else {
      confMap.set(key, {
        name: s.name || existing.name,
        role: s.role || existing.role,
        linkedinUrl: s.linkedinUrl || existing.linkedinUrl,
        bio: s.bio || existing.bio,
        researchAreas: [...new Set([...existing.researchAreas, ...s.researchAreas])],
      })
    }
  }
  console.log(`  Total unique: ${confMap.size}`)

  // Save for inspection
  fs.writeFileSync('scripts/scraped-speaker-details.json', JSON.stringify([...confMap.values()], null, 2))

  // Get all Sanity members
  console.log('\n═══ Fetching Sanity members ═══')
  const members = await sanity.fetch<Array<{
    _id: string; name: string; role?: string; linkedinUrl?: string; researchAreas?: string[]
  }>>(`*[_type == "member"]{ _id, name, role, linkedinUrl, researchAreas }`)
  console.log(`  ${members.length} members`)

  // Match and patch
  console.log('\n═══ Matching & patching ═══')
  let patched = 0
  let noData = 0

  for (const member of members) {
    // 1. Try conference pages first
    let bestConf: SpeakerData | null = null
    let bestConfScore = 0
    for (const [, speaker] of confMap) {
      const score = nameMatchScore(member.name, speaker.name)
      if (score > bestConfScore) { bestConfScore = score; bestConf = speaker }
    }

    // 2. Webinar fallback
    let webinarData: { role: string; researchAreas: string[] } | null = null
    for (const [key, data] of webinarMap) {
      const score = nameMatchScore(member.name, key)
      if (score >= 0.6 && data.role) { webinarData = data; break }
    }

    // Build patch
    const patch: Record<string, unknown> = {}

    // Role: from conference (score >= 0.5) or webinar bio
    if (!member.role) {
      if (bestConf && bestConfScore >= 0.5 && bestConf.role) {
        patch.role = bestConf.role
      } else if (webinarData?.role) {
        patch.role = webinarData.role
      }
    }

    // LinkedIn: from conference only
    if (!member.linkedinUrl && bestConf && bestConfScore >= 0.5 && bestConf.linkedinUrl) {
      patch.linkedinUrl = bestConf.linkedinUrl
    }

    // Research areas: conference first, then webinar tags
    if (!member.researchAreas || member.researchAreas.length === 0) {
      const confAreas = bestConf && bestConfScore >= 0.5 ? bestConf.researchAreas : []
      const webAreas = webinarData?.researchAreas || []
      const merged = [...new Set([...confAreas, ...webAreas])]
      if (merged.length > 0) patch.researchAreas = merged
    }

    if (Object.keys(patch).length === 0) {
      if (!member.role && !member.linkedinUrl) {
        console.log(`  ✗  No data found: "${member.name}"`)
        noData++
      } else {
        console.log(`  ↩  Already has data: "${member.name}"`)
      }
      continue
    }

    await sanity.patch(member._id).set(patch).commit()
    const matchInfo = bestConf && bestConfScore >= 0.5
      ? `conf "${bestConf.name}" (${bestConfScore.toFixed(2)})`
      : 'webinar bio'
    console.log(`  ✓  "${member.name}" [${matchInfo}]`)
    if (patch.role) console.log(`       role: ${patch.role}`)
    if (patch.linkedinUrl) console.log(`       linkedin: ${patch.linkedinUrl}`)
    if (patch.researchAreas) console.log(`       areas: ${(patch.researchAreas as string[]).join(', ')}`)
    patched++
    await sleep(100)
  }

  console.log(`\n  Patched: ${patched} | No data: ${noData}`)
  console.log('\n✅  Done.')
}

main().catch((err) => {
  console.error('\n💥 Fatal:', err)
  process.exit(1)
})
