import { Component, useState, lazy, Suspense } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { DataProvider, useData } from './context/DataContext'
import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { PROFILE } from './data'
import './config/contact'

// Public Route-level code splitting
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Services = lazy(() => import('./pages/Services'))
const CV = lazy(() => import('./pages/CV'))
const Certificates = lazy(() => import('./pages/Certificates'))

// Admin Route-level code splitting (lazy-loaded so zero impact on public bundle)
const ProtectedRoute = lazy(() => import('./admin/ProtectedRoute'))
const AdminLayout = lazy(() => import('./admin/AdminLayout'))
const Login = lazy(() => import('./admin/pages/Login'))
const DashboardHome = lazy(() => import('./admin/pages/DashboardHome'))
const ProjectsManager = lazy(() => import('./admin/pages/ProjectsManager'))
const ExperienceManager = lazy(() => import('./admin/pages/ExperienceManager'))
const CertificatesManager = lazy(() => import('./admin/pages/CertificatesManager'))
const SkillsManager = lazy(() => import('./admin/pages/SkillsManager'))
const ServicesManager = lazy(() => import('./admin/pages/ServicesManager'))
const AboutManager = lazy(() => import('./admin/pages/AboutManager'))
const HeroManager = lazy(() => import('./admin/pages/HeroManager'))
const ContactManager = lazy(() => import('./admin/pages/ContactManager'))
const MessagesManager = lazy(() => import('./admin/pages/MessagesManager'))
const MediaManager = lazy(() => import('./admin/pages/MediaManager'))
const CvManager = lazy(() => import('./admin/pages/CvManager'))
const AnalyticsManager = lazy(() => import('./admin/pages/AnalyticsManager'))
const SeoManager = lazy(() => import('./admin/pages/SeoManager'))
const SettingsManager = lazy(() => import('./admin/pages/SettingsManager'))

function PageWrapper({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.35 }}
    >
      {children}
    </motion.div>
  )
}

function RouteFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 animate-spin" />
    </div>
  )
}

function AnimatedRoutes() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes location={location} key={isAdmin ? 'admin' : location.pathname}>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
        <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
        <Route path="/cv" element={<PageWrapper><CV /></PageWrapper>} />
        <Route path="/certificates" element={<PageWrapper><Certificates /></PageWrapper>} />

        {/* ADMIN AUTH */}
        <Route path="/admin/login" element={<Login />} />

        {/* PROTECTED ADMIN CMS ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="projects" element={<ProjectsManager />} />
          <Route path="experience" element={<ExperienceManager />} />
          <Route path="certificates" element={<CertificatesManager />} />
          <Route path="skills" element={<SkillsManager />} />
          <Route path="services" element={<ServicesManager />} />
          <Route path="about" element={<AboutManager />} />
          <Route path="hero" element={<HeroManager />} />
          <Route path="contact" element={<ContactManager />} />
          <Route path="messages" element={<MessagesManager />} />
          <Route path="media" element={<MediaManager />} />
          <Route path="cv" element={<CvManager />} />
          <Route path="analytics" element={<AnalyticsManager />} />
          <Route path="seo" element={<SeoManager />} />
          <Route path="settings" element={<SettingsManager />} />
        </Route>

        {/* CATCH-ALL */}
        <Route path="*" element={<PageWrapper><Home /></PageWrapper>} />
      </Routes>
    </Suspense>
  )
}

class RouteErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen flex items-center justify-center px-6 pt-24 bg-[#07070d]">
          <div className="glass rounded-3xl p-10 max-w-lg text-center border border-white/10">
            <p className="font-mono text-xs mb-3 text-[#00f5d4]">SYSTEM RECOVERY</p>
            <h1 className="font-display text-3xl font-bold text-white mb-3">Something went wrong</h1>
            <p className="text-sm mb-6 text-white/60">
              The page encountered an error. Refresh the page to restart the application.
            </p>
            <button className="btn-primary" onClick={() => window.location.reload()}>
              Reload Portfolio
            </button>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}

function LayoutContent() {
  const [loading, setLoading] = useState(true)
  const location = useLocation()
  const { profile } = useData()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Cursor />}
      {!isAdmin && <div className="noise" />}
      {!isAdmin && <Navbar />}

      <RouteErrorBoundary>
        <AnimatedRoutes />
      </RouteErrorBoundary>

      {!isAdmin && (
        <footer className="py-12 px-4 sm:px-6 lg:px-10 text-center border-t border-[var(--border-subtle)] transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="font-mono text-xs text-[var(--text-muted)] text-center md:text-left">
              Designed &amp; Built by <span className="text-[#00f5d4] font-semibold">{profile?.name || PROFILE.name}</span> · {profile?.title || PROFILE.title}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-xs text-[var(--text-muted)]">
              <a href={profile?.github || PROFILE.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)] transition-colors py-1">
                GitHub
              </a>
              <span>•</span>
              <a href={profile?.linkedin || PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--text-primary)] transition-colors py-1">
                LinkedIn
              </a>
              <span>•</span>
              <a href={profile?.whatsapp || PROFILE.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-[#00f5d4] transition-colors py-1">
                WhatsApp
              </a>
              <span>•</span>
              <a href={`mailto:${profile?.email || PROFILE.email}`} className="hover:text-[#00f5d4] transition-colors py-1">
                Email
              </a>
            </div>
          </div>
        </footer>
      )}

      {loading && !isAdmin && <Loader onDone={() => setLoading(false)} />}
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <AuthProvider>
          <DataProvider>
            <LayoutContent />
          </DataProvider>
        </AuthProvider>
      </HashRouter>
    </ThemeProvider>
  )
}
