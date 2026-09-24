const axios = require('axios');

/**
 * OAuth Service — manual (passport-free) implementation for
 * Google, GitHub, and LinkedIn "Sign in with" flows.
 *
 * Each provider exposes two functions:
 *   getAuthUrl()               → builds the provider's consent-screen URL
 *   exchangeCodeForProfile(code) → exchanges the auth code for an access
 *                                   token, then fetches a normalized profile:
 *                                   { id, email, name, avatar }
 *
 * Uses axios (already a project dependency) — no new packages required.
 */

// ─────────────────────────────────────────────────────────────────
// GOOGLE
// ─────────────────────────────────────────────────────────────────
const google = {
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'select_account',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  async exchangeCodeForProfile(code) {
    const { data: tokenData } = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: 'authorization_code',
    });

    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    return {
      id: profile.sub,
      email: profile.email,
      name: profile.name || profile.given_name || 'Google User',
      avatar: profile.picture || null,
    };
  },
};

module.exports = { google };


