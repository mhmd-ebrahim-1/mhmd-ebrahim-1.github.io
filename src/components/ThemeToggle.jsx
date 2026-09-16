import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ className = '', compact = false }) {
  const { theme, isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`rounded-xl glass border transition-colors flex items-center justify-center relative overflow-hidden ${
        compact ? 'w-9 h-9' : 'w-10 h-10'
      } ${className}`}
      style={{
        background: isDark
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(15, 23, 42, 0.05)',
        borderColor: isDark
          ? 'rgba(255, 255, 255, 0.12)'
          : 'rgba(15, 23, 42, 0.12)',
        color: isDark ? '#fbbf24' : '#0284c7',
      }}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex items-center justify-center"
      >
        {isDark ? <Moon size={compact ? 16 : 18} /> : <Sun size={compact ? 16 : 18} />}
      </motion.div>
    </motion.button>
  )
}