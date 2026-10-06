import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    const result = await registerUser({ name: data.name, email: data.email, password: data.password });
    if (result.success) {
      toast.success('Account created! Let\'s get started 🎉');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div>
      {/* Brand & Portal Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-2xl p-1 bg-gradient-to-br from-brand-500/20 to-accent-600/30 border border-brand-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.25)] overflow-hidden">
          <img src="/AI-interview-svg-icon.png" alt="InterviewAI" className="w-full h-full object-cover rounded-xl" />
        </div>
        <span className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">InterviewAI</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-1 tracking-tight">Create Account</h2>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-5">Start practicing with real-time AI interviewers</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1 font-mono">
            Full Name
          </label>
          <div className="relative">
            <input
              type="text"
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-[#080d1a]/85 border border-slate-300 dark:border-slate-700/70 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/25 transition-all shadow-sm dark:shadow-inner"
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' }
              })}
            />
          </div>
          {errors.name && <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-medium">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1 font-mono">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-[#080d1a]/85 border border-slate-300 dark:border-slate-700/70 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/25 transition-all shadow-sm dark:shadow-inner"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email' }
              })}
            />
          </div>
          {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1 font-mono">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full pl-4 pr-10 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-[#080d1a]/85 border border-slate-300 dark:border-slate-700/70 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/25 transition-all shadow-sm dark:shadow-inner"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 8, message: 'Minimum 8 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s])/,
                  message: 'Must include uppercase and lowercase letters, a number, and a special character',
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Use at least 8 characters, including uppercase and lowercase letters, a number, and a special character.
          </p>
          {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-medium">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1 font-mono">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type="password"
              className="w-full px-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-[#080d1a]/85 border border-slate-300 dark:border-slate-700/70 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/25 transition-all shadow-sm dark:shadow-inner"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (v) => v === password || 'Passwords do not match',
              })}
            />
          </div>
          {errors.confirmPassword && <p className="text-red-500 dark:text-red-400 text-xs mt-1 font-medium">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-accent-600 hover:from-brand-500 hover:via-brand-400 hover:to-accent-500 text-white font-semibold text-sm tracking-wide shadow-[0_0_25px_rgba(20,184,166,0.35)] hover:shadow-[0_0_35px_rgba(20,184,166,0.5)] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Sparkles className="w-4 h-4 text-brand-200" />
          )}
          <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
        </button>
      </form>

      <SocialLoginButtons />

      <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 font-semibold transition-colors hover:underline ml-1">
          Sign in
        </Link>
      </p>
    </div>
  );
}
