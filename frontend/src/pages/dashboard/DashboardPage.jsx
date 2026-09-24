import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Trophy, ClipboardList, TrendingUp, Star,
  Plus, ChevronRight, Clock, Building2,
  Zap, Target, BarChart3
} from 'lucide-react';
import { userAPI } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import {
  RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis,
  AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: 'easeOut' },
});

const STAT_CARDS = [
  {
    icon: ClipboardList,
    label: 'Total Interviews',
    key: 'totalSessions',
    sub: 'All time sessions',
    accent: 'stat-card-teal',
    iconBg: 'bg-teal-500/15 text-teal-400',
  },
  {
    icon: Trophy,
    label: 'Completed',
    key: 'completedSessions',
    sub: 'Finished sessions',
    accent: 'stat-card-emerald',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
  },
  {
    icon: TrendingUp,
    label: 'Avg. Score',
    key: 'averageScore',
    sub: 'Across all sessions',
    suffix: '%',
    accent: 'stat-card-blue',
    iconBg: 'bg-blue-500/15 text-blue-400',
  },
  {
    icon: Star,
    label: 'Best Score',
    key: 'bestScore',
    sub: 'Personal best',
    suffix: '%',
    accent: 'stat-card-amber',
    iconBg: 'bg-amber-500/15 text-amber-400',
  },
];

const QUICK_ACTIONS = [
  {
    to: '/interviews/new', icon: Zap,
    label: 'Start Interview', desc: 'Setup a new mock session',
    bg: 'from-teal-600 to-teal-500', glow: 'shadow-[0_0_20px_rgba(13,148,136,0.4)]',
  },
  {
    to: '/resumes', icon: ClipboardList,
    label: 'Upload Resume', desc: 'Add your latest resume',
    bg: 'from-blue-600 to-blue-500', glow: 'shadow-[0_0_20px_rgba(37,99,235,0.35)]',
  },
  {
    to: '/sessions', icon: BarChart3,
    label: 'View Progress', desc: 'Review past performance',
    bg: 'from-emerald-600 to-emerald-500', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.35)]',
  },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userAPI.getDashboard()
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const scoreData = [
    { name: 'Score', value: stats?.averageScore ?? 0, fill: '#14b8a6' },
  ];

  return (
    <div className="space-y-7 animate-fade-in">

      {/* ── Greeting Row ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-surface-border bg-gradient-to-r from-surface-card/90 via-surface-card/40 to-teal-500/5 backdrop-blur-xl relative overflow-hidden">
        {/* Glow corner */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl p-1 bg-gradient-to-br from-teal-500/20 via-brand-500/20 to-blue-500/30 border border-teal-500/30 flex-shrink-0 shadow-lg shadow-teal-500/10 flex items-center justify-center">
            <img src="/AI-interview-svg-icon.png" alt="InterviewAI Coach" className="w-full h-full object-cover rounded-xl" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#080e1c] flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            </span>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 dark:text-slate-100">
              Good day,{' '}
              <span className="gradient-text">{user?.name?.split(' ')[0]}</span>{' '}
              👋
            </h2>
            <p className="text-slate-500 mt-0.5 text-xs sm:text-sm">
              Ready to practice? Your AI interview coach is active &amp; ready.
            </p>
          </div>
        </div>
        <Link to="/interviews/new" className="btn-primary inline-flex self-start sm:self-auto gap-2">
          <Plus className="w-4 h-4" />
          New Interview
        </Link>
      </div>

      {/* ── Stat Cards ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STAT_CARDS.map(({ icon: Icon, label, key, sub, suffix = '', accent, iconBg }, i) => (
          <motion.div key={key} {...fadeUp(i * 0.07)} className={`stat-card ${accent}`}>
            {/* subtle corner glow */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 bg-white pointer-events-none" />
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl flex-shrink-0 ${iconBg}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-slate-600 dark:text-slate-500 text-xs font-medium">{label}</p>
                <p className="text-3xl font-display font-bold text-slate-900 dark:text-slate-100 mt-0.5 leading-none">
                  {loading ? '—' : `${stats?.[key] ?? 0}${suffix}`}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-600 mt-1.5">{sub}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Charts + Recent ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Score Gauge */}
        <motion.div {...fadeUp(0.2)} className="card p-6 flex flex-col items-center justify-center relative overflow-hidden">
          {/* bg teal orb */}
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-teal-500/5 blur-2xl pointer-events-none" />
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
            Avg. Performance
          </h3>
          <div className="relative flex items-center justify-center">
            <ResponsiveContainer width={180} height={180}>
              <RadialBarChart
                innerRadius="76%"
                outerRadius="92%"
                data={scoreData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  angleAxisId={0}
                  tick={false}
                />
                <RadialBar
                  background={{ fill: 'var(--progress-track)' }}
                  dataKey="value"
                  cornerRadius={6}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            {/* center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
              <span className="text-2xl font-display font-bold gradient-text leading-none tracking-tight">
                {stats?.averageScore ?? 0}%
              </span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider mt-1">
                Score
              </span>
            </div>
          </div>
          <p className="text-slate-500 text-xs mt-2 tracking-wide">Overall score</p>
        </motion.div>

        {/* Recent Sessions */}
        <motion.div {...fadeUp(0.25)} className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-200 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-400 inline-block animate-pulse" />
              Recent Sessions
            </h3>
            <Link to="/sessions" className="btn-ghost text-xs text-teal-400 hover:text-teal-300">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {!stats?.recentSessions?.length ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mx-auto mb-3">
                <ClipboardList className="w-6 h-6 text-teal-500/60" />
              </div>
              <p className="text-slate-500 text-sm">No sessions yet</p>
              <Link to="/interviews/new" className="btn-primary mt-4 inline-flex text-xs px-4 py-2">
                Start practicing
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentSessions.map((session) => {
                const score = session.overallScore;
                const scoreCls = score >= 70
                  ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                  : score >= 40
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                  : 'text-rose-400 bg-rose-500/10 border-rose-500/20';

                return (
                  <Link
                    key={session._id}
                    to={`/sessions/${session._id}/results`}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-surface-border hover:border-teal-500/30 bg-surface hover:bg-surface-hover transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/15 group-hover:border-teal-500/30 transition-colors">
                        <Building2 className="w-4 h-4 text-teal-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                          {session.interviewId?.jobTitle}
                        </p>
                        <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${scoreCls}`}>
                        {score}%
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────────── */}
      <motion.div {...fadeUp(0.3)} className="card p-5">
        <h3 className="font-semibold text-slate-200 text-sm mb-4 flex items-center gap-2">
          <Target className="w-4 h-4 text-teal-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ to, icon: Icon, label, desc, bg, glow }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center gap-4 p-4 rounded-xl border border-surface-border hover:border-teal-500/30 bg-surface hover:bg-surface-hover transition-all group"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${bg} ${glow} flex-shrink-0 group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
