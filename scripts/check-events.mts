import { createClient } from '@sanity/client'
import * as fs from 'fs'
function loadEnv() {
  const lines = fs.readFileSync('.env.local', 'utf8').split('\n')
  for (const line of lines) {
    const [key, ...rest] = line.split('=')
    if (key && rest.length) process.env[key.trim()] = rest.join('=').trim()
  }
}
loadEnv()
const sanity = createClient({ projectId: '5vfa1g0e', dataset: 'production', apiVersion: '2024-01-01', token: process.env.SANITY_API_TOKEN, useCdn: false })
sanity.fetch(`*[_type == 'event']{ _id, title, image, date } | order(date desc)`).then(r => { console.log('COUNT:', r.length); r.slice(0,5).forEach(e => console.log(e.title, '| image:', !!e.image)) }).catch(console.error)
