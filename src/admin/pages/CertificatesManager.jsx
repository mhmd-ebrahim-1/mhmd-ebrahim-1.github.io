import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Search, Edit2, Trash2, Award, ExternalLink, Star } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import ImageUploader from '../components/ImageUploader'

const INITIAL_CERT = {
  id: null,
  slug: '',
  title: '',
  issuer: '',
  issuerShort: '',
  date: '2024',
  credentialId: '',
  credentialUrl: '',
  coverImage: '',
  category: 'ai_ml',
  categoryLabel: 'AI & Machine Learning',
  accent: '#00f5d4',
  featured: false,
  published: true,
  displayOrder: 0,
  skills: [],
}

export default function CertificatesManager() {
  const { certificates, setCertificates, logAudit } = useData()
  const { addToast } = useOutletContext()

  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editingCert, setEditingCert] = useState(INITIAL_CERT)
  const [deletingId, setDeletingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [skillsInput, setSkillsInput] = useState('')

  const filtered = certificates.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.issuer.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => {
    setEditingCert({
      ...INITIAL_CERT,
      slug: `cert-${Date.now().toString().slice(-4)}`,
      displayOrder: certificates.length + 1,
    })
    setSkillsInput('')
    setModalOpen(true)
  }

  const openEdit = (cert) => {
    setEditingCert({ ...cert })
    setSkillsInput(cert.skills ? cert.skills.join(', ') : '')
    setModalOpen(true)
  }

  const openDelete = (id) => {
    setDeletingId(id)
    setConfirmOpen(true)
  }

  const confirmDelete = async () => {
    setSaving(true)
    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.from('certificates').delete().eq('id', deletingId)
      }
      setCertificates((prev) => prev.filter((c) => c.id !== deletingId))
      addToast('Certificate deleted successfully', 'success', 'Deleted')
      logAudit('DELETE', 'certificate', `Certificate #${deletingId}`)
    } catch (e) {
      console.error(e)
      addToast('Failed to delete certificate', 'error')
    } finally {
      setSaving(false)
      setConfirmOpen(false)
      setDeletingId(null)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    const skillsArray = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      ...editingCert,
      skills: skillsArray,
      slug: editingCert.slug || editingCert.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }

    try {
      if (isSupabaseConfigured() && supabase) {
        const dbPayload = {
          slug: payload.slug,
          title: payload.title,
          issuer: payload.issuer,
          issuer_short: payload.issuerShort || payload.issuer,
          date: payload.date,
          credential_id: payload.credentialId,
          credential_url: payload.credentialUrl,
          cover_image: payload.coverImage,
          category: payload.category,
          category_label: payload.categoryLabel,
          accent: payload.accent,
          skills: payload.skills,
          featured: payload.featured,
          published: payload.published,
          display_order: payload.displayOrder,
        }

        if (payload.id && typeof payload.id === 'number') {
          await supabase.from('certificates').update(dbPayload).eq('id', payload.id)
        } else {
          const { data, error } = await supabase.from('certificates').insert([dbPayload]).select()
          if (error) throw error
          if (data?.[0]) payload.id = data[0].id
        }
      }

      setCertificates((prev) => {
        const exists = prev.some((c) => c.id === payload.id || c.slug === payload.slug)
        if (exists) {
          return prev.map((c) => (c.id === payload.id || c.slug === payload.slug ? payload : c))
        }
        return [...prev, { ...payload, id: payload.id || Date.now() }]
      })

      addToast(`Certificate "${payload.title}" saved`, 'success', 'Saved')
      logAudit(editingCert.id ? 'UPDATE' : 'CREATE', 'certificate', payload.title)
      setModalOpen(false)
    } catch (err) {
      console.error(err)
      addToast(err.message || 'Failed to save', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Certificates &amp; Credentials</h2>
          <p className="font-mono text-xs text-white/50 mt-1">{certificates.length} Total Credentials</p>
        </div>

        <button onClick={openNew} className="btn-primary inline-flex items-center gap-2 text-xs font-mono py-3 px-4">
          <Plus size={16} /> Add Certificate
        </button>
      </div>

      <div className="p-4 rounded-2xl glass border border-white/[0.08]">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by certificate title or issuer..."
            className="w-full pl-10 pr-4 py-2 rounded-xl glass border border-white/10 text-xs text-white font-mono outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((cert) => (
          <motion.div
            key={cert.id || cert.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl glass border border-white/[0.08] flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] px-2.5 py-0.5 rounded bg-cyan-500/15 text-[#00f5d4] border border-cyan-500/30">
                  {cert.issuerShort || cert.issuer}
                </span>
                <span className="font-mono text-xs text-white/40">{cert.date}</span>
              </div>
              <h3 className="font-display font-bold text-sm text-white mb-2 line-clamp-2">{cert.title}</h3>
              <p className="font-mono text-[11px] text-white/60 mb-4">{cert.issuer}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-2">
                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/40 hover:text-[#00f5d4]"
                    title="View Credential"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                {cert.featured && <Star size={14} className="text-amber-400 fill-amber-400/20" />}
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(cert)}
                  className="p-1.5 rounded-lg glass text-[#00f5d4] hover:bg-cyan-500/10"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => openDelete(cert.id)}
                  className="p-1.5 rounded-lg glass text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingCert.id ? 'Edit Certificate' : 'Add Certificate'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Certificate Title *</label>
            <input
              type="text"
              required
              value={editingCert.title}
              onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
              placeholder="e.g. NVIDIA Deep Learning Institute"
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Issuer Name *</label>
              <input
                type="text"
                required
                value={editingCert.issuer}
                onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                placeholder="e.g. NVIDIA"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Issuer Short / Badge</label>
              <input
                type="text"
                value={editingCert.issuerShort || ''}
                onChange={(e) => setEditingCert({ ...editingCert, issuerShort: e.target.value })}
                placeholder="e.g. NVIDIA DLI"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Issue Date</label>
              <input
                type="text"
                value={editingCert.date}
                onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                placeholder="2024"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Credential URL</label>
              <input
                type="url"
                value={editingCert.credentialUrl || ''}
                onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                placeholder="https://courses.nvidia.com/..."
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <ImageUploader
            bucket="certificates"
            value={editingCert.coverImage}
            onChange={(url) => setEditingCert({ ...editingCert, coverImage: url })}
            label="Certificate Badge / Image / PDF"
          />

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingCert.published}
                onChange={(e) => setEditingCert({ ...editingCert, published: e.target.checked })}
                className="rounded accent-[#00f5d4]"
              />
              <span className="font-mono text-xs text-white/80">Published</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={editingCert.featured}
                onChange={(e) => setEditingCert({ ...editingCert, featured: e.target.checked })}
                className="rounded accent-amber-400"
              />
              <span className="font-mono text-xs text-white/80">Featured</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-xs glass text-white/70">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary px-5 py-2 text-xs font-mono">
              Save Certificate
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Certificate"
        loading={saving}
      />
    </div>
  )
}
