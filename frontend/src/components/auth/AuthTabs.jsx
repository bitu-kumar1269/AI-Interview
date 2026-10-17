import { Link, useSearchParams } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';

export default function AuthTabs({ activeTab }) {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const query = email ? `?email=${encodeURIComponent(email)}` : '';

  return (
    <div className="grid grid-cols-2 p-1 mb-6 bg-slate-100 dark:bg-[#070b16] rounded-xl border border-slate-200 dark:border-cyan-500/20 text-xs font-semibold">
      <Link
        to={`/login${query}`}
        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all duration-200 ${
          activeTab === 'login'
            ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-md shadow-brand-500/25 font-bold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <LogIn className="w-3.5 h-3.5" />
        <span>Log In</span>
      </Link>
      <Link
        to={`/register${query}`}
        className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all duration-200 ${
          activeTab === 'register'
            ? 'bg-gradient-to-r from-brand-600 to-accent-600 text-white shadow-md shadow-brand-500/25 font-bold'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <UserPlus className="w-3.5 h-3.5" />
        <span>Sign Up (New User)</span>
      </Link>
    </div>
  );
}
