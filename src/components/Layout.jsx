import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import './Layout.css';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  return (
    <div className="app-layout">
      {/* Mobile overlay — only on small screens when sidebar is open */}
      {sidebarOpen && <div className="mobile-overlay md:hidden" onClick={() => setSidebarOpen(false)}></div>}
      
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
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
