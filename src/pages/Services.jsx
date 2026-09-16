import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Database,
  BrainCircuit,
  BarChart3,
  LayoutDashboard,
  Bot,
  Eye,
  Cpu,
  ArrowUpRight,
  ArrowRight,
  Linkedin,
  Github,
  CheckCircle2,
  FileCode2,
  GitPullRequest,
  ShieldCheck,
  Mail,
} from 'lucide-react'
import { PROFILE as STATIC_PROFILE, SERVICES as STATIC_SERVICES } from '../data'
import { getEmailServiceUrl } from '../config/contact'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { useData } from '../context/DataContext'

const serviceIconMap = {
  BarChart3,
  LayoutDashboard,
  Database,
  BrainCircuit,
  Bot,
  Eye,
  Cpu,
}

const serviceAccents = {
  'data-analysis-eda': '#0ea5e9',
  'power-bi-dashboards': '#fb923c',
  'sql-database-analysis': '#38bdf8',
  'machine-learning-solutions': '#00f5d4',
  'ai-nlp-rag-systems': '#a78bfa',
  'computer-vision': '#f43f5e',
  'data-engineering-big-data': '#34d399',
}

const workflowSteps = [
  {
    step: '01',
    title: 'Discovery & Requirements',
    desc: 'Align on business objectives, evaluate raw data sources/schemas, and define concrete success metrics and deliverables.',
    icon: FileCode2,
  },
  {
    step: '02',
    title: 'Architecture & Implementation',
    desc: 'Clean and model data, build statistical/ML pipelines, design DAX models, or develop custom RAG and computer vision modules.',
    icon: GitPullRequest,
  },
  {
    step: '03',
    title: 'Testing, Delivery & Handoff',
    desc: 'Perform rigorous validation, provide reproducible source code, documentation, interactive dashboards, and deployment guidelines.',
    icon: ShieldCheck,
  },
]

