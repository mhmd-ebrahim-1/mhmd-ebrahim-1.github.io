import { motion } from 'framer-motion'
import { useReveal } from '../hooks'
import { PROFILE as STATIC_PROFILE, SKILLS as STATIC_SKILLS, TOOLS as STATIC_TOOLS } from '../data'
import { Database, BrainCircuit, Bot, Eye, Cpu, Terminal, ArrowUpRight, Sparkles, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import WhatsAppIcon from '../components/WhatsAppIcon'
import '../config/contact'
import { useData } from '../context/DataContext'

const BASE_URL = import.meta.env.BASE_URL

const domainIcons = {
  analytics: Database,
  ml: BrainCircuit,
  ai_nlp: Bot,
  vision: Eye,
  data_eng: Cpu,
  dev_tools: Terminal,
}

const domainAccents = {
  analytics: '#0ea5e9',
  ml: '#00f5d4',
  ai_nlp: '#a78bfa',
  vision: '#fb923c',
  data_eng: '#38bdf8',
  dev_tools: '#f43f5e',
}

export default function About() {
  const { profile, skills, tools, siteSettings } = useData()
  const PROFILE = profile || STATIC_PROFILE
  const SKILLS = skills || STATIC_SKILLS
  const TOOLS = tools || STATIC_TOOLS

  const [heroRef, heroVisible] = useReveal()
  const [skillsRef, skillsVisible] = useReveal()
  const [toolsRef, toolsVisible] = useReveal()

  return (
    <div className="page-transition min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        {/* About Hero & Profile */}
        <div ref={heroRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 lg:mb-28 items-start">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={heroVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            <p className="font-mono text-xs mb-4 tracking-wider uppercase" style={{ color: '#00f5d4' }}>
              // 01 — PROFESSIONAL PROFILE
            </p>
            <h1 className="font-display text-4xl sm:text-6xl font-bold mb-6 tracking-[-0.04em] leading-[1.05]">
              Turning Data <br />
              Into <span className="grad-text">Intelligence</span>
            </h1>

            <p className="text-base sm:text-lg leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.7)' }}>
              {PROFILE.bio}
            </p>
            <p className="text-base leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
              {PROFILE.bio2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {[
                { label: 'Location', value: PROFILE.location },
                { label: 'Availability', value: 'Open to internships & freelance' },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="p-4 rounded-xl glass"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <p className="font-mono text-[10px] mb-1 tracking-wider uppercase text-white/40">{label}</p>
                  <p className="text-sm font-semibold text-white/90">{value}</p>
                </div>
              ))}
            </div>

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
              <Link to="/projects" className="btn-ghost inline-flex items-center gap-2 text-sm">
                Explore My Projects <ArrowUpRight size={15} />
              </Link>
              <a
                href={siteSettings?.cvUrl || `${BASE_URL}Mohamed-Ebrahim-CV.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                download="Mohamed-Ebrahim-CV.pdf"
                className="btn-ghost inline-flex items-center gap-2 text-sm"
              >
                Download CV
              </a>
            </div>
          </motion.div>

          {/* Right Column: Clean Portrait & Python Code Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={heroVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* Portrait Framing */}
            <div
              className="relative rounded-3xl overflow-hidden glass border p-3 group"
              style={{ borderColor: 'rgba(0,245,212,0.2)', background: 'rgba(17,17,32,0.7)' }}
            >
              <div className="relative h-[420px] sm:h-[480px] lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#0e0e20] via-[#090914] to-[#06060c] flex items-end justify-center">
                <div
                  className="absolute top-1/4 w-60 h-60 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(0,245,212,0.18) 0%, rgba(14,165,233,0.08) 50%, transparent 70%)',
                    filter: 'blur(25px)',
                  }}
                />
                <img
                  src={`${BASE_URL}profile-home-about.webp`}
                  alt="Mohamed Ebrahim"
                  className="relative z-10 w-full h-full object-contain object-bottom transition-transform duration-500 group-hover:scale-[1.02] drop-shadow-[0_10px_25px_rgba(0,0,0,0.8)]"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = `${BASE_URL}profile-home-about.png`
                  }}
                />
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#080810]/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 z-30 flex items-center justify-between p-3 rounded-xl glass border border-white/10" style={{ background: 'rgba(10,10,22,0.75)' }}>
                  <div>
                    <p className="font-display font-bold text-white text-base">Mohamed Ebrahim</p>
                    <p className="font-mono text-xs text-[#00f5d4]">Data Analyst &amp; ML Engineer</p>
                  </div>
                  <span className="w-8 h-8 rounded-full flex items-center justify-center glass border border-cyan-400/30 flex-shrink-0">
                    <Sparkles size={14} style={{ color: '#00f5d4' }} />
                  </span>
                </div>
              </div>
            </div>

            {/* Python Profile Card */}
            <div
              className="rounded-2xl overflow-hidden relative border"
              style={{
                borderColor: 'rgba(255,255,255,0.08)',
                background: 'rgba(11,11,22,0.85)',
              }}
            >
              <div className="relative z-10 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="font-mono text-xs ml-3 text-white/30">engineer_profile.py</span>
                </div>
                <div className="font-mono text-xs leading-6 text-white/80 overflow-x-auto">
                  <p>
                    <span style={{ color: '#a78bfa' }}>class</span> <span style={{ color: '#00f5d4' }}>MohamedEbrahim</span>:
                  </p>
                  <p className="pl-4">
                    <span style={{ color: '#fb923c' }}>role</span> = <span style={{ color: '#86efac' }}>&quot;Data Analyst &amp; ML Engineer&quot;</span>
                  </p>
                  <p className="pl-4">
                    <span style={{ color: '#fb923c' }}>stack</span> = [
                  </p>
                  <p className="pl-8">
                    <span style={{ color: '#86efac' }}>&quot;Data Analytics &amp; Power BI&quot;</span>,
                  </p>
                  <p className="pl-8">
                    <span style={{ color: '#86efac' }}>&quot;Machine Learning &amp; Computer Vision&quot;</span>,
                  </p>
                  <p className="pl-8">
                    <span style={{ color: '#86efac' }}>&quot;Arabic RAG &amp; GenAI&quot;</span>,
                  </p>
                  <p className="pl-8">
                    <span style={{ color: '#86efac' }}>&quot;PySpark &amp; Data Pipelines&quot;</span>,
                  </p>
                  <p className="pl-4">]</p>
                  <p className="pl-4 mt-1">
                    <span style={{ color: '#7dd3fc' }}>def</span> <span style={{ color: '#fde68a' }}>deliver_impact</span>(self):
                  </p>
                  <p className="pl-8">
                    <span style={{ color: '#a78bfa' }}>return</span> <span style={{ color: '#86efac' }}>&quot;Rigorous, Evidence-Based Solutions&quot;</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categorized Technical Expertise (No Arbitrary Percentages) */}
        <div ref={skillsRef} className="mb-20 lg:mb-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={skillsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="font-mono text-xs mb-3 tracking-wider uppercase" style={{ color: '#00f5d4' }}>
              // 02 — TECHNICAL COMPETENCIES
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-white">
              Skills &amp; <span className="grad-text">Applied Knowledge</span>
            </h2>
            <p className="text-sm sm:text-base mt-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Organized by domain and supported by verifiable project implementations across the repository.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(SKILLS || {}).map(([key, domain], cardIndex) => {
              const Icon = domainIcons[key] || Database
              const accent = domainAccents[key] || '#00f5d4'
              const domainTitle = domain?.title || key
              const domainDesc = domain?.description || ''
              const domainSkills = Array.isArray(domain?.skills) ? domain.skills : []

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 25 }}
                  animate={skillsVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: cardIndex * 0.08, duration: 0.6 }}
                  className="p-6 sm:p-7 rounded-2xl glass flex flex-col justify-between"
                  style={{ border: `1px solid ${accent}22` }}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `${accent}14`, color: accent, border: `1px solid ${accent}33` }}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-display font-semibold text-lg text-white">{domainTitle}</h3>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {domainDesc}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    {domainSkills.map((s) => (
                      <span
                        key={s}
                        className="font-mono text-xs px-2.5 py-1 rounded-md"
                        style={{
                          background: `${accent}0d`,
                          border: `1px solid ${accent}25`,
                          color: '#e8e8f0',
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Tools & Frameworks */}
        <div ref={toolsRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={toolsVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <p className="font-mono text-xs mb-3 tracking-wider uppercase" style={{ color: '#00f5d4' }}>
              // 03 — TOOLING
            </p>
            <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-white">
              Technologies &amp; <span className="grad-text">Environments</span>
            </h2>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            {TOOLS.map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={toolsVisible ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.03, duration: 0.3 }}
                whileHover={{ y: -3, scale: 1.03 }}
                className="flex items-center gap-2.5 px-4 py-3 rounded-xl glass border transition-all cursor-default"
                style={{ borderColor: `${tool.color}30` }}
              >
                <span className="text-lg">{tool.icon}</span>
                <span className="font-mono text-xs sm:text-sm font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {tool.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
