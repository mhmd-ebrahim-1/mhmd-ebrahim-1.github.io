import { useState, useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderGit2,
  Briefcase,
  Award,
  Sparkles,
  Layers,
  User,
  Flame,
  PhoneCall,
  Mail,
  Image as ImageIcon,
  FileText,
  BarChart3,
  Globe2,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell,
  RefreshCw,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import Toast from './components/Toast'

const NAV_ITEMS = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/admin/projects', label: 'Projects', icon: FolderGit2 },
  { path: '/admin/experience', label: 'Experience', icon: Briefcase },
  { path: '/admin/certificates', label: 'Certificates', icon: Award },
  { path: '/admin/skills', label: 'Skills & Tools', icon: Sparkles },
  { path: '/admin/services', label: 'Services', icon: Layers },
  { path: '/admin/about', label: 'About & Bio', icon: User },
  { path: '/admin/hero', label: 'Hero Section', icon: Flame },
  { path: '/admin/contact', label: 'Contact & Socials', icon: PhoneCall },
  { path: '/admin/messages', label: 'Messages', icon: Mail },
  { path: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { path: '/admin/cv', label: 'CV / Resume', icon: FileText },
  { path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/admin/seo', label: 'SEO & Meta', icon: Globe2 },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
]

export default function AdminLayout() {
  const { user, signOut, isConfigured } = useAuth()
  const { isLive, refreshData } = useData()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [toasts, setToasts] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [location.pathname])

  const addToast = (message, type = 'info', title = '') => {
    const id = Date.now() + Math.random().toString(36).substring(2, 5)
    setToasts((prev) => [...prev, { id, message, type, title }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const handleManualRefresh = async () => {
    setRefreshing(true)
    await refreshData()
    setTimeout(() => {
      setRefreshing(false)
      addToast('Data refreshed successfully from backend', 'success', 'Synced')
    }, 600)
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/admin/login')
    } catch (e) {
      console.error(e)
    }
  }

  // Find active label for header
  const currentItem = NAV_ITEMS.find((item) =>
    item.exact ? location.pathname === item.path : location.pathname.startsWith(item.path)
  )
  const pageTitle = currentItem?.label || 'Admin Panel'

  return (
    <div className="min-h-screen bg-[#07070d] text-white flex flex-col md:flex-row antialiased">
      {/* Toast Notification Container */}
      <Toast toasts={toasts} onRemove={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#090c16]/95 border-r border-white/[0.08] shrink-0 sticky top-0 h-screen z-40">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl glass border border-[#00f5d4]/30 overflow-hidden flex items-center justify-center p-1 group-hover:scale-105 transition-transform">
              <img src="/logo-me.webp" alt="ME" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = '/logo-me.png' }} />
            </div>
            <div>
              <p className="font-display font-bold text-sm text-white tracking-tight">Mohamed Ebrahim</p>
              <p className="font-mono text-[9px] text-[#00f5d4] tracking-widest uppercase">Admin CMS</p>
            </div>
          </Link>
        </div>

        {/* Sync Status Badge */}
        <div className="px-6 py-2.5 bg-black/20 border-b border-white/[0.04] flex items-center justify-between text-[11px] font-mono">
          <span className="text-white/40">Backend Status</span>
          <span className={`inline-flex items-center gap-1.5 ${isConfigured ? 'text-[#00f5d4]' : 'text-amber-400'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isConfigured ? 'bg-[#00f5d4] animate-pulse' : 'bg-amber-400'}`} />
            {isConfigured ? 'Supabase Live' : 'Offline / Demo'}
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1 custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path)

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#00f5d4]/15 to-[#0ea5e9]/10 text-[#00f5d4] border border-[#00f5d4]/30 font-semibold shadow-lg shadow-[#00f5d4]/5'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                  }`
                }
              >
                <Icon size={16} className={isActive ? 'text-[#00f5d4]' : 'text-white/40'} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-black/20 space-y-2">
          <div className="flex items-center gap-3 p-2 rounded-xl glass border border-white/5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-[#00f5d4] border border-cyan-500/30 flex items-center justify-center font-bold font-mono text-xs">
              ME
            </div>
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-semibold text-white truncate">{user?.email || 'admin@portfolio'}</p>
              <p className="font-mono text-[10px] text-white/40">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-mono text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/20"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden sticky top-0 z-50 bg-[#080b14]/95 backdrop-blur-md border-b border-white/[0.08] px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl glass text-white/70 hover:text-white"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <img src="/logo-me.webp" alt="ME" className="w-6 h-6 object-contain" onError={(e) => { e.currentTarget.src = '/logo-me.png' }} />
            <span className="font-display font-bold text-sm text-white">{pageTitle}</span>
          </div>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl glass text-xs font-mono text-[#00f5d4] flex items-center gap-1.5"
        >
          <ExternalLink size={14} /> View Site
        </a>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-[#080b16] p-4 overflow-y-auto space-y-1"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = item.exact
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path)

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                    isActive
                      ? 'bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/30'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
            <div className="pt-4 border-t border-white/10">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-rose-400"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar (Desktop) */}
        <header className="hidden md:flex h-16 bg-[#080b14]/80 backdrop-blur-md border-b border-white/[0.08] px-8 items-center justify-between sticky top-0 z-30">
          <div>
            <span className="font-mono text-[10px] text-[#00f5d4] tracking-wider uppercase">// ADMIN PANEL</span>
            <h1 className="font-display font-bold text-lg text-white leading-tight">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleManualRefresh}
              disabled={refreshing}
              className="p-2 rounded-xl glass border border-white/10 text-white/60 hover:text-[#00f5d4] hover:border-[#00f5d4]/40 transition-colors"
              title="Refresh Data from Supabase"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin text-[#00f5d4]' : ''} />
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl font-mono text-xs font-semibold glass border border-[#00f5d4]/30 text-[#00f5d4] hover:bg-[#00f5d4]/10 transition-all flex items-center gap-2 shadow-lg shadow-[#00f5d4]/5"
            >
              <ExternalLink size={13} /> View Live Portfolio
            </a>
          </div>
        </header>

        {/* Nested Route View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet context={{ addToast }} />
        </main>
      </div>
    </div>
  )
}
