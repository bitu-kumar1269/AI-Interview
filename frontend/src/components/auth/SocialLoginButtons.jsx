/**
 * SocialLoginButtons — "Continue with Google" button.
 *
 * Uses a plain <a> link (full-page navigation) to initiate OAuth redirect
 * to Google's consent screen, which redirects back to backend and /oauth-callback.
 */

import { getApiBaseUrl } from '@/utils/apiUrl';

const API_BASE = getApiBaseUrl();

export default function SocialLoginButtons() {
  return (
    <div>
      <div className="flex items-center gap-3 my-5">
        <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700/60" />
        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">or continue with</span>
        <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700/60" />
      </div>

      <a
        href={`${API_BASE}/auth/google`}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl bg-white dark:bg-[#080d1a]/85 border border-slate-300 dark:border-slate-700/70 text-slate-700 dark:text-slate-200 text-sm font-medium transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-slate-400 dark:hover:border-slate-500 active:scale-[0.98] shadow-sm dark:shadow-none"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.28-.97 2.36-2.06 3.09l3.33 2.58c1.94-1.79 3.06-4.43 3.06-7.57 0-.73-.07-1.43-.19-2.1H12z"/>
          <path fill="#34A853" d="M5.27 14.27l-.75.57-2.66 2.07C3.5 19.98 7.44 22.5 12 22.5c3.02 0 5.55-1 7.4-2.72l-3.33-2.58c-.99.66-2.26 1.06-4.07 1.06-3.13 0-5.78-2.11-6.73-4.95z"/>
          <path fill="#4A90D9" d="M1.86 6.09C1.13 7.52.5 9.62.5 12s.63 4.48 1.36 5.91l3.41-2.64c-.2-.66-.32-1.36-.32-2.27s.12-1.61.32-2.27L1.86 6.09z"/>
          <path fill="#FBBC05" d="M12 5.5c1.66 0 3.14.57 4.31 1.68l2.96-2.96C17.55 2.38 15.02 1.5 12 1.5 7.44 1.5 3.5 4.02 1.86 6.09l3.41 2.64C6.22 5.89 8.87 5.5 12 5.5z"/>
        </svg>
        <span>Google</span>
      </a>
    </div>
  );
}

