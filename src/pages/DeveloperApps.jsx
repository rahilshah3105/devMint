import { ExternalLink } from 'lucide-react';
import './ToolPage.css';

const APPS = [
  {
    title: 'Task Manager',
    description: 'Plan your day with a clean task board for creating, tracking, and completing daily to-dos.',
    url: 'https://todo-phi-neon-51.vercel.app/',

  },
  {
    title: 'Word Utils',
    description: 'A handy suite of text and word utilities for quick formatting, cleanup, and content edits.',
    url: 'https://wordedd.netlify.app/',
  },
  {
    title: 'Password Manager',
    description: 'Generate secure passwords and manage them in a local vault with simple import/export support.',
    url: 'https://password-manager-pi-rosy.vercel.app/',
  },
  {
    title: 'NewsApp (NewsPulse)',
    description: 'Read latest headlines by category with a responsive news reader featuring bookmarks and dark mode.',
    url: 'https://getyournewspulse.netlify.app/',
  },
  {
    title: 'Bing Cypress Search',
    description: 'A Cypress automation project for validating Bing search flows and end-to-end browser scenarios.',
    url: 'https://github.com/rahilshah3105/bing-cypress-search',
  },
];

export default function DeveloperApps() {
  return (
    <div className="tool-page h-full flex flex-col">
      <header className="tool-header border-b border-[var(--border-light)] pb-6 mb-6">
        <div>
          <h2>Recommended Developer Apps</h2>
          <p>A curated list of external tools and platforms that pair nicely with DevToolkit.</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {APPS.map((app, idx) => (
            <a
              key={idx}
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel developer-app-card p-5 rounded-xl cursor-pointer flex flex-col h-full shadow transition-colors duration-300 ease-in-out"
              style={{ textDecoration: 'none' }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-[var(--accent-primary)] transition-colors duration-300 ease-in-out developer-app-card-title">
                  {app.title}
                </h3>
                <ExternalLink size={18} className="text-[var(--text-muted)] transition-colors duration-300 ease-in-out developer-app-card-icon" />
              </div>
              <p className="text-sm text-[var(--text-secondary)] flex-1 leading-relaxed mb-6">
                {app.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
