import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader2, Bot, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const oauthError = searchParams.get('oauthError');
    if (oauthError) {
      toast.error(oauthError);
      searchParams.delete('oauthError');
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div>
      {/* Brand & Portal Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl p-1 bg-gradient-to-br from-brand-500/20 to-accent-600/30 border border-brand-400/30 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.25)] overflow-hidden">
          <img src="/AI-interview-svg-icon.png" alt="InterviewAI" className="w-full h-full object-cover rounded-xl" />
        </div>
        <div>
          <span className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight">InterviewAI</span>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-brand-500 dark:text-brand-400">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            <span>NEURAL PORTAL</span>
          </div>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-1.5 tracking-tight">Welcome Back</h2>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Sign in to activate your AI interview workspace</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 font-mono">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500 dark:text-brand-400/80" />
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-[#080d1a]/85 border border-slate-300 dark:border-slate-700/70 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/25 transition-all shadow-sm dark:shadow-inner"
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+\.\S+$/, message: 'Invalid email address' }
              })}
            />
          </div>
          {errors.email && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5 font-mono">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-500 dark:text-brand-400/80" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-[#080d1a]/85 border border-slate-300 dark:border-slate-700/70 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/25 transition-all shadow-sm dark:shadow-inner"
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-600 dark:hover:text-brand-300 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 font-medium">{errors.password.message}</p>}
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
          <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
        </button>
      </form>

      <SocialLoginButtons />

      <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 font-semibold transition-colors hover:underline ml-1">
          Create one free
        </Link>
      </p>
    </div>
  );
}
