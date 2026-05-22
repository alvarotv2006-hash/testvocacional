// scripts/generate-sitemap.js
// Ejecutar después del build: node scripts/generate-sitemap.js

import { writeFileSync } from 'fs'
import { articles } from '../src/data/articles.js'
import { quizzes } from '../src/data/quizzes.js'

const BASE = 'https://www.testvocacional.es'
const today = new Date().toISOString().split('T')[0]

const staticRoutes = [
  { url: '/',           priority: '1.0', changefreq: 'weekly' },
  { url: '/tests',      priority: '0.95', changefreq: 'weekly' },
  { url: '/blog',       priority: '0.9',  changefreq: 'weekly' },
  { url: '/privacidad', priority: '0.3',  changefreq: 'yearly' },
  { url: '/aviso-legal',priority: '0.3',  changefreq: 'yearly' },
]

const quizRoutes = quizzes.map(q => ({
  url: `/tests/${q.slug}`,
  priority: '0.9',
  changefreq: 'monthly',
  lastmod: today,
}))

const articleRoutes = articles.map(a => ({
  url: `/blog/${a.slug}`,
  priority: '0.8',
  changefreq: 'monthly',
  lastmod: a.date,
}))

const allRoutes = [...staticRoutes, ...quizRoutes, ...articleRoutes]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes.map(r => `  <url>
    <loc>${BASE}${r.url}</loc>
    <lastmod>${r.lastmod || today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`).join('\n')}
</urlset>`

writeFileSync('./dist/sitemap.xml', xml)
console.log(`✅ Sitemap generado con ${allRoutes.length} URLs`)
