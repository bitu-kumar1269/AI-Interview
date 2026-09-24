import { NavLink, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  LayoutDashboard,
  MessageSquarePlus,
  ClipboardList,
  FileText,
  History,
  User,
  LogOut,
  X,
  Briefcase,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/dashboard',         icon: LayoutDashboard,   label: 'Dashboard',       desc: 'Cockpit overview' },
  { to: '/interviews',        icon: ClipboardList,     label: 'Interviews',      desc: 'All mock sessions' },
  { to: '/interviews/new',    icon: MessageSquarePlus, label: 'New Interview',   desc: 'Create AI session', isPrimary: true },
  { to: '/sessions',          icon: History,           label: 'History',         desc: 'Past recordings & stats' },
  { to: '/resumes',           icon: FileText,          label: 'Resumes',         desc: 'ATS score & profiles' },
  { to: '/jobs',              icon: Briefcase,         label: 'Jobs',            desc: 'Live openings', badge: 'SOON' },
  { to: '/jobs/recommended',  icon: Sparkles,          label: 'Recommendations', desc: 'AI matched roles' },
  { to: '/profile',           icon: User,              label: 'Profile',         desc: 'Settings & account' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-surface-border flex-shrink-0 select-none z-20 transition-colors duration-200"
        style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)' }}
      >
        <SidebarContent user={user} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed left-0 top-0 z-40 h-full w-72 border-r border-surface-border flex flex-col lg:hidden shadow-2xl transition-colors duration-200"
            style={{ background: 'var(--card-bg)', backdropFilter: 'blur(20px)' }}
          >
            <button
              onClick={onClose}
              aria-label="Close navigation"
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent user={user} onLogout={handleLogout} onNavClick={onClose} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ user, onLogout, onNavClick }) {
  return (
    <div className="flex flex-col h-full">

      {/* ── Brand Header ─────────────────────────────────────── */}
      <div className="px-5 py-5 border-b border-surface-border">
        <Link to="/dashboard" onClick={onNavClick} className="flex items-center gap-3 group">
          {/* Logo mark */}
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 p-0.5 bg-gradient-to-br from-teal-500/20 via-brand-500/20 to-blue-500/30 border border-teal-500/30 shadow-lg shadow-teal-500/10 group-hover:scale-105 transition-transform overflow-hidden">
            <img src="/AI-interview-svg-icon.png" alt="InterviewAI" className="w-full h-full object-cover rounded-lg" />
            {/* live indicator */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: '#10b981', borderColor: '#080e1c' }}
            >
              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-70" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span className="font-display font-bold text-base text-slate-900 dark:text-white tracking-tight">
                Interview
              </span>
              <span className="font-display font-bold text-base tracking-tight gradient-text">
                AI
              </span>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-1"
              style={{ color: '#14b8a6' }}
            >
              <Zap className="w-2.5 h-2.5" />
              Cockpit v2.0
            </p>
          </div>
        </Link>
      </div>

      {/* ── Navigation ───────────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 text-[10px] font-semibold text-slate-600 uppercase tracking-widest mb-3">
          Navigation
        </p>

        {NAV_ITEMS.map(({ to, icon: Icon, label, isPrimary, badge }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavClick}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              clsx(
                'group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                isPrimary
                  ? isActive
                    ? 'text-white keep-white'
                    : 'text-teal-700 dark:text-teal-300 border border-teal-500/25 hover:border-teal-400/40 hover:text-slate-900 dark:hover:text-white'
                  : isActive
                  ? 'nav-active-chip'
                  : 'text-slate-600 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/4'
              )
            }
            style={({ isActive }) => isPrimary ? {
              background: isActive
                ? 'linear-gradient(135deg, #0d9488, #14b8a6 60%, #2563eb)'
                : 'rgba(13,148,136,0.08)',
              boxShadow: isActive ? '0 0 20px rgba(13,148,136,0.3)' : 'none',
            } : {}}
          >
            {({ isActive }) => (
              <>
                <div className={clsx(
                  'p-1.5 rounded-lg transition-colors flex-shrink-0',
                  isPrimary
                    ? 'bg-white/10 text-white keep-white'
                    : isActive
                    ? 'text-teal-400 bg-teal-500/15'
                    : 'text-slate-500 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:bg-slate-900/5 dark:group-hover:bg-white/5'
                )}>
                  <Icon className="w-4 h-4" />
                </div>

                <span className={clsx('flex-1 text-xs sm:text-sm', isPrimary && 'font-semibold')}>
                  {label}
                </span>

                {badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider"
                    style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)' }}
                  >
                    {badge}
                  </span>
                )}

                {isPrimary && !badge && (
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />
                )}

                {isActive && !isPrimary && !badge && (
                  <ChevronRight className="w-3.5 h-3.5 text-teal-500/70 flex-shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── User Dock ─────────────────────────────────────────── */}
      <div className="p-3 border-t border-surface-border">
        <div className="p-2.5 rounded-xl border border-surface-border flex items-center justify-between gap-2"
          style={{ background: 'var(--card-bg)' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex-shrink-0">
              {/* avatar with teal gradient ring */}
              <div className="w-9 h-9 rounded-xl p-[1.5px]"
                style={{ background: 'linear-gradient(135deg, #0d9488, #2563eb)' }}
              >
                <div className="w-full h-full rounded-[11px] overflow-hidden flex items-center justify-center text-white font-semibold text-xs"
                  style={{ background: '#0a1124' }}
                >
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
              </div>
              {/* online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                style={{ background: '#10b981', borderColor: 'var(--card-bg)' }}
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name || 'Candidate'}</p>
                <ShieldCheck className="w-3 h-3 text-teal-400 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-slate-600 truncate">{user?.email || 'Logged In'}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