export default function Services() {
  const { profile, services } = useData()
  const PROFILE = profile || STATIC_PROFILE
  const SERVICES = (services || STATIC_SERVICES).filter((s) => s.published ?? true)

  return (
    <div className="page-transition min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Page Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass mb-4 border" style={{ borderColor: 'rgba(0,245,212,0.2)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00f5d4', boxShadow: '0 0 12px #00f5d4' }} />
            <span className="font-mono text-[11px] sm:text-xs tracking-wider uppercase" style={{ color: '#00f5d4' }}>
              // 03 — SERVICES &amp; COLLABORATION
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold mb-4 tracking-[-.04em] text-white">
            Technical <span className="grad-text">Services &amp; Offerings</span>
          </h1>
          <p className="text-base sm:text-lg max-w-3xl leading-relaxed" style={{ color: 'rgba(255,255,255,.65)' }}>
            Specialized, production-grounded technical services tailored for engineering teams, businesses, and research labs. Spanning exploratory data analysis, interactive Power BI dashboards, machine learning systems, Arabic RAG assistants, and scalable data pipelines.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {SERVICES.map((service, idx) => {
            const Icon = serviceIconMap[service.icon] || Database
            const accent = serviceAccents[service.id] || '#00f5d4'

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.06, duration: 0.5 }}
                className="glass glass-hover rounded-3xl p-7 flex flex-col justify-between group"
                style={{ border: `1px solid ${accent}22` }}
              >
                <div>
                  {/* Service Header */}
                  <div className="flex items-center justify-between gap-4 mb-6">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105"
                      style={{ background: `${accent}15`, color: accent, border: `1px solid ${accent}33` }}
                    >
                      <Icon size={22} />
                    </div>
                    <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      0{idx + 1} / 0{SERVICES.length}
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <h2 className="font-display font-bold text-xl text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,.6)' }}>
                    {service.shortDesc}
                  </p>

                  {/* Deliverables List */}
                  <div className="mb-6 space-y-2.5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">Key Deliverables:</p>
                    {(service.deliverables || []).map((del, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs leading-normal" style={{ color: 'rgba(255,255,255,.75)' }}>
                        <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: accent }} />
                        <span>{del}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 mb-6 pt-3">
                    {(service.tech || []).map((t) => (
                      <span
                        key={t}
                        className="font-mono text-[10px] px-2.5 py-1 rounded-md"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'rgba(255,255,255,0.65)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Service Contact Action CTA - EMAIL ONLY */}
                  <a
                    href={getEmailServiceUrl(service.title, service.emailSubject)}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-semibold glass transition-all hover:scale-[1.02] hover:text-white"
                    style={{
                      color: accent,
                      border: `1px solid ${accent}44`,
                      background: `${accent}0d`,
                    }}
                  >
                    <Mail size={14} /> {service.cta}
                  </a>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Engagement / Workflow Process */}
        <section className="mb-24">
          <div className="max-w-3xl mb-12">
            <p className="font-mono text-xs mb-2 tracking-wider uppercase" style={{ color: '#00f5d4' }}>
              // COLLABORATION WORKFLOW
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
              How We <span className="grad-text">Work Together</span>
            </h2>
            <p className="text-sm sm:text-base" style={{ color: 'rgba(255,255,255,.55)' }}>
              A structured, transparent engineering process ensuring quality, reproducibility, and verified milestones.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {workflowSteps.map((ws, i) => {
              const StepIcon = ws.icon
              return (
                <motion.div
                  key={ws.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="glass rounded-2xl p-7 relative border"
                  style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'rgba(0,245,212,0.1)', color: '#00f5d4', border: '1px solid rgba(0,245,212,0.25)' }}
                    >
                      <StepIcon size={18} />
                    </div>
                    <span className="font-mono text-2xl font-bold" style={{ color: 'rgba(0,245,212,0.3)' }}>
                      {ws.step}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white mb-2">{ws.title}</h3>
                  <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    {ws.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Unified Premium Contact Section */}
        <section>
          <div
            className="rounded-3xl p-8 sm:p-12 lg:p-14 glass border relative overflow-hidden"
            style={{
              borderColor: 'rgba(0,245,212,0.2)',
              background: 'linear-gradient(135deg, rgba(13,13,26,0.95) 0%, rgba(8,8,16,0.98) 100%)',
            }}
          >
            <div
              className="absolute -top-32 -right-32 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.12), transparent 70%)' }}
            />
            <div
              className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.1), transparent 70%)' }}
            />

            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="font-mono text-xs mb-3 tracking-wider uppercase" style={{ color: '#00f5d4' }}>
                  // LET&apos;S CONNECT
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                  Ready to Start a Collaboration? <br />
                  <span className="grad-text">Let&apos;s Build Together.</span>
                </h2>
                <p className="text-sm sm:text-base leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,.65)' }}>
                  Whether you need a full data analytics dashboard, an end-to-end ML model, or technical consultation on GenAI and big data architecture, reach out directly through the unified channels below.
                </p>

                {/* Location & Status Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div
                    className="p-4 rounded-2xl glass border"
                    style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}
                  >
                    <p className="font-mono text-xs uppercase tracking-wider text-white/40 mb-1">Location</p>
                    <p className="text-sm font-semibold text-white">{PROFILE.location}</p>
                  </div>
                  <div
                    className="p-4 rounded-2xl glass border"
                    style={{ borderColor: 'rgba(0,245,212,0.15)', background: 'rgba(0,245,212,0.02)' }}
                  >
                    <p className="font-mono text-xs uppercase tracking-wider text-white/40 mb-1">Availability</p>
                    <p className="text-sm font-semibold text-[#00f5d4] flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
                      Open to internships &amp; freelance
                    </p>
                  </div>
                </div>

                <Link to="/projects" className="btn-ghost inline-flex items-center gap-2 text-sm">
                  <ArrowRight size={15} style={{ color: '#00f5d4' }} /> Explore Featured Projects
                </Link>
              </div>

              {/* Unified Contact Hub Card */}
              <div
                className="p-7 sm:p-9 rounded-3xl glass border relative overflow-hidden"
                style={{
                  borderColor: 'rgba(0,245,212,0.2)',
                  background: 'linear-gradient(145deg, rgba(16,18,34,0.92) 0%, rgba(8,10,20,0.96) 100%)',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(0,245,212,0.04)',
                }}
              >
                <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                  <div>
                    <span className="font-mono text-[10px] tracking-wider uppercase" style={{ color: '#00f5d4' }}>
                      DIRECT CHANNELS
                    </span>
                    <h3 className="font-display font-bold text-white text-xl mt-0.5">Contact Hub</h3>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full font-mono text-[11px] flex items-center gap-1.5 font-medium"
                    style={{
                      background: 'rgba(0,245,212,0.08)',
                      border: '1px solid rgba(0,245,212,0.2)',
                      color: '#00f5d4',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
                    Available
                  </span>
                </div>

                <div className="space-y-4 py-6">
                  {/* Primary: WhatsApp */}
                  <a
                    href={PROFILE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-between p-4 rounded-2xl transition-all group hover:scale-[1.01] hover:shadow-lg hover:shadow-emerald-500/10"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,245,212,0.14) 0%, rgba(14,165,233,0.1) 100%)',
                      border: '1px solid rgba(0,245,212,0.35)',
                    }}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'linear-gradient(135deg,#00f5d4,#0ea5e9)', color: '#080810' }}
                      >
                        <WhatsAppIcon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="font-display font-semibold text-white text-sm sm:text-base group-hover:text-[#00f5d4] transition-colors">
                          Chat on WhatsApp
                        </p>
                        <p className="font-mono text-xs text-white/50">+20 109 355 6456</p>
                      </div>
                    </div>
                    <ArrowUpRight size={18} className="text-[#00f5d4] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>

                  {/* Secondary: Email */}
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="w-full flex items-center justify-between p-4 rounded-2xl glass transition-all group hover:scale-[1.01] hover:border-cyan-400/40"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 glass border"
                        style={{
                          borderColor: 'rgba(14,165,233,0.3)',
                          background: 'rgba(14,165,233,0.1)',
                          color: '#0ea5e9',
                        }}
                      >
                        <Mail size={19} />
                      </div>
                      <div className="text-left">
                        <p className="font-display font-semibold text-white text-sm sm:text-base group-hover:text-white transition-colors">
                          Send Email
                        </p>
                        <p className="font-mono text-xs text-white/50">{PROFILE.email}</p>
                      </div>
                    </div>
                    <ArrowUpRight size={18} className="text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                  </a>
                </div>

                {/* Supporting Profiles Row */}
                <div className="pt-5 border-t border-white/[0.08]">
                  <p className="font-mono text-xs uppercase tracking-wider text-white/40 mb-3">
                    Professional Networks
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href={PROFILE.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl glass font-mono text-xs font-semibold text-white/80 hover:text-white hover:border-cyan-400/40 transition-all"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <Linkedin size={14} style={{ color: '#0ea5e9' }} /> LinkedIn
                    </a>
                    <a
                      href={PROFILE.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl glass font-mono text-xs font-semibold text-white/80 hover:text-white hover:border-cyan-400/40 transition-all"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <Github size={14} /> GitHub
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
