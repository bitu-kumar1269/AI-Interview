/**
 * components/admin/topbar/AdminTopbar.jsx
 *
 * The top navigation bar of the admin panel.
 * Composed of:
 *  - Left: Mobile hamburger menu + Breadcrumb
 *  - Right: Dark mode toggle + NotificationDropdown + UserMenu
 *
 * Props:
 *  onMenuClick  — fn       — called when hamburger is clicked (mobile)
 *  darkMode     — boolean  — current dark mode state
 *  onDarkToggle — fn       — toggles dark mode
 */

import { Menu } from 'lucide-react';
import Breadcrumb            from './Breadcrumb';
import NotificationDropdown  from './NotificationDropdown';
import UserMenu              from './UserMenu';
import { ThemeToggle }       from '@/components/common';

export default function AdminTopbar({ onMenuClick }) {
  return (
    <header className="
      flex items-center justify-between
      px-4 lg:px-6 h-16 flex-shrink-0
      bg-surface-card/90 backdrop-blur-md
      border-b border-surface-border
      transition-colors duration-200
    ">

      {/* ── Left section ──────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          id="admin-mobile-menu-btn"
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-xl bg-surface-hover border border-surface-border
                     flex items-center justify-center text-slate-500 dark:text-slate-400
                     hover:text-slate-900 dark:hover:text-white transition-all"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Breadcrumb */}
        <Breadcrumb />
      </div>

      {/* ── Right section ─────────────────────────────────────── */}
      <div className="flex items-center gap-2">

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notification bell */}
        <NotificationDropdown />

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}
