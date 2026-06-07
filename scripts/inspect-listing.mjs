const res = await fetch('https://morocco.ai/webinars21/', {
  headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
});
const html = await res.text();

// All img tags with any src-like attr
const imgTags = (html.match(/<img[^>]+>/gi) || []).slice(0, 20);
console.log('IMG TAGS:');
imgTags.forEach(t => console.log(t.substring(0, 200)));

// data-src
const dataSrcs = (html.match(/data-src="([^"]+)"/gi) || []);
console.log('\nDATA-SRC:', dataSrcs.slice(0, 5));

// All WP upload URLs
const wpUrls = [...new Set(html.match(/wp-content\/uploads\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi) || [])];
console.log('\nWP UPLOAD PATHS:', wpUrls.slice(0, 10));

// Check for background-image in style attrs
const bgImgs = (html.match(/background(?:-image)?[^;'"]*url\(['"](https?:\/\/[^'"]+)['"]\)/gi) || []).slice(0, 5);
console.log('\nBG IMAGES:', bgImgs);

// Snippet of body
const bodyIdx = html.indexOf('<body');
console.log('\n--- BODY START ---');
console.log(html.substring(bodyIdx, bodyIdx + 3000));
