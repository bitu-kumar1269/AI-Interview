import { Menu, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useLocation, Link } from 'react-router-dom';
import { ThemeToggle } from '@/components/common';

const PAGE_TITLES = {
  '/dashboard':       'Dashboard',
  '/interviews':      'My Interviews',
  '/interviews/new':  'New Interview',
  '/sessions':        'Session History',
  '/resumes':         'My Resumes',
  '/jobs':            'Jobs Portal',
  '/profile':         'Profile',
};

export default function Topbar({ onMenuClick }) {
  const { user } = useAuthStore();
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'AI Interview';

  return (
    <header className="h-14 border-b border-surface-border flex items-center justify-between px-5 flex-shrink-0 transition-colors duration-200"
      style={{ background: 'var(--card-bg)', backdropFilter: 'blur(16px)' }}
    >
      {/* Left: menu + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/5 lg:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2 lg:hidden" aria-label="Go to Dashboard">
          <img src="/AI-interview-svg-icon.png" alt="InterviewAI" className="w-6 h-6 rounded-lg object-contain shadow-sm" />
        </Link>
        <div className="flex items-center gap-2">
          {/* teal dot */}
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-teal-400" />
          <h1 className="text-sm font-display font-semibold text-slate-200">{title}</h1>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notifications */}
        <button
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {/* notification dot */}
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-teal-400" />
        </button>

        {/* Divider */}
        <div className="w-px h-5 bg-surface-border mx-1" />

        {/* User avatar link */}
        <Link
          to="/profile"
          className="flex items-center gap-2 hover:opacity-85 transition-opacity"
        >
          <div
            className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center text-white font-bold text-xs flex-shrink-0 p-[1.5px]"
            style={{ background: 'linear-gradient(135deg, #0d9488, #2563eb)' }}
          >
            <div
              className="w-full h-full rounded-md overflow-hidden flex items-center justify-center text-[10px] font-bold text-white"
              style={{ background: '#0a1124' }}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || 'User'}
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
            {user?.name?.split(' ')[0]}
          </span>
        </Link>
      </div>
    </header>
  );
}
