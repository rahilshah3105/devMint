import { ExternalLink } from 'lucide-react';
import './ToolPage.css';

const APPS = [
  {
    title: "Regex101",
    description: "Build, test, and debug regex.",
    url: "https://regex101.com",
    tags: ["Regex", "Testing"]
  },
  {
    title: "JSONFormatter",
    description: "Format and validate JSON data instantly.",
    url: "https://jsonformatter.org",
    tags: ["Data", "Format"]
  },
  {
    title: "CodeSandbox",
    description: "Online code editor tailored for web applications.",
    url: "https://codesandbox.io",
    tags: ["IDE", "Web"]
  },
  {
    title: "Postman",
    description: "The complete API development platform.",
    url: "https://www.postman.com/",
    tags: ["API", "Testing"]
  },
  {
    title: "Word Formatter",
    description: "Format and manipulate text in various ways for testing and mockups.",
    url: "https://wordedd.netlify.app/",
    tags: ["Data", "Format"]
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
             <p className="text-sm text-[var(--text-secondary)] text-center">Add more links by editing<br /><code>DeveloperApps.jsx</code></p>
          </div>
        </div>
      </div>
    </div>
  );
}
