const User = require('../models/User.model');
const oauthService = require('../services/oauth.service');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwt.utils');

const getPrimaryClientUrl = () => {
  const raw = process.env.CLIENT_URL || 'http://localhost:5173';
  return raw.split(',')[0].trim().replace(/\/+$/, '');
};

/**
 * Finds an existing user by provider ID or email, or creates a new one.
 * Links the provider ID onto an existing email/password account if it
 * matches, so a user can sign in with either method afterward.
 */
const findOrCreateOAuthUser = async ({ provider, profile }) => {
  const idField = `${provider}Id`; // googleId | githubId | linkedinId

  let user = await User.findOne({ [idField]: profile.id });
  if (user) return user;

  // Link to an existing account with the same email, if any
  user = await User.findOne({ email: profile.email });
  if (user) {
    user[idField] = profile.id;
    if (!user.avatar && profile.avatar) user.avatar = profile.avatar;
    await user.save({ validateBeforeSave: false });
    return user;
  }

  // Otherwise create a brand-new OAuth-only account
  user = await User.create({
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
    [idField]: profile.id,
    authProvider: provider,
    role: 'candidate',
  });
  return user;
};

/**
 * Issues tokens for the user and redirects back to the frontend.
 * Tokens are passed as URL fragments (#) rather than query params so
 * they are never sent to the server or logged in server access logs.
 */
const redirectWithTokens = (res, user) => {
  const clientUrl = getPrimaryClientUrl();
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  const redirectUrl = `${clientUrl}/oauth-callback#accessToken=${accessToken}&refreshToken=${refreshToken}`;
  res.redirect(redirectUrl);
};

const redirectWithError = (res, message) => {
  const clientUrl = getPrimaryClientUrl();
  const redirectUrl = `${clientUrl}/login?oauthError=${encodeURIComponent(message)}`;
  res.redirect(redirectUrl);
};

// Build one pair of (redirect, callback) handlers per provider to avoid
// repeating the same try/catch boilerplate three times.
const makeHandlers = (provider) => ({
  redirect: (req, res) => {
    res.redirect(oauthService[provider].getAuthUrl());
  },

  callback: async (req, res) => {
    const { code, error, error_description: errorDescription } = req.query;

    if (error) {
      return redirectWithError(res, errorDescription || `${provider} sign-in was cancelled.`);
    }
    if (!code) {
      return redirectWithError(res, `Missing authorization code from ${provider}.`);
    }

    try {
      const profile = await oauthService[provider].exchangeCodeForProfile(code);

      if (!profile.email) {
        return redirectWithError(res, `${provider} did not provide an email address.`);
      }

      const user = await findOrCreateOAuthUser({ provider, profile });

      if (!user.isActive) {
        return redirectWithError(res, 'Your account has been deactivated.');
      }
      if (user.isBanned) {
        return redirectWithError(res, 'Your account has been banned due to violation of terms.');
      }

      user.lastLogin = new Date();
      await user.save({ validateBeforeSave: false });

      redirectWithTokens(res, user);
    } catch (err) {
      console.error(`[OAuth:${provider}] callback failed:`, err.response?.data || err.message);
      redirectWithError(res, `${provider} sign-in failed. Please try again.`);
    }
  },
});

module.exports = {
  google: makeHandlers('google'),
  github: makeHandlers('github'),
  linkedin: makeHandlers('linkedin'),
};
