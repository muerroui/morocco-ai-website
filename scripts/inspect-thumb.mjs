const res = await fetch('https://morocco.ai/event/moroccoai-webinar-8-boosting-language/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
});
const html = await res.text();

const ogMatch = html.match(/property="og:image"\s+content="([^"]+)"/) ||
                html.match(/content="([^"]+)"\s+property="og:image"/);
console.log('og:image:', ogMatch ? ogMatch[1] : 'none');

const wpImgs = (html.match(/https:\/\/morocco\.ai\/wp-content\/uploads\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi) || []);
console.log('WP upload images:', [...new Set(wpImgs)].slice(0, 8));

// Check meta tags area
const metaArea = html.substring(0, 3000);
console.log('\n--- META AREA ---');
console.log(metaArea.substring(0, 1500));
