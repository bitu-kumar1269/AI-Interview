/**
 * utils/apiUrl.js
 *
 * Normalizes API and WebSocket URLs across both local dev and production (e.g. Render).
 * Handles edge cases like:
 *  - VITE_API_URL set with or without '/api' suffix (e.g. 'https://backend.onrender.com' vs 'https://backend.onrender.com/api')
 *  - Trailing slashes
 *  - Fallback to '/api' for Vite dev proxy
 */

/**
 * Returns the normalized API base URL.
 * Guaranteed to end with '/api' unless falling back to relative '/api'.
 *
 * Examples:
 *   'https://backend.onrender.com'     -> 'https://backend.onrender.com/api'
 *   'https://backend.onrender.com/'    -> 'https://backend.onrender.com/api'
 *   'https://backend.onrender.com/api' -> 'https://backend.onrender.com/api'
 *   'https://backend.onrender.com/api/'-> 'https://backend.onrender.com/api'
 *   '' (undefined)                     -> '/api'
 */
export const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return '/api';

  const trimmed = envUrl.trim().replace(/\/+$/, '');
  if (!trimmed) return '/api';

  // If user provided origin without /api, append it
  if (!trimmed.endsWith('/api')) {
    return `${trimmed}/api`;
  }
  return trimmed;
};

/**
 * Returns the base server URL for WebSocket / Socket.IO connections (without '/api' suffix).
 *
 * Examples:
 *   'https://backend.onrender.com/api' -> 'https://backend.onrender.com'
 *   'https://backend.onrender.com'     -> 'https://backend.onrender.com'
 *   '' (undefined)                     -> 'http://localhost:5001'
 */
export const getSocketUrl = () => {
  const envSocket = import.meta.env.VITE_SOCKET_URL;
  if (envSocket) return envSocket.trim().replace(/\/+$/, '');

  const envApi = import.meta.env.VITE_API_URL;
  if (envApi) {
    const trimmed = envApi.trim().replace(/\/+$/, '');
    const withoutApi = trimmed.replace(/\/api$/, '');
    // A relative value like '/api' strips down to '' — that's not a
    // valid socket.io target, so fall back to the current page's origin
    // (correct for same-origin Nginx-proxied production deployments).
    if (withoutApi && /^https?:\/\//.test(withoutApi)) return withoutApi;
    if (typeof window !== 'undefined' && window.location?.origin) {
      return window.location.origin;
    }
  }

  return 'http://localhost:5001';
};
