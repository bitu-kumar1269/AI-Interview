import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
  User, Mail, Lock, Save, Loader2, CheckCircle, Camera,
  Trash2, Linkedin, Github, ExternalLink, Sparkles, Globe,
} from 'lucide-react';
import { userAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

function LeetCodeIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 4.96 3.82c.264.025.534.025.803.003a5.955 5.955 0 0 0 3.328-1.55l3.854-4.126a1.375 1.375 0 0 0-1.922-1.922l-3.854 4.126a3.205 3.205 0 0 1-1.791.834 3.16 3.16 0 0 1-.433-.002 3.192 3.192 0 0 1-2.67-2.054 2.973 2.973 0 0 1-.188-.547 2.97 2.97 0 0 1-.033-1.27c.045-.378.196-.733.438-1.025L7.97 8.16l4.552-4.87a1.375 1.375 0 0 0-.96-2.29h-.079zM16.48 7.37a1.375 1.375 0 0 0-.972 2.347l3.854 4.126a3.197 3.197 0 0 1 .834 1.791c.026.144.026.289.002.433a3.192 3.192 0 0 1-2.054 2.67c-.174.07-.358.12-.547.188-.415.093-.846.07-1.27-.033a2.97 2.97 0 0 1-1.025-.438l-1.922-1.922a1.375 1.375 0 1 0-1.922 1.922l1.922 1.922a5.726 5.726 0 0 0 1.969.843c.264.05.534.05.803.028a5.938 5.938 0 0 0 3.82-2.906 5.83 5.83 0 0 0 1.017-.349 5.527 5.527 0 0 0 2.362-.062 5.35 5.35 0 0 0 .513-.125 5.266 5.266 0 0 0 2.104-1.209l3.854-4.126a1.375 1.375 0 0 0-.972-2.347h-.079a1.374 1.374 0 0 0-.961.438l-4.552 4.87-4.552-4.87a1.374 1.374 0 0 0-.961-.438h-.079z"/>
      <path d="M8.5 11.5a1.25 1.25 0 0 0 0 2.5h7a1.25 1.25 0 0 0 0-2.5h-7z" fill="#FFA116"/>
    </svg>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      summary: user?.summary || user?.bio || '',
      linkedin: user?.linkedin || '',
      github: user?.github || '',
      leetcode: user?.leetcode || '',
    },
  });

  const {
    register: regPwd, handleSubmit: handlePwd, watch: watchPwd,
    reset: resetPwd, formState: { errors: pwdErrors }
  } = useForm();
  const newPassword = watchPwd('newPassword');

  // Watch profile fields for live counter & link preview
  const watchSummary  = watch('summary');
  const watchLinkedin = watch('linkedin');
  const watchGithub   = watch('github');
  const watchLeetcode = watch('leetcode');

  // Sync profile details on mount
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await userAPI.getProfile();
        if (active && data?.user) {
          updateUser(data.user);
          reset({
            name: data.user.name || '',
            email: data.user.email || '',
            summary: data.user.summary || data.user.bio || '',
            linkedin: data.user.linkedin || '',
            github: data.user.github || '',
            leetcode: data.user.leetcode || '',
          });
        }
      } catch {
        // graceful fallback to store
      }
    })();
    return () => { active = false; };
  }, [reset, updateUser]);

  const onProfileSave = async (data) => {
    setSaving(true);
    try {
      const payload = {
        name: data.name,
        summary: data.summary,
        bio: data.summary,
        linkedin: data.linkedin,
        github: data.github,
        leetcode: data.leetcode,
      };
      const { data: res } = await userAPI.updateProfile(payload);
      if (res?.user) {
        updateUser(res.user);
      }
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setUploadingAvatar(true);
    try {
      const { data } = await userAPI.uploadAvatar(formData);
      if (data?.user) {
        updateUser(data.user);
      } else if (data?.avatarUrl) {
        updateUser({ avatar: data.avatarUrl });
      }
      toast.success('Profile photo uploaded!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload photo');
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!confirm('Are you sure you want to remove your profile photo?')) return;
    setUploadingAvatar(true);
    try {
      const { data } = await userAPI.deleteAvatar();
      if (data?.user) {
        updateUser(data.user);
      } else {
        updateUser({ avatar: null });
      }
      toast.success('Profile photo removed');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to remove photo');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const onPasswordSave = async (data) => {
    setSavingPwd(true);
    try {
      await userAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password changed successfully!');
      resetPwd();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* ── Profile Header & Avatar ─────────────────────────────── */}
      <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-5">
          {/* Avatar Container */}
          <div className="relative group flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-brand flex items-center justify-center text-white font-display font-bold text-3xl shadow-lg shadow-brand-500/10 border-2 border-brand-500/30">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.name?.charAt(0).toUpperCase() || 'U'}</span>
              )}
            </div>

            {/* Hover overlay for changing avatar */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              className="absolute inset-0 rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-xs font-medium cursor-pointer"
              title="Change profile photo"
            >
              {uploadingAvatar ? (
                <Loader2 className="w-6 h-6 animate-spin text-brand-400" />
              ) : (
                <>
                  <Camera className="w-5 h-5 mb-1 text-white" />
                  <span>Change</span>
                </>
              )}
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarFileSelect}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-display font-bold text-white">{user?.name}</h2>
              <span className="badge badge-brand capitalize">{user?.role || 'Candidate'}</span>
            </div>
            <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
            <div className="flex items-center gap-3 mt-2.5 text-xs text-slate-500">
              <span>{user?.totalSessions ?? 0} sessions completed</span>
              <span>•</span>
              <span className="text-emerald-400 font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Avatar Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
          >
            {uploadingAvatar ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Camera className="w-3.5 h-3.5" />}
            Upload Photo
          </button>
          {user?.avatar && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              disabled={uploadingAvatar}
              className="btn-ghost text-xs px-2.5 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
              title="Remove photo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ── Main Profile Form ───────────────────────────────────── */}
      <form onSubmit={handleSubmit(onProfileSave)} className="space-y-6">
        {/* Personal Details */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
          <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-400" /> Personal Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Bitu Kumar"
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input bg-surface-hover opacity-60 cursor-not-allowed"
                disabled
                {...register('email')}
              />
              <p className="text-slate-500 text-xs mt-1">Email is linked to your authentication account</p>
            </div>
          </div>
        </motion.div>

        {/* Introduction Summary */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> Introduction Summary
            </h3>
            <span className={`text-xs ${(watchSummary?.length || 0) > 900 ? 'text-amber-400 font-medium' : 'text-slate-500'}`}>
              {watchSummary?.length || 0}/1000
            </span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Write a professional introduction summarizing your engineering background, favorite technologies, and career focus. The AI interviewer uses this to tailor technical questions to your expertise.
          </p>

          <textarea
            rows={4}
            className="form-input resize-y text-sm leading-relaxed"
            placeholder="e.g. Full-Stack Software Engineer with 2+ years of hands-on experience developing distributed backend systems in Node.js, Express, and microservices, with modern frontends in React.js. Passionate about system design, high-concurrency APIs, and clean code principles..."
            maxLength={1000}
            {...register('summary')}
          />
        </motion.div>

        {/* Social & Coding Links */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
          <h3 className="font-semibold text-white mb-2 flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" /> Coding & Professional Profiles
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Add links to your public profiles. This helps reviewers and AI systems understand your coding contributions and achievements.
          </p>

          <div className="space-y-4">
            {/* LinkedIn */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="form-label mb-0 flex items-center gap-1.5 text-blue-400">
                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn Profile
                </label>
                {watchLinkedin && watchLinkedin.startsWith('http') && (
                  <a
                    href={watchLinkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                  >
                    Test link <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                className="form-input"
                placeholder="https://linkedin.com/in/username"
                {...register('linkedin')}
              />
            </div>

            {/* GitHub */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="form-label mb-0 flex items-center gap-1.5 text-slate-300">
                  <Github className="w-3.5 h-3.5" /> GitHub Profile
                </label>
                {watchGithub && watchGithub.startsWith('http') && (
                  <a
                    href={watchGithub}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                  >
                    Test link <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                className="form-input"
                placeholder="https://github.com/username"
                {...register('github')}
              />
            </div>

            {/* LeetCode */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="form-label mb-0 flex items-center gap-1.5 text-amber-400">
                  <LeetCodeIcon className="w-3.5 h-3.5" /> LeetCode Profile
                </label>
                {watchLeetcode && watchLeetcode.startsWith('http') && (
                  <a
                    href={watchLeetcode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                  >
                    Test link <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <input
                type="url"
                className="form-input"
                placeholder="https://leetcode.com/u/username"
                {...register('leetcode')}
              />
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary px-6 py-2.5 shadow-lg shadow-brand-500/20">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving Profile...' : 'Save Profile Changes'}
          </button>
        </div>
      </form>

      {/* ── Password Change Form ─────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
        <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
          <Lock className="w-4 h-4 text-brand-400" /> Change Password
        </h3>

        <form onSubmit={handlePwd(onPasswordSave)} className="space-y-4">
          <div>
            <label className="form-label">Current Password</label>
            <input
              type="password"
              className="form-input"
              {...regPwd('currentPassword', { required: 'Current password is required' })}
            />
            {pwdErrors.currentPassword && <p className="form-error">{pwdErrors.currentPassword.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-input"
                {...regPwd('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 8, message: 'Min 8 characters' },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                    message: 'Must include uppercase, lowercase, and number',
                  },
                })}
              />
              {pwdErrors.newPassword && <p className="form-error">{pwdErrors.newPassword.message}</p>}
            </div>
            <div>
              <label className="form-label">Confirm New Password</label>
              <input
                type="password"
                className="form-input"
                {...regPwd('confirmPassword', {
                  required: 'Please confirm password',
                  validate: (v) => v === newPassword || 'Passwords do not match',
                })}
              />
              {pwdErrors.confirmPassword && <p className="form-error">{pwdErrors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={savingPwd} className="btn-primary">
              {savingPwd ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {savingPwd ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </motion.div>

      {/* ── Account Details ─────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
        <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
          <Mail className="w-4 h-4 text-brand-400" /> Account Details
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A' },
            { label: 'Account Type', value: user?.role === 'admin' ? 'Administrator' : 'Candidate' },
            { label: 'Total Sessions', value: user?.totalSessions ?? 0 },
            { label: 'Available Credits', value: user?.credits ?? 10 },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-surface-border last:border-0">
              <span className="text-slate-400 text-sm">{label}</span>
              <span className="text-white text-sm font-medium">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
