import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

/**
 * OAuthCallbackPage
 *
 * The backend's OAuth callback redirects here as:
 *   /oauth-callback#accessToken=...&refreshToken=...
 * (tokens are in the URL *fragment*, not query string, so they're
 * never sent to any server or captured in access logs)
 *
 * or on failure:
 *   /login?oauthError=<message>
 * (handled directly by LoginPage, not this page)
 */
export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const loginWithTokens = useAuthStore((s) => s.loginWithTokens);
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get('accessToken');
    const refreshToken = hash.get('refreshToken');

    if (!accessToken || !refreshToken) {
      toast.error('Sign-in failed: no tokens received.');
      navigate('/login', { replace: true });
      return;
    }

    loginWithTokens({ accessToken, refreshToken }).then((result) => {
      // Clear the sensitive fragment from the URL/history either way
      window.history.replaceState(null, '', '/oauth-callback');

      if (result.success) {
        toast.success('Welcome back! 👋');
        navigate('/dashboard', { replace: true });
      } else {
        toast.error(result.message);
        navigate('/login', { replace: true });
      }
    });
  }, [loginWithTokens, navigate]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      <p className="text-slate-400 text-sm">Finishing sign-in…</p>
    </div>
  );
}
