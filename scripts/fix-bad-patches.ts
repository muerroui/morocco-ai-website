/**
 * Revert bad data patches caused by false-positive name matching (score 0.50).
 * Unsets: wrongly assigned LinkedIn URLs and roles that are person names.
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function main() {
  console.log('\n🔧  Cleaning bad patches\n')

  // Members that got Walid Daou's LinkedIn (wrong 0.50 matches)
  const wrongLinkedIn = [
    'Pr. Mohamed Daoudi',
    'Tariq Daouda',
    'Rajaa El Hamdani',
  ]

  // Members that got wrong LinkedIn from Mehdi Bennis match
  const wrongBennis = ['Mohammed Amine Bennouna']

  // Members where role = another person's name (parsing artifact)
  // Rule: if role starts with "Prof." or "Dr." it's a person name, not a role
  const members = await sanity.fetch<Array<{
    _id: string; name: string; role?: string; linkedinUrl?: string; researchAreas?: string[]
  }>>(`*[_type == "member"]{ _id, name, role, linkedinUrl, researchAreas }`)

  for (const member of members) {
    const unset: string[] = []
    const setFields: Record<string, unknown> = {}

    // Fix wrong LinkedIn
    if (wrongLinkedIn.includes(member.name)) {
      // Walid Daou's URL was wrongly assigned
      if (member.linkedinUrl === 'https://www.linkedin.com/in/walid-daou001/?originalSubdomain=fr') {
        unset.push('linkedinUrl')
      }
      // Also unset research areas that came from wrong Daou match
      if (member.researchAreas?.includes('Machine Learning') || member.researchAreas?.includes('Deep Learning')) {
        // These might be legitimate from webinar tags — keep them
        // Only unset if they came from wrong conf match
        // For Daoudi: he's a Deep Learning prof — areas are likely correct
        // For Tariq Daouda: he's healthcare — check
        // For Rajaa El Hamdani: areas from Hamdioui match
        if (member.name === 'Rajaa El Hamdani') {
          unset.push('researchAreas')
        }
      }
    }

    if (wrongBennis.includes(member.name)) {
      if (member.linkedinUrl === 'https://www.linkedin.com/in/mehdi-bennis-56a4715') {
        unset.push('linkedinUrl')
      }
      // Research areas from Bennis (wireless/5G) are wrong for Bennouna (robust ML)
      if (member.researchAreas?.includes('5G/6G')) {
        setFields.researchAreas = ['Machine Learning']  // Bennouna's actual area
      }
    }

    // Fix role = person name (starts with Prof./Dr./Pr.)
    if (member.role && member.role.match(/^(Prof\.|Dr\.|Pr\.)\s+[A-Z]/)) {
      console.log(`  ⚠  "${member.name}" has role="${member.role}" (looks like person name)`)
      unset.push('role')
    }

    if (unset.length > 0 || Object.keys(setFields).length > 0) {
      let op = sanity.patch(member._id)
      if (Object.keys(setFields).length > 0) op = op.set(setFields)
      if (unset.length > 0) op = op.unset(unset)
      await op.commit()
      console.log(`  ✓  Fixed "${member.name}": unset [${unset.join(', ')}]${Object.keys(setFields).length > 0 ? ` set ${JSON.stringify(setFields)}` : ''}`)
      await sleep(100)
    }
  }

  console.log('\n✅  Cleanup done.')
}

main().catch(console.error)
