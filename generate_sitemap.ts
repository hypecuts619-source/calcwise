import fs from 'fs';
import path from 'path';
import { CALCULATORS, CATEGORIES } from './src/constants.ts';

const domain = 'https://calcwise.quickconvertunits.com';
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// Add home
xml += `  <url>\n    <loc>${domain}/</loc>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n`;

// Add sitemap page
xml += `  <url>\n    <loc>${domain}/sitemap</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;

// Add other static pages
const staticPages = ['/about', '/privacy-policy', '/cookie-policy', '/faq'];
staticPages.forEach(p => {
  xml += `  <url>\n    <loc>${domain}${p}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.5</priority>\n  </url>\n`;
});

// Add categories
CATEGORIES.forEach(cat => {
  xml += `  <url>\n    <loc>${domain}/category/${cat.id}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
});

// Add calculators
CALCULATORS.forEach(calc => {
  xml += `  <url>\n    <loc>${domain}/calculator/${calc.slug}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
});

xml += `</urlset>`;

fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
console.log('Sitemap built at public/sitemap.xml');

