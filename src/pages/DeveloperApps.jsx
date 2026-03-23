import { ExternalLink } from 'lucide-react';
import './ToolPage.css';

const APPS = [
  {
    title: 'YouTube to MP3',
    description: 'Full-stack converter for turning YouTube videos into downloadable MP3 files with quality options.',
    url: 'https://github.com/rahilshah3105/youtubeToMp3',
    localPath: 'youtubeToMp3/frontend + youtubeToMp3/backend',
    run: 'frontend: npm run dev, backend: npm run dev',
    tags: ['React', 'Node.js', 'FFmpeg']
  },
  {
    title: 'Instagram Analyzer',
    description: 'Analyze Instagram followers/following exports to find non-mutual connections quickly.',
    url: 'https://github.com/rahilshah3105/instagram',
    localPath: 'instagram',
    run: 'npm run dev',
    tags: ['React', 'Vite', 'Data Analysis']
  },
  {
    title: 'Password Generator',
    description: 'Generate strong passwords, store them locally, and manage your vault with import/export support.',
    url: 'https://github.com/rahilshah3105/passwordGenerator',
    localPath: 'passwordGenerator',
    run: 'npm run dev',
    tags: ['React', 'Vite', 'Tailwind']
  },
  {
    title: 'Bing Cypress Search',
    description: 'Cypress automation project for browser-based search workflows and testing scenarios.',
    url: 'https://github.com/rahilshah3105/bing-cypress-search',
    localPath: 'bing-cypress-search',
    run: 'npx cypress open',
    tags: ['Cypress', 'E2E Testing', 'Automation']
  },
  {
    title: 'NewsApp (NewsPulse)',
    description: 'News reader with categories, dark mode, bookmarks, and responsive UI powered by RSS feeds.',
    url: 'https://github.com/rahilshah3105/newsapp',
    localPath: 'newsapp',
    run: 'npm start',
    tags: ['React', 'RSS', 'Bookmarks']
  },
];

export default function DeveloperApps() {
  const startupSteps = [
    {
      step: '1. YouTube to MP3 backend',
      command: 'cd youtubeToMp3/backend && npm run dev'
    },
    {
      step: '2. YouTube to MP3 frontend',
      command: 'cd youtubeToMp3/frontend && npm run dev'
    },
    {
      step: '3. Password Generator',
      command: 'cd passwordGenerator && npm run dev'
    },
    {
      step: '4. Instagram Analyzer',
      command: 'cd instagram && npm run dev'
    },
    {
      step: '5. NewsApp',
      command: 'cd newsapp && npm start'
    },
    {
      step: '6. Bing Cypress Search',
      command: 'cd bing-cypress-search && npx cypress open'
    }
  ];

  return (
    <div className="tool-page h-full flex flex-col">
      <header className="tool-header border-b border-[var(--border-light)] pb-6 mb-6">
        <div>
          <h2>Recommended Developer Apps</h2>
          <p>A curated list of external tools and platforms that pair nicely with DevToolkit.</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <section className="glass-panel p-5 rounded-xl mb-6">
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-3">Open All Useful Apps</h3>
          <div className="space-y-2">
            {startupSteps.map((item) => (
              <div key={item.step} className="text-sm text-[var(--text-secondary)]">
                <div className="font-medium text-[var(--text-primary)]">{item.step}</div>
                <code className="text-xs text-[var(--text-muted)]">{item.command}</code>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APPS.map((app, idx) => (
            <a 
              key={idx} 
              href={app.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="glass-panel p-6 rounded-xl hover:border-[var(--border-focus)] transition-all cursor-pointer group flex flex-col h-full shadow"
              style={{ textDecoration: 'none' }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-[var(--accent-primary)] group-hover:text-[var(--accent-secondary)] transition-colors">
                  {app.title}
                </h3>
                <ExternalLink size={18} className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors" />
              </div>
              <p className="text-sm text-[var(--text-secondary)] flex-1 leading-relaxed mb-6">
                {app.description}
              </p>
              <div className="text-xs text-[var(--text-muted)] mb-4 space-y-1">
                <div><strong>Local:</strong> {app.localPath}</div>
                <div><strong>Run:</strong> {app.run}</div>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {app.tags.map(tag => (
                  <span key={tag} className="text-xs bg-[rgba(128,128,128,0.1)] text-[var(--text-muted)] px-2 py-1 rounded-md">
                    {tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
          
          <div className="glass-panel p-6 rounded-xl border-dashed border-[var(--border-light)] flex flex-col items-center justify-center opacity-60">
             <div className="text-[2rem] text-[var(--text-muted)] mb-2">+</div>
             <p className="text-sm text-[var(--text-secondary)] text-center">Add more links by editing<br /><code>src/pages/DeveloperApps.jsx</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
