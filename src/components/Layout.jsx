import { useState, useEffect, useMemo, useRef } from 'react';
import Sidebar from './Sidebar';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import './Layout.css';

const FEATURE_SEARCH_ITEMS = [
  { name: 'Code Formatter', path: '/formatter', group: 'Editors & Formatters' },
  { name: 'Multi-Lang Editor', path: '/editor', group: 'Editors & Formatters' },
  { name: 'Diff Checker', path: '/diff', group: 'Editors & Formatters' },
  { name: 'Code Shrinker', path: '/shrinker', group: 'Editors & Formatters' },
  { name: 'JSON to Types', path: '/json-types', group: 'Converters & Encoders' },
  { name: 'JSON Toolkit', path: '/json-toolkit', group: 'Converters & Encoders' },
  { name: 'JSON Compare', path: '/json-compare', group: 'Converters & Encoders' },
  { name: 'Utility Tools', path: '/utility-tools', group: 'Converters & Encoders' },
  { name: 'Base64 Converter', path: '/base64', group: 'Converters & Encoders' },
  { name: 'URL Converter', path: '/url', group: 'Converters & Encoders' },
  { name: 'Color Converter', path: '/color', group: 'Converters & Encoders' },
  { name: 'JWT Decoder', path: '/jwt', group: 'Converters & Encoders' },
  { name: 'Base Converter', path: '/base-converter', group: 'Converters & Encoders' },
  { name: 'UUID Generator', path: '/uuid', group: 'Generators & Utilities' },
  { name: 'Hash Generator', path: '/hash', group: 'Generators & Utilities' },
  { name: 'Lorem Ipsum', path: '/lorem', group: 'Generators & Utilities' },
  { name: 'Timestamp Converter', path: '/timestamp', group: 'Generators & Utilities' },
  { name: 'Regex Tester', path: '/regex', group: 'Generators & Utilities' },
  { name: 'JSON Snippets', path: '/json-snippets', group: 'Generators & Utilities' },
  { name: 'String Utils', path: '/string-utils', group: 'Generators & Utilities' },
  { name: 'Improve Prompts', path: '/improve-prompts', group: 'Generators & Utilities' },
  { name: 'API Test Cases', path: '/api-test-cases', group: 'Generators & Utilities' },
  { name: 'Mock Data', path: '/mock-data', group: 'Generators & Utilities' },
  { name: 'Schema Validator', path: '/json-schema-validator', group: 'Generators & Utilities' },
  { name: 'API Workbench', path: '/http-request-builder', group: 'Generators & Utilities' },
  { name: 'Unit Test Scaffold', path: '/unit-test-scaffold', group: 'Generators & Utilities' },
  { name: 'E2E Scenario Builder', path: '/e2e-scenario-builder', group: 'Generators & Utilities' },
  { name: 'Log Analyzer', path: '/log-analyzer', group: 'Generators & Utilities' },
  { name: 'Git PR Helper', path: '/git-pr-helper', group: 'Generators & Utilities' },
  { name: 'Cron Explainer', path: '/cron', group: 'Generators & Utilities' },
  { name: 'Remote Runner', path: '/remote-runner', group: 'Generators & Utilities' },
  { name: 'Developer Apps', path: '/apps', group: 'Ecosystem' },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const searchInputRef = useRef(null);

  const filteredFeatures = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return FEATURE_SEARCH_ITEMS;
    return FEATURE_SEARCH_ITEMS.filter(item => `${item.name} ${item.group}`.toLowerCase().includes(query));
  }, [searchText]);

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchText('');
    setActiveIndex(0);
  };

  const openSearch = () => setSearchOpen(true);

  const goToFeature = (path) => {
    navigate(path);
    closeSearch();
  };

  // Auto-collapse sidebar on smaller screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 769) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const isSearchShortcut = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k';
      if (isSearchShortcut) {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === 'Escape' && searchOpen) {
        event.preventDefault();
        closeSearch();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    setTimeout(() => searchInputRef.current?.focus(), 0);
  }, [searchOpen]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchText]);

  useEffect(() => {
    if (searchOpen) closeSearch();
  }, [location.pathname]);

  const handleSearchInputKeyDown = (event) => {
    if (!filteredFeatures.length) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((prev) => (prev + 1) % filteredFeatures.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((prev) => (prev - 1 + filteredFeatures.length) % filteredFeatures.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      goToFeature(filteredFeatures[activeIndex].path);
    }
  };

  return (
    <div className="app-layout">
      {/* Mobile overlay — only on small screens when sidebar is open */}
      {sidebarOpen && <div className="mobile-overlay md:hidden" onClick={() => setSidebarOpen(false)}></div>}

      {searchOpen && (
        <div className="feature-search-overlay" onClick={closeSearch}>
          <div className="feature-search-panel" onClick={(e) => e.stopPropagation()}>
            <div className="feature-search-input-wrap">
              <Search size={16} className="feature-search-icon" />
              <input
                ref={searchInputRef}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onKeyDown={handleSearchInputKeyDown}
                placeholder="Search tools..."
                className="feature-search-input"
              />
              <span className="feature-search-shortcut">Ctrl/Cmd + K</span>
            </div>

            <div className="feature-search-results custom-scrollbar">
              {filteredFeatures.length === 0 && (
                <div className="feature-search-empty">No matching feature found.</div>
              )}

              {filteredFeatures.map((item, index) => (
                <button
                  key={item.path}
                  type="button"
                  className={`feature-search-item ${index === activeIndex ? 'active' : ''}`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => goToFeature(item.path)}
                >
                  <span>{item.name}</span>
                  <small>{item.group}</small>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onOpenSearch={openSearch} />
      
      <main className="main-content">
        {/* Mobile-only hamburger — only shows when sidebar is CLOSED on mobile */}
        {!sidebarOpen && (
          <button 
            className="sidebar-toggle-btn md:hidden"
            onClick={() => setSidebarOpen(true)}
            title="Open sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        <Outlet />
      </main>
    </div>
  );
}
