const res = await fetch('https://morocco.ai/webinars21/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
});
const html = await res.text();

// All unique image URLs in the page (any format)
const allImgs = [...new Set(
  (html.match(/https?:\/\/morocco\.ai\/wp-content\/uploads\/[^\s"'\\)>]+/gi) || [])
  .map(u => u.replace(/[\\'")\s>]+$/, ''))
  .filter(u => /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(u))
)];

console.log(`Found ${allImgs.length} unique image URLs:\n`);
allImgs.forEach(u => console.log(u));

// Check elementorFrontend config JSON
const cfgMatch = html.match(/elementorFrontend\.config\s*=\s*(\{.+?\});/s);
if (cfgMatch) {
  console.log('\n--- elementorFrontend.config found, length:', cfgMatch[1].length);
}

// Check for data-settings with url
const dataSettings = (html.match(/data-settings="([^"]{50,})"/g) || []).slice(0,3);
console.log('\ndata-settings samples:', dataSettings.map(s => s.substring(0,200)));
