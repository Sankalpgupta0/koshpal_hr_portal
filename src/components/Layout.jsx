import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { FiBell, FiMenu, FiX } from 'react-icons/fi';
import Sidebar from './Sidebar';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Overlay - Mobile only */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      </div>

      {/* Sidebar - Mobile */}
      {mobileMenuOpen && (
        <div className="fixed left-0 top-0 h-screen z-50 lg:hidden">
          <Sidebar isOpen={true} onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        </div>
      )}

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-500 ${
          sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'
        }`}
      >
        {/* Top Header */}
        <header 
          className="flex items-center justify-between px-6 h-[89px] border-b"
          style={{
            backgroundColor: 'var(--color-bg-card)',
            borderColor: 'var(--color-border-primary)',
          }}
        >
          {/* Menu button for mobile */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:opacity-80 transition-colors"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
            }}
          >
            {mobileMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>

          {/* Spacer for desktop */}
          <div className="hidden lg:block"></div>
         
          {/* Notification button */}
          <button 
            className="p-2 rounded-lg hover:opacity-80 transition-colors relative"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
            }}
          >
            <FiBell className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content Area */}
        <main 
          className="flex-1 overflow-y-auto overflow-x-hidden p-6"
          style={{ backgroundColor: 'var(--color-bg-secondary)' }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;

