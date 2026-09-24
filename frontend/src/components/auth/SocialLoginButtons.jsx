/**
 * SocialLoginButtons — "Continue with Google / GitHub / LinkedIn" row.
 *
 * These are plain <a> links (full-page navigation), NOT axios calls —
 * OAuth requires a real browser redirect to the provider's consent screen,
 * which then redirects back to our backend, then to /oauth-callback.
 */

import { getApiBaseUrl } from '@/utils/apiUrl';

const API_BASE = getApiBaseUrl();

const PROVIDERS = [
  {
    id: 'google',
    label: 'Google',
    href: `${API_BASE}/auth/google`,
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24">
        <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.24 1.28-.97 2.36-2.06 3.09l3.33 2.58c1.94-1.79 3.06-4.43 3.06-7.57 0-.73-.07-1.43-.19-2.1H12z"/>
        <path fill="#34A853" d="M5.27 14.27l-.75.57-2.66 2.07C3.5 19.98 7.44 22.5 12 22.5c3.02 0 5.55-1 7.4-2.72l-3.33-2.58c-.99.66-2.26 1.06-4.07 1.06-3.13 0-5.78-2.11-6.73-4.95z"/>
        <path fill="#4A90D9" d="M1.86 6.09C1.13 7.52.5 9.62.5 12s.63 4.48 1.36 5.91l3.41-2.64c-.2-.66-.32-1.36-.32-2.27s.12-1.61.32-2.27L1.86 6.09z"/>
        <path fill="#FBBC05" d="M12 5.5c1.66 0 3.14.57 4.31 1.68l2.96-2.96C17.55 2.38 15.02 1.5 12 1.5 7.44 1.5 3.5 4.02 1.86 6.09l3.41 2.64C6.22 5.89 8.87 5.5 12 5.5z"/>
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    href: `${API_BASE}/auth/github`,
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.95.1-.75.4-1.25.73-1.53-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.77.12 3.06.74.81 1.19 1.83 1.19 3.09 0 4.41-2.7 5.38-5.27 5.67.42.36.78 1.07.78 2.16 0 1.56-.02 2.82-.02 3.2 0 .31.2.67.79.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: `${API_BASE}/auth/linkedin`,
    icon: (
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0A66C2">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z"/>
      </svg>
    ),
  },
];

export default function SocialLoginButtons() {
  return (
    <div>
      <div className="flex items-center gap-3 my-5">
        <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700/60" />
        <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">or continue with</span>
        <div className="h-px flex-1 bg-slate-300 dark:bg-slate-700/60" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {PROVIDERS.map((p) => (
          <a
            key={p.id}
            href={p.href}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white dark:bg-[#080d1a]/85 border border-slate-300 dark:border-slate-700/70 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all active:scale-[0.97] hover:border-slate-400 dark:hover:border-slate-400/70 shadow-sm dark:shadow-none"
          >
            {p.icon}
            <span className="hidden sm:inline">{p.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
