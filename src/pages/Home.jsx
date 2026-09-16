import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Download,
  ExternalLink,
  Database,
  BrainCircuit,
  BarChart3,
  Sparkles,
  LayoutDashboard,
  Bot,
  Eye,
  Cpu,
  ArrowUpRight,
  FileText,
  Briefcase,
  Layers,
} from 'lucide-react'
import { PROFILE, PROJECTS, SERVICES } from '../data'
import { getWhatsAppServiceUrl } from '../config/contact'
import TrustStrip from '../components/TrustStrip'
import CaseStudyModal from '../components/CaseStudyModal'
import WhatsAppIcon from '../components/WhatsAppIcon'

const BASE_URL = import.meta.env.BASE_URL

const serviceIconMap = {
  BarChart3,
  LayoutDashboard,
  Database,
  BrainCircuit,
  Bot,
  Eye,
  Cpu,
}

const domains = [
  {
    icon: Database,
    title: 'Data Analytics & BI',
    text: 'Exploratory data analysis, SQL modeling, statistical data cleaning, and production Power BI dashboards with DAX.',
    tags: ['Python', 'SQL', 'Pandas', 'Power BI', 'DAX'],
    accent: '#0ea5e9',
  },
  {
    icon: BrainCircuit,
    title: 'Machine Learning & AI',
    text: 'Predictive algorithms, classification/regression pipelines, Arabic RAG assistants, and real-time computer vision models.',
    tags: ['Scikit-Learn', 'TensorFlow', 'NLP', 'RAG', 'OpenCV'],
    accent: '#00f5d4',
  },
  {
    icon: BarChart3,
    title: 'Data Engineering',
    text: 'Distributed data pipelines with PySpark and HDFS, star-schema warehouse modeling in Snowflake, and Airflow orchestration.',
    tags: ['PySpark', 'HDFS', 'Airflow', 'Snowflake', 'Docker'],
    accent: '#fb923c',
  },
]

