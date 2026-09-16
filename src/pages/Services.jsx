import { motion } from 'framer-motion'
import {
  Database,
  BrainCircuit,
  BarChart3,
  LayoutDashboard,
  Bot,
  Eye,
  Cpu,
  ArrowUpRight,
  Linkedin,
  Github,
  CheckCircle2,
  FileCode2,
  GitPullRequest,
  ShieldCheck,
  Mail,
} from 'lucide-react'
import { PROFILE, SERVICES } from '../data'
import { getWhatsAppServiceUrl } from '../config/contact'
import WhatsAppIcon from '../components/WhatsAppIcon'

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
                    {service.deliverables.map((del, i) => (
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
                    {service.tech.map((t) => (
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

                  {/* Service Contact Action CTA */}
                  <a
                    href={getWhatsAppServiceUrl(service.title)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-mono text-xs font-semibold glass transition-all hover:scale-[1.02]"
                    style={{
                      color: accent,
                      border: `1px solid ${accent}44`,
                      background: `${accent}0d`,
                    }}
                  >
                    <WhatsAppIcon size={14} /> {service.cta}
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

        {/* Dual Conversion Contact Banner */}
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
                  Whether you need a full data analytics dashboard, an end-to-end ML model, or technical consultation on GenAI and big data architecture, reach out directly via WhatsApp or Email.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={PROFILE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2 text-sm shadow-lg shadow-emerald-500/10"
                  >
                    <WhatsAppIcon size={16} /> Chat on WhatsApp
                  </a>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="btn-ghost inline-flex items-center gap-2 text-sm"
                  >
                    <Mail size={15} /> Send Email
                  </a>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost inline-flex items-center gap-2 text-sm"
                  >
                    <Linkedin size={15} /> LinkedIn Message
                  </a>
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost inline-flex items-center gap-2 text-sm"
                  >
                    <Github size={15} /> GitHub
                  </a>
                </div>
              </div>

              <div
                className="p-6 sm:p-8 rounded-2xl glass border space-y-4"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-white/40 mb-2">Direct Communication</p>
                  <div className="space-y-1.5">
                    <a
                      href={PROFILE.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-base font-semibold text-[#00f5d4] hover:underline flex items-center gap-2"
                    >
                      <WhatsAppIcon size={16} /> Chat on WhatsApp
                    </a>
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="font-mono text-sm font-semibold text-white/80 hover:text-[#00f5d4] hover:underline flex items-center gap-2 transition-colors"
                    >
                      <Mail size={14} style={{ color: '#0ea5e9' }} /> {PROFILE.email}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-white/40 mb-1">Location</p>
                    <p className="text-sm font-semibold text-white">{PROFILE.location}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-white/40 mb-1">Availability</p>
                    <p className="text-sm font-semibold text-[#00f5d4]">Open to internships &amp; freelance</p>
                  </div>
                </div>

                <div className="pt-3 border-t flex items-center gap-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl glass font-mono text-xs flex items-center gap-2 hover:border-cyan-400 text-white"
                  >
                    <Linkedin size={13} style={{ color: '#0ea5e9' }} /> LinkedIn
                  </a>
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl glass font-mono text-xs flex items-center gap-2 hover:border-cyan-400 text-white"
                  >
                    <Github size={13} /> GitHub
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
