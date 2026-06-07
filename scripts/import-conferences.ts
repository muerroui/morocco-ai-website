/**
 * Import MoroccoAI annual conferences as Event documents in Sanity.
 * Usage: npx tsx scripts/import-conferences.ts
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

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'events')
fs.mkdirSync(IMAGES_DIR, { recursive: true })

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const CONFERENCES = [
  {
    slug: 'moroccoai-conference-2024',
    title: "MoroccoAI Annual Conference '24",
    date: '2024-12-04T09:00:00.000Z',
    location: 'Virtual',
    description: "The 4th MoroccoAI Annual Conference bringing together AI researchers, practitioners, and enthusiasts from Morocco and beyond.",
    registrationUrl: 'https://morocco.ai/events/conferences/MoroccoAI-Conference-2024/',
    imageUrl: 'https://morocco.ai/wp-content/uploads/2024/10/banner_exp.png',
  },
  {
    slug: 'moroccoai-conference-2023',
    title: "MoroccoAI Annual Conference '23",
    date: '2023-12-07T09:00:00.000Z',
    location: 'Rabat, Morocco',
    description: "The 3rd MoroccoAI Annual Conference gathering the AI community with keynotes from world-class researchers and industry leaders.",
    registrationUrl: 'https://morocco.ai/events/conferences/MoroccoAI-Conference-2023',
    imageUrl: 'https://morocco.ai/wp-content/uploads/2023/10/Conference-23-flyer-brainstorming-LinkedIn-Post-Flyer-A4-21-×-29.7-cm-Facebook-Cover.png',
  },
  {
    slug: 'moroccoai-conference-2022',
    title: 'MoroccoAI Annual Conference 2022',
    date: '2022-12-01T09:00:00.000Z',
    location: 'Rabat, Morocco',
    description: "The 2nd MoroccoAI Annual Conference featuring keynotes from leading AI researchers and practitioners.",
    registrationUrl: 'https://morocco.ai/conf22',
    imageUrl: 'https://morocco.ai/wp-content/uploads/2022/09/MoroccoAI-Conference-2022-wide.png',
  },
  {
    slug: 'moroccoai-conference-2021',
    title: "MoroccoAI Annual Conference '21",
    date: '2021-12-11T09:00:00.000Z',
    location: 'Virtual',
    description: "The 1st MoroccoAI Annual Conference connecting AI researchers, students, and professionals across Morocco and the world.",
    registrationUrl: 'https://morocco.ai/events/conferences/MoroccoAI-conf-2021/index.html',
    imageUrl: 'https://morocco.ai/wp-content/uploads/2020/03/website-conference-pic.png',
  },
]

async function downloadImage(imageUrl: string, destPath: string): Promise<boolean> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(imageUrl, {
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 Windows AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36' },
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
    const ct = ext === 'png' ? 'image/png' : 'image/jpeg'
    const asset = await sanity.assets.upload('image', buffer, { filename, contentType: ct })
    return asset._id
  } catch (err: any) {
    console.warn(`  ⚠  Upload failed: ${err.message}`)
    return null
  }
}

async function main() {
  console.log('\n🇲🇦  Importing MoroccoAI Conferences\n')

  for (const conf of CONFERENCES) {
    console.log(`\n── ${conf.title}`)

    // Check if already exists
    const exists = await sanity.fetch(`*[_type == "event" && slug.current == $slug][0]._id`, { slug: conf.slug })
    if (exists) { console.log(`  ↩  Already exists`); continue }

    // Download image
    const ext = conf.imageUrl.split('?')[0].split('.').pop()?.toLowerCase() || 'png'
    const filename = `${conf.slug}.${ext}`
    const destPath = path.join(IMAGES_DIR, filename)
    let assetId: string | null = null

    if (fs.existsSync(destPath)) {
      console.log(`  ↩  Image cached: ${filename}`)
    } else {
      console.log(`  ↓  Downloading: ${filename}`)
      await downloadImage(conf.imageUrl, destPath)
    }

    if (fs.existsSync(destPath)) {
      console.log(`  ↑  Uploading to Sanity...`)
      assetId = await uploadImageToSanity(destPath, filename)
      if (assetId) console.log(`     → ${assetId.slice(0, 50)}...`)
    }

    // Create Sanity document
    const doc: Record<string, unknown> = {
      _type: 'event',
      title: conf.title,
      slug: { _type: 'slug', current: conf.slug },
      date: conf.date,
      location: conf.location,
      description: conf.description,
      registrationUrl: conf.registrationUrl,
    }

    if (assetId) {
      doc.image = { _type: 'image', asset: { _type: 'reference', _ref: assetId } }
    }

    await sanity.create(doc)
    console.log(`  ✓  Imported${assetId ? ' with image' : ' (no image)'}`)
    await sleep(200)
  }

  console.log('\n✅  Done. Check Sanity Studio → Events')
}

main().catch(console.error)
