import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { SEO_BY_PATH, SITE_URL } from '../src/utils/seo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const NORMALIZED_SITE_URL = SITE_URL.replace(/\/$/, '');

const TOP_PRIORITY_PATHS = new Set(['/formatter']);
const MEDIUM_PRIORITY_PATHS = new Set(['/editor', '/diff', '/shrinker', '/json-types', '/json-toolkit', '/regex']);

function normalizePath(routePath) {
  if (routePath === '/') {
    return '/';
  }

  return routePath.endsWith('/') ? routePath.slice(0, -1) : routePath;
}

function getPriority(routePath) {
  if (routePath === '/') {
    return '1.0';
  }

  if (TOP_PRIORITY_PATHS.has(routePath)) {
    return '0.9';
  }

  if (MEDIUM_PRIORITY_PATHS.has(routePath)) {
    return '0.8';
  }

  if (routePath === '/apps') {
    return '0.5';
  }

  return '0.7';
}

function getChangeFreq(routePath) {
  return routePath === '/apps' ? 'monthly' : 'weekly';
}

function getRoutePaths() {
  return Object.keys(SEO_BY_PATH)
    .map(normalizePath)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => {
      if (a === '/') return -1;
      if (b === '/') return 1;
      return a.localeCompare(b);
    });
}

function buildRouteSitemapXml(routePaths, lastmod) {
  const urlsXml = routePaths
    .map((routePath) => {
      const fullUrl = `${NORMALIZED_SITE_URL}${routePath === '/' ? '/' : routePath}`;

      return [
        '  <url>',
        `    <loc>${fullUrl}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${getChangeFreq(routePath)}</changefreq>`,
        `    <priority>${getPriority(routePath)}</priority>`,
        '  </url>'
      ].join('\n');
    })
    .join('\n');

  return ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', urlsXml, '</urlset>', ''].join('\n');
}

function buildSitemapIndexXml(lastmod) {
  const routeSitemapUrl = `${NORMALIZED_SITE_URL}/sitemap.xml`;
  const indexEntries = [
    '  <sitemap>',
    `    <loc>${routeSitemapUrl}</loc>`,
    `    <lastmod>${lastmod}</lastmod>`,
    '  </sitemap>'
  ].join('\n');

  return ['<?xml version="1.0" encoding="UTF-8"?>', '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', indexEntries, '</sitemapindex>', ''].join('\n');
}

async function main() {
  const routePaths = getRoutePaths();
  const lastmod = new Date().toISOString().slice(0, 10);
  const routeSitemapPath = path.resolve(__dirname, '../public/sitemap.xml');
  const sitemapIndexPath = path.resolve(__dirname, '../public/sitemap-index.xml');

  const routeSitemapXml = buildRouteSitemapXml(routePaths, lastmod);
  const sitemapIndexXml = buildSitemapIndexXml(lastmod);

  await writeFile(routeSitemapPath, routeSitemapXml, 'utf8');
  await writeFile(sitemapIndexPath, sitemapIndexXml, 'utf8');

  console.log(`Sitemap generated at ${routeSitemapPath}`);
  console.log(`Optional sitemap index generated at ${sitemapIndexPath}`);
}

main().catch((error) => {
  console.error('Failed to generate sitemap:', error);
  process.exit(1);
});
