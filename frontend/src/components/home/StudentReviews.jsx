import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  CheckCircle2,
  Quote,
  TrendingUp,
  Award,
  Building,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const METRICS = [
  { label: 'Interview Pass Rate', value: '89.4%', change: '+34% vs self-prep', icon: TrendingUp },
  { label: 'Community Rating', value: '4.9 / 5.0', change: 'Over 2,400+ reviews', icon: Star },
  { label: 'Mock Sessions Completed', value: '50,000+', change: 'Worldwide candidates', icon: Users },
  { label: 'Average Salary Bump', value: '+$32,000', change: 'Reported by hired users', icon: Award },
];

const REVIEWS = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    role: 'Software Engineer II',
    company: 'Google',
    companyColor: 'from-blue-500/20 to-emerald-500/20',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'FAANG & Tech Leaders',
    badge: 'Landed L4 Offer',
    date: '3 weeks ago',
    review:
      'The 3D AI voice mock felt unnervingly realistic. In my actual Google interview, the interviewer asked a distributed caching question that was almost identical to what the Groq AI engine grilled me on 2 days earlier. Landed the offer!',
    highlight: 'Aced Google System Design Round',
    skills: ['Go', 'Kubernetes', 'System Design'],
  },
  {
    id: 2,
    name: 'David Chen',
    role: 'Senior Frontend Engineer',
    company: 'Stripe',
    companyColor: 'from-indigo-500/20 to-purple-500/20',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Frontend & Full-Stack',
    badge: 'Offer Accepted',
    date: '1 month ago',
    review:
      'The instant feedback on React concurrent rendering, performance profiling, and state management was sharper than mock interviews I paid $200 for on other platforms. The ATS resume scoring pinpointed exact keywords I was missing.',
    highlight: 'Negotiated +$28k over initial offer',
    skills: ['React', 'TypeScript', 'Next.js'],
  },
  {
    id: 3,
    name: 'Priya Patel',
    role: 'Cloud & Backend Engineer',
    company: 'Amazon AWS',
    companyColor: 'from-amber-500/20 to-orange-500/20',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Backend & Systems',
    badge: 'L5 SDE Confirmed',
    date: '2 weeks ago',
    review:
      'Amazon’s Leadership Principles combined with deep technical questions are notorious. Practicing behavioral answers using the voice recognition while getting real-time STAR framework coaching was the game-changer.',
    highlight: 'Mastered Amazon Leadership Principles',
    skills: ['AWS', 'Java', 'DynamoDB', 'Microservices'],
  },
  {
    id: 4,
    name: 'Alex Rivera',
    role: 'Full-Stack Developer',
    company: 'Netflix',
    companyColor: 'from-rose-500/20 to-red-500/20',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'FAANG & Tech Leaders',
    badge: 'Senior Offer',
    date: 'Just recently',
    review:
      'I used to freeze up and talk too fast during technical rounds. Doing 10 voice sessions where the AI avatar naturally interjected and asked follow-up clarifying questions cured my interview anxiety completely.',
    highlight: 'Overcame severe interview anxiety',
    skills: ['Node.js', 'GraphQL', 'Docker'],
  },
  {
    id: 5,
    name: 'Elena Rostova',
    role: 'AI / ML Engineer',
    company: 'Microsoft',
    companyColor: 'from-cyan-500/20 to-blue-500/20',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Backend & Systems',
    badge: 'Applied AI Team',
    date: '3 weeks ago',
    review:
      'I uploaded my resume with PyTorch and transformer fine-tuning projects. The AI tailored deep mathematical questions about attention heads and loss functions that matched Microsoft’s exact bar.',
    highlight: 'Resume-tailored ML Architecture Questions',
    skills: ['Python', 'PyTorch', 'LLMs', 'FastAPI'],
  },
  {
    id: 6,
    name: 'Marcus Johnson',
    role: 'Software Engineer',
    company: 'Uber',
    companyColor: 'from-emerald-500/20 to-teal-500/20',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    rating: 5,
    category: 'Career Switchers',
    badge: 'Bootcamp to $145k',
    date: '1 month ago',
    review:
      'Coming from a non-traditional background, I felt impostor syndrome constantly. This platform gave me structured daily mock drills with real-time scoring. Within 30 days, I signed with Uber!',
    highlight: 'Career transition in under 6 weeks',
    skills: ['JavaScript', 'Python', 'SQL', 'PostgreSQL'],
  },
];

