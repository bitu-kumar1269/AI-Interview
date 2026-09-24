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

// ─────────────────────────────────────────────────────────────────
// GITHUB
// ─────────────────────────────────────────────────────────────────
const github = {
  getAuthUrl() {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
      scope: 'read:user user:email',
      allow_signup: 'true',
    });
    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  },

  async exchangeCodeForProfile(code) {
    const { data: tokenData } = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        code,
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        redirect_uri: process.env.GITHUB_CALLBACK_URL,
      },
      { headers: { Accept: 'application/json' } }
    );

    if (!tokenData.access_token) {
      throw new Error(tokenData.error_description || 'GitHub token exchange failed.');
    }

    const authHeader = { Authorization: `Bearer ${tokenData.access_token}` };

    const { data: profile } = await axios.get('https://api.github.com/user', { headers: authHeader });

    // GitHub only returns a public email if the user has one set; otherwise
    // we need a separate call to the (possibly private) emails list.
    let email = profile.email;
    if (!email) {
      const { data: emails } = await axios.get('https://api.github.com/user/emails', { headers: authHeader });
      const primary = emails.find((e) => e.primary && e.verified) || emails.find((e) => e.verified) || emails[0];
      email = primary?.email || null;
    }

    if (!email) {
      throw new Error('Could not retrieve an email address from GitHub. Please make an email public or verified on your GitHub account.');
    }

    return {
      id: String(profile.id),
      email,
      name: profile.name || profile.login,
      avatar: profile.avatar_url || null,
    };
  },
};

// ─────────────────────────────────────────────────────────────────
// LINKEDIN (OpenID Connect — "Sign In with LinkedIn using OpenID Connect")
// ─────────────────────────────────────────────────────────────────
const linkedin = {
  getAuthUrl() {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: process.env.LINKEDIN_CLIENT_ID,
      redirect_uri: process.env.LINKEDIN_CALLBACK_URL,
      scope: 'openid profile email',
    });
    return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
  },

  async exchangeCodeForProfile(code) {
    const { data: tokenData } = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        redirect_uri: process.env.LINKEDIN_CALLBACK_URL,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { data: profile } = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    return {
      id: profile.sub,
      email: profile.email,
      name: profile.name || 'LinkedIn User',
      avatar: profile.picture || null,
    };
  },
};

module.exports = { google, github, linkedin };
