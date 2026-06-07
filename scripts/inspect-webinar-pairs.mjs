import * as cheerio from 'cheerio';

const PAGES = [
  { url: 'https://morocco.ai/webinars21/', year: '21' },
  { url: 'https://morocco.ai/webinars22/', year: '22' },
  { url: 'https://morocco.ai/webinars23/', year: '23' },
  { url: 'https://morocco.ai/webinars24/', year: '24' },
];

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

for (const page of PAGES) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`PAGE: ${page.url}`);
  console.log('='.repeat(60));

  const res = await fetch(page.url, { headers: { 'User-Agent': UA } });
  const html = await res.text();
  const $ = cheerio.load(html);

  // Find all webinar*.png images and their context
  $('img').each((_, el) => {
    const src = $(el).attr('src') || '';
    if (!src.includes('webinar') || src.includes('Webinar_Logo') || src.includes('logo')) return;

    // Walk up DOM to find a title nearby
    let title = '';
    let $parent = $(el).parent();
    for (let i = 0; i < 8; i++) {
      const text = $parent.find('h2, h3, h4, h5, strong, .elementor-heading-title').first().text().trim();
      if (text && text.length > 10 && text.length < 200) { title = text; break; }
      // Also check siblings
      const sibText = $parent.siblings().filter((_, s) => {
        const t = $(s).text().trim();
        return t.length > 10 && t.length < 200 && $(s).is('h2,h3,h4,h5,div,p');
      }).first().text().trim();
      if (sibText && sibText.length > 10) { title = sibText; break; }
      $parent = $parent.parent();
    }

    const filename = src.split('/').pop();
    console.log(`  IMG: ${filename}`);
    console.log(`  TITLE: ${title || '(not found)'}`);
    console.log('  ---');
  });

  // Also show all headings to understand page structure
  console.log('\nALL H2/H3/H4:');
  $('h2, h3, h4, .elementor-heading-title').each((_, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 5 && text.length < 300) {
      console.log(`  [${el.tagName}] ${text.substring(0, 120)}`);
    }
  });
}
