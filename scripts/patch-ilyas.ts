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

const sanity = createClient({
  projectId: '5vfa1g0e', dataset: 'production',
  apiVersion: '2024-01-01', token: process.env.SANITY_API_TOKEN, useCdn: false,
})

async function run() {
  const webinar = await sanity.fetch<{ _id: string; speakerName: string } | null>(
    `*[_type=="webinar" && speakerName=="Ilyas Malik"][0]{_id, speakerName}`
  )
  console.log('Webinar:', webinar)

  const asset = await sanity.fetch<{ _id: string; originalFilename: string } | null>(
    `*[_type=="sanity.imageAsset" && originalFilename match "ilyas*"][0]{_id, originalFilename}`
  )
  console.log('Asset:', asset)

  if (webinar?._id && asset?._id) {
    await sanity.patch(webinar._id).set({
      speakerImage: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } },
    }).commit()
    console.log('✓ Patched Ilyas Malik speaker image')
  } else {
    console.log('Missing webinar or asset — check above')
  }
}

run().catch(console.error)
