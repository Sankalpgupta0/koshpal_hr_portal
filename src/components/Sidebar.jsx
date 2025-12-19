import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  FiSettings, 
  FiLogOut,
  FiChevronLeft,
  FiHome,
  FiUsers 
} from 'react-icons/fi';
import { logout } from '../api/auth';

function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiUsers, label: 'Employee Directory', path: '/directory' },
    { icon: FiSettings, label: 'Settings', path: '/settings' },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Navigate to login anyway
      navigate('/login');
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'HR';

  return (
    <aside
      className={`fixed top-0 left-0 h-full transition-all duration-500 ease-in-out ${
        isOpen ? 'w-72' : 'w-20'
      }`}
      style={{
        backgroundColor: 'var(--color-bg-card)',
        borderRight: '1px solid var(--color-border-primary)',
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 border-b" style={{ borderColor: 'var(--color-border-primary)', height: '89px' }}>
          {isOpen && (
            <div className="flex items-center gap-3 transition-opacity duration-500">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <img src="/logo.png" alt="logo" className="w-8 h-8 bg-transparent" />
              </div>
              <span
                className="text-h3"
                style={{ color: 'var(--color-text-primary)' }}
              >
                Koshpal
              </span>
            </div>
          )}

          {/* Toggle Collapse button */}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:opacity-80 transition-all"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-primary)',
            }}
            aria-label="Toggle sidebar"
          >
            <FiChevronLeft
              className={`w-5 h-5 transition-transform ${
                !isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      !isOpen ? 'justify-center' : ''
                    }`}
                    style={{
                      backgroundColor: active
                        ? 'var(--color-bg-secondary)'
                        : 'transparent',
                      color: active
                        ? 'var(--color-primary)'
                        : 'var(--color-text-secondary)',
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left text-body-md">
                          {item.label}
                        </span>
                        {item.badge && (
                          <span
                            className="px-2 py-0.5 text-label rounded-full"
                            style={{
                              backgroundColor: 'var(--color-primary)',
                              color: 'var(--color-text-inverse)',
                            }}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer - User Profile & Logout */}
        {isOpen && (
          <div className="p-4 border-t" style={{ borderColor: 'var(--color-border-primary)' }}>
            {/* User Profile */}
            <div className="flex items-center gap-3 p-3 rounded-lg hover:opacity-80 cursor-pointer transition-all mb-2" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-text-inverse)',
                }}
              >
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="text-subtitle truncate"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {user.name || 'HR User'}
                </p>
                <p
                  className="text-caption truncate"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {user.email || ''}
                </p>
              </div>
            </div>
            
            {/* Logout Button */}
            {/* <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:opacity-80"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--color-error, #ef4444)',
              }}
            >
              <FiLogOut className="w-5 h-5" />
              <span className="text-body-md">Logout</span>
            </button> */}
          </div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar;

