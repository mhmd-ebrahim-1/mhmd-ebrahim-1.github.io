import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Check, Briefcase, Calendar, MapPin } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'

const INITIAL_EXP = {
  id: null,
  role: '',
  organization: '',
  location: 'Mansoura, Egypt',
  start_date: '2023',
  end_date: 'Present',
  current_position: true,
  description: '',
  technologies: [],
  display_order: 0,
  published: true,
}

export default function ExperienceManager() {
  const { experience, setExperience, logAudit } = useData()
  const { addToast } = useOutletContext()

  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editingExp, setEditingExp] = useState(INITIAL_EXP)
  const [deletingId, setDeletingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [techInput, setTechInput] = useState('')

  const openNew = () => {
    setEditingExp({
      ...INITIAL_EXP,
      display_order: experience.length + 1,
    })
    setTechInput('')
    setModalOpen(true)
  }

  const openEdit = (exp) => {
    setEditingExp({ ...exp })
    setTechInput(exp.technologies ? exp.technologies.join(', ') : '')
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
        const { error } = await supabase.from('experience').delete().eq('id', deletingId)
        if (error) throw error
      }
      setExperience((prev) => (prev || []).filter((e) => e.id !== deletingId))
      addToast('Experience item deleted', 'success', 'Deleted')
      logAudit('DELETE', 'experience', `Experience #${deletingId}`)
    } catch (e) {
      console.error(e)
      addToast(e.message || 'Failed to delete item', 'error')
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
      ...editingExp,
      technologies: techArray,
    }

    try {
      if (isSupabaseConfigured() && supabase) {
        const dbPayload = {
          role: payload.role,
          organization: payload.organization,
          location: payload.location,
          start_date: payload.start_date,
          end_date: payload.current_position ? 'Present' : payload.end_date,
          current_position: payload.current_position,
          description: payload.description,
          technologies: payload.technologies,
          display_order: payload.display_order,
          published: payload.published,
        }

        if (payload.id && typeof payload.id === 'number') {
          const { error } = await supabase.from('experience').update(dbPayload).eq('id', payload.id)
          if (error) throw error
        } else {
          const { data, error } = await supabase.from('experience').insert([dbPayload]).select()
          if (error) throw error
          if (data?.[0]) payload.id = data[0].id
        }
      }

      setExperience((prev) => {
        const exists = prev.some((e) => e.id === payload.id)
        if (exists) {
          return prev.map((e) => (e.id === payload.id ? payload : e))
        }
        return [...prev, { ...payload, id: payload.id || Date.now() }]
      })

      addToast(`Experience item "${payload.role}" saved`, 'success', 'Saved')
      logAudit(editingExp.id ? 'UPDATE' : 'CREATE', 'experience', payload.role)
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
          <h2 className="font-display font-bold text-2xl text-white">Experience &amp; Timeline</h2>
          <p className="font-mono text-xs text-white/50 mt-1">Manage career milestones and training positions</p>
        </div>

        <button
          onClick={openNew}
          className="btn-primary inline-flex items-center gap-2 text-xs font-mono py-3 px-4 shrink-0"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((item, idx) => (
          <motion.div
            key={item.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl glass border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Briefcase size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">{item.role}</h3>
                <p className="text-xs font-semibold text-[#00f5d4]">{item.organization}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-white/50 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} /> {item.start_date} – {item.end_date}
                  </span>
                  {item.location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin size={13} /> {item.location}
                    </span>
                  )}
                </div>
                {item.description && (
                  <p className="text-xs text-white/70 mt-3 leading-relaxed max-w-2xl">{item.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              <button
                onClick={() => openEdit(item)}
                className="p-2 rounded-xl glass border border-cyan-400/30 text-[#00f5d4] hover:bg-cyan-500/10"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => openDelete(item.id)}
                className="p-2 rounded-xl glass border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}

        {experience.length === 0 && (
          <div className="p-12 rounded-3xl glass border border-white/[0.08] text-center">
            <p className="font-mono text-sm text-white/40">No experience items registered yet. Click &quot;Add Experience&quot; to create one.</p>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingExp.id ? 'Edit Experience' : 'Add Experience'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Role / Position *</label>
              <input
                type="text"
                required
                value={editingExp.role}
                onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                placeholder="e.g. Data Analytics Trainee"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Organization *</label>
              <input
                type="text"
                required
                value={editingExp.organization}
                onChange={(e) => setEditingExp({ ...editingExp, organization: e.target.value })}
                placeholder="e.g. NTI / ITIDA"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Start Date</label>
              <input
                type="text"
                value={editingExp.start_date}
                onChange={(e) => setEditingExp({ ...editingExp, start_date: e.target.value })}
                placeholder="Jul 2024"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">End Date</label>
              <input
                type="text"
                disabled={editingExp.current_position}
                value={editingExp.current_position ? 'Present' : editingExp.end_date}
                onChange={(e) => setEditingExp({ ...editingExp, end_date: e.target.value })}
                placeholder="Aug 2024"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono disabled:opacity-50"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Location</label>
              <input
                type="text"
                value={editingExp.location || ''}
                onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                placeholder="Mansoura, Egypt"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={editingExp.current_position}
              onChange={(e) => setEditingExp({ ...editingExp, current_position: e.target.checked })}
              className="rounded accent-[#00f5d4]"
            />
            <span className="font-mono text-xs text-white/80">Currently in this role / Ongoing</span>
          </label>

          <div>
            <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Description</label>
            <textarea
              rows={3}
              value={editingExp.description || ''}
              onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
              placeholder="Key responsibilities and achievements..."
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-xs glass text-white/70">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary px-5 py-2 text-xs font-mono">
              Save Experience
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Experience"
        loading={saving}
      />
    </div>
  )
}
