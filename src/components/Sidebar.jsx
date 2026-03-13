import { NavLink } from 'react-router-dom';
import { 
  Code2, 
  FileJson, 
  Hash, 
  Terminal, 
  GitCompare, 
  Regex, 
  AlignLeft, 
  Lock,
  Link,
  Wrench,
  Moon,
  Sun,
  Palette,
  FileText,
  Key,
  Globe,
  Clock3,
  X
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './Sidebar.css';

const navGroups = [
  {
    title: "Editors & Formatters",
    items: [
      { name: "Code Formatter", path: "/formatter", icon: <AlignLeft size={18} /> },
      { name: "Multi-Lang Editor", path: "/editor", icon: <Code2 size={18} /> },
      { name: "Diff Checker", path: "/diff", icon: <GitCompare size={18} /> },
      { name: "Code Shrinker \\n", path: "/shrinker", icon: <FileJson size={18} /> },
    ]
  },
  {
    title: "Converters & Encoders",
    items: [
      { name: "JSON to Types", path: "/json-types", icon: <FileJson size={18} /> },
      { name: "JSON Toolkit", path: "/json-toolkit", icon: <FileJson size={18} /> },
      { name: "Base64 Converter", path: "/base64", icon: <Lock size={18} /> },
      { name: "URL Converter", path: "/url", icon: <Link size={18} /> },
      { name: "Color Converter", path: "/color", icon: <Palette size={18} /> },
      { name: "JWT Decoder", path: "/jwt", icon: <Lock size={18} /> },
    ]
  },
  {
    title: "Generators & Utilities",
    items: [
      { name: "UUID Generator", path: "/uuid", icon: <Key size={18} /> },
      { name: "Hash Generator", path: "/hash", icon: <Hash size={18} /> },
      { name: "Lorem Ipsum", path: "/lorem", icon: <FileText size={18} /> },
      { name: "Timestamp Converter", path: "/timestamp", icon: <Clock3 size={18} /> },
      { name: "Regex Tester", path: "/regex", icon: <Regex size={18} /> },
      { name: "Remote Runner", path: "/remote-runner", icon: <Terminal size={18} /> },
      { name: "JS Runner", path: "/js-runner", icon: <Terminal size={18} /> },
    ]
  },
  {
    title: "Ecosystem",
    items: [
      { name: "Developer Apps", path: "/apps", icon: <Globe size={18} /> }
    ]
  }
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-header flex justify-between items-center">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="logo-icon">
            <img src="/logo.png" alt="DevToolkit Logo" style={{ width: '26px', height: '26px', objectFit: 'contain', borderRadius: '4px' }} />
          </div>
          <div className="logo-text">
            <h1 style={{color: 'var(--text-primary)'}}>DevToolkit</h1>
            <span>Pro Utilities</span>
          </div>
        </div>
        <button 
          className="sidebar-close-btn"
          onClick={() => setIsOpen(false)}
        >
          <X size={20} />
        </button>
      </div>
      
      <nav className="sidebar-nav custom-scrollbar">
        {navGroups.map((group, idx) => (
          <div key={idx} className="nav-group">
            <h3 className="nav-group-title">{group.title}</h3>
            <ul className="nav-list">
              {group.items.map((item, itemIdx) => (
                <li key={itemIdx}>
                  <NavLink 
                    to={item.path} 
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    <span className="nav-icon">{item.icon}</span>
                    <span className="nav-name">{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      
      <div className="sidebar-footer flex justify-between items-center px-6 py-4 border-t border-[rgba(128,128,128,0.1)]">
        <span className="text-xs text-[var(--text-muted)] font-medium">Built for Developers</span>
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-[rgba(128,128,128,0.1)] text-[var(--text-secondary)] transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </aside>
  );
}
