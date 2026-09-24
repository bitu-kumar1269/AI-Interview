import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useAppContext } from '@/context';

/**
 * ThemeToggle
 * Sleek, animated top-right corner theme toggle button.
 * Toggles between 'dark' (black theme) and 'light' theme.
 */
export default function ThemeToggle({ className = '', showLabel = false }) {
  const { theme, isDark, toggleTheme } = useAppContext();

  return (
    <motion.button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.94 }}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to black theme'}
      title={isDark ? 'Switch to light theme' : 'Switch to black theme'}
      className={`
        relative inline-flex items-center justify-center gap-2
        h-9 px-3 rounded-xl
        transition-colors duration-200 select-none
        ${isDark
          ? 'bg-[#141a30]/80 hover:bg-[#1a2240] text-amber-400 border border-amber-400/20 shadow-[0_0_15px_rgba(251,191,36,0.15)]'
          : 'bg-white hover:bg-slate-100 text-brand-600 border border-slate-200 shadow-sm'
        }
        ${className}
      `}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="dark-icon"
            initial={{ rotate: -90, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <Sun className="w-4 h-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
          </motion.div>
        ) : (
          <motion.div
            key="light-icon"
            initial={{ rotate: 90, scale: 0.7, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0.7, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <Moon className="w-4 h-4 text-brand-600 drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]" />
          </motion.div>
        )}
      </AnimatePresence>

      {showLabel && (
        <span className="text-xs font-semibold tracking-wide">
          {isDark ? 'Light Mode' : 'Black Mode'}
        </span>
      )}
    </motion.button>
  );
}
