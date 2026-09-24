import React from 'react';

// Brand logos with precision SVG marks and typography
const COMPANIES = [
  {
    name: 'ZoomInfo',
    render: () => (
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M7 7h10l-6 10h6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-display font-bold text-lg tracking-tight">zoominfo</span>
      </div>
    ),
  },
  {
    name: 'Experian',
    render: () => (
      <div className="flex items-center gap-2.5">
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <rect x="3" y="3" width="4.5" height="4.5" rx="1" />
          <rect x="9.5" y="3" width="4.5" height="4.5" rx="1" />
          <rect x="3" y="9.5" width="4.5" height="4.5" rx="1" />
          <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
          <rect x="16.5" y="9.5" width="4.5" height="4.5" rx="1" />
          <rect x="9.5" y="16.5" width="4.5" height="4.5" rx="1" />
        </svg>
        <span className="font-sans font-semibold text-lg tracking-tight lowercase">experian<span className="text-xs font-normal">™</span></span>
      </div>
    ),
  },
  {
    name: 'Peloton',
    render: () => (
      <div className="flex items-center gap-2">
        <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5h-2v-4.5h-1.5V10H13v6.5z" />
          <circle cx="12" cy="7.5" r="1.5" />
        </svg>
        <span className="font-display font-extrabold text-base tracking-[0.25em] uppercase">PELOTON</span>
      </div>
    ),
  },
  {
    name: 'Coca-Cola',
    render: () => (
      <div className="flex items-center">
        <span className="font-serif italic font-bold text-2xl tracking-tight leading-none px-1">Coca-Cola</span>
      </div>
    ),
  },
  {
    name: 'Samsung',
    render: () => (
      <div className="flex items-center">
        <span className="font-sans font-black text-lg tracking-[0.18em] uppercase">SAMSUNG</span>
      </div>
    ),
  },
  {
    name: 'Gigster',
    render: () => (
      <div className="flex items-center">
        <span className="font-display font-extrabold text-xl tracking-tight lowercase">gig<span className="font-semibold">ster</span></span>
      </div>
    ),
  },
  {
    name: 'Udemy',
    render: () => (
      <div className="flex items-center gap-1.5">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2L6 8h4v8h4V8h4L12 2z" />
        </svg>
        <span className="font-display font-bold text-lg tracking-tight">ûdemy</span>
      </div>
    ),
  },
  {
    name: 'Google',
    render: () => (
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.24 10.285V13.4h6.887C18.667 15.6 16.5 18 12.24 18c-3.35 0-6.1-2.73-6.1-6.1s2.75-6.1 6.1-6.1c1.55 0 2.94.57 4.02 1.58l2.36-2.36C16.92 3.4 14.77 2.5 12.24 2.5 7.15 2.5 3 6.65 3 11.74s4.15 9.24 9.24 9.24c5.34 0 8.87-3.75 8.87-9.03 0-.61-.06-1.12-.17-1.66h-8.7z" />
        </svg>
        <span className="font-display font-semibold text-lg tracking-tight">Google</span>
      </div>
    ),
  },
  {
    name: 'Microsoft',
    render: () => (
      <div className="flex items-center gap-2">
        <div className="grid grid-cols-2 gap-0.5 w-4 h-4 flex-shrink-0">
          <span className="bg-current opacity-80" />
          <span className="bg-current opacity-80" />
          <span className="bg-current opacity-80" />
          <span className="bg-current opacity-80" />
        </div>
        <span className="font-sans font-semibold text-base tracking-tight">Microsoft</span>
      </div>
    ),
  },
  {
    name: 'Amazon',
    render: () => (
      <div className="flex items-center gap-1.5">
        <span className="font-sans font-bold text-lg tracking-tight leading-none">amazon</span>
        <svg className="w-4 h-4 fill-current -mt-0.5" viewBox="0 0 24 24">
          <path d="M2 17c5.5 3 13.5 3 19-2-.5 1-1.5 2-3 2.5-4.5 1.5-11.5 1-16-.5z" />
        </svg>
      </div>
    ),
  },
  {
    name: 'Meta',
    render: () => (
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 7.2c-2.4 0-4.3 1.9-5.1 4.5-.6 2-.4 3.7.6 4.7 1 .9 2.4.9 3.8.1.9-.5 1.8-1.5 2.7-2.9.9 1.4 1.8 2.4 2.7 2.9 1.4.8 2.8.8 3.8-.1 1-1 1.2-2.7.6-4.7-.8-2.6-2.7-4.5-5.1-4.5zm-5.7 6.7c-.5-.5-.6-1.5-.2-2.8.6-2 1.9-3.4 3.6-3.4.9 0 1.7.4 2.3 1.2-1.9 2.5-3.8 4.2-5.7 5zm11.4 0c-1.9-.8-3.8-2.5-5.7-5 .6-.8 1.4-1.2 2.3-1.2 1.7 0 3 1.4 3.6 3.4.4 1.3.3 2.3-.2 2.8z" />
        </svg>
        <span className="font-display font-semibold text-lg tracking-tight">Meta</span>
      </div>
    ),
  },
  {
    name: 'Stripe',
    render: () => (
      <div className="flex items-center">
        <span className="font-sans font-extrabold text-xl tracking-tight">stripe</span>
      </div>
    ),
  },
  {
    name: 'Spotify',
    render: () => (
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.308-1.758-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.808-.87 7.076-.51 9.722 1.113.294.18.386.563.207.857zm1.224-2.72c-.226.367-.706.482-1.072.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.127-.849-.106-.976-.519-.126-.413.107-.849.52-.976 3.632-1.102 8.147-.568 11.236 1.332.366.226.482.705.257 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.016-.129-1.166-.623-.15-.495.13-1.016.624-1.167 3.532-1.073 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.443-.838.59-1.282.33z" />
        </svg>
        <span className="font-display font-bold text-lg tracking-tight">Spotify</span>
      </div>
    ),
  },
  {
    name: 'Domo',
    render: () => (
      <div className="flex items-center px-2 py-0.5 rounded bg-slate-200/60 dark:bg-current/10 border border-slate-300/80 dark:border-current/20">
        <span className="font-sans font-black text-sm tracking-widest uppercase">DOMO</span>
      </div>
    ),
  },
];

