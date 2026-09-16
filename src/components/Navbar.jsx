import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight, Mail } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import ThemeToggle from './ThemeToggle'
import { PROFILE } from '../data'
import '../config/contact'

const BASE_URL = import.meta.env.BASE_URL || '/'

const LINKS = [
  { path: '/', label: 'Home' },
  { path: '/about', label: 'About' },
  { path: '/projects', label: 'Projects' },
  { path: '/services', label: 'Services' },
  { path: '/cv', label: 'CV' },
  { path: '/certificates', label: 'Certificates' },
]

export default function Navbar() {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!menuOpen) return undefined
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'var(--bg-nav)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
          borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
          boxShadow: scrolled ? '0 10px 35px rgba(0, 0, 0, 0.15)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(0,245,212,0.35)]"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <img
                src={`${BASE_URL}logo-me.webp`}
                alt="Mohamed Ebrahim"
                className="w-full h-full object-contain p-1 transition-transform duration-300 group-hover:scale-110"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = `${BASE_URL}logo-me.png`
                }}
              />
            </div>
            <div>
              <p className="font-display font-bold text-sm tracking-tight text-[var(--text-primary)] group-hover:text-[#00f5d4] transition-colors">
                Mohamed Ebrahim
              </p>
              <p className="font-mono text-[9px] tracking-wider text-[var(--text-muted)]">
                DATA · ML · AI
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => {
              const active = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    color: active ? '#00f5d4' : 'var(--text-secondary)',
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'rgba(0, 245, 212, 0.08)',
                        border: '1px solid rgba(0, 245, 212, 0.2)',
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Actions: Theme Toggle + Contact CTA + Mobile Menu Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle compact />

            <a
              href={PROFILE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/10 btn-primary"
            >
              <WhatsAppIcon size={16} /> Get In Touch
            </a>

            <button
              type="button"
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center glass border transition-colors"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Backdrop & Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[70px] sm:top-[84px] left-3 right-3 sm:left-4 sm:right-4 z-50 md:hidden glass rounded-3xl p-4 border shadow-2xl space-y-2"
              style={{
                background: 'var(--bg-nav)',
                borderColor: 'var(--border-subtle)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
              }}
            >
              <div className="space-y-1">
                {LINKS.map((link) => {
                  const active = location.pathname === link.path
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all"
                      style={{
                        color: active ? '#00f5d4' : 'var(--text-primary)',
                        background: active ? 'rgba(0, 245, 212, 0.1)' : 'transparent',
                        border: active ? '1px solid rgba(0, 245, 212, 0.25)' : '1px solid transparent',
                      }}
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight size={15} style={{ opacity: active ? 1 : 0.4 }} />
                    </Link>
                  )
                })}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <a
                  href={PROFILE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs shadow-lg shadow-emerald-500/10"
                >
                  <WhatsAppIcon size={15} /> WhatsApp
                </a>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="btn-ghost flex items-center justify-center gap-2 py-3 px-3 rounded-xl font-semibold text-xs"
                >
                  <Mail size={15} style={{ color: '#00f5d4' }} /> Email
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}