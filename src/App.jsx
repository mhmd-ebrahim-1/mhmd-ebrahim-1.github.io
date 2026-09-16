import { Component, useState, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import Loader from './components/Loader'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import { PROFILE } from './data'
import './config/contact'

// Route-level code splitting for enhanced performance
const About = lazy(() => import('./pages/About'))
const Projects = lazy(() => import('./pages/Projects'))
const Services = lazy(() => import('./pages/Services'))
const CV = lazy(() => import('./pages/CV'))
const Certificates = lazy(() => import('./pages/Certificates'))

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
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<RouteFallback />}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
          <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
          <Route path="/cv" element={<PageWrapper><CV /></PageWrapper>} />
          <Route path="/certificates" element={<PageWrapper><Certificates /></PageWrapper>} />
          <Route path="*" element={<PageWrapper><Home /></PageWrapper>} />
        </Routes>
      </Suspense>
    </AnimatePresence>
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
        <main className="min-h-screen flex items-center justify-center px-6 pt-24">
          <div className="glass rounded-3xl p-10 max-w-lg text-center">
            <p className="font-mono text-xs mb-3" style={{ color: '#00f5d4' }}>
              SYSTEM RECOVERY
            </p>
            <h1 className="font-display text-3xl font-bold text-white mb-3">Something went wrong</h1>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
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

export default function App() {
  const [loading, setLoading] = useState(true)

  return (
    <BrowserRouter>
      <Cursor />
      <div className="noise" />
      <Navbar />
      <RouteErrorBoundary>
        <AnimatedRoutes />
      </RouteErrorBoundary>
      <footer className="py-12 px-6 text-center border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Designed &amp; Built by <span style={{ color: '#00f5d4' }}>Mohamed Ebrahim</span> · Data Analyst &amp; ML Engineer
          </p>
          <div className="flex items-center gap-4 font-mono text-xs text-white/40">
            <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <span>•</span>
            <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              LinkedIn
            </a>
            <span>•</span>
            <a href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-[#00f5d4] transition-colors">
              WhatsApp
            </a>
            <span>•</span>
            <a href={`mailto:${PROFILE.email}`} className="hover:text-[#00f5d4] transition-colors">
              Email
            </a>
          </div>
        </div>
      </footer>
      {loading && <Loader onDone={() => setLoading(false)} />}
    </BrowserRouter>
  )
}
