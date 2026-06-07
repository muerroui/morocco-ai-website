const HEADERS = {
  'User-Agent': 'Mozilla/5.0 Windows AppleWebKit/537.36 Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json',
}

async function main() {
  // Get all registered post types
  const typesRes = await fetch('https://morocco.ai/wp-json/wp/v2/types', { headers: HEADERS })
  const types = await typesRes.json() as Record<string, { rest_base: string; name: string }>
  console.log('Post types:')
  for (const [key, t] of Object.entries(types)) {
    console.log(`  ${key} → rest_base: ${t.rest_base} name: ${t.name}`)
  }

  // Try fetching pages about conferences
  console.log('\nPages search "conference":')
  const pagesRes = await fetch('https://morocco.ai/wp-json/wp/v2/pages?search=conference&per_page=10', { headers: HEADERS })
  const pages = await pagesRes.json() as Array<{ id: number; slug: string; title: { rendered: string }; link: string }>
  pages.forEach(p => console.log(`  ${p.id} | ${p.slug} | ${p.link}`))

  // Check for posts
  console.log('\nPosts (first 5):')
  const postsRes = await fetch('https://morocco.ai/wp-json/wp/v2/posts?per_page=5&_fields=id,slug,title,date', { headers: HEADERS })
  const posts = await postsRes.json() as Array<{ id: number; slug: string; title: { rendered: string }; date: string }>
  posts.forEach(p => console.log(`  ${p.date.slice(0,10)} | ${p.slug}`))
}

main().catch(console.error)
