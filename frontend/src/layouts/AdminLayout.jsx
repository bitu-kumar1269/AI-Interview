/**
 * layouts/AdminLayout.jsx
 *
 * The root shell for all admin pages.
 * Composed of:
 *  - Desktop: collapsible sidebar (icon-only or full width) + topbar + page content
 *  - Mobile: hidden sidebar, topbar with hamburger, MobileDrawer overlay
 *
 * State managed here (not in child components) to keep layout logic centralized:
 *  - collapsed    — sidebar collapsed state (persisted in localStorage)
 *  - mobileOpen   — mobile drawer open state
 *  - darkMode     — dark/light mode toggle (persisted in localStorage)
 *
 * Dark mode implementation:
 *  Toggles the `admin-light` class on the layout root div.
 *  CSS variables can key off this class to switch themes in a later phase.
 *  Current implementation is dark-first — light mode softens backgrounds.
 */

import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppContext } from '@/context';

import AdminSidebar   from '@/components/admin/sidebar/AdminSidebar';
import MobileDrawer   from '@/components/admin/sidebar/MobileDrawer';
import AdminTopbar    from '@/components/admin/topbar/AdminTopbar';

// ─── Persist helpers ──────────────────────────────────────────────
const getStored = (key, fallback) => {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};

export default function AdminLayout() {
  const { isDark: darkMode, toggleTheme } = useAppContext();
  const [collapsed,   setCollapsed]   = useState(() => getStored('admin-sidebar-collapsed', false));
  const [mobileOpen,  setMobileOpen]  = useState(false);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('admin-sidebar-collapsed', JSON.stringify(collapsed));
  }, [collapsed]);


  // Close mobile drawer on resize to lg+
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const sidebarW = collapsed ? 'w-[70px]' : 'w-[240px]';

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${
      darkMode
        ? 'text-white'
        : 'bg-slate-100 text-slate-900'
    }`} style={darkMode ? { background: '#060b18' } : {}}>

      {/* ── Desktop Sidebar ──────────────────────────────────── */}
      <aside
        className={`
          hidden lg:flex flex-col flex-shrink-0
          ${sidebarW}
          transition-all duration-300 ease-in-out
          ${darkMode
            ? 'border-r border-surface-border'
            : 'bg-white border-r border-slate-200'
          }
          relative
        `}
        style={darkMode ? { background: 'rgba(8,14,30,0.95)', backdropFilter: 'blur(20px)' } : {}}
      >
        {/* Sidebar content */}
        <div className={darkMode ? '' : 'admin-light'}>
          <AdminSidebar collapsed={collapsed} onNavClick={() => {}} />
        </div>

        {/* Collapse toggle button — floats on the right edge */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            absolute -right-3 top-20 z-10
            w-6 h-6 rounded-full flex items-center justify-center
            text-slate-400 hover:text-white transition-all duration-200
            ${darkMode
              ? 'bg-[#1a1a35] border border-white/10 hover:border-white/20'
              : 'bg-white border border-slate-200 shadow-sm hover:shadow-md'
            }
          `}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed
            ? <ChevronRight size={12} />
            : <ChevronLeft size={12} />
          }
        </button>
      </aside>

      {/* ── Mobile Drawer ────────────────────────────────────── */}
      <MobileDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* ── Main Content Area ────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Topbar */}
        <AdminTopbar
          onMenuClick={() => setMobileOpen(true)}
          darkMode={darkMode}
          onDarkToggle={toggleTheme}
        />

        {/* Page content — scrollable */}
        <main className={`
          flex-1 overflow-y-auto
          ${darkMode ? '' : 'bg-slate-50'}
        `}
        style={darkMode ? { background: '#060b18' } : {}}
        >
          <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
