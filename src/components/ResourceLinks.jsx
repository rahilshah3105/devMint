import { ExternalLink } from 'lucide-react';
import './ResourceLinks.css';

export default function ResourceLinks({ links }) {
  if (!links || links.length === 0) return null;

  return (
    <div className="resource-links-container">
      <h3 className="resource-links-title">Helpful Resources</h3>
      <div className="resource-links-grid">
        {links.map((link, idx) => (
          <a
            key={idx}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="resource-link"
          >
            <span>{link.title}</span>
            <ExternalLink size={14} />
          </a>
        ))}
      </div>
    </div>
  );
}
