import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  ExternalLink,
  Eye,
  Check,
  Star,
  Layers,
  Sparkles,
  ArrowUpDown,
  Filter,
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import ImageUploader from '../components/ImageUploader'

const INITIAL_PROJECT = {
  id: null,
  slug: '',
  title: '',
  category: 'data_analytics',
  categoryLabel: 'Data Analytics',
  accent: '#00f5d4',
  shortDesc: '',
  fullDesc: '',
  valueProp: '',
  coverImage: '',
  github: '',
  live: '',
  featured: false,
  published: true,
  displayOrder: 0,
  tech: [],
  metrics: [],
  tags: [],
}

const CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'data_analytics', label: 'Data Analytics' },
  { id: 'power_bi', label: 'Power BI & Dashboards' },
  { id: 'ml', label: 'Machine Learning' },
  { id: 'ai_rag', label: 'AI & RAG' },
  { id: 'vision', label: 'Computer Vision' },
  { id: 'data_eng', label: 'Data Engineering' },
]

const COLOR_PALETTE = ['#00f5d4', '#0ea5e9', '#a78bfa', '#fb923c', '#f43f5e', '#34d399', '#38bdf8']

export default function ProjectsManager() {
  const { projects, setProjects, logAudit } = useData()
  const { addToast } = useOutletContext()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(INITIAL_PROJECT)
  const [deletingId, setDeletingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [techInput, setTechInput] = useState('')

  // Filtered list
  const filtered = (projects || []).filter((p) => {
    const title = p.title || ''
    const shortDesc = p.shortDesc || p.description || ''
    const matchSearch =
      title.toLowerCase().includes(search.toLowerCase()) ||
      shortDesc.toLowerCase().includes(search.toLowerCase()) ||
      (p.tech || []).some((t) => (t || '').toLowerCase().includes(search.toLowerCase()))
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory
    return matchSearch && matchCat
  })

  const openNew = () => {
    setEditingProject({
      ...INITIAL_PROJECT,
      slug: `project-${Date.now().toString().slice(-4)}`,
      displayOrder: projects.length + 1,
    })
    setTechInput('')
    setModalOpen(true)
  }

  const openEdit = (project) => {
    setEditingProject({ ...project })
    setTechInput(project.tech ? project.tech.join(', ') : '')
    setModalOpen(true)
  }

  const handleDuplicate = (project) => {
    const duplicated = {
      ...project,
      id: Date.now(),
      slug: `${project.slug}-copy`,
      title: `${project.title} (Copy)`,
      displayOrder: projects.length + 1,
    }
    setProjects((prev) => [...prev, duplicated])
    addToast('Project duplicated successfully', 'success', 'Duplicated')
  }

  const openDelete = (id) => {
    setDeletingId(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    setSaving(true)
    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.from('projects').delete().eq('id', deletingId)
      }
      setProjects((prev) => prev.filter((p) => p.id !== deletingId))
      addToast('Project deleted successfully', 'success', 'Deleted')
      logAudit('DELETE', 'project', `Project #${deletingId}`)
    } catch (e) {
      console.error(e)
      addToast('Failed to delete project', 'error')
    } finally {
      setSaving(false)
      setConfirmOpen(false)
      setDeletingId(null)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const techArray = techInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      ...editingProject,
      tech: techArray,
      slug: editingProject.slug || editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }

    try {
      if (isSupabaseConfigured() && supabase) {
        const dbPayload = {
          slug: payload.slug,
          title: payload.title,
          category: payload.category,
          category_label: payload.categoryLabel,
          accent: payload.accent,
          short_desc: payload.shortDesc,
          full_desc: payload.fullDesc,
          value_prop: payload.valueProp,
          cover_image: payload.coverImage,
          github: payload.github,
          live: payload.live,
          featured: payload.featured,
          published: payload.published,
          display_order: payload.displayOrder,
          tech: payload.tech,
          metrics: payload.metrics || [],
          tags: payload.tags || [],
        }

        if (payload.id && typeof payload.id === 'number') {
          await supabase.from('projects').update(dbPayload).eq('id', payload.id)
        } else {
          const { data, error } = await supabase.from('projects').insert([dbPayload]).select()
          if (error) throw error
          if (data?.[0]) payload.id = data[0].id
        }
      }

      // Update in-memory state
      setProjects((prev) => {
        const exists = prev.some((p) => p.id === payload.id || p.slug === payload.slug)
        if (exists) {
          return prev.map((p) => (p.id === payload.id || p.slug === payload.slug ? payload : p))
        }
        return [...prev, { ...payload, id: payload.id || Date.now() }]
      })

      addToast(`Project "${payload.title}" saved successfully`, 'success', 'Saved')
      logAudit(editingProject.id ? 'UPDATE' : 'CREATE', 'project', payload.title)
      setModalOpen(false)
    } catch (err) {
      console.error(err)
      addToast(err.message || 'Failed to save project', 'error', 'Error')
    } finally {
      setSaving(false)
    }
  }

  const togglePublished = async (project) => {
    const updated = { ...project, published: !project.published }
    setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)))

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('projects').update({ published: updated.published }).eq('id', project.id)
    }
    addToast(
      `Project is now ${updated.published ? 'Published' : 'Hidden'}`,
      updated.published ? 'success' : 'info'
    )
  }

  const toggleFeatured = async (project) => {
    const updated = { ...project, featured: !project.featured }
    setProjects((prev) => prev.map((p) => (p.id === project.id ? updated : p)))

    if (isSupabaseConfigured() && supabase) {
      await supabase.from('projects').update({ featured: updated.featured }).eq('id', project.id)
    }
    addToast(
      `Project ${updated.featured ? 'added to' : 'removed from'} Featured showcase`,
      'success'
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Search & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Manage Projects</h2>
          <p className="font-mono text-xs text-white/50 mt-1">
            {projects.length} Total Projects ({projects.filter((p) => p.published).length} Published)
          </p>
        </div>

        <button
          onClick={openNew}
          className="btn-primary inline-flex items-center gap-2 text-xs font-mono py-3 px-4 shadow-lg shadow-[#00f5d4]/10 shrink-0"
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl glass border border-white/[0.08] flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title, description, or technologies..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white placeholder:text-white/30 focus:border-[#00f5d4]/50 outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <Filter size={15} className="text-white/40 shrink-0 ml-1" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white/80 bg-[#0c1020] focus:border-[#00f5d4]/50 outline-none"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id} className="bg-[#0c1020] text-white">
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table / Grid */}
      <div className="space-y-3">
        {filtered.map((project, idx) => (
          <motion.div
            key={project.id || project.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl glass border border-white/[0.07] hover:border-white/15 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 group"
          >
            {/* Project Meta Left */}
            <div className="flex items-start sm:items-center gap-4 min-w-0">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-mono text-sm font-bold shrink-0 relative overflow-hidden"
                style={{
                  background: `${project.accent}14`,
                  color: project.accent,
                  border: `1px solid ${project.accent}33`,
                }}
              >
                {project.coverImage ? (
                  <img src={project.coverImage} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span>0{idx + 1}</span>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-display font-bold text-base text-white truncate group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  {project.featured && (
                    <span className="font-mono text-[10px] px-2 py-0.5 rounded-md bg-amber-400/10 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                      <Star size={10} /> Featured
                    </span>
                  )}
                  <span
                    className="font-mono text-[10px] px-2 py-0.5 rounded-md"
                    style={{ background: `${project.accent}14`, color: project.accent }}
                  >
                    {project.categoryLabel || project.category}
                  </span>
                </div>

                <p className="text-xs text-white/60 line-clamp-1 mb-2">{project.shortDesc}</p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1">
                  {project.tech?.slice(0, 5).map((t) => (
                    <span key={t} className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/[0.03] text-white/50">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions Right */}
            <div className="flex items-center justify-between lg:justify-end gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-white/[0.06] shrink-0">
              {/* Published Toggle */}
              <button
                onClick={() => togglePublished(project)}
                className={`px-2.5 py-1.5 rounded-xl font-mono text-[11px] flex items-center gap-1.5 transition-colors border ${
                  project.published
                    ? 'bg-[#00f5d4]/10 text-[#00f5d4] border-[#00f5d4]/30'
                    : 'bg-white/[0.02] text-white/40 border-white/10'
                }`}
                title="Toggle Visibility"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${project.published ? 'bg-[#00f5d4]' : 'bg-white/30'}`} />
                {project.published ? 'Published' : 'Hidden'}
              </button>

              {/* Featured Toggle */}
              <button
                onClick={() => toggleFeatured(project)}
                className={`p-2 rounded-xl glass border transition-colors ${
                  project.featured
                    ? 'text-amber-400 border-amber-400/30 bg-amber-400/10'
                    : 'text-white/40 hover:text-white border-white/10'
                }`}
                title="Toggle Featured Status"
              >
                <Star size={14} />
              </button>

              {/* Duplicate */}
              <button
                onClick={() => handleDuplicate(project)}
                className="p-2 rounded-xl glass border border-white/10 text-white/50 hover:text-white transition-colors"
                title="Duplicate Project"
              >
                <Copy size={14} />
              </button>

              {/* Edit */}
              <button
                onClick={() => openEdit(project)}
                className="p-2 rounded-xl glass border border-cyan-400/30 text-[#00f5d4] hover:bg-cyan-500/10 transition-colors"
                title="Edit Project"
              >
                <Edit2 size={14} />
              </button>

              {/* Delete */}
              <button
                onClick={() => openDelete(project.id)}
                className="p-2 rounded-xl glass border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                title="Delete Project"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="p-12 rounded-3xl glass border border-white/[0.08] text-center">
            <p className="font-mono text-sm text-white/40">No projects found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* EDIT / CREATE MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject.id ? 'Edit Project' : 'Create New Project'}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider mb-1.5">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={editingProject.title}
                onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                placeholder="e.g. Healthcare Analytics Platform"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white focus:border-[#00f5d4]/50 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider mb-1.5">
                Slug (URL Identifier)
              </label>
              <input
                type="text"
                value={editingProject.slug}
                onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                placeholder="e.g. healthcare-analytics"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white focus:border-[#00f5d4]/50 outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={editingProject.category}
                onChange={(e) => {
                  const selected = CATEGORIES.find((c) => c.id === e.target.value)
                  setEditingProject({
                    ...editingProject,
                    category: e.target.value,
                    categoryLabel: selected ? selected.label : e.target.value,
                  })
                }}
                className="w-full px-3 py-2.5 rounded-xl glass border border-white/10 text-xs font-mono text-white bg-[#0c1020] outline-none"
              >
                {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={editingProject.displayOrder}
                onChange={(e) => setEditingProject({ ...editingProject, displayOrder: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider mb-1.5">
                Accent Color
              </label>
              <div className="flex items-center gap-1.5 pt-1">
                {COLOR_PALETTE.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setEditingProject({ ...editingProject, accent: c })}
                    className="w-6 h-6 rounded-full transition-transform"
                    style={{
                      background: c,
                      transform: editingProject.accent === c ? 'scale(1.2)' : 'scale(1)',
                      border: editingProject.accent === c ? '2px solid white' : 'none',
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider mb-1.5">
              Value Proposition / Headline
            </label>
            <input
              type="text"
              value={editingProject.valueProp || ''}
              onChange={(e) => setEditingProject({ ...editingProject, valueProp: e.target.value })}
              placeholder="e.g. Interactive 3-page clinical KPI dashboard with SQL modeling"
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white focus:border-[#00f5d4]/50 outline-none"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider mb-1.5">
              Short Description *
            </label>
            <textarea
              rows={3}
              required
              value={editingProject.shortDesc}
              onChange={(e) => setEditingProject({ ...editingProject, shortDesc: e.target.value })}
              placeholder="Comprehensive summary displayed on the card..."
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white focus:border-[#00f5d4]/50 outline-none leading-relaxed"
            />
          </div>

          {/* Image Uploader */}
          <ImageUploader
            bucket="projects"
            value={editingProject.coverImage}
            onChange={(url) => setEditingProject({ ...editingProject, coverImage: url })}
            label="Project Cover Image"
          />

          <div>
            <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider mb-1.5">
              Technologies (comma separated)
            </label>
            <input
              type="text"
              value={techInput}
              onChange={(e) => setTechInput(e.target.value)}
              placeholder="Python, Power BI, SQL, DAX, PostgreSQL"
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white focus:border-[#00f5d4]/50 outline-none font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider mb-1.5">
                GitHub Repository URL
              </label>
              <input
                type="url"
                value={editingProject.github || ''}
                onChange={(e) => setEditingProject({ ...editingProject, github: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono outline-none"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase tracking-wider mb-1.5">
                Live Demo / Dashboard URL
              </label>
              <input
                type="url"
                value={editingProject.live || ''}
                onChange={(e) => setEditingProject({ ...editingProject, live: e.target.value })}
                placeholder="https://app.powerbi.com/... or demo link"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingProject.published}
                onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                className="rounded accent-[#00f5d4]"
              />
              <span className="font-mono text-xs text-white/80">Published (Visible to public)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingProject.featured}
                onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                className="rounded accent-amber-400"
              />
              <span className="font-mono text-xs text-white/80">Featured on Home</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2.5 rounded-xl font-mono text-xs glass text-white/70 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-6 py-2.5 text-xs font-mono font-semibold flex items-center gap-2"
            >
              {saving ? <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" /> : <Check size={15} />}
              Save &amp; Publish Project
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Project"
        message="Are you sure you want to delete this project? It will be permanently removed from your portfolio."
        confirmText="Delete Project"
        loading={saving}
      />
    </div>
  )
}
