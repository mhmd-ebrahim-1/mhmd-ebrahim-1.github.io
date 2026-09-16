import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowUpRight, Mail } from 'lucide-react'
import WhatsAppIcon from './WhatsAppIcon'
import { PROFILE } from '../data'
import '../config/contact'

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

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(5, 9, 18, 0.96)' : 'rgba(8, 8, 16, 0.4)',
          backdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
          borderBottom: scrolled ? '1px solid rgba(0, 245, 212, 0.12)' : '1px solid transparent',
          boxShadow: scrolled ? '0 10px 35px rgba(0, 0, 0, 0.8)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-bold text-sm transition-transform group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg,rgba(0,245,212,0.15),rgba(14,165,233,0.15))',
                border: '1px solid rgba(0,245,212,0.3)',
                color: '#00f5d4',
              }}
            >
              ME
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white tracking-tight group-hover:text-[#00f5d4] transition-colors">
                Mohamed Ebrahim
              </p>
              <p className="font-mono text-[9px] tracking-wider" style={{ color: 'rgba(255,255,255,.3)' }}>
                DATA · ML · AI
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => {
              const active = location.pathname === link.path
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:text-white"
                  style={{ color: active ? '#00f5d4' : 'rgba(255,255,255,.55)' }}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'rgba(0,245,212,.07)',
                        border: '1px solid rgba(0,245,212,.13)',
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={PROFILE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-transform hover:-translate-y-0.5 shadow-lg shadow-emerald-500/10"
              style={{ background: 'linear-gradient(135deg,#00f5d4,#0ea5e9)', color: '#080810' }}
            >
              <WhatsAppIcon size={16} /> Get In Touch
            </a>
            <button
              aria-label="Toggle navigation"
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(255,255,255,.08)',
                color: '#fff',
              }}
            >
              {menuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[78px] left-4 right-4 z-50 md:hidden glass rounded-2xl p-3 border shadow-2xl"
            style={{ background: 'rgba(6,9,18,.98)', borderColor: 'rgba(255,255,255,0.12)' }}
          >
            {LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  color: location.pathname === link.path ? '#00f5d4' : 'rgba(255,255,255,.75)',
                  background: location.pathname === link.path ? 'rgba(0,245,212,.06)' : 'transparent',
                }}
              >
                {link.label}
                <ArrowUpRight size={14} />
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-white/10">
              <a
                href={PROFILE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-xs shadow-lg shadow-emerald-500/10"
                style={{ background: 'linear-gradient(135deg,#00f5d4,#0ea5e9)', color: '#080810' }}
              >
                <WhatsAppIcon size={14} /> WhatsApp
              </a>
              <a
                href={`mailto:${PROFILE.email}`}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl font-semibold text-xs glass border border-white/10 text-white"
              >
                <Mail size={14} style={{ color: '#00f5d4' }} /> Email
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
