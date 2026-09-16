import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Star, BookOpen, ChevronDown, ChevronUp, Images, X, ExternalLink, Eye, CheckCircle2 } from 'lucide-react'
import { useReveal } from '../hooks'
import { CERTIFICATES } from '../data'

const BASE_URL = import.meta.env.BASE_URL

const TIER_CONFIG = {
  top: { label: 'Core Certifications', color: '#00f5d4', icon: Star, bg: 'rgba(0,245,212,0.08)', border: 'rgba(0,245,212,0.2)' },
  important: { label: 'Professional & Technical', color: '#0ea5e9', icon: Award, bg: 'rgba(14,165,233,0.08)', border: 'rgba(14,165,233,0.2)' },
  standard: { label: 'Additional Learning', color: '#a78bfa', icon: BookOpen, bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)' },
  learning: { label: 'Learning Activities', color: '#fb923c', icon: BookOpen, bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.2)' },
}

function CertificateModal({ cert, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = 'auto'
    }
  }, [onClose])

  if (!cert) return null

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md p-4 sm:p-6 lg:p-8 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="relative max-w-4xl w-full max-h-[92vh] rounded-2xl overflow-hidden flex flex-col glass"
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        onClick={(e) => e.stopPropagation()}
        style={{ border: '1px solid rgba(255,255,255,0.12)', background: '#090a14' }}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-xs flex-shrink-0"
              style={{ background: cert.color + '20', border: `1px solid ${cert.color}40`, color: cert.color }}
            >
              {cert.issuer.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-display font-bold text-white text-base sm:text-lg truncate">{cert.name}</h3>
              <p className="text-xs font-mono truncate" style={{ color: cert.color }}>
                {cert.issuer} {cert.date ? `· ${cert.date}` : '· Verified'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col items-center justify-center bg-black/60">
          {cert.image ? (
            <img
              src={`${BASE_URL}${cert.image}`}
              alt={`${cert.name} certificate`}
              className="max-h-[65vh] w-auto max-w-full rounded-lg shadow-2xl object-contain"
              style={{ border: '1px solid rgba(255,255,255,0.08)' }}
            />
          ) : (
            <div className="py-16 text-center text-white/50">
              <CheckCircle2 size={48} className="mx-auto mb-3 text-emerald-400 opacity-80" />
              <p className="text-base text-white">Verified Academic Record</p>
              <p className="text-xs font-mono text-white/40 mt-1">Direct credential issued by {cert.issuer}</p>
            </div>
          )}
        </div>

        {/* Footer Details */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            {cert.detail && <p className="text-white/70 font-mono">{cert.detail}</p>}
            {cert.credentialId && (
              <p className="font-mono text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Credential ID: <span className="text-white/80">{cert.credentialId}</span>
              </p>
            )}
          </div>
          {cert.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {cert.skills.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[11px] px-2 py-0.5 rounded"
                  style={{ background: `${cert.color}15`, border: `1px solid ${cert.color}30`, color: cert.color }}
                >
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

function CertificateGallery({ onSelectCert }) {
  const topCerts = CERTIFICATES.filter((c) => c.tier === 'top' && c.image)

  return (
    <section className="mb-14">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <p className="font-mono text-xs mb-2 tracking-[0.12em]" style={{ color: '#0ea5e9' }}>
            // VISUAL PROOF &amp; ACCREDITATIONS
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Selected Credentials</h2>
          <p className="text-sm mt-2" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Direct visual certificates across Data Analytics, Deep Learning, Generative AI &amp; Business Intelligence. Click any card to inspect full certificate.
          </p>
        </div>
      </div>

      {/* Featured Grid Showcase */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {topCerts.map((cert) => (
          <button
            key={cert.id}
            onClick={() => onSelectCert(cert)}
            className="group relative rounded-xl overflow-hidden glass p-2 text-left transition-all duration-300 hover:scale-[1.03] hover:border-sky-500/40 flex flex-col"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-black/40 mb-2">
              <img
                src={`${BASE_URL}${cert.image}`}
                alt={cert.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Eye size={16} className="text-white drop-shadow" />
              </div>
            </div>
            <p className="font-display font-semibold text-white text-[11px] leading-tight line-clamp-1 group-hover:text-cyan-300 transition-colors">
              {cert.name}
            </p>
            <p className="font-mono text-[10px] mt-0.5 truncate" style={{ color: cert.color }}>
              {cert.issuer}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}

function CertCard({ cert, index, onSelect }) {
  const [ref, visible] = useReveal()

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 25 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -3 }}
      onClick={() => onSelect(cert)}
      className="glass rounded-2xl p-5 flex gap-4 items-start cursor-pointer group transition-all duration-300 hover:border-white/20"
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Visual Thumbnail or Issuer Avatar */}
      {cert.image ? (
        <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-black/50 border border-white/10 group-hover:border-sky-400/50 transition-colors">
          <img
            src={`${BASE_URL}${cert.image}`}
            alt={cert.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors flex items-center justify-center">
            <Eye size={14} className="text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      ) : (
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 font-display font-bold text-sm"
          style={{ background: cert.color + '18', border: `1px solid ${cert.color}30`, color: cert.color }}
        >
          {cert.issuer.slice(0, 2).toUpperCase()}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="font-display font-semibold text-white text-sm leading-snug mb-1 group-hover:text-cyan-300 transition-colors">
            {cert.name}
          </p>
          {cert.image && (
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded text-white/40 group-hover:text-cyan-300 transition-colors flex items-center gap-1 flex-shrink-0">
              <Eye size={11} /> View
            </span>
          )}
        </div>
        <p className="font-semibold text-xs mb-1" style={{ color: cert.color }}>
          {cert.issuer}
        </p>
        <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          {cert.date ? `Issued ${cert.date}` : 'Verified Credential'}
          {cert.expires ? ` · Expires ${cert.expires}` : ''}
          {cert.detail ? ` · ${cert.detail}` : ''}
        </p>
        {cert.credentialId && (
          <p className="font-mono text-[10px] mt-1 break-all" style={{ color: 'rgba(255,255,255,0.22)' }}>
            Credential ID · {cert.credentialId}
          </p>
        )}
        {cert.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {cert.skills.map((s) => (
              <span
                key={s}
                className="font-mono text-[11px] px-2 py-0.5 rounded-md"
                style={{ background: `${cert.color}0d`, border: `1px solid ${cert.color}25`, color: cert.color }}
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}

function CertSection({ tier, certs, onSelect }) {
  const [expanded, setExpanded] = useState(tier !== 'standard')
  const config = TIER_CONFIG[tier]
  if (!config || certs.length === 0) return null
  const Icon = config.icon
  const [ref, visible] = useReveal()

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between mb-6 group text-left"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: config.bg, border: `1px solid ${config.border}` }}
          >
            <Icon size={16} style={{ color: config.color }} />
          </div>
          <div>
            <h2 className="font-display font-semibold text-white text-lg sm:text-xl">{config.label}</h2>
            <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {certs.length} certificate{certs.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors group-hover:bg-white/5"
          style={{ border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certs.map((cert, i) => (
                <CertCard key={cert.id} cert={cert} index={i} onSelect={onSelect} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  )
}

export default function Certificates() {
  const [selectedCert, setSelectedCert] = useState(null)
  const groups = ['top', 'important', 'standard', 'learning'].map((tier) => ({
    tier,
    certs: CERTIFICATES.filter((c) => c.tier === tier),
  }))
  const visibleGroups = groups.filter((g) => g.certs.length > 0)

  return (
    <div className="page-transition min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-14"
        >
          <p className="font-mono text-xs mb-4 tracking-[0.12em]" style={{ color: '#00f5d4' }}>
            // 06 — ACHIEVEMENTS
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold mb-4 tracking-[-0.04em]">
            Certificates &amp;
            <br />
            <span className="grad-text">Achievements</span>
          </h1>
          <p className="text-base max-w-2xl" style={{ color: 'rgba(255,255,255,0.45)' }}>
            A curated, verifiable collection of credentials across Data Analytics, Machine Learning, Generative AI, and Software Engineering.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            {visibleGroups.map(({ tier, certs }) => {
              const config = TIER_CONFIG[tier]
              return (
                <div
                  key={tier}
                  className="px-4 py-3 rounded-xl glass"
                  style={{ border: `1px solid ${config.color}20` }}
                >
                  <p className="font-display font-bold text-2xl" style={{ color: config.color }}>
                    {certs.length}
                  </p>
                  <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {config.label}
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>

        <CertificateGallery onSelectCert={(cert) => setSelectedCert(cert)} />

        {groups.map(({ tier, certs }) => (
          <CertSection key={tier} tier={tier} certs={certs} onSelect={(cert) => setSelectedCert(cert)} />
        ))}
      </div>

      <AnimatePresence>
        {selectedCert && (
          <CertificateModal cert={selectedCert} onClose={() => setSelectedCert(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