export default function CompanyMarquee() {
  return (
    <section className="relative w-full py-10 overflow-hidden">
      {/* Subtle ambient gradient spotlight */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/[0.02] to-transparent pointer-events-none" />

      {/* Section Subtitle */}
      <div className="max-w-6xl mx-auto px-6 text-center mb-8 relative z-10">
        <p className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.22em] text-slate-600 dark:text-slate-400 uppercase">
          TRUSTED BY CANDIDATES HIRED AT 500+ TECH LEADERS & ENTERPRISES
        </p>
      </div>

      {/* Infinite Scrolling Ticker Track */}
      <div
        className="group relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent_0%,black_10%,black_90%,transparent_100%)] select-none"
      >
        {/* Track 1 */}
        <div className="flex shrink-0 items-center justify-around gap-12 sm:gap-16 md:gap-20 py-2 animate-marquee group-hover:[animation-play-state:paused] will-change-transform min-w-full">
          {COMPANIES.map((company, idx) => (
            <div
              key={`c1-${company.name}-${idx}`}
              className="flex items-center text-slate-700 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-all duration-300 transform hover:scale-105 opacity-90 hover:opacity-100 cursor-default flex-shrink-0"
              title={company.name}
            >
              {company.render()}
            </div>
          ))}
        </div>

        {/* Track 2 (seamless duplication for continuous loop) */}
        <div
          aria-hidden="true"
          className="flex shrink-0 items-center justify-around gap-12 sm:gap-16 md:gap-20 py-2 animate-marquee group-hover:[animation-play-state:paused] will-change-transform min-w-full"
        >
          {COMPANIES.map((company, idx) => (
            <div
              key={`c2-${company.name}-${idx}`}
              className="flex items-center text-slate-700 hover:text-slate-950 dark:text-slate-400 dark:hover:text-white transition-all duration-300 transform hover:scale-105 opacity-90 hover:opacity-100 cursor-default flex-shrink-0"
              title={company.name}
            >
              {company.render()}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
