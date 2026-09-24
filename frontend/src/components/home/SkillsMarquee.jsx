import React from 'react';
import {
  SiReact,
  SiPython,
  SiJavascript,
  SiTypescript,
  SiNodedotjs,
  SiGo,
  SiSwift,
  SiRust,
  SiCplusplus,
  SiDocker,
  SiKubernetes,
  SiGooglecloud,
  SiMongodb,
  SiPostgresql,
  SiMysql,
  SiRedis,
  SiGraphql,
  SiNextdotjs,
  SiVuedotjs,
  SiAngular,
  SiDjango,
  SiTailwindcss,
  SiGit,
  SiHtml5,
  SiOpenai,
  SiFirebase,
  SiTerraform,
  SiSpringboot,
  SiKotlin,
  SiRuby,
  SiPhp,
  SiLinux,
  SiPostman,
  SiFastapi,
  SiElixir,
  SiApachekafka,
  SiNginx,
  SiElasticsearch,
  SiPytorch,
  SiSupabase,
} from 'react-icons/si';
import { FaJava, FaAws, FaCss3Alt } from 'react-icons/fa6';
import { TbBrandCSharp } from 'react-icons/tb';
import { Sparkles } from 'lucide-react';

// Row 1: Languages & Core Frameworks
const ROW_1_SKILLS = [
  { name: 'React', icon: SiReact, color: '#61DAFB' },
  { name: 'Python', icon: SiPython, color: '#3776AB' },
  { name: 'JavaScript', icon: SiJavascript, color: '#F7DF1E' },
  { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
  { name: 'Go (Golang)', icon: SiGo, color: '#00ADD8' },
  { name: 'Swift', icon: SiSwift, color: '#F05138' },
  { name: 'Java', icon: FaJava, color: '#F89820' },
  { name: 'Rust', icon: SiRust, color: '#DEA584' },
  { name: 'C++', icon: SiCplusplus, color: '#00599C' },
  { name: 'C#', icon: TbBrandCSharp, color: '#9B4F96' },
  { name: 'Vue.js', icon: SiVuedotjs, color: '#4FC08D' },
  { name: 'Next.js', icon: SiNextdotjs, color: '#FFFFFF' },
  { name: 'Angular', icon: SiAngular, color: '#DD0031' },
  { name: 'Kotlin', icon: SiKotlin, color: '#7F52FF' },
  { name: 'Ruby', icon: SiRuby, color: '#CC342D' },
];

// Row 2: Backend, Databases & APIs
const ROW_2_SKILLS = [
  { name: 'Node.js', icon: SiNodedotjs, color: '#5FA04E' },
  { name: 'PostgreSQL', icon: SiPostgresql, color: '#4169E1' },
  { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
  { name: 'Redis', icon: SiRedis, color: '#DC382D' },
  { name: 'GraphQL', icon: SiGraphql, color: '#E10098' },
  { name: 'Django', icon: SiDjango, color: '#092E20' },
  { name: 'FastAPI', icon: SiFastapi, color: '#009688' },
  { name: 'Spring Boot', icon: SiSpringboot, color: '#6DB33F' },
  { name: 'MySQL', icon: SiMysql, color: '#4479A1' },
  { name: 'Apache Kafka', icon: SiApachekafka, color: '#231F20' },
  { name: 'Elasticsearch', icon: SiElasticsearch, color: '#005571' },
  { name: 'PHP', icon: SiPhp, color: '#777BB4' },
  { name: 'Elixir', icon: SiElixir, color: '#4E2A8E' },
  { name: 'Postman', icon: SiPostman, color: '#FF6C37' },
  { name: 'Supabase', icon: SiSupabase, color: '#3ECF8E' },
];

// Row 3: Cloud, DevOps, AI & Infrastructure
const ROW_3_SKILLS = [
  { name: 'Docker', icon: SiDocker, color: '#2496ED' },
  { name: 'Kubernetes', icon: SiKubernetes, color: '#326CE5' },
  { name: 'AWS Cloud', icon: FaAws, color: '#FF9900' },
  { name: 'Google Cloud', icon: SiGooglecloud, color: '#4285F4' },
  { name: 'Terraform', icon: SiTerraform, color: '#7B42BC' },
  { name: 'OpenAI / LLMs', icon: SiOpenai, color: '#10A37F' },
  { name: 'PyTorch', icon: SiPytorch, color: '#EE4C2C' },
  { name: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
  { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Git & GitHub', icon: SiGit, color: '#F05032' },
  { name: 'Linux / Bash', icon: SiLinux, color: '#FCC624' },
  { name: 'Nginx', icon: SiNginx, color: '#009639' },
  { name: 'HTML5', icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS3', icon: FaCss3Alt, color: '#1572B6' },
];

function SkillPill({ skill }) {
  const Icon = skill.icon;
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-white dark:bg-[#0a1124]/90 border border-slate-200 dark:border-surface-border hover:border-brand-500/50 hover:bg-slate-50 dark:hover:bg-surface-hover/80 hover:scale-105 transition-all duration-200 cursor-default group shadow-sm flex-shrink-0">
      <span
        className="w-6 h-6 flex items-center justify-center text-lg rounded-full group-hover:scale-110 transition-transform flex-shrink-0"
        style={{ color: skill.color }}
      >
        <Icon className="w-5 h-5" />
      </span>
      <span className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition-colors whitespace-nowrap">
        {skill.name}
      </span>
    </div>
  );
}

export default function SkillsMarquee() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-brand-500/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-accent-600/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="max-w-4xl mx-auto text-center px-6 mb-12 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          Comprehensive Tech Coverage
        </div>
        <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-900 dark:text-white mb-4">
          Prepare for Interviews in <span className="gradient-text">Any Tech Stack</span>
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
          Our Groq & Llama-3 AI engine dynamically generates tailored coding, architectural, and behavioral questions across 60+ programming languages, modern frameworks, and cloud stacks.
        </p>
      </div>

      {/* Flowing Marquee Rows */}
      <div className="relative space-y-4 [mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)] select-none">
        
        {/* Row 1 - Left to Right */}
        <div className="group flex overflow-hidden">
          <div className="flex shrink-0 items-center gap-4 py-1 animate-marquee group-hover:[animation-play-state:paused] will-change-transform min-w-full">
            {ROW_1_SKILLS.map((skill, idx) => (
              <SkillPill key={`r1-a-${skill.name}-${idx}`} skill={skill} />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="flex shrink-0 items-center gap-4 py-1 animate-marquee group-hover:[animation-play-state:paused] will-change-transform min-w-full"
          >
            {ROW_1_SKILLS.map((skill, idx) => (
              <SkillPill key={`r1-b-${skill.name}-${idx}`} skill={skill} />
            ))}
          </div>
        </div>

        {/* Row 2 - Right to Left (Reverse Flow) */}
        <div className="group flex overflow-hidden">
          <div className="flex shrink-0 items-center gap-4 py-1 animate-marquee-reverse group-hover:[animation-play-state:paused] will-change-transform min-w-full">
            {ROW_2_SKILLS.map((skill, idx) => (
              <SkillPill key={`r2-a-${skill.name}-${idx}`} skill={skill} />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="flex shrink-0 items-center gap-4 py-1 animate-marquee-reverse group-hover:[animation-play-state:paused] will-change-transform min-w-full"
          >
            {ROW_2_SKILLS.map((skill, idx) => (
              <SkillPill key={`r2-b-${skill.name}-${idx}`} skill={skill} />
            ))}
          </div>
        </div>

        {/* Row 3 - Left to Right */}
        <div className="group flex overflow-hidden">
          <div className="flex shrink-0 items-center gap-4 py-1 animate-marquee group-hover:[animation-play-state:paused] will-change-transform min-w-full">
            {ROW_3_SKILLS.map((skill, idx) => (
              <SkillPill key={`r3-a-${skill.name}-${idx}`} skill={skill} />
            ))}
          </div>
          <div
            aria-hidden="true"
            className="flex shrink-0 items-center gap-4 py-1 animate-marquee group-hover:[animation-play-state:paused] will-change-transform min-w-full"
          >
            {ROW_3_SKILLS.map((skill, idx) => (
              <SkillPill key={`r3-b-${skill.name}-${idx}`} skill={skill} />
            ))}
          </div>
        </div>

      </div>

      {/* Bottom mini pill badges summary */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400 px-6">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time code evaluation</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brand-500" />
          <span>Distributed systems & concurrency</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-500" />
          <span>Live behavioral STAR feedback</span>
        </div>
      </div>
    </section>
  );
}
