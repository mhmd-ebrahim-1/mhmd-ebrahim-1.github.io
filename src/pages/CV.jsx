import { motion } from 'framer-motion'
import { Download, Briefcase, GraduationCap, MapPin, Mail, Github, Linkedin } from 'lucide-react'
import WhatsAppIcon from '../components/WhatsAppIcon'
import { useReveal } from '../hooks'
import { PROFILE as STATIC_PROFILE, EXPERIENCE as STATIC_EXPERIENCE, EDUCATION, LEARNING_ACTIVITIES, SKILLS, TOOLS } from '../data'
import '../config/contact'
import { useData } from '../context/DataContext'

const BASE_URL = import.meta.env.BASE_URL
const DEFAULT_CV_FILE = 'Mohamed-Ebrahim-CV.pdf'

function TimelineItem({ item, index, isEdu = false }) {
  const [ref, visible] = useReveal()
  const title = item.title || item.role || item.degree
  const company = item.company || item.organization || item.institution || item.school
  const period = item.period || (item.start_date ? `${item.start_date} – ${item.end_date || (item.current_position ? 'Present' : '')}` : item.year)
  const isCurrent = Boolean(item.current || item.current_position)
  const highlights = item.highlights || item.technologies || []

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex gap-4 sm:gap-6 pb-10 last:pb-0"
    >
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 z-10"
          style={{
            background: isCurrent ? 'rgba(0,245,212,0.15)' : 'rgba(255,255,255,0.04)',
            border: isCurrent ? '1px solid rgba(0,245,212,0.3)' : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {isEdu ? (
            <GraduationCap size={16} style={{ color: isCurrent ? '#00f5d4' : 'rgba(255,255,255,0.4)' }} />
          ) : (
            <Briefcase size={16} style={{ color: isCurrent ? '#00f5d4' : 'rgba(255,255,255,0.4)' }} />
          )}
        </div>
        <div className="w-px flex-1 mt-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
      </div>
      <div className="flex-1 min-w-0 pt-1 pb-2">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-1">
          <h3 className="font-display font-semibold text-[var(--text-primary)] text-base sm:text-lg">
            {title}
          </h3>
          {isCurrent && (
            <span
              className="self-start px-2.5 py-0.5 rounded-full font-mono text-xs flex items-center gap-1.5"
              style={{
                background: 'rgba(0,245,212,0.1)',
                border: '1px solid rgba(0,245,212,0.3)',
                color: '#00f5d4',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f5d4] animate-pulse" />
              Current
            </span>
          )}
        </div>
        <p className="font-mono text-xs sm:text-sm text-cyan-400 mb-2">
          {company} · {period}
          {item.location ? ` · ${item.location}` : ''}
        </p>
        <p className="text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
          {item.description}
        </p>
        {highlights.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {highlights.map((h, i) => (
              <li key={i} className="text-xs flex items-start gap-2 text-[var(--text-secondary)]">
                <span className="text-[#00f5d4] mt-0.5">•</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  )
}

export default function CV() {
  const { profile, siteSettings, experience, skills } = useData()
  const PROFILE = profile || STATIC_PROFILE
  const EXPERIENCE = (experience && experience.length > 0) ? experience : STATIC_EXPERIENCE
  const SKILLS_DATA = skills || STATIC_SKILLS
  const cvDownloadUrl = siteSettings?.cvUrl || `${BASE_URL}${DEFAULT_CV_FILE}`

  return (
    <div className="page-transition min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12"
        >
          <div>
            <p className="font-mono text-xs mb-3 tracking-[0.12em]" style={{ color: '#00f5d4' }}>
              // 05 — CURRICULUM VITAE
            </p>
            <h1 className="font-display section-title font-bold text-[var(--text-primary)]">
              Professional <span className="grad-text">CV</span>
            </h1>
            <p className="text-sm sm:text-base mt-2 text-[var(--text-muted)]">
              Official curriculum vitae, training milestones, and technical background.
            </p>
          </div>

          <motion.a
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            href={cvDownloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download="Mohamed-Ebrahim-CV.pdf"
            className="btn-primary inline-flex items-center gap-2 self-start text-sm"
          >
            <Download size={16} /> Download PDF
          </motion.a>
        </motion.div>

        <div className="glass rounded-3xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {/* Header Card */}
          <div
            className="p-6 sm:p-10 pb-8 border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,245,212,0.02)' }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
              <div
                className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border flex items-end justify-center bg-gradient-to-b from-[#111126] to-[#070712]"
                style={{ borderColor: 'rgba(0,245,212,0.3)' }}
              >
                <img
                  src={`${BASE_URL}profile-cutout.webp`}
                  alt={PROFILE.name}
                  className="w-full h-full object-contain object-bottom"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src = `${BASE_URL}profile-cutout.png`
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1">
                  {PROFILE.fullName}
                </h2>
                <p className="text-base font-semibold mb-3" style={{ color: '#00f5d4' }}>
                  {PROFILE.title}
                </p>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                  <span className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)]">
                    <MapPin size={12} style={{ color: '#00f5d4', flexShrink: 0 }} />
                    {PROFILE.location}
                  </span>
                  <a
                    href={PROFILE.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    <WhatsAppIcon size={13} className="text-[#00f5d4] shrink-0" />
                    WhatsApp
                  </a>
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    <Mail size={12} style={{ color: '#00f5d4', flexShrink: 0 }} />
                    {PROFILE.email}
                  </a>
                  <a
                    href={PROFILE.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    <Github size={12} style={{ color: '#00f5d4', flexShrink: 0 }} />
                    mhmd-ebrahim-1
                  </a>
                  <a
                    href={PROFILE.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 font-mono text-xs text-[var(--text-secondary)] hover:text-white transition-colors"
                  >
                    <Linkedin size={12} style={{ color: '#00f5d4', flexShrink: 0 }} />
                    mhmd-ebrahim1
                  </a>
                </div>
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed max-w-3xl text-[var(--text-secondary)]">
              {PROFILE.bio}
            </p>
          </div>

          {/* Body Content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {/* Left: Experience & Education */}
            <div className="lg:col-span-3 p-6 sm:p-10">
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-8">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(0,245,212,0.1)', border: '1px solid rgba(0,245,212,0.2)' }}
                  >
                    <Briefcase size={14} style={{ color: '#00f5d4' }} />
                  </div>
                  <h3 className="font-display font-semibold text-[var(--text-primary)] text-lg">Practical Experience &amp; Training</h3>
                </div>
                {EXPERIENCE.map((exp, i) => (
                  <TimelineItem key={exp.id} item={exp} index={i} />
                ))}
              </div>

              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)' }}
                  >
                    <GraduationCap size={14} style={{ color: '#a78bfa' }} />
                  </div>
                  <h3 className="font-display font-semibold text-[var(--text-primary)] text-lg">Education</h3>
                </div>
                {EDUCATION.map((edu, i) => (
                  <TimelineItem key={edu.id} item={edu} index={i} isEdu />
                ))}
              </div>
            </div>

            {/* Right: Technical Skills & Languages */}
            <div className="lg:col-span-2 p-6 sm:p-10 space-y-8">
              <div>
                <h3 className="font-display font-semibold text-[var(--text-primary)] text-lg mb-6">Core Competencies</h3>
                <div className="space-y-6">
                  {Object.entries(SKILLS_DATA || {}).map(([key, domain]) => (
                    <div key={key}>
                      <p className="font-mono text-xs mb-2 tracking-wider uppercase" style={{ color: '#00f5d4' }}>
                        {domain?.title || key}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(domain?.skills || []).map((s) => (
                          <span
                            key={s}
                            className="font-mono text-xs px-2 py-0.5 rounded"
                            style={{
                              background: 'rgba(255,255,255,0.03)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              color: 'rgba(255,255,255,0.7)',
                            }}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Languages */}
              <div className="pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <h3 className="font-display font-semibold text-white text-lg mb-4">Languages</h3>
                <div className="space-y-2.5">
                  {[
                    { lang: 'Arabic', level: 'Native proficiency' },
                    { lang: 'English', level: 'Professional working proficiency' },
                  ].map(({ lang, level }) => (
                    <div key={lang} className="flex justify-between items-center text-sm">
                      <span className="text-white/80">{lang}</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded glass" style={{ color: '#00f5d4' }}>
                        {level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tools & Frameworks */}
              <div className="pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <h3 className="font-display font-semibold text-white text-lg mb-4">Tools &amp; Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {TOOLS.map((t) => (
                    <span
                      key={t.name}
                      className="font-mono text-xs px-2.5 py-1 rounded-md flex items-center gap-1.5"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        color: 'rgba(255,255,255,0.65)',
                      }}
                    >
                      <span>{t.icon}</span>
                      <span>{t.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
