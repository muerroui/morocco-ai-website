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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// Known person names that ended up in role fields (conference HTML parsing artifacts)
const PERSON_NAME_ROLES = new Set([
  'Karim Amor',
  'Michael Conway',
  'Walid Daou',
  'Emad Mostaque',
])

async function main() {
  const members = await sanity.fetch<Array<{
    _id: string; name: string; role?: string; linkedinUrl?: string; researchAreas?: string[]
  }>>(`*[_type == "member"]{ _id, name, role, linkedinUrl, researchAreas }`)

  for (const member of members) {
    const unset: string[] = []

    // Role is another member's name (parsing artifact)
    if (member.role && PERSON_NAME_ROLES.has(member.role)) {
      unset.push('role')
    }

    // Rajaa El Hamdani — got Hamdioui's data via false 0.50 match
    if (member.name === 'Rajaa El Hamdani') {
      if (member.linkedinUrl === 'https://www.linkedin.com/in/saidhamdioui') unset.push('linkedinUrl')
      if (member.role === 'TU Delft - Cognitive IC, Netherlands') unset.push('role')
      if (member.researchAreas?.includes('In-Memory Computing')) unset.push('researchAreas')
    }

    if (unset.length > 0) {
      await sanity.patch(member._id).unset(unset).commit()
      console.log(`  ✓  "${member.name}": unset [${unset.join(', ')}]`)
      await sleep(100)
    }
  }

  console.log('Done.')
}

main().catch(console.error)
