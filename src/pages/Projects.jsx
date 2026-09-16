import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, ExternalLink, ArrowUpRight, ArrowRight, Layers } from 'lucide-react'
import { useReveal } from '../hooks'
import { PROJECTS } from '../data'
import CaseStudyModal from '../components/CaseStudyModal'

const BASE_URL = import.meta.env.BASE_URL

const FILTERS = [
  { id: 'all', label: 'All Projects' },
  { id: 'data', label: 'Data & BI' },
  { id: 'ai', label: 'AI & ML' },
  { id: 'dev', label: 'Development' },
]

function ProjectCard({ proj, index, onOpenCaseStudy }) {
  const [ref, visible] = useReveal()
  const [hovered, setHovered] = useState(false)
  const image = `${BASE_URL}${proj.coverImage || 'projects/' + proj.slug + '.svg'}`

  return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="glass rounded-2xl overflow-hidden flex flex-col justify-between group"
      style={{
        border: `1px solid ${hovered ? (proj.accent || '#00f5d4') + '40' : 'rgba(255,255,255,0.07)'}`,
        transition: 'border-color .3s, transform .3s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        {/* Preview Thumbnail */}
        <div
          className="h-48 sm:h-52 relative overflow-hidden bg-[#07070e] border-b flex items-center justify-center cursor-pointer"
          style={{ borderColor: 'rgba(255,255,255,0.06)' }}
          onClick={() => {
            if (proj.caseStudy) onOpenCaseStudy(proj)
          }}
        >
          <img
            src={image}
            alt={`${proj.title} project preview`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080810]/80 via-transparent to-transparent pointer-events-none" />

          {proj.featured && (
            <span
              className="absolute top-3.5 left-3.5 px-2.5 py-1 rounded-md font-mono text-[10px] font-bold tracking-wider"
              style={{
                background: (proj.accent || '#00f5d4') + '22',
                border: `1px solid ${proj.accent || '#00f5d4'}55`,
                color: proj.accent || '#00f5d4',
              }}
            >
              FEATURED
            </span>
          )}

          <span
            className="absolute top-3.5 right-3.5 px-2 py-0.5 rounded font-mono text-[10px]"
            style={{
              background: 'rgba(0,0,0,.65)',
              color: 'rgba(255,255,255,.8)',
              border: '1px solid rgba(255,255,255,.12)',
            }}
          >
            {proj.categoryLabel || (proj.category === 'ai' ? 'AI & ML' : proj.category === 'data' ? 'DATA' : 'DEV')}
          </span>

          {proj.caseStudy && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs">
              <span className="px-3.5 py-1.5 rounded-lg glass font-mono text-xs text-white flex items-center gap-1.5">
                <Layers size={13} style={{ color: proj.accent }} /> Read Case Study
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="font-display font-bold text-lg text-white leading-snug">{proj.title}</h3>
            <ArrowUpRight
              size={16}
              style={{
                color: proj.accent || '#00f5d4',
                opacity: hovered ? 1 : 0.4,
                flexShrink: 0,
              }}
            />
          </div>

          <p className="text-xs sm:text-sm font-medium mb-3 leading-relaxed" style={{ color: proj.accent || '#38bdf8' }}>
            {proj.valueProp || proj.description}
          </p>

          <p className="text-xs leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,.5)' }}>
            {proj.description}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-5">
            {proj.tech.map((t) => (
              <span
                key={t}
                className="font-mono text-[11px] px-2 py-0.5 rounded"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div
        className="px-5 sm:px-6 py-4 border-t flex items-center justify-between gap-3"
        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.2)' }}
      >
        {proj.caseStudy ? (
          <button
            onClick={() => onOpenCaseStudy(proj)}
            className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold transition-all hover:translate-x-0.5"
            style={{ color: proj.accent || '#00f5d4' }}
          >
            Case Study <ArrowRight size={12} />
          </button>
        ) : (
          <span className="font-mono text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Code Available
          </span>
        )}

        <div className="flex items-center gap-3">
          <a
            href={proj.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs transition-colors hover:text-white"
            style={{ color: 'rgba(255,255,255,.5)' }}
          >
            <Github size={13} /> Source
          </a>
          {proj.live && (
            <a
              href={proj.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-mono text-xs transition-colors hover:text-white"
              style={{ color: proj.accent || '#00f5d4' }}
            >
              <ExternalLink size={13} /> Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState('all')
  const [activeProject, setActiveProject] = useState(null)

  const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)
  const featured = filtered.filter((p) => p.featured)
  const additional = filtered.filter((p) => !p.featured)

  return (
    <div className="page-transition min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-10">
      <CaseStudyModal
        project={activeProject}
        isOpen={Boolean(activeProject)}
        onClose={() => setActiveProject(null)}
      />

      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12">
          <p className="font-mono text-xs mb-3 tracking-wider uppercase" style={{ color: '#00f5d4' }}>
            // 04 — PORTFOLIO PROJECTS
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold mb-4 tracking-[-.04em]">
            Selected <span className="grad-text">Work</span>
          </h1>
          <p className="text-base max-w-2xl" style={{ color: 'rgba(255,255,255,.55)' }}>
            A structured portfolio of 9 technical projects across Data Analytics, Machine Learning, Generative AI, Computer Vision, and Big Data Engineering.
          </p>
        </motion.div>

        {/* Filter Controls */}
        <div className="flex items-center gap-2 sm:gap-3 mb-12 flex-wrap">
          {FILTERS.map((f) => (
            <motion.button
              key={f.id}
              onClick={() => setFilter(f.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-xl font-mono text-xs sm:text-sm font-medium transition-all"
              style={{
                color: filter === f.id ? '#00f5d4' : 'rgba(255,255,255,.5)',
                background: filter === f.id ? 'rgba(0,245,212,.08)' : 'transparent',
                border: filter === f.id ? '1px solid rgba(0,245,212,.25)' : '1px solid rgba(255,255,255,.06)',
              }}
            >
              {f.label}
            </motion.button>
          ))}
          <span className="sm:ml-auto font-mono text-xs" style={{ color: 'rgba(255,255,255,.3)' }}>
            Showing {filtered.length} project{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Featured Section */}
        {featured.length > 0 && (
          <section className="mb-16">
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-[11px] tracking-wider uppercase mb-1" style={{ color: '#00f5d4' }}>
                  // PRIMARY TECHNICAL SHOWCASE
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Featured Work</h2>
              </div>
              <span className="font-mono text-xs text-white/30">{featured.length} featured</span>
            </div>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {featured.map((proj, i) => (
                  <ProjectCard key={proj.id} proj={proj} index={i} onOpenCaseStudy={setActiveProject} />
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        )}

        {/* Additional Section */}
        {additional.length > 0 && (
          <section>
            <div className="flex items-end justify-between gap-4 mb-6">
              <div>
                <p className="font-mono text-[11px] tracking-wider uppercase mb-1" style={{ color: '#a78bfa' }}>
                  // EXPLORE MORE WORK
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">Additional Projects</h2>
              </div>
              <span className="font-mono text-xs text-white/30">{additional.length} projects</span>
            </div>
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {additional.map((proj, i) => (
                  <ProjectCard key={proj.id} proj={proj} index={i} onOpenCaseStudy={setActiveProject} />
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        )}
      </div>
    </div>
  )
}
