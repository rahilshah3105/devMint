# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## SEO and Google Search Console Setup

This project already includes:

- `meta` SEO tags in `index.html`
- Google verification token in `index.html`
- Google verification HTML file in `public/googled1a543d80e38cfa9.html`
- `robots.txt` in `public/robots.txt`
- `sitemap.xml` in `public/sitemap.xml`

### Steps to complete Google Search Console

1. Deploy the latest build to your production domain.
2. Open Google Search Console and add your property.
3. Prefer **Domain property** (DNS verification) if you manage DNS. Otherwise use **URL prefix**.
4. For URL prefix verification, use one of these methods:
	- HTML file: keep `public/googled1a543d80e38cfa9.html` deployed and accessible.
	- HTML tag: keep `<meta name="google-site-verification" ...>` in `index.html`.
5. Verify the file works by opening:
	- `https://code-line-formatter.vercel.app/googled1a543d80e38cfa9.html`
6. In Search Console, go to **Sitemaps** and submit:
	- `https://code-line-formatter.vercel.app/sitemap.xml`
7. Use **URL Inspection** and request indexing for key pages (home and top tools).
8. Check **Coverage/Pages** and **Enhancements** after 24-72 hours for crawl or indexing issues.
9. Keep canonical URLs, robots, and sitemap entries consistent with your live routes.

### Optional but recommended

- Set up Google Analytics 4 and link GA4 with Search Console.
- Monitor Core Web Vitals in Search Console and improve low-scoring pages.

### Automatic sitemap generation

Sitemap is now generated from route entries in `src/utils/seo.js`.

- Run manually: `npm run sitemap:generate`
- Runs automatically before every production build via `prebuild`
- Output files:
	- `public/sitemap.xml` (primary URL sitemap for Search Console submission)
	- `public/sitemap-index.xml` (optional sitemap index)

When adding or removing routes, update `SEO_BY_PATH` and regenerate/deploy.
