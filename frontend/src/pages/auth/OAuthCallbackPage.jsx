import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

import { getApiBaseUrl } from '@/utils/apiUrl';

/**
 * OAuthCallbackPage
 *
 * The backend's OAuth callback redirects here as:
 *   /oauth-callback#accessToken=...&refreshToken=...
 * (tokens are in the URL *fragment*, not query string, so they're
 * never sent to any server or captured in access logs)
 *
 * If a provider redirects here directly with ?code=..., we forward it
 * to the backend callback endpoint to exchange the code for tokens.
 *
 * or on failure:
 *   /login?oauthError=<message>
 */
export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const loginWithTokens = useAuthStore((s) => s.loginWithTokens);
  const ranOnce = useRef(false);

  useEffect(() => {
    if (ranOnce.current) return;
    ranOnce.current = true;

    // 1. First check hash (tokens issued directly by backend)
    const hash = new URLSearchParams(window.location.hash.slice(1));
    const accessToken = hash.get('accessToken');
    const refreshToken = hash.get('refreshToken');

    if (accessToken && refreshToken) {
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
      return;
    }

    // 2. Check query params for provider error or code
    const searchParams = new URLSearchParams(window.location.search);
    const oauthError = searchParams.get('oauthError') || searchParams.get('error') || searchParams.get('error_description');
    if (oauthError) {
      toast.error(oauthError);
      navigate('/login', { replace: true });
      return;
    }

    const code = searchParams.get('code');
    if (code) {
      // Forward code to backend callback
      const apiBase = getApiBaseUrl();
      const state = searchParams.get('state');
      const stateParam = state ? `&state=${encodeURIComponent(state)}` : '';
      window.location.href = `${apiBase}/auth/google/callback?code=${encodeURIComponent(code)}${stateParam}`;
      return;
    }

    toast.error('Sign-in failed: no tokens received.');
    navigate('/login', { replace: true });
  }, [loginWithTokens, navigate]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      <p className="text-slate-400 text-sm">Finishing sign-in…</p>
    </div>
  );
}
