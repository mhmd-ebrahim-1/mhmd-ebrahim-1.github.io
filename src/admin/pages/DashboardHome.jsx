import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FolderGit2,
  Award,
  Briefcase,
  Sparkles,
  Layers,
  Mail,
  Eye,
  Plus,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useAuth } from '../../context/AuthContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export default function DashboardHome() {
  const { projects, certificates, experience, skills, services, siteSettings } = useData()
  const { user } = useAuth()
  const [messagesCount, setMessagesCount] = useState(0)
  const [unreadCount, setUnreadCount] = useState(0)
  const [pageViewsCount, setPageViewsCount] = useState(148) // baseline
  const [recentLogs, setRecentLogs] = useState([])

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return

    // Fetch messages stats
    supabase
      .from('contact_messages')
      .select('id, is_read', { count: 'exact' })
      .then(({ data, count }) => {
        if (count !== null) setMessagesCount(count)
        if (data) setUnreadCount(data.filter((m) => !m.is_read).length)
      })

    // Fetch total page views
    supabase
      .from('page_views')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => {
        if (count !== null && count > 0) setPageViewsCount(count)
      })

    // Fetch recent audit logs
    supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5)
      .then(({ data }) => {
        if (data) setRecentLogs(data)
      })
  }, [])

  const publishedProjects = projects.filter((p) => p.published).length
  const featuredProjects = projects.filter((p) => p.featured).length

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      subtitle: `${publishedProjects} Published · ${featuredProjects} Featured`,
      icon: FolderGit2,
      accent: '#00f5d4',
      link: '/admin/projects',
    },
    {
      title: 'Certificates',
      value: certificates.length,
      subtitle: 'Verified credentials',
      icon: Award,
      accent: '#0ea5e9',
      link: '/admin/certificates',
    },
    {
      title: 'Experience Timeline',
      value: experience.length || 3,
      subtitle: 'Career milestones',
      icon: Briefcase,
      accent: '#a78bfa',
      link: '/admin/experience',
    },
    {
      title: 'Active Services',
      value: services.length,
      subtitle: 'Technical offerings',
      icon: Layers,
      accent: '#fb923c',
      link: '/admin/services',
    },
    {
      title: 'Contact Messages',
      value: messagesCount,
      subtitle: `${unreadCount} Unread submissions`,
      icon: Mail,
      accent: '#f43f5e',
      link: '/admin/messages',
    },
    {
      title: 'Total Page Views',
      value: pageViewsCount,
      subtitle: 'Live portfolio traffic',
      icon: Eye,
      accent: '#34d399',
      link: '/admin/analytics',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 sm:p-8 glass border relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        style={{
          background: 'linear-gradient(135deg, rgba(14, 20, 42, 0.95) 0%, rgba(8, 10, 22, 0.98) 100%)',
          borderColor: 'rgba(0, 245, 212, 0.2)',
        }}
      >
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-[#00f5d4]/30 text-[#00f5d4] font-mono text-[11px] mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
            CONTROL CENTER
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Welcome back, <span className="grad-text">Mohamed</span>
          </h2>
          <p className="text-sm text-white/65 mt-1.5 leading-relaxed">
            Manage your projects, certificates, services, CV, and live inquiries. All changes take effect across your portfolio instantly.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <Link
            to="/admin/projects"
            className="btn-primary inline-flex items-center gap-2 text-xs font-mono py-3 px-4 shadow-lg shadow-[#00f5d4]/10"
          >
            <Plus size={15} /> Add New Project
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost inline-flex items-center gap-2 text-xs font-mono py-3 px-4"
          >
            <ExternalLink size={14} /> Open Live Site
          </a>
        </div>
      </motion.div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                to={stat.link}
                className="block p-6 rounded-2xl glass glass-hover border group transition-all"
                style={{ borderColor: `${stat.accent}22` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      background: `${stat.accent}14`,
                      color: stat.accent,
                      border: `1px solid ${stat.accent}33`,
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <ArrowUpRight
                    size={18}
                    className="text-white/30 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                  />
                </div>
                <p className="font-mono text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="font-display font-semibold text-sm text-white/90">{stat.title}</p>
                <p className="font-mono text-[11px] text-white/50 mt-1">{stat.subtitle}</p>
              </Link>
            </motion.div>
          )
        })}
      </div>

      {/* Two Column Section: Quick Actions & Recent Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Quick Action Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 sm:p-7 rounded-3xl glass border border-white/[0.08]">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/[0.08]">
              <div>
                <p className="font-mono text-[10px] text-[#00f5d4] uppercase tracking-wider">SHORTCUTS</p>
                <h3 className="font-display font-bold text-lg text-white">Quick Actions</h3>
              </div>
              <Zap size={18} className="text-[#00f5d4]" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { label: 'New Project', path: '/admin/projects', icon: FolderGit2, accent: '#00f5d4' },
                { label: 'Upload CV', path: '/admin/cv', icon: Award, accent: '#0ea5e9' },
                { label: 'New Certificate', path: '/admin/certificates', icon: Award, accent: '#a78bfa' },
                { label: 'Edit Hero & Bio', path: '/admin/hero', icon: Sparkles, accent: '#fb923c' },
                { label: 'Manage Services', path: '/admin/services', icon: Layers, accent: '#34d399' },
                { label: 'SEO Settings', path: '/admin/seo', icon: ExternalLink, accent: '#f43f5e' },
              ].map((act) => (
                <Link
                  key={act.label}
                  to={act.path}
                  className="p-4 rounded-xl glass border border-white/5 hover:border-[#00f5d4]/40 flex flex-col items-center justify-center text-center gap-2 group transition-all"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ background: `${act.accent}15`, color: act.accent }}
                  >
                    <act.icon size={16} />
                  </div>
                  <span className="font-mono text-xs font-semibold text-white/80 group-hover:text-white">
                    {act.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Projects Preview List */}
          <div className="p-6 sm:p-7 rounded-3xl glass border border-white/[0.08]">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div>
                <p className="font-mono text-[10px] text-[#0ea5e9] uppercase tracking-wider">PORTFOLIO</p>
                <h3 className="font-display font-bold text-lg text-white">Featured Projects</h3>
              </div>
              <Link to="/admin/projects" className="text-xs font-mono text-[#00f5d4] hover:underline flex items-center gap-1">
                All Projects ({projects.length}) <ArrowUpRight size={13} />
              </Link>
            </div>

            <div className="space-y-3">
              {projects.slice(0, 4).map((proj) => (
                <div
                  key={proj.id || proj.slug}
                  className="flex items-center justify-between p-3.5 rounded-xl glass border border-white/5 hover:border-white/15 transition-all"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0"
                      style={{ background: `${proj.accent}18`, color: proj.accent }}
                    >
                      0{proj.id || '1'}
                    </div>
                    <div className="overflow-hidden">
                      <p className="font-display font-semibold text-xs sm:text-sm text-white truncate">
                        {proj.title}
                      </p>
                      <p className="font-mono text-[10px] text-white/40 truncate">
                        {proj.categoryLabel || proj.category} · {proj.tech?.slice(0, 3).join(', ')}
                      </p>
                    </div>
                  </div>
                  <span
                    className="font-mono text-[10px] px-2.5 py-1 rounded-md shrink-0"
                    style={{
                      background: proj.published ? 'rgba(0,245,212,0.1)' : 'rgba(255,255,255,0.05)',
                      color: proj.published ? '#00f5d4' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {proj.published ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: System Status & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* System Health Card */}
          <div className="p-6 rounded-3xl glass border border-white/[0.08]">
            <h3 className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#00f5d4]" /> System Configuration
            </h3>

            <div className="space-y-3 text-xs font-mono">
              <div className="flex items-center justify-between p-3 rounded-xl glass border border-white/5">
                <span className="text-white/50">Database Engine</span>
                <span className="text-white font-semibold">PostgreSQL (Supabase)</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl glass border border-white/5">
                <span className="text-white/50">Hosting</span>
                <span className="text-white font-semibold">GitHub Pages</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl glass border border-white/5">
                <span className="text-white/50">CV File</span>
                <span className="text-[#00f5d4] truncate max-w-[150px]">{siteSettings.cvUrl}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl glass border border-white/5">
                <span className="text-white/50">Contact Email</span>
                <span className="text-white truncate max-w-[150px]">{siteSettings.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Activity / Audit Stream */}
          <div className="p-6 rounded-3xl glass border border-white/[0.08]">
            <h3 className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
              <Activity size={18} className="text-[#0ea5e9]" /> Recent CMS Activity
            </h3>

            {recentLogs.length > 0 ? (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="p-3 rounded-xl glass border border-white/5 text-xs font-mono">
                    <div className="flex items-center justify-between text-white/50 mb-1">
                      <span className="text-[#00f5d4] uppercase text-[10px]">{log.action}</span>
                      <span className="text-[10px]">{new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-white font-semibold">{log.entity_name || log.entity_type}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Clock size={24} className="mx-auto text-white/20 mb-2" />
                <p className="text-xs text-white/40 font-mono">Activity logs will record updates here as you edit content.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
