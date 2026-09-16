import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Layers, Plus, Edit2, Trash2, Check, Mail, Database } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'

const INITIAL_SERVICE = {
  id: '',
  title: '',
  shortDesc: '',
  fullDesc: '',
  icon: 'Database',
  accent: '#00f5d4',
  cta: 'Inquire Service via Email',
  emailSubject: 'Service Inquiry',
  tech: [],
  deliverables: [],
  published: true,
  displayOrder: 0,
}

export default function ServicesManager() {
  const { services, setServices, logAudit } = useData()
  const { addToast } = useOutletContext()

  const [modalOpen, setModalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editingService, setEditingService] = useState(INITIAL_SERVICE)
  const [deletingId, setDeletingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [techInput, setTechInput] = useState('')
  const [delivInput, setDelivInput] = useState('')

  const openNew = () => {
    setEditingService({
      ...INITIAL_SERVICE,
      id: `service-${Date.now().toString().slice(-4)}`,
      displayOrder: (services || []).length + 1,
    })
    setTechInput('')
    setDelivInput('')
    setModalOpen(true)
  }

  const openEdit = (serv) => {
    setEditingService({ ...serv })
    setTechInput(serv.tech ? serv.tech.join(', ') : '')
    setDelivInput(serv.deliverables ? serv.deliverables.join('\n') : '')
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
        await supabase.from('services').delete().eq('id', deletingId)
      }
      setServices((prev) => prev.filter((s) => s.id !== deletingId))
      addToast('Service removed successfully', 'success', 'Deleted')
      logAudit('DELETE', 'service', deletingId)
    } catch (e) {
      console.error(e)
      addToast('Failed to delete service', 'error')
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

    const delivArray = delivInput
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean)

    const payload = {
      ...editingService,
      tech: techArray,
      deliverables: delivArray,
      id: editingService.id || editingService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    }

    try {
      if (isSupabaseConfigured() && supabase) {
        const dbPayload = {
          id: payload.id,
          title: payload.title,
          short_desc: payload.shortDesc,
          full_desc: payload.fullDesc,
          icon: payload.icon,
          accent: payload.accent,
          tech: payload.tech,
          deliverables: payload.deliverables,
          cta: payload.cta,
          email_subject: payload.emailSubject,
          display_order: payload.displayOrder,
          published: payload.published,
        }

        const { error } = await supabase.from('services').upsert(dbPayload)
        if (error) throw error
      }

      setServices((prev) => {
        const exists = prev.some((s) => s.id === payload.id)
        if (exists) {
          return prev.map((s) => (s.id === payload.id ? payload : s))
        }
        return [...prev, payload]
      })

      addToast(`Service "${payload.title}" saved`, 'success', 'Saved')
      logAudit('UPDATE', 'service', payload.title)
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
          <h2 className="font-display font-bold text-2xl text-white">Technical Services</h2>
          <p className="font-mono text-xs text-white/50 mt-1">{services.length} Active Offerings</p>
        </div>

        <button onClick={openNew} className="btn-primary inline-flex items-center gap-2 text-xs font-mono py-3 px-4">
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((serv, idx) => (
          <motion.div
            key={serv.id || idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl glass border border-white/[0.08] flex flex-col justify-between group"
            style={{ border: `1px solid ${serv.accent || '#00f5d4'}22` }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold"
                  style={{ background: `${serv.accent || '#00f5d4'}15`, color: serv.accent || '#00f5d4' }}
                >
                  <Database size={18} />
                </div>
                <span className="font-mono text-xs text-white/40">0{idx + 1}</span>
              </div>

              <h3 className="font-display font-bold text-lg text-white mb-2">{serv.title}</h3>
              <p className="text-xs text-white/60 mb-4 line-clamp-3 leading-relaxed">{serv.shortDesc}</p>

              {serv.deliverables && serv.deliverables.length > 0 && (
                <div className="space-y-1.5 mb-4 pt-3 border-t border-white/[0.06]">
                  <p className="font-mono text-[10px] uppercase text-white/40">Deliverables ({serv.deliverables.length})</p>
                  {serv.deliverables.slice(0, 2).map((del, i) => (
                    <p key={i} className="text-[11px] text-white/70 line-clamp-1">
                      • {del}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
              <span className="font-mono text-[10px] text-[#0ea5e9] flex items-center gap-1">
                <Mail size={12} /> {serv.emailSubject || 'Inquiry'}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEdit(serv)}
                  className="p-1.5 rounded-lg glass text-[#00f5d4] hover:bg-cyan-500/10"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => openDelete(serv.id)}
                  className="p-1.5 rounded-lg glass text-rose-400 hover:bg-rose-500/10"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingService.id ? 'Edit Service' : 'Add Service'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Service Title *</label>
            <input
              type="text"
              required
              value={editingService.title}
              onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
              placeholder="e.g. Power BI Dashboards &amp; DAX Modeling"
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Short Description *</label>
            <textarea
              rows={3}
              required
              value={editingService.shortDesc}
              onChange={(e) => setEditingService({ ...editingService, shortDesc: e.target.value })}
              placeholder="Summary displayed on service card..."
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white"
            />
          </div>

          <div>
            <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Deliverables (one per line)</label>
            <textarea
              rows={3}
              value={delivInput}
              onChange={(e) => setDelivInput(e.target.value)}
              placeholder="Executive Summary Dashboards&#10;Custom DAX Measures&#10;Automated Scheduled Refresh"
              className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Technologies (comma separated)</label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Power BI, DAX, Power Query, SQL"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-mono text-[11px] text-white/60 uppercase mb-1">Email Subject Pre-fill</label>
              <input
                type="text"
                value={editingService.emailSubject || ''}
                onChange={(e) => setEditingService({ ...editingService, emailSubject: e.target.value })}
                placeholder="Power BI Dashboard Request"
                className="w-full px-4 py-2.5 rounded-xl glass border border-white/10 text-xs text-white font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.08]">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-xs glass text-white/70">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary px-5 py-2 text-xs font-mono">
              Save Service
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Service"
        loading={saving}
      />
    </div>
  )
}