const CATEGORIES = [
  'All Reviews',
  'FAANG & Tech Leaders',
  'Frontend & Full-Stack',
  'Backend & Systems',
  'Career Switchers',
];

export default function StudentReviews() {
  const [activeCategory, setActiveCategory] = useState('All Reviews');

  const filteredReviews =
    activeCategory === 'All Reviews'
      ? REVIEWS
      : REVIEWS.filter((r) => r.category === activeCategory);

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-surface">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            Verified Candidate Success Stories
          </div>

          <h2 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6">
            Real Students, <span className="gradient-text">Real Dream Offers</span>
          </h2>

          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed">
            See how over 50,000+ developers, bootcamp grads, and engineers used our 3D AI interviewer to crush technical rounds and land offers at top-tier companies.
          </p>
        </div>

        {/* ── High-Impact Metrics Bar ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-16">
          {METRICS.map(({ label, value, change, icon: Icon }, idx) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-surface-card/90 border border-slate-200 dark:border-surface-border relative overflow-hidden group hover:border-brand-500/40 transition-colors shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 group-hover:bg-brand-500/20 group-hover:scale-110 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {change}
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mb-1">
                {value}
              </div>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium">
                {label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Category Filter Tabs ── */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-12 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-gradient-brand text-white shadow-brand shadow-sm font-semibold'
                  : 'bg-white dark:bg-surface-card text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-hover border border-slate-200 dark:border-surface-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Reviews Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <AnimatePresence mode="popLayout">
            {filteredReviews.map((review, i) => (
              <motion.div
                key={review.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="p-6 rounded-2xl bg-white dark:bg-surface-card border border-slate-200 dark:border-surface-border hover:border-brand-500/40 hover:shadow-lg dark:hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group shadow-sm"
              >
                <div>
                  {/* Student Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/30 group-hover:ring-brand-500 transition-all"
                        />
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-surface flex items-center justify-center"
                          title="Verified Candidate"
                        >
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-300 transition-colors">
                          {review.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          <span>{review.role}</span>
                          <span>•</span>
                          <span className="font-semibold text-brand-600 dark:text-brand-400">{review.company}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {review.badge}
                    </span>
                  </div>

                  {/* Rating Stars & Key Highlight */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(review.rating)].map((_, idx) => (
                        <Star key={idx} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      5.0
                    </span>
                  </div>

                  {/* Highlight pill */}
                  <div className="mb-4 inline-block px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-surface-card-muted border border-slate-200 dark:border-surface-border text-xs font-semibold text-teal-700 dark:text-teal-300">
                    ✨ {review.highlight}
                  </div>

                  {/* Written Review Quote */}
                  <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic relative">
                    &ldquo;{review.review}&rdquo;
                  </p>
                </div>

                {/* Tech Skills & Verified Tag */}
                <div className="pt-4 border-t border-slate-200 dark:border-surface-border/60 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {review.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-surface-hover text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-surface-border/60"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {review.date}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Bottom Callout Banner ── */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-950/90 via-surface-card to-accent-950/90 border border-brand-500/30 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-display font-bold text-white mb-3">
              Want to be our next success story?
            </h3>
            <p className="text-slate-200 text-sm sm:text-base mb-6">
              Start practicing with our interactive 3D AI interviewer today. Completely free to begin.
            </p>
            <Link
              to="/register"
              className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2 shadow-lg shadow-brand-500/30 text-white"
            >
              Start Free Practice Now <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
