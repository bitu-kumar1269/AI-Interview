import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu } from 'lucide-react';
import { ThemeToggle } from '@/components/common';

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-100 dark:bg-[#070913] flex items-center justify-center lg:justify-end transition-colors duration-200">
      {/* ── Fullscreen Background Video ──────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40 dark:opacity-100 transition-opacity"
      >
        <source src="/Ai-interview-video.mp4" type="video/mp4" />
        <source src="/Ai-intervirw-video.mp4" type="video/mp4" />
      </video>

      {/* ── Responsive Gradient Overlay ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-slate-100/70 to-slate-200/90 dark:from-black/40 dark:via-black/20 dark:to-[#070913]/90 lg:bg-gradient-to-r lg:from-white/20 lg:via-slate-100/60 lg:to-white/95 lg:dark:from-black/10 lg:dark:via-slate-950/40 lg:dark:to-[#060813]/95 pointer-events-none transition-colors" />

      {/* ── Ambient Cyber Glow Accents ────────────────── */}
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Top Left Floating Navigation & Status Badge ─ */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 px-3.5 py-2 rounded-full bg-white/80 dark:bg-[#080c18]/70 hover:bg-white dark:hover:bg-[#0d1424]/90 border border-slate-200 dark:border-cyan-500/30 hover:border-cyan-500/40 backdrop-blur-xl shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-200 group"
        >
          <img src="/AI-interview-svg-icon.png" alt="InterviewAI Logo" className="w-5 h-5 rounded-full object-cover shadow-sm" />
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-cyan-500 dark:text-cyan-400" />
          <span>Back to Home</span>
        </Link>

        <div className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#080c18]/60 border border-slate-200 dark:border-cyan-500/25 text-[11px] font-mono text-cyan-600 dark:text-cyan-300 backdrop-blur-xl shadow-sm dark:shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
          </span>
          <Cpu className="w-3 h-3 text-cyan-500 dark:text-cyan-400 ml-0.5" />
          <span>AI NEURAL ENGINE ONLINE</span>
        </div>
      </div>

      {/* ── Top Right Theme Toggle ────────────────────── */}
      <div className="absolute top-6 right-6 z-30">
        <ThemeToggle />
      </div>

      {/* ── Right-Side Floating Glass Login Panel ────── */}
      <div className="relative z-10 w-full max-w-[460px] p-4 sm:p-6 lg:p-0 lg:my-auto lg:mr-10 xl:mr-20 2xl:mr-28">
        <motion.div
          initial={{ opacity: 0, x: 30, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative bg-white/95 dark:bg-[#090d19]/85 backdrop-blur-2xl border border-slate-200 dark:border-cyan-500/25 rounded-3xl p-7 sm:p-10 shadow-2xl dark:shadow-[0_0_60px_rgba(6,182,212,0.15)] overflow-hidden"
        >
          {/* Top subtle neon border highlight line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-80" />
          
          {/* Inner subtle ambient glow */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-cyan-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-blue-600/20 rounded-full blur-2xl pointer-events-none" />

          {/* Form Outlet */}
          <div className="relative z-10">
            <Outlet />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
