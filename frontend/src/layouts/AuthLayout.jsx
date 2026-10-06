import { Outlet, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="relative min-h-screen w-full overflow-y-auto bg-[#070913] flex flex-col justify-center items-center lg:items-end py-6 px-4 sm:px-6 lg:py-12">
      {/* ── Fullscreen Background Video ──────────────── */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
      >
        <source src="/Ai-interview-video.mp4" type="video/mp4" />
        <source src="/Ai-intervirw-video.mp4" type="video/mp4" />
      </video>

      {/* ── Responsive Gradient Overlay ── */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#070913]/90 lg:bg-gradient-to-r lg:from-black/10 lg:via-slate-950/40 lg:to-[#060813]/95 pointer-events-none" />

      {/* ── Ambient Cyber Glow Accents ────────────────── */}
      <div className="fixed top-1/3 -right-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-80 h-80 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* ── Floating Header Controls ─ */}
      <div className="relative w-full max-w-[460px] lg:max-w-none lg:fixed lg:top-6 lg:left-6 lg:right-6 z-20 flex items-center justify-between mb-4 lg:mb-0">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-300 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-white/80 dark:bg-[#080c18]/70 hover:bg-white dark:hover:bg-[#0d1424]/90 border border-slate-200 dark:border-cyan-500/30 hover:border-cyan-500/40 backdrop-blur-xl shadow-sm dark:shadow-[0_0_20px_rgba(6,182,212,0.15)] transition-all duration-200 group"
          >
            <img src="/AI-interview-svg-icon.png" alt="InterviewAI Logo" className="w-5 h-5 rounded-full object-cover shadow-sm" />
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-cyan-500 dark:text-cyan-400" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>

      {/* ── Floating Glass Form Panel ────── */}
      <div className="relative z-10 w-full max-w-[460px] mx-auto lg:mx-0 lg:my-auto lg:mr-10 xl:mr-20 2xl:mr-28">
        <motion.div
          initial={{ opacity: 0, x: 20, y: 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="relative bg-white/95 dark:bg-[#090d19]/85 backdrop-blur-2xl border border-slate-200 dark:border-cyan-500/25 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl dark:shadow-[0_0_60px_rgba(6,182,212,0.15)] hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-[0_20px_70px_rgba(6,182,212,0.2)] transition-all duration-300 overflow-hidden"
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
