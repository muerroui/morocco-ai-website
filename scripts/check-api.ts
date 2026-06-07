const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'application/json',
}

async function main() {
  // Check tribe events API
  const urls = [
    'https://morocco.ai/wp-json/tribe/events/v1/events?per_page=5',
    'https://morocco.ai/wp-json/wp/v2/tribe_events?per_page=5',
    'https://morocco.ai/wp-json/wp/v2/posts?per_page=5&categories=conferences',
    'https://morocco.ai/wp-json/wp/v2/types',
  ]

  for (const url of urls) {
    console.log(`\n── ${url}`)
    try {
      const res = await fetch(url, { headers: HEADERS })
      console.log(`  Status: ${res.status}`)
      const text = await res.text()
      console.log(`  Body (first 500): ${text.slice(0, 500)}`)
    } catch (err: any) {
      console.log(`  Error: ${err.message}`)
    }
  }
}

main().catch(console.error)