export default function Home() {
  const [activeProject, setActiveProject] = useState(null)
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 4)

  return (
    <main className="page-transition">
      {/* Case Study Modal */}
      <CaseStudyModal
        project={activeProject}
        isOpen={Boolean(activeProject)}
        onClose={() => setActiveProject(null)}
      />

      {/* Hero Section */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden px-4 sm:px-6 lg:px-10 pt-28 pb-16">
        <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
        <div
          className="absolute -top-32 -right-32 w-[520px] h-[520px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(0,245,212,.12),transparent 68%)' }}
        />
        <div
          className="absolute -bottom-48 -left-32 w-[560px] h-[560px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle,rgba(14,165,233,.09),transparent 68%)' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-[1.15fr_.85fr] gap-12 lg:gap-16 items-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass mb-6 border" style={{ borderColor: 'rgba(0,245,212,0.2)' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00f5d4', boxShadow: '0 0 12px #00f5d4' }} />
              <span className="font-mono text-[11px] sm:text-xs tracking-wider uppercase" style={{ color: '#00f5d4' }}>
                OPEN TO INTERNSHIPS &amp; FREELANCE
              </span>
            </div>

            <p className="font-mono text-xs sm:text-sm mb-3 tracking-wider uppercase" style={{ color: 'rgba(255,255,255,.45)' }}>
              Data Analyst &amp; Machine Learning Engineer
            </p>

            <h1 className="font-display font-bold text-5xl sm:text-7xl xl:text-8xl leading-[.92] tracking-[-.04em] mb-6">
              <span className="text-white">Mohamed</span>
              <br />
              <span className="grad-text">Ebrahim</span>
            </h1>

            <p className="max-w-2xl text-base sm:text-lg leading-8 mb-6" style={{ color: 'rgba(255,255,255,.65)' }}>
              Building data-driven products, intelligent ML systems, and practical AI solutions. Specializing in exploratory analytics, business intelligence dashboards, RAG architectures, and end-to-end data pipelines.
            </p>

            {/* Core Tech Pill Strip */}
            <div className="flex flex-wrap items-center gap-2 mb-8">
              {['Python', 'SQL', 'Power BI', 'Machine Learning', 'NLP', 'RAG', 'PySpark', 'Docker'].map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs px-2.5 py-1 rounded-md"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: 'rgba(255, 255, 255, 0.75)',
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-9">
              <a
                href={PROFILE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2.5 shadow-lg shadow-emerald-500/10"
              >
                <WhatsAppIcon size={18} /> Chat on WhatsApp
              </a>
              <a
                href={`mailto:${PROFILE.email}`}
                className="btn-ghost inline-flex items-center gap-2"
              >
                <Mail size={15} /> Send Email
              </a>
              <Link to="/projects" className="btn-ghost inline-flex items-center gap-2">
                Explore My Work <ArrowRight size={16} />
              </Link>
              <a
                href={`${BASE_URL}Mohamed-Ebrahim-CV.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                download="Mohamed-Ebrahim-CV.pdf"
                className="btn-ghost inline-flex items-center gap-2"
              >
                <Download size={15} /> Download CV
              </a>
            </div>

            {/* Social & Direct Contact Links */}
            <div className="flex items-center gap-3">
              <a
                href={PROFILE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                className="w-11 h-11 rounded-xl glass flex items-center justify-center transition-all hover:-translate-y-1 hover:border-emerald-400/50 hover:text-emerald-400"
                style={{ color: '#00f5d4' }}
              >
                <WhatsAppIcon size={19} />
              </a>
              <a
                href={`mailto:${PROFILE.email}`}
                aria-label="Send Email"
                className="w-11 h-11 rounded-xl glass flex items-center justify-center transition-transform hover:-translate-y-1 hover:border-cyan-400/40 hover:text-[#00f5d4]"
                style={{ color: 'rgba(255,255,255,.75)' }}
              >
                <Mail size={18} />
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="w-11 h-11 rounded-xl glass flex items-center justify-center transition-transform hover:-translate-y-1 hover:border-cyan-400/40"
                style={{ color: 'rgba(255,255,255,.75)' }}
              >
                <Linkedin size={18} />
              </a>
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="w-11 h-11 rounded-xl glass flex items-center justify-center transition-transform hover:-translate-y-1 hover:border-cyan-400/40"
                style={{ color: 'rgba(255,255,255,.75)' }}
              >
                <Github size={18} />
              </a>
            </div>
          </motion.div>

          {/* Profile Portrait Showcase - Full Body Focal Point */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative flex justify-center lg:justify-end w-full"
          >
            {/* Soft atmospheric ambient glow */}
            <div
              className="absolute inset-0 rounded-[40px] pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(0,245,212,0.12) 0%, rgba(14,165,233,0.06) 45%, transparent 70%)',
                filter: 'blur(35px)',
              }}
            />

            {/* Portrait Frame */}
            <div className="relative w-full max-w-[340px] sm:max-w-[400px] lg:max-w-[440px]">
              <div
                className="absolute -inset-[1px] rounded-[28px]"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,245,212,0.4), rgba(14,165,233,0.15), rgba(167,139,250,0.3))',
                }}
              />
              <div className="relative m-[1px] rounded-[27px] overflow-hidden bg-[#090913] border border-white/[0.05]">
                {/* Header Strip */}
                <div
                  className="h-12 px-5 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(15,15,30,0.7)' }}
                >
                  <span className="font-mono text-[10px] tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    PORTFOLIO // 2026
                  </span>
                  <span
                    className="font-mono text-[10px] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1.5"
                    style={{
                      color: '#00f5d4',
                      background: 'rgba(0,245,212,0.1)',
                      border: '1px solid rgba(0,245,212,0.25)',
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
                    ACTIVE &amp; AVAILABLE
                  </span>
                </div>

                {/* Portrait Canvas */}
                <div className="relative h-[480px] sm:h-[560px] lg:h-[620px] overflow-hidden flex items-end justify-center bg-gradient-to-b from-[#0e0e20] via-[#090914] to-[#06060c]">
                  {/* Subtle soft backdrop glow behind body */}
                  <div
                    className="absolute top-1/4 w-72 h-72 rounded-full pointer-events-none"
                    style={{
                      background: 'radial-gradient(circle, rgba(0,245,212,0.18) 0%, rgba(14,165,233,0.08) 50%, transparent 70%)',
                      filter: 'blur(30px)',
                    }}
                  />

                  {/* High Quality Full-Body Portrait Cutout */}
                  <img
                    src={`${BASE_URL}profile-home-about.webp`}
                    alt="Mohamed Ebrahim - Data Analyst & ML Engineer"
                    className="relative z-10 w-full h-full object-contain object-bottom transition-transform duration-500 hover:scale-[1.02] drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]"
                    loading="eager"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.src = `${BASE_URL}profile-home-about.png`
                    }}
                  />

                  {/* Soft bottom ground shadow fade */}
                  <div
                    className="absolute inset-0 z-20 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, transparent 72%, rgba(8,8,16,0.85) 94%, #080810 100%)',
                    }}
                  />

                  {/* Floating Identity Badge */}
                  <div className="absolute bottom-4 left-4 right-4 z-30 flex items-end justify-between gap-3 p-3.5 rounded-2xl glass border border-white/10 backdrop-blur-md" style={{ background: 'rgba(10,10,22,0.75)' }}>
                    <div>
                      <p className="font-display font-semibold text-white text-base sm:text-lg drop-shadow-md">
                        Mohamed Ebrahim
                      </p>
                      <p className="font-mono text-xs mt-0.5 text-[#00f5d4]">
                        Data Analyst &amp; ML Engineer
                      </p>
                    </div>
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center glass border border-cyan-400/30 flex-shrink-0"
                      style={{ background: 'rgba(0,245,212,0.12)' }}
                    >
                      <Sparkles size={15} style={{ color: '#00f5d4' }} />
                    </div>
                  </div>
                </div>

                {/* Footer Strip */}
                <div className="p-3 bg-[#080810] border-t border-white/[0.04]">
                  <p className="font-mono text-[11px] text-center text-white/50">
                    Data Analytics · Machine Learning · AI Systems
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust & Credibility Strip */}
      <TrustStrip />

      {/* Core Technical Domains */}
      <section className="px-4 sm:px-6 lg:px-10 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="font-mono text-xs mb-2 tracking-wider uppercase" style={{ color: '#00f5d4' }}>
              // CORE DOMAINS
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
              End-to-End <span className="grad-text">Technical Scope</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {domains.map(({ icon: Icon, title, text, tags, accent }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass glass-hover rounded-2xl p-7 flex flex-col justify-between"
                style={{ border: `1px solid ${accent}22` }}
              >
                <div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: `${accent}14`, color: accent, border: `1px solid ${accent}33` }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-white mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,.55)' }}>
                    {text}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  {tags.map((t) => (
                    <span key={t} className="font-mono text-[11px] px-2.5 py-1 rounded-md" style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.6)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects with Case Study Integration */}
      <section className="px-4 sm:px-6 lg:px-10 pb-28">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
            <div>
              <p className="font-mono text-xs mb-2 tracking-wider uppercase" style={{ color: '#00f5d4' }}>
                // FEATURED ENGINEERING WORK
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white">
                Projects That <span className="grad-text">Deliver Value</span>
              </h2>
            </div>
            <Link
              to="/projects"
              className="font-mono text-sm inline-flex items-center gap-2 transition-colors hover:text-cyan-300"
              style={{ color: '#00f5d4' }}
            >
              View All 9 Projects <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {featured.map((proj, i) => (
              <motion.article
                key={proj.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass glass-hover rounded-3xl p-6 sm:p-8 flex flex-col justify-between group"
                style={{ border: `1px solid ${proj.accent}25` }}
              >
                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <span
                      className="font-mono text-[11px] px-3 py-1 rounded-md tracking-wider font-semibold"
                      style={{
                        color: proj.accent,
                        background: `${proj.accent}12`,
                        border: `1px solid ${proj.accent}28`,
                      }}
                    >
                      {proj.categoryLabel}
                    </span>
                    <span className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      0{proj.id} / 04
                    </span>
                  </div>

                  {/* Title & One-Line Value Proposition */}
                  <h3 className="font-display text-2xl font-bold text-white mb-2 leading-tight">
                    {proj.title}
                  </h3>
                  <p className="text-sm font-medium mb-5 leading-relaxed" style={{ color: proj.accent }}>
                    {proj.valueProp}
                  </p>

                  {/* Project Screenshot / Visual Preview Area */}
                  <div
                    className="relative h-48 mb-6 rounded-2xl overflow-hidden bg-[#07070e] border flex items-center justify-center cursor-pointer group/img"
                    style={{ borderColor: 'rgba(255,255,255,.08)' }}
                    onClick={() => setActiveProject(proj)}
                  >
                    <img
                      src={`${BASE_URL}${proj.coverImage || 'projects/' + proj.slug + '.svg'}`}
                      alt={`${proj.title} project preview`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = `${BASE_URL}projects/${proj.slug}.svg`
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/80 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/50 backdrop-blur-xs">
                      <span className="px-4 py-2 rounded-xl glass font-mono text-xs font-semibold text-white flex items-center gap-2">
                        <Layers size={14} style={{ color: proj.accent }} /> Read Case Study
                      </span>
                    </div>
                  </div>

                  {/* Tech Stack Strip */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {proj.tech.map((t) => (
                      <span key={t} className="tech-tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div
                  className="flex items-center justify-between gap-4 pt-5 border-t"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <button
                    onClick={() => setActiveProject(proj)}
                    className="inline-flex items-center gap-2 font-mono text-xs font-semibold transition-all hover:translate-x-1"
                    style={{ color: proj.accent }}
                  >
                    View Case Study <ArrowRight size={13} />
                  </button>

                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-xs transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,.45)' }}
                  >
                    <Github size={14} /> GitHub <ArrowUpRight size={12} />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section ("What I Can Help You With") */}
      <section id="services" className="px-4 sm:px-6 lg:px-10 pb-28 pt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div className="max-w-3xl">
              <p className="font-mono text-xs mb-2 tracking-wider uppercase" style={{ color: '#00f5d4' }}>
                // SERVICES &amp; COLLABORATION
              </p>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
                What I Can <span className="grad-text">Help You With</span>
              </h2>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,.6)' }}>
                Practical, production-grounded technical services tailored for engineering teams, startups, and clients seeking verified data analytics and machine learning capabilities.
              </p>
            </div>
            <Link
              to="/services"
              className="font-mono text-sm inline-flex items-center gap-2 transition-colors hover:text-cyan-300 shrink-0"
              style={{ color: '#00f5d4' }}
            >
              View Full Services Page <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {SERVICES.map((service, idx) => {
              const Icon = serviceIconMap[service.icon] || Database
              const mailSubject = service.emailSubject || `${service.title} Project Inquiry`
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06 }}
                  className="glass glass-hover rounded-2xl p-7 flex flex-col justify-between"
                  style={{ border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                      style={{ background: 'rgba(0,245,212,0.1)', color: '#00f5d4', border: '1px solid rgba(0,245,212,0.2)' }}
                    >
                      <Icon size={22} />
                    </div>
                    <h3 className="font-display font-semibold text-xl text-white mb-3">{service.title}</h3>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,.55)' }}>
                      {service.shortDesc}
                    </p>

                    <div className="mb-6 space-y-2">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-white/40">Key Deliverables:</p>
                      {service.deliverables.map((del, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs" style={{ color: 'rgba(255,255,255,.7)' }}>
                          <span className="text-[#00f5d4] mt-0.5">•</span>
                          <span>{del}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {service.tech.slice(0, 4).map((t) => (
                        <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-white/50">
                          {t}
                        </span>
                      ))}
                    </div>
                    <a
                      href={getWhatsAppServiceUrl(service.title)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl font-mono text-xs font-semibold glass hover:border-cyan-400/50 transition-all hover:text-white"
                      style={{ color: '#00f5d4', border: '1px solid rgba(0,245,212,0.25)' }}
                    >
                      <WhatsAppIcon size={14} /> {service.cta}
                    </a>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/services"
              className="btn-ghost inline-flex items-center gap-2 text-sm"
            >
              <Briefcase size={15} /> Explore Detailed Services, Offerings &amp; Workflow <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Let's Connect Contact Section */}
      <section className="px-4 sm:px-6 lg:px-10 pb-28">
        <div className="max-w-7xl mx-auto">
          <div
            className="rounded-3xl p-8 sm:p-12 lg:p-16 glass border relative overflow-hidden"
            style={{
              borderColor: 'rgba(0,245,212,0.18)',
              background: 'linear-gradient(135deg, rgba(13,13,26,0.95) 0%, rgba(8,8,16,0.98) 100%)',
            }}
          >
            <div
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(0,245,212,0.12), transparent 70%)' }}
            />
            <div
              className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.1), transparent 70%)' }}
            />

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="font-mono text-xs mb-3 tracking-wider uppercase" style={{ color: '#00f5d4' }}>
                  // LET&apos;S CONNECT
                </p>
                <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                  Have a Data or AI Problem to Solve? <br />
                  <span className="grad-text">Let&apos;s Build the Solution.</span>
                </h2>
                <p className="text-base sm:text-lg leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,.65)' }}>
                  Whether you are a recruiter seeking a dedicated Data Analyst &amp; ML Engineer for internships or freelance roles, or looking to launch an analytics dashboard or custom AI pipeline — reach out directly via WhatsApp or Email.
                </p>

                <div className="flex flex-wrap gap-3.5">
                  <a
                    href={PROFILE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary inline-flex items-center gap-2.5 shadow-lg shadow-emerald-500/10"
                  >
                    <WhatsAppIcon size={18} /> Chat on WhatsApp
                  </a>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="btn-ghost inline-flex items-center gap-2"
                  >
                    <Mail size={15} /> Send Email
                  </a>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost inline-flex items-center gap-2"
                  >
                    <Linkedin size={15} /> LinkedIn
                  </a>
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost inline-flex items-center gap-2"
                  >
                    <Github size={15} /> GitHub
                  </a>
                  <Link to="/projects" className="btn-ghost inline-flex items-center gap-2">
                    <ArrowRight size={15} /> View Projects
                  </Link>
                </div>
              </div>

              {/* Conversion Contact Card */}
              <div
                className="p-8 rounded-2xl glass border space-y-6"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-white/40 mb-2">Direct Communication</p>
                  <div className="space-y-2">
                    <a
                      href={PROFILE.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-base sm:text-lg font-semibold text-[#00f5d4] hover:underline flex items-center gap-2.5"
                    >
                      <WhatsAppIcon size={18} /> Chat on WhatsApp
                    </a>
                    <a
                      href={`mailto:${PROFILE.email}`}
                      className="font-mono text-sm sm:text-base font-semibold text-white/80 hover:text-[#00f5d4] hover:underline flex items-center gap-2.5 transition-colors"
                    >
                      <Mail size={16} style={{ color: '#0ea5e9' }} /> {PROFILE.email}
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-white/40 mb-1">Location</p>
                    <p className="text-sm font-semibold text-white">{PROFILE.location}</p>
                  </div>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-wider text-white/40 mb-1">Current Status</p>
                    <p className="text-sm font-semibold text-[#00f5d4]">Open to internships &amp; freelance</p>
                  </div>
                </div>

                <div className="pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <p className="font-mono text-xs uppercase tracking-wider text-white/40 mb-3">Professional Profiles</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href={PROFILE.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl glass font-mono text-xs flex items-center gap-2 hover:border-cyan-400"
                      style={{ color: '#fff' }}
                    >
                      <Linkedin size={14} style={{ color: '#0ea5e9' }} /> LinkedIn
                    </a>
                    <a
                      href={PROFILE.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl glass font-mono text-xs flex items-center gap-2 hover:border-cyan-400"
                      style={{ color: '#fff' }}
                    >
                      <Github size={14} /> GitHub
                    </a>
                    <Link
                      to="/projects"
                      className="px-4 py-2 rounded-xl glass font-mono text-xs flex items-center gap-2 hover:border-cyan-400"
                      style={{ color: '#fff' }}
                    >
                      <ArrowRight size={14} style={{ color: '#00f5d4' }} /> Projects
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
